#!/usr/bin/env python3
"""Process three review-only generated clumps to final 1x runtime footprints."""

from __future__ import annotations

import hashlib
import json
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/art/tall-grass-clump-review-v2"
SOURCE_OUT = OUT / "source"
EVIDENCE = ROOT / "docs/assets/licenses/tall-grass-clump-review-v2"
GENERATED = {
    "wide": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-b29f1e6d-64a5-4870-9913-ed87e48f5e75.png"),
    "tall": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-b60c10c4-39f1-4b85-9769-7e3f3b653762.png"),
    "small": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-016cf6ad-4587-40d7-af90-cf68ef6562d2.png"),
}
FINAL = {"wide": (48, 34), "tall": (30, 48), "small": (38, 38)}
PALETTE_HEX = ["#3B4028", "#53582D", "#6A7138", "#858B49", "#A1A35C"]
PALETTE = np.asarray([tuple(int(value[index:index + 2], 16) for index in (1, 3, 5)) for value in PALETTE_HEX], dtype=np.int16)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def magenta_mask(rgb: np.ndarray) -> np.ndarray:
    # Tolerant enough for generated edge variants, but deliberately excludes
    # any warm or olive sprite color.
    return (rgb[:, :, 0] >= 190) & (rgb[:, :, 2] >= 150) & (rgb[:, :, 1] <= 105)


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


def fill_pinholes(mask: np.ndarray) -> tuple[np.ndarray, int]:
    height, width = mask.shape
    exterior = np.zeros_like(mask, dtype=bool)
    queue: deque[tuple[int, int]] = deque()
    for x in range(width):
        for y in (0, height - 1):
            if not mask[y, x] and not exterior[y, x]:
                exterior[y, x] = True; queue.append((x, y))
    for y in range(height):
        for x in (0, width - 1):
            if not mask[y, x] and not exterior[y, x]:
                exterior[y, x] = True; queue.append((x, y))
    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and not mask[ny, nx] and not exterior[ny, nx]:
                exterior[ny, nx] = True; queue.append((nx, ny))
    holes = ~mask & ~exterior
    result = mask.copy(); result[holes] = True
    return result, int(holes.sum())


def quantize(rgb: np.ndarray, mask: np.ndarray) -> np.ndarray:
    values = rgb.astype(np.int16)
    distances = ((values[:, :, None, :] - PALETTE[None, None, :, :]) ** 2).sum(axis=3)
    result = PALETTE[distances.argmin(axis=2)].astype(np.uint8)
    rgba = np.zeros((*mask.shape, 4), dtype=np.uint8)
    rgba[:, :, :3] = result
    rgba[:, :, 3] = mask.astype(np.uint8) * 255
    return rgba


def process(name: str, path: Path) -> tuple[Image.Image, dict]:
    source = Image.open(path).convert("RGB")
    SOURCE_OUT.mkdir(parents=True, exist_ok=True)
    source_copy = SOURCE_OUT / f"{name}-generated.png"
    source.save(source_copy, optimize=False)
    array = np.asarray(source)
    object_mask = ~magenta_mask(array)
    object_mask, source_components, source_sizes = largest_component(object_mask)
    ys, xs = np.where(object_mask)
    if len(xs) == 0:
        raise AssertionError(f"empty source {name}")
    crop_box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    rgba = np.zeros((*object_mask.shape, 4), dtype=np.uint8)
    rgba[:, :, :3] = array
    rgba[:, :, 3] = object_mask.astype(np.uint8) * 255
    cropped = Image.fromarray(rgba, "RGBA").crop(crop_box)

    # Author directly at the final rendered footprint. Runtime scale stays 1,
    # and 1-2 px blades are retained instead of collapsing into old scale-2
    # blocks.
    authored = cropped.resize(FINAL[name], Image.Resampling.NEAREST)
    authored_array = np.asarray(authored)
    authored_mask = authored_array[:, :, 3] > 0
    authored_mask, _, _ = largest_component(authored_mask)
    authored_mask, filled_holes = fill_pinholes(authored_mask)
    final = Image.fromarray(quantize(authored_array[:, :, :3], authored_mask), "RGBA")
    output = OUT / f"clump-{name}.png"
    final.save(output, optimize=False)

    final_array = np.asarray(final)
    final_mask = final_array[:, :, 3] > 0
    _, final_components, final_sizes = largest_component(final_mask)
    used = sorted({"#" + "".join(f"{channel:02X}" for channel in pixel)
                   for pixel in final_array[final_mask, :3]})
    checks = {
        "generatedSourceSize": list(source.size),
        "sourceCrop": list(crop_box),
        "sourceComponentsBeforeCleanup": source_components,
        "sourceComponentSizes": source_sizes,
        "authoredAtFinalPx": list(FINAL[name]),
        "finalRenderedPx": list(final.size),
        "runtimeScale": 1,
        "objectCount": final_components,
        "finalComponentSizes": final_sizes,
        "pinholesFilledAtLogicalSize": filled_holes,
        "binaryAlpha": sorted(map(int, np.unique(final_array[:, :, 3]))) == [0, 255],
        "onlyLockedColors": set(used) <= set(PALETTE_HEX),
        "usedColors": used,
        "nearestNeighborOnly": True,
        "sha256": digest(output),
    }
    if not (checks["objectCount"] == 1 and checks["binaryAlpha"] and checks["onlyLockedColors"]):
        raise AssertionError({name: checks})
    return final, checks


def player_frame() -> Image.Image:
    sheet = Image.open(ROOT / "public/assets/pixel/processed/boy.png").convert("RGBA")
    return sheet.crop((0, 0, 64, 64)).resize((96, 96), Image.Resampling.NEAREST)


def make_review(images: dict[str, Image.Image]) -> None:
    # Three isolated sprites, shown at 3x on a neutral locked-lawn backdrop.
    panel = Image.new("RGB", (600, 230), "#6C7749")
    draw = ImageDraw.Draw(panel)
    x_positions = {"wide": 105, "tall": 300, "small": 495}
    for name in ("wide", "tall", "small"):
        sprite = images[name].resize((images[name].width * 3, images[name].height * 3), Image.Resampling.NEAREST)
        x = x_positions[name] - sprite.width // 2
        y = 190 - sprite.height
        panel.paste(sprite, (x, y), sprite)
        draw.text((x_positions[name] - 18, 204), name.upper(), fill="#F0E8C7")
    panel.save(OUT / "clumps-alone-3x.png", optimize=False)

    lawn = Image.open(ROOT / "output/art/ground-grass-v2/grass_ground_12x12_2x.png").convert("RGB")
    lawn = lawn.crop((220, 170, 900, 510))
    fit = lawn.copy()
    player = player_frame()
    fit.paste(player, (286, 176), player)
    positions = {"wide": (88, 226), "tall": (190, 212), "small": (432, 222)}
    for name, position in positions.items():
        fit.paste(images[name], position, images[name])
    fit.save(OUT / "clumps-fit-new-lawn-1x.png", optimize=False)
    fit.resize((fit.width * 3, fit.height * 3), Image.Resampling.NEAREST).save(
        OUT / "clumps-fit-new-lawn-3x.png", optimize=False
    )

    # Review-only projection into the verified real capture. The files remain
    # outside public/, and no Phaser preload/placement is changed.
    game = Image.open(ROOT / "docs/verification/ground-grass-review-v1/home-integrated-1460x1062.png").convert("RGBA")
    projected = game.copy()
    screen_positions = {"wide": (470, 340), "tall": (1090, 320), "small": (930, 540)}
    for name, position in screen_positions.items():
        width = round(images[name].width * 1.5)
        height = round(images[name].height * 1.5)
        sprite = images[name].resize((width, height), Image.Resampling.NEAREST)
        projected.alpha_composite(sprite, position)
    projected.convert("RGB").save(OUT / "clumps-in-game-projection.png", optimize=False)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    images, checks = {}, {}
    for name, path in GENERATED.items():
        images[name], checks[name] = process(name, path)
    make_review(images)
    report = {
        "date": "2026-10-21",
        "status": "review only; not integrated",
        "cameraZoomAt1460x1062": 1.5,
        "newAssetRuntimeScale": 1,
        "authoringRule": "direct final rendered footprint at runtime scale 1; no runtime fractional asset scaling",
        "runtimeScaleAudit": {
            "existingClumps": {"scale": 2, "integer": True},
            "existingBushes": {"scale": 0.45, "integer": False},
            "existingBroadleafAndRoundTrees": {"scale": 0.7, "integer": False},
            "existingTallThinTree": {"scale": 1.1, "integer": False},
            "existingPalms": {"scale": 1.66, "integer": False},
            "newReviewClumps": {"scale": 1, "integer": True},
        },
        "palmConsistencyWarning": "Yes. Recolor-only palms retain scale 1.66, so their source-pixel cadence can look uneven beside direct-final-size scale-1 art, especially under the 1.5 camera zoom.",
        "lockedPalette": PALETTE_HEX,
        "checks": checks,
        "generatedWith": "OpenAI built-in image generation; one call per clump",
        "outputs": {path.name: digest(path) for path in sorted(OUT.glob("*.png"))},
    }
    (OUT / "checks.json").write_text(json.dumps(report, indent=2) + "\n")
    (OUT / "scale-audit.md").write_text(
        "# Runtime scale audit\n\n"
        "Fixed review viewport camera zoom: **1.5**. Existing clumps are the only integer-scaled nature group (**2**). "
        "Existing bushes (**0.45**), broadleaf/round trees (**0.7**), tall-thin tree (**1.1**) and palms (**1.66**) "
        "are non-integer. New review clumps are authored at final size for scale **1**. The palms remain recolor-only; "
        "their 1.66 scale can look inconsistent beside the new direct-final-size art, particularly after camera zoom 1.5.\n"
    )
    (EVIDENCE / "SOURCE_RECORD.md").write_text(
        "# Tall grass clump checkpoint v2\n\n"
        "Three original review-only clump sources were made with the OpenAI built-in image generation tool, "
        "one call per sprite. The current clump was a problem reference; game screenshots were style/mood "
        "references only. Processing removed magenta, retained one connected object, resized with nearest-neighbor, "
        "locked pixels to the approved five-color clump palette, and saved final-size scale-1 PNGs. "
        "Nothing was copied into `public/` or registered in Phaser.\n"
    )
    (EVIDENCE / "checks.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
