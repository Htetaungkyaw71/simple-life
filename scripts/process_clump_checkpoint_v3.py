#!/usr/bin/env python3
"""Reconstruct generated clumps on their detected logical-pixel grid.

The image model returns a large preview of deliberately blocky art.  Point
sampling that preview destroys blades whenever the sample misses a logical
cell.  This pass detects the repeated cell cadence, assigns every source cell
the majority palette label, then fits that logical grid into the final scale-1
canvas without filtered resampling.
"""

from __future__ import annotations

import hashlib
import json
from collections import Counter, deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/art/tall-grass-clump-review-v3"
SOURCE_OUT = OUT / "source"
EVIDENCE = ROOT / "docs/assets/licenses/tall-grass-clump-review-v3"
GENERATED = {
    "wide": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-aa76a8dc-7dd2-439d-82e6-1ea41f72b7be.png"),
    "tall": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-6c24c05e-5188-45d4-8017-52f8a793f84c.png"),
    "small": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-1c5511d6-d834-4f8d-8b6a-acd238a01e14.png"),
}
FINAL = {"wide": (48, 34), "tall": (30, 48), "small": (38, 38)}
PALETTE_HEX = ["#3B4028", "#53582D", "#6A7138", "#858B49", "#A1A35C"]
PALETTE = np.asarray([
    tuple(int(value[index:index + 2], 16) for index in (1, 3, 5))
    for value in PALETTE_HEX
], dtype=np.int32)
BACKGROUND = len(PALETTE)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def magenta_mask(rgb: np.ndarray) -> np.ndarray:
    return (rgb[:, :, 0] >= 180) & (rgb[:, :, 2] >= 140) & (rgb[:, :, 1] <= 120)


def label_source(rgb: np.ndarray) -> np.ndarray:
    values = rgb.astype(np.int32)
    distances = ((values[:, :, None, :] - PALETTE[None, None, :, :]) ** 2).sum(axis=3)
    labels = distances.argmin(axis=2).astype(np.uint8)
    labels[magenta_mask(rgb)] = BACKGROUND
    return labels


def largest_component(mask: np.ndarray) -> tuple[np.ndarray, int, list[int]]:
    height, width = mask.shape
    seen = np.zeros_like(mask, dtype=bool)
    components: list[list[tuple[int, int]]] = []
    for y, x in zip(*np.where(mask & ~seen)):
        if seen[y, x]:
            continue
        queue = [(int(x), int(y))]
        seen[y, x] = True
        points = []
        while queue:
            px, py = queue.pop()
            points.append((px, py))
            for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                if 0 <= nx < width and 0 <= ny < height and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    queue.append((nx, ny))
        components.append(points)
    components.sort(key=len, reverse=True)
    result = np.zeros_like(mask, dtype=bool)
    if components:
        for x, y in components[0]:
            result[y, x] = True
    return result, len(components), [len(component) for component in components[:8]]


def foreground_bbox(labels: np.ndarray) -> tuple[int, int, int, int]:
    ys, xs = np.where(labels != BACKGROUND)
    if len(xs) == 0:
        raise AssertionError("empty generated clump")
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def run_lengths(labels: np.ndarray) -> list[int]:
    lengths: list[int] = []
    for line in list(labels) + list(labels.T):
        start = 0
        for index in range(1, len(line) + 1):
            if index == len(line) or line[index] != line[start]:
                length = index - start
                if line[start] != BACKGROUND and 4 <= length <= 96:
                    lengths.append(length)
                start = index
    return lengths


def edge_periodicity(labels: np.ndarray, cell: int) -> float:
    horizontal = np.where(labels[:, 1:] != labels[:, :-1])[1] + 1
    vertical = np.where(labels[1:, :] != labels[:-1, :])[0] + 1
    scores = []
    for edges in (horizontal, vertical):
        if not len(edges):
            continue
        hist = np.bincount(edges % cell, minlength=cell)
        scores.append(float(np.sort(hist)[-min(2, cell):].sum() / len(edges)))
    return sum(scores) / max(1, len(scores))


def detect_grid(labels: np.ndarray, target: tuple[int, int]) -> dict:
    left, top, right, bottom = foreground_bbox(labels)
    crop = labels[top:bottom, left:right]
    runs = run_lengths(crop)
    width, height = right - left, bottom - top
    candidates = []
    for cell in range(6, 33):
        if runs:
            support = sum(
                1 for length in runs
                if abs(length / cell - round(length / cell)) <= 0.16
            ) / len(runs)
        else:
            support = 0.0
        periodicity = edge_periodicity(crop, cell)
        native_w, native_h = max(1, round(width / cell)), max(1, round(height / cell))
        target_w, target_h = target
        # The requested footprint is a canvas, so a few pixels of padding are
        # expected.  Penalize only estimates that substantially exceed it or
        # collapse it to much less than three quarters of the target.
        overflow = max(0, native_w - target_w) / target_w + max(0, native_h - target_h) / target_h
        undersize = max(0, target_w * .72 - native_w) / target_w + max(0, target_h * .72 - native_h) / target_h
        score = support * .68 + periodicity * .32 - overflow * .45 - undersize * .25
        candidates.append({
            "cell": cell,
            "score": round(score, 6),
            "runSupport": round(support, 6),
            "edgePeriodicity": round(periodicity, 6),
            "native": [native_w, native_h],
        })
    candidates.sort(key=lambda item: (item["score"], item["cell"]), reverse=True)
    best = candidates[0]
    return {
        "detectedCellPx": best["cell"],
        "nativeLogicalSize": best["native"],
        "sourceObjectBoundsPx": [left, top, right, bottom],
        "sourceObjectSizePx": [width, height],
        "topCandidates": candidates[:5],
    }


def majority_grid(labels: np.ndarray, bbox: tuple[int, int, int, int], size: tuple[int, int]) -> np.ndarray:
    left, top, right, bottom = bbox
    crop = labels[top:bottom, left:right]
    out_w, out_h = size
    grid = np.full((out_h, out_w), BACKGROUND, dtype=np.uint8)
    ys = np.linspace(0, crop.shape[0], out_h + 1)
    xs = np.linspace(0, crop.shape[1], out_w + 1)
    for y in range(out_h):
        y0, y1 = int(round(ys[y])), max(int(round(ys[y + 1])), int(round(ys[y])) + 1)
        for x in range(out_w):
            x0, x1 = int(round(xs[x])), max(int(round(xs[x + 1])), int(round(xs[x])) + 1)
            values = crop[y0:min(y1, crop.shape[0]), x0:min(x1, crop.shape[1])].reshape(-1)
            if values.size:
                grid[y, x] = Counter(map(int, values)).most_common(1)[0][0]
    return grid


def area_majority(labels: np.ndarray, size: tuple[int, int]) -> np.ndarray:
    return majority_grid(labels, (0, 0, labels.shape[1], labels.shape[0]), size)


def fit_grid(grid: np.ndarray, target: tuple[int, int]) -> np.ndarray:
    target_w, target_h = target
    height, width = grid.shape
    scale = min(1.0, target_w / width, target_h / height)
    if scale < 1:
        width, height = max(1, round(width * scale)), max(1, round(height * scale))
        grid = area_majority(grid, (width, height))
    canvas = np.full((target_h, target_w), BACKGROUND, dtype=np.uint8)
    x = (target_w - width) // 2
    y = target_h - height
    canvas[y:y + height, x:x + width] = grid
    return canvas


def fill_pinholes(labels: np.ndarray) -> tuple[np.ndarray, int]:
    mask = labels != BACKGROUND
    height, width = mask.shape
    exterior = np.zeros_like(mask, dtype=bool)
    queue: deque[tuple[int, int]] = deque()
    for x in range(width):
        for y in (0, height - 1):
            if not mask[y, x] and not exterior[y, x]:
                exterior[y, x] = True
                queue.append((x, y))
    for y in range(height):
        for x in (0, width - 1):
            if not mask[y, x] and not exterior[y, x]:
                exterior[y, x] = True
                queue.append((x, y))
    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and not mask[ny, nx] and not exterior[ny, nx]:
                exterior[ny, nx] = True
                queue.append((nx, ny))
    holes = ~mask & ~exterior
    labels = labels.copy()
    labels[holes] = 1
    return labels, int(holes.sum())


def clean_labels(labels: np.ndarray) -> tuple[np.ndarray, dict]:
    mask, source_components, source_sizes = largest_component(labels != BACKGROUND)
    cleaned = labels.copy()
    cleaned[~mask] = BACKGROUND
    cleaned, holes = fill_pinholes(cleaned)
    mask = cleaned != BACKGROUND

    # A one-cell dark outline keeps the silhouette readable on the lawn.  The
    # majority-voted upper-left highlights remain one cell inside that edge.
    boundary = np.zeros_like(mask)
    for y, x in zip(*np.where(mask)):
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if not (0 <= nx < mask.shape[1] and 0 <= ny < mask.shape[0]) or not mask[ny, nx]:
                boundary[y, x] = True
                break
    cleaned[boundary] = 0

    # Reinforce the requested dark base row without changing the silhouette.
    mask = cleaned != BACKGROUND
    for x in range(cleaned.shape[1]):
        ys = np.where(mask[:, x])[0]
        if len(ys):
            cleaned[ys[-1], x] = 0
            if len(ys) > 2:
                cleaned[ys[-2], x] = min(int(cleaned[ys[-2], x]), 1)

    # Remove isolated one-cell color flecks only when they are fully enclosed
    # by the object.  Deliberate edge highlights and pointed tips are retained.
    replacements = 0
    for _ in range(8):
        updated = cleaned.copy()
        pass_replacements = 0
        for y in range(1, cleaned.shape[0] - 1):
            for x in range(1, cleaned.shape[1] - 1):
                value = int(cleaned[y, x])
                neighbors = [int(cleaned[y - 1, x]), int(cleaned[y + 1, x]), int(cleaned[y, x - 1]), int(cleaned[y, x + 1])]
                if value == BACKGROUND or BACKGROUND in neighbors or value in neighbors:
                    continue
                updated[y, x] = Counter(neighbors).most_common(1)[0][0]
                replacements += 1
                pass_replacements += 1
        cleaned = updated
        if pass_replacements == 0:
            break

    return cleaned, {
        "componentsBeforeLargest": source_components,
        "componentSizesBeforeLargest": source_sizes,
        "pinholesFilled": holes,
        "interiorSpecklesReplaced": replacements,
    }


def labels_to_image(labels: np.ndarray) -> Image.Image:
    rgba = np.zeros((*labels.shape, 4), dtype=np.uint8)
    mask = labels != BACKGROUND
    rgba[mask, :3] = PALETTE[labels[mask]].astype(np.uint8)
    rgba[mask, 3] = 255
    return Image.fromarray(rgba, "RGBA")


def isolated_interior_pixels(labels: np.ndarray) -> int:
    count = 0
    for y in range(1, labels.shape[0] - 1):
        for x in range(1, labels.shape[1] - 1):
            value = int(labels[y, x])
            neighbors = [int(labels[y - 1, x]), int(labels[y + 1, x]), int(labels[y, x - 1]), int(labels[y, x + 1])]
            if value != BACKGROUND and BACKGROUND not in neighbors and value not in neighbors:
                count += 1
    return count


def process(name: str, path: Path) -> tuple[Image.Image, dict]:
    source = Image.open(path).convert("RGB")
    SOURCE_OUT.mkdir(parents=True, exist_ok=True)
    source_copy = SOURCE_OUT / f"{name}-generated.png"
    source.save(source_copy, optimize=False)
    labels = label_source(np.asarray(source))
    detection = detect_grid(labels, FINAL[name])
    bbox = tuple(detection["sourceObjectBoundsPx"])
    native = tuple(detection["nativeLogicalSize"])
    logical = majority_grid(labels, bbox, native)
    fitted = fit_grid(logical, FINAL[name])
    cleaned, cleanup = clean_labels(fitted)
    image = labels_to_image(cleaned)
    output = OUT / f"clump-{name}.png"
    image.save(output, optimize=False)

    array = np.asarray(image)
    mask = array[:, :, 3] > 0
    _, components, component_sizes = largest_component(mask)
    used = sorted({"#" + "".join(f"{channel:02X}" for channel in pixel) for pixel in array[mask, :3]})
    checks = {
        "rawSourceSha256": digest(path),
        "rawCanvasPxBeforeAnyResize": list(source.size),
        **detection,
        "majorityVoteLogicalGrid": list(native),
        "finalCanvasPx": list(image.size),
        "runtimeScale": 1,
        "objectCount": components,
        "componentSizes": component_sizes,
        "binaryAlpha": sorted(map(int, np.unique(array[:, :, 3]))) == [0, 255],
        "noMagentaOrPink": all(not (pixel[0] > 150 and pixel[2] > 100 and pixel[1] < 130) for pixel in array[mask, :3]),
        "onlyLockedColors": set(used) <= set(PALETTE_HEX),
        "usesLightestHighlight": PALETTE_HEX[-1] in used,
        "isolatedInteriorColorPixels": isolated_interior_pixels(cleaned),
        "usedColors": used,
        "processing": "detected-grid majority vote; no point sampling, filtering, dithering or antialiasing",
        "cleanup": cleanup,
        "sha256": digest(output),
    }
    required = (
        checks["objectCount"] == 1
        and checks["binaryAlpha"]
        and checks["noMagentaOrPink"]
        and checks["onlyLockedColors"]
        and checks["usesLightestHighlight"]
        and checks["isolatedInteriorColorPixels"] == 0
    )
    if not required:
        raise AssertionError({name: checks})
    return image, checks


def player_frame() -> Image.Image:
    sheet = Image.open(ROOT / "public/assets/pixel/processed/boy.png").convert("RGBA")
    return sheet.crop((0, 0, 64, 64)).resize((96, 96), Image.Resampling.NEAREST)


def make_review(images: dict[str, Image.Image]) -> None:
    lawn = Image.open(ROOT / "output/art/ground-grass-v2/grass_ground_12x12_2x.png").convert("RGB")
    lawn = lawn.crop((320, 330, 1000, 670))
    fit = lawn.copy()
    player = player_frame()
    fit.paste(player, (286, 176), player)
    positions = {"wide": (76, 226), "tall": (190, 212), "small": (438, 222)}
    for name, position in positions.items():
        fit.paste(images[name], position, images[name])
    fit.save(OUT / "clumps-fit-new-lawn-1x.png", optimize=False)
    fit.resize((fit.width * 3, fit.height * 3), Image.Resampling.NEAREST).save(
        OUT / "clumps-fit-new-lawn-3x.png", optimize=False
    )

    panel = Image.new("RGB", (600, 230), "#6C7749")
    draw = ImageDraw.Draw(panel)
    positions = {"wide": 105, "tall": 300, "small": 495}
    for name in ("wide", "tall", "small"):
        sprite = images[name].resize((images[name].width * 3, images[name].height * 3), Image.Resampling.NEAREST)
        x = positions[name] - sprite.width // 2
        panel.paste(sprite, (x, 190 - sprite.height), sprite)
        draw.text((positions[name] - 18, 204), name.upper(), fill="#F0E8C7")
    panel.save(OUT / "clumps-alone-3x.png", optimize=False)


def make_zoom_proof(sprite: Image.Image) -> None:
    # Simulate the world-camera sampling of a scale-1 sprite at zoom 1.5.
    left = max(0, sprite.width // 2 - 8)
    source_crop = sprite.crop((left, 0, min(sprite.width, left + 16), min(16, sprite.height)))
    zoomed = source_crop.resize((round(source_crop.width * 1.5), round(source_crop.height * 1.5)), Image.Resampling.NEAREST)
    enlarged = zoomed.resize((zoomed.width * 12, zoomed.height * 12), Image.Resampling.NEAREST).convert("RGB")
    proof = Image.new("RGB", (enlarged.width, enlarged.height + 28), "#263E38")
    proof.paste(enlarged, (0, 28))
    draw = ImageDraw.Draw(proof)
    draw.text((4, 4), "1.5x: cream widths alternate 1 / 2 screen px", fill="#FFF6DC")
    # Red guides mark individual simulated screen pixels. Yellow guides mark
    # source-pixel boundaries after 1.5x nearest sampling: their spacing is
    # visibly 12,24,12,24 inspection pixels (one then two screen pixels).
    for x in range(0, proof.width, 12):
        draw.line((x, 28, x, proof.height - 1), fill="#C9514A")
    for y in range(28, proof.height, 12):
        draw.line((0, y, proof.width - 1, y), fill="#C9514A")
    for source_x in range(source_crop.width + 1):
        x = round(source_x * 1.5) * 12
        if x < proof.width:
            draw.line((x, 24, x, proof.height - 1), fill="#F6E8C8", width=2)
    proof.save(OUT / "camera-zoom-1_5-proof.png", optimize=False)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    images: dict[str, Image.Image] = {}
    checks = {}
    for name, path in GENERATED.items():
        images[name], checks[name] = process(name, path)
    make_review(images)
    make_zoom_proof(images["small"])
    report = {
        "date": "2026-10-21",
        "status": "review only; not integrated",
        "cameraZoom": 1.5,
        "newAssetRuntimeScale": 1,
        "lockedPalette": PALETTE_HEX,
        "checks": checks,
        "zoomAnalysis": {
            "scale1AtZoom1_5": "one source pixel maps to 1.5 screen pixels, so nearest sampling alternates one- and two-screen-pixel runs",
            "integerOption": 2,
            "worldViewChange": "world viewport width and height become 75% of the current zoom-1.5 view; visible world area becomes 56.25%",
            "ui": "separate UI scene stays viewport-anchored; world-relative HUD pointers must continue using camera zoom",
            "existingFractionalAssetScales": [0.45, 0.7, 1.1, 1.66],
        },
        "futureTreeStage": "generate a new final-size scale-1 palm as the fourth tree asset; do not recolor the old scale-1.66 palm",
        "outputs": {path.name: digest(path) for path in sorted(OUT.glob("*.png"))},
    }
    (OUT / "checks.json").write_text(json.dumps(report, indent=2) + "\n")
    (EVIDENCE / "checks.json").write_text(json.dumps(report, indent=2) + "\n")
    (EVIDENCE / "SOURCE_RECORD.md").write_text(
        "# Tall grass clump checkpoint v3\n\n"
        "Three original review-only clumps were created in separate OpenAI built-in image-generation calls. "
        "The gameplay screenshot was a color/pixel-density/mood reference only. Each prompt requested one "
        "10–14-blade sprite drawn as if on a 48×48 logical canvas over solid magenta. Processing detects "
        "the large-preview logical cell cadence, uses majority-vote per cell, retains one connected object, "
        "fills enclosed alpha holes, locks the five-color palette and writes final scale-1 canvases. No clump "
        "is copied into `public/` or registered in Phaser pending approval.\n"
    )
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
