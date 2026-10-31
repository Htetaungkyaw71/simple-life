#!/usr/bin/env python3
"""Snap the generated 2x2 cucumber/grape/berry board to native item pixels.

The generated preview is sampled by logical-cell area vote. No filtered resize,
antialiasing, blur, or runtime fractional scale is used. Each result is palette
locked, bottom-centred in the established 24px item frame, and exported both as
one 2x2 magenta evidence sheet and a transparent runtime strip.
"""

from __future__ import annotations

import hashlib
import json
import math
import shutil
from collections import Counter, deque
from pathlib import Path

from PIL import Image

from import_item_icon_sheets import green_target


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "output/art/item-icon-repair-v1/generated-2x2.png"
RECORD = ROOT / "docs/assets/licenses/item-icon-repair-v1"
MAGENTA = (255, 0, 255)
FRAME = 24
GENERATED_BACKGROUND_DISTANCE = 4
# Recorded from the generated source's outer edge. The source is visually flat
# magenta but contains tiny codec/generation variations around its dominant
# #FC03FA. These exact references replace the retired broad hue predicate.
GENERATED_BACKGROUND_REFERENCES = (
    (252, 3, 250), (247, 5, 250), (247, 6, 250), (248, 4, 249),
    (249, 12, 245), (250, 8, 250), (250, 11, 245), (250, 12, 246),
    (250, 14, 246), (251, 3, 249), (251, 4, 248), (251, 4, 249),
    (251, 4, 251), (251, 5, 249), (251, 5, 251), (251, 6, 251),
    (252, 4, 249), (241, 32, 238), (248, 16, 243), (243, 27, 241),
    (247, 16, 241),
)

SPECS = (
    {
        "label": "cucumber seed packet",
        "key": "cucumber-seed-item",
        "quadrant": (0, 0),
        "target": (19, 24),
        "palette": (
            "#293306", "#3c4a08", "#5f7114", "#879439", "#b4b86a",
            "#6d7e18", "#3f6810", "#2c5110", "#75a624", "#a8ca48",
            "#8f672e", "#b98843", "#d7aa58", "#ead084", "#f6e2a5",
            "#fff0bd", "#fff7d2", "#d5bd6b",
        ),
    },
    {
        "label": "cucumber produce",
        "key": "cucumber-item",
        "quadrant": (1, 0),
        "target": (18, 14),
        "palette": (
            "#24360e", "#315212", "#417017", "#568c20", "#70a92b",
            "#8fc63b", "#b5db55", "#d5e77d", "#8b6227", "#cf9632", "#f0c85a",
        ),
    },
    {
        "label": "grapes produce",
        "key": "grape-item",
        "quadrant": (0, 1),
        "target": (17, 19),
        "palette": (
            "#241a4e", "#3b2d78", "#5a4aa8", "#6e5bc0", "#8c7cd6", "#d5cff6",
            "#4a321c", "#76502a", "#314916", "#52731e", "#7d9b32", "#aec65b",
        ),
    },
    {
        "label": "wild berries produce",
        "key": "wild-berry-item",
        "quadrant": (1, 1),
        "target": (18, 18),
        "palette": (
            "#17121d", "#2e2238", "#4d3a5e", "#67517a", "#8390a7", "#bec6d2",
            "#2c4317", "#4c6d20", "#729431", "#a5bf58",
        ),
    },
)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def rgb(value: str) -> tuple[int, int, int]:
    return tuple(int(value[index:index + 2], 16) for index in (1, 3, 5))


def near_recorded_background(pixel: tuple[int, int, int]) -> bool:
    return any(
        max(abs(pixel[channel] - reference[channel]) for channel in range(3)) <= GENERATED_BACKGROUND_DISTANCE
        for reference in GENERATED_BACKGROUND_REFERENCES
    )


def connected_background_mask(image: Image.Image) -> set[tuple[int, int]]:
    """Return only recorded-color pixels 8-connected to the outer background."""
    queue: deque[tuple[int, int]] = deque()
    for x in range(image.width):
        queue.extend(((x, 0), (x, image.height - 1)))
    for y in range(image.height):
        queue.extend(((0, y), (image.width - 1, y)))
    background: set[tuple[int, int]] = set()
    while queue:
        x, y = queue.popleft()
        if (x, y) in background or not near_recorded_background(image.getpixel((x, y))):
            continue
        background.add((x, y))
        for ny in range(max(0, y - 1), min(image.height, y + 2)):
            for nx in range(max(0, x - 1), min(image.width, x + 2)):
                if (nx, ny) not in background:
                    queue.append((nx, ny))
    return background


def bbox_for(quadrant: Image.Image, background: set[tuple[int, int]]) -> tuple[int, int, int, int]:
    points = [
        (x, y)
        for y in range(quadrant.height)
        for x in range(quadrant.width)
        if (x, y) not in background
    ]
    if not points:
        raise ValueError("generated quadrant contains no icon")
    xs = [point[0] for point in points]
    ys = [point[1] for point in points]
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def detected_cell(quadrant: Image.Image, bounds: tuple[int, int, int, int], background_points: set[tuple[int, int]]) -> dict:
    crop = quadrant.crop(bounds).quantize(colors=48, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    labels = list(crop.get_flattened_data())
    width, height = crop.size
    source = quadrant.crop(bounds)
    background = [
        (x + bounds[0], y + bounds[1]) in background_points
        for y in range(height)
        for x in range(width)
    ]
    runs = []
    horizontal_edges = []
    vertical_edges = []
    for y in range(height):
        for x in range(1, width):
            at = y * width + x
            before = at - 1
            if labels[at] != labels[before] or background[at] != background[before]:
                horizontal_edges.append(x)
    for y in range(1, height):
        for x in range(width):
            at = y * width + x
            before = at - width
            if labels[at] != labels[before] or background[at] != background[before]:
                vertical_edges.append(y)
    for vertical in (False, True):
        outer, inner = (width, height) if vertical else (height, width)
        for line in range(outer):
            values = [labels[(index * width + line) if vertical else (line * width + index)] for index in range(inner)]
            backs = [background[(index * width + line) if vertical else (line * width + index)] for index in range(inner)]
            start = 0
            for index in range(1, inner + 1):
                if index == inner or values[index] != values[start] or backs[index] != backs[start]:
                    length = index - start
                    if not backs[start] and 4 <= length <= 96:
                        runs.append(length)
                    start = index
    candidates = []
    for cell in range(6, 33):
        support = sum(abs(length / cell - round(length / cell)) <= .16 for length in runs) / max(1, len(runs))
        periodicity_parts = []
        for edges in (horizontal_edges, vertical_edges):
            counts = Counter(edge % cell for edge in edges)
            periodicity_parts.append(sum(sorted(counts.values(), reverse=True)[:min(2, cell)]) / max(1, len(edges)))
        periodicity = sum(periodicity_parts) / max(1, len(periodicity_parts))
        score = support * .68 + periodicity * .32
        candidates.append({"cell": cell, "score": round(score, 6), "support": round(support, 6), "edgePeriodicity": round(periodicity, 6)})
    candidates.sort(key=lambda item: (item["score"], item["cell"]), reverse=True)
    best = candidates[0]
    return {
        "detectedCellPx": best["cell"],
        "score": best["score"],
        "runSupport": best["support"],
        "edgePeriodicity": best["edgePeriodicity"],
        "topCandidates": candidates[:5],
        "sourceObjectBoundsPx": list(bounds),
        "sourceObjectSizePx": [bounds[2] - bounds[0], bounds[3] - bounds[1]],
    }


def nearest_palette(pixel: tuple[int, int, int], palette: tuple[tuple[int, int, int], ...]) -> tuple[int, int, int]:
    return min(palette, key=lambda value: sum((pixel[index] - value[index]) ** 2 for index in range(3)))


def apply_green_remap(icon: Image.Image, key: str) -> tuple[Image.Image, dict]:
    """Apply the shared foliage constants without touching fruit colours.

    The cucumber body is green fruit, so it keeps its deliberately contrasted
    source palette. Packet greens and the grape/berry leaf pixels use the same
    green_target transform as the established item-sheet importer.
    """
    result = icon.copy()
    pixels = result.load()
    candidates = protected = changed = 0
    lookup = {}
    for y in range(result.height):
        for x in range(result.width):
            source = pixels[x, y]
            if not source[3]:
                continue
            mapped = green_target(source)
            if mapped is None:
                continue
            candidates += 1
            if key == "cucumber-item":
                protected += 1
                continue
            lookup[source] = mapped
            if mapped != source:
                pixels[x, y] = mapped
                changed += 1
    return result, {
        "greenCandidatePixels": candidates,
        "protectedGreenFruitBodyPixels": protected,
        "changedPixels": changed,
        "lookup": [
            {"from": list(source), "to": list(target)}
            for source, target in sorted(lookup.items())
        ],
    }


def area_vote(
    quadrant: Image.Image,
    bounds: tuple[int, int, int, int],
    background: set[tuple[int, int]],
    size: tuple[int, int],
    palette: tuple[tuple[int, int, int], ...],
) -> Image.Image:
    left, top, right, bottom = bounds
    out_width, out_height = size
    output = Image.new("RGBA", size)
    for y in range(out_height):
        y0 = top + round((bottom - top) * y / out_height)
        y1 = max(y0 + 1, top + round((bottom - top) * (y + 1) / out_height))
        for x in range(out_width):
            x0 = left + round((right - left) * x / out_width)
            x1 = max(x0 + 1, left + round((right - left) * (x + 1) / out_width))
            samples = [
                quadrant.getpixel((sx, sy))
                for sy in range(y0, min(y1, quadrant.height))
                for sx in range(x0, min(x1, quadrant.width))
            ]
            foreground = [
                quadrant.getpixel((sx, sy))
                for sy in range(y0, min(y1, quadrant.height))
                for sx in range(x0, min(x1, quadrant.width))
                if (sx, sy) not in background
            ]
            if len(foreground) < max(1, math.ceil(len(samples) * .22)):
                continue
            median = tuple(sorted(pixel[channel] for pixel in foreground)[len(foreground) // 2] for channel in range(3))
            output.putpixel((x, y), nearest_palette(median, palette) + (255,))
    box = output.getchannel("A").getbbox()
    if not box:
        raise ValueError("logical vote produced an empty icon")
    return output.crop(box)


def frame_icon(icon: Image.Image) -> tuple[Image.Image, dict]:
    if icon.width > FRAME or icon.height > FRAME:
        raise ValueError(f"{icon.size} exceeds the {FRAME}px frame")
    frame = Image.new("RGBA", (FRAME, FRAME))
    x = (FRAME - icon.width) // 2
    y = FRAME - icon.height
    frame.paste(icon, (x, y), icon)
    return frame, {"pasteX": x, "pasteY": y, "anchorX": FRAME / 2, "anchorY": FRAME}


def pca_ratio(icon: Image.Image) -> float:
    points = [(x, y) for y in range(icon.height) for x in range(icon.width) if icon.getpixel((x, y))[3]]
    mean_x = sum(x for x, _ in points) / len(points)
    mean_y = sum(y for _, y in points) / len(points)
    xx = sum((x - mean_x) ** 2 for x, _ in points) / len(points)
    yy = sum((y - mean_y) ** 2 for _, y in points) / len(points)
    xy = sum((x - mean_x) * (y - mean_y) for x, y in points) / len(points)
    trace = xx + yy
    delta = math.sqrt(max(0, (xx - yy) ** 2 + 4 * xy * xy))
    major = max(.0001, (trace + delta) / 2)
    minor = max(.0001, (trace - delta) / 2)
    return round(math.sqrt(major / minor), 3)


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")
    RECORD.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SOURCE, RECORD / "source.png")
    strip = Image.new("RGBA", (FRAME * len(SPECS), FRAME))
    snapped = Image.new("RGB", (FRAME * 4, FRAME * 4), MAGENTA)
    reports = []
    half_width, half_height = source.width // 2, source.height // 2
    for index, spec in enumerate(SPECS):
        column, row = spec["quadrant"]
        quadrant = source.crop((column * half_width, row * half_height, (column + 1) * half_width, (row + 1) * half_height))
        background = connected_background_mask(quadrant)
        bounds = bbox_for(quadrant, background)
        detection = detected_cell(quadrant, bounds, background)
        palette = tuple(rgb(value) for value in spec["palette"])
        icon = area_vote(quadrant, bounds, background, spec["target"], palette)
        icon, palette_remap = apply_green_remap(icon, spec["key"])
        frame, placement = frame_icon(icon)
        strip.paste(frame, (index * FRAME, 0), frame)
        evidence_x = column * FRAME * 2 + (FRAME * 2 - icon.width) // 2
        evidence_y = row * FRAME * 2 + (FRAME * 2 - icon.height) // 2
        snapped.paste(icon.convert("RGB"), (evidence_x, evidence_y), icon)
        colors = {pixel[:3] for pixel in icon.get_flattened_data() if pixel[3]}
        magenta = [color for color in colors if color[0] >= 220 and color[2] >= 220 and color[1] <= 90]
        report = {
            "position": index + 1,
            "label": spec["label"],
            "itemKey": spec["key"],
            "requestedNativeSize": list(spec["target"]),
            "truePixelSize": list(icon.size),
            "uniqueOpaqueColors": len(colors),
            "opaquePixels": sum(pixel[3] == 255 for pixel in icon.get_flattened_data()),
            "alphaValues": sorted(set(icon.getchannel("A").get_flattened_data())),
            "magentaColors": [list(color) for color in magenta],
            "placement": placement,
            "logicalGrid": detection,
            "principalAxisRatio": pca_ratio(icon),
            "sourcePalette": list(spec["palette"]),
            "finalPalette": ["#" + "".join(f"{channel:02x}" for channel in color) for color in sorted(colors)],
            "paletteRemap": palette_remap,
        }
        if report["alphaValues"] not in ([255], [0, 255]) or magenta:
            raise ValueError(f"invalid snapped output for {spec['label']}: {report}")
        reports.append(report)
    candidate = RECORD / "candidate.png"
    snapped_path = RECORD / "snapped-2x2.png"
    strip.save(candidate)
    snapped.save(snapped_path)
    manifest = {
        "date": "2026-10-26",
        "generator": "OpenAI built-in image generation; model version not exposed",
        "source": str(SOURCE.relative_to(ROOT)),
        "sourceSha256": digest(SOURCE),
        "sourceSize": list(source.size),
        "backgroundCleanup": {
            "references": [list(color) for color in GENERATED_BACKGROUND_REFERENCES],
            "distance": GENERATED_BACKGROUND_DISTANCE,
            "connectivity": 8,
            "method": "recorded-color components connected to the outer background; no hue/saturation/lightness deletion",
        },
        "processing": "quadrant object detection; generated logical-grid cadence audit; source-area majority vote into native cells; fixed palette; shared green-only HSL remap with Cucumber fruit-body protection; no filtered resize, antialiasing, blur or runtime fractional scale",
        "frameSize": [FRAME, FRAME],
        "displayScale": 1,
        "candidate": {"path": str(candidate.relative_to(ROOT)), "sha256": digest(candidate)},
        "snappedSheet": {"path": str(snapped_path.relative_to(ROOT)), "sha256": digest(snapped_path), "size": list(snapped.size), "background": "#FF00FF"},
        "icons": reports,
    }
    (RECORD / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
