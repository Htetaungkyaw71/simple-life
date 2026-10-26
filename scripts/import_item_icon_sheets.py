#!/usr/bin/env python3
"""Clean, palette-match and frame the reviewed 4x3 item icon sheets.

The runtime importer starts from already-native hard-pixel review sheets. It
finds artwork through 8-connected components, joins only nearby detached
fragments, and never divides a canvas by grid coordinates. It does not resize,
quantize, repaint geometry, or interpolate pixels.
"""

from __future__ import annotations

import colorsys
import hashlib
import json
import shutil
from collections import Counter
from pathlib import Path

from PIL import Image

from import_sheet import (
    BRIGHT_GREEN_LIGHTNESS,
    GREEN_HUE_MAX,
    GREEN_HUE_MIN,
    HUE_SHIFT,
    LIGHTNESS_SCALE,
    SATURATION_SCALE,
    clean_magenta,
    component_sets,
    is_magenta,
)


ROOT = Path(__file__).resolve().parents[1]
FRAME_SIZE = 24

SHEETS = (
    {
        "id": "seed-packets",
        "source": ROOT / "output/art/item-icon-sheets-v1/image-1-seed-packets.png",
        "expected": "ChatGPT_Image_25_Oct_2026__18_54_02-pixel-snapper.png",
        "record": ROOT / "docs/assets/licenses/item-icons-seed-packets-v1",
        "labels": ("tomato", "strawberry", "carrot", "corn", "chili", "eggplant", "green pepper", "watermelon", "pumpkin", "grapes", "blueberries", "sweet potato"),
        "keys": ("tomato-seed-item", "strawberry-seed-item", "carrot-seed-item", "corn-seed-item", "chili-seed-item", "eggplant-seed-item", None, "watermelon-seed-item", "pumpkin-seed-item", "grape-seed-item", "blueberry-seed-item", "sweetPotato-seed-item"),
    },
    {
        "id": "crop-produce",
        "source": ROOT / "output/art/item-icon-sheets-v1/image-2-harvested-produce.png",
        "expected": "ChatGPT_Image_25_Oct_2026__18_54_07-pixel-snapper.png",
        "record": ROOT / "docs/assets/licenses/item-icons-crop-produce-v1",
        "labels": ("tomato", "strawberry", "carrot", "corn", "chili", "eggplant", "green pepper", "watermelon", "pumpkin", "grapes", "blueberries", "sweet potato"),
        "keys": ("tomato-item", "strawberry-item", "carrot-item", "corn-item", "chili-item", "eggplant-item", None, "watermelon-item", "pumpkin-item", "grape-item", "blueberry-item", "sweetPotato-item"),
    },
    {
        "id": "fruit-tab",
        "source": ROOT / "output/art/item-icon-sheets-v1/image-3-fruit-food.png",
        "expected": "ChatGPT_Image_25_Oct_2026__18_54_12-pixel-snapper.png",
        "record": ROOT / "docs/assets/licenses/item-icons-fruit-tab-v1",
        "labels": ("grilled meat", "wild berries", "green pear", "mango", "banana", "orange", "papaya", "coconut", "dragon fruit", "pineapple", "watermelon", "grapes"),
        "keys": ("meat-item", "wild-berry-item", "guava-item", "mango-item", "banana-item", "orange-item", "papaya-item", "coconut-item", "dragon-fruit-item", "pineapple-item", "watermelon-item", "grape-item"),
    },
)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def component_bbox(component: set[tuple[int, int]]) -> tuple[int, int, int, int]:
    xs = [point[0] for point in component]
    ys = [point[1] for point in component]
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def bbox_gap(left: set[tuple[int, int]], right: set[tuple[int, int]]) -> tuple[int, float]:
    ax0, ay0, ax1, ay1 = component_bbox(left)
    bx0, by0, bx1, by1 = component_bbox(right)
    dx = max(0, bx0 - ax1, ax0 - bx1)
    dy = max(0, by0 - ay1, ay0 - by1)
    ac = ((ax0 + ax1) / 2, (ay0 + ay1) / 2)
    bc = ((bx0 + bx1) / 2, (by0 + by1) / 2)
    return max(dx, dy), (ac[0] - bc[0]) ** 2 + (ac[1] - bc[1]) ** 2


def detect_icons(image: Image.Image) -> tuple[list[set[tuple[int, int]]], dict]:
    points = {
        (x, y)
        for y in range(image.height)
        for x in range(image.width)
        if image.getpixel((x, y))[3]
    }
    raw = component_sets(points)
    components = [set(component) for component in raw]
    merges = []
    while len(components) > 12:
        smallest = min(range(len(components)), key=lambda index: len(components[index]))
        candidates = [
            (bbox_gap(components[smallest], component), index)
            for index, component in enumerate(components)
            if index != smallest
        ]
        (gap, distance), nearest = min(candidates)
        if gap > 8:
            raise ValueError(f"detached component is {gap}px from its nearest icon")
        merges.append({"fragmentPixels": len(components[smallest]), "gap": gap, "distanceSquared": round(distance, 2)})
        components[nearest].update(components[smallest])
        components.pop(smallest)
    if len(components) != 12:
        raise ValueError(f"expected 12 detected icons, found {len(components)}")

    # Position ordering follows detected visual centres: three bands, then X.
    by_y = sorted(components, key=lambda component: sum(y for _, y in component) / len(component))
    rows = [by_y[index:index + 4] for index in range(0, 12, 4)]
    ordered = [
        component
        for row in rows
        for component in sorted(row, key=lambda component: sum(x for x, _ in component) / len(component))
    ]
    return ordered, {"rawConnectedComponents": len(raw), "joinedFragments": merges, "detectedIcons": 12}


def crop_component(image: Image.Image, component: set[tuple[int, int]]) -> Image.Image:
    x0, y0, x1, y1 = component_bbox(component)
    result = Image.new("RGBA", (x1 - x0, y1 - y0))
    source = image.load()
    target = result.load()
    for x, y in component:
        target[x - x0, y - y0] = source[x, y]
    return result


def green_target(pixel: tuple[int, int, int, int]) -> tuple[int, int, int, int] | None:
    r, g, b, alpha = pixel
    hue, lightness, saturation = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    hue_degrees = hue * 360
    if not (GREEN_HUE_MIN <= hue_degrees <= GREEN_HUE_MAX and g > r and g > b):
        return None
    mapped_hue = ((hue_degrees - HUE_SHIFT) % 360) / 360
    mapped_saturation = max(0.0, min(1.0, saturation * SATURATION_SCALE))
    mapped_lightness = lightness * LIGHTNESS_SCALE if lightness >= BRIGHT_GREEN_LIGHTNESS else lightness
    red, green, blue = colorsys.hls_to_rgb(mapped_hue, mapped_lightness, mapped_saturation)
    return round(red * 255), round(green * 255), round(blue * 255), alpha


def protected_green_body(sheet_id: str, index: int, x: int, y: int, image: Image.Image) -> bool:
    # These spatial masks protect the explicitly named green fruit bodies while
    # allowing their top leaves/calyxes/stems to receive the shared foliage map.
    if sheet_id == "seed-packets" and index in (6, 7):
        return 7 <= y <= image.height - 4
    if sheet_id == "crop-produce" and index == 6:  # green pepper
        return y >= 5
    if sheet_id == "crop-produce" and index == 7:  # watermelon
        return y >= 3
    if sheet_id == "fruit-tab" and index == 2:  # pear body
        return y >= 6
    if sheet_id == "fruit-tab" and index == 10:  # striped melon body
        return y >= 4
    return False


def remap_icon(sheet_id: str, index: int, image: Image.Image) -> tuple[Image.Image, dict]:
    result = image.copy()
    pixels = result.load()
    changed = protected = candidates = 0
    lookup = {}
    for y in range(result.height):
        for x in range(result.width):
            pixel = pixels[x, y]
            if not pixel[3]:
                continue
            mapped = green_target(pixel)
            if mapped is None:
                continue
            candidates += 1
            if protected_green_body(sheet_id, index, x, y, result):
                protected += 1
                continue
            lookup[pixel] = mapped
            if mapped != pixel:
                pixels[x, y] = mapped
                changed += 1
    return result, {
        "greenCandidatePixels": candidates,
        "protectedGreenFruitBodyPixels": protected,
        "changedPixels": changed,
        "lookup": [{"from": list(source), "to": list(target)} for source, target in sorted(lookup.items())],
    }


def frame_icon(icon: Image.Image) -> tuple[Image.Image, dict]:
    if icon.width > FRAME_SIZE or icon.height > FRAME_SIZE:
        raise ValueError(f"{icon.size} does not fit the common {FRAME_SIZE}px frame")
    frame = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE))
    x = (FRAME_SIZE - icon.width) // 2
    y = FRAME_SIZE - icon.height
    frame.alpha_composite(icon, (x, y))
    return frame, {"pasteX": x, "pasteY": y, "anchorX": FRAME_SIZE / 2, "anchorY": FRAME_SIZE}


def process_sheet(spec: dict) -> dict:
    source_path = spec["source"]
    if not source_path.exists():
        raise FileNotFoundError(source_path)
    original = Image.open(source_path).convert("RGBA")
    colors = Counter(original.get_flattened_data())
    background, background_count = colors.most_common(1)[0]
    alpha = sorted(set(original.getchannel("A").get_flattened_data()))
    clean_grid = alpha in ([255], [0, 255]) and len(colors) <= 256 and is_magenta(background)
    if not clean_grid:
        raise ValueError(f"{source_path} is not a clean native hard-pixel sheet: colors={len(colors)}, alpha={alpha}, background={background}")

    cleaned, removed, remaining = clean_magenta(original)
    if remaining:
        raise ValueError(f"{source_path} retains {remaining} detected magenta pixels")
    components, detection = detect_icons(cleaned)
    raw_icons = [crop_component(cleaned, component) for component in components]
    if max(max(icon.size) for icon in raw_icons) != FRAME_SIZE:
        raise ValueError("the smallest common square is not the expected 24px native frame")

    pre_sheet = Image.new("RGBA", (FRAME_SIZE * 12, FRAME_SIZE))
    final_sheet = Image.new("RGBA", pre_sheet.size)
    reports = []
    for index, (label, key, raw) in enumerate(zip(spec["labels"], spec["keys"], raw_icons)):
        remapped, palette = remap_icon(spec["id"], index, raw)
        pre_frame, placement = frame_icon(raw)
        final_frame, final_placement = frame_icon(remapped)
        if pre_frame.getchannel("A").tobytes() != final_frame.getchannel("A").tobytes():
            raise ValueError(f"palette remap changed geometry for {label}")
        pre_sheet.alpha_composite(pre_frame, (index * FRAME_SIZE, 0))
        final_sheet.alpha_composite(final_frame, (index * FRAME_SIZE, 0))
        reports.append({
            "position": index + 1,
            "row": index // 4 + 1,
            "column": index % 4 + 1,
            "label": label,
            "itemKey": key,
            "sourceBounds": list(component_bbox(components[index])),
            "truePixelSize": list(raw.size),
            "sourceUniqueOpaqueColors": len({pixel for pixel in raw.get_flattened_data() if pixel[3]}),
            "finalUniqueOpaqueColors": len({pixel for pixel in remapped.get_flattened_data() if pixel[3]}),
            "placement": final_placement,
            "paletteRemap": palette,
        })

    record = spec["record"]
    record.mkdir(parents=True, exist_ok=True)
    source_copy = record / "source.png"
    cleaned_path = record / "cleaned-source.png"
    pre_path = record / "candidate-pre-palette.png"
    candidate_path = record / "candidate.png"
    shutil.copyfile(source_path, source_copy)
    cleaned.save(cleaned_path)
    pre_sheet.save(pre_path)
    final_sheet.save(candidate_path)
    output_alpha = sorted(set(final_sheet.getchannel("A").get_flattened_data()))
    output_magenta = sum(is_magenta(pixel) for pixel in final_sheet.get_flattened_data())
    if output_alpha != [0, 255] or output_magenta:
        raise ValueError(f"invalid output alpha/magenta: alpha={output_alpha}, magenta={output_magenta}")

    manifest = {
        "sheet": spec["id"],
        "requestedFilename": spec["expected"],
        "requestedPixelSnapperFilePresent": False,
        "actualNativeSource": str(source_path.relative_to(ROOT)),
        "actualNativeSourceNote": "Previously generated native review export from the matching 18_54 source; used because the requested -pixel-snapper filename was not present in Downloads, attachments, assets-src, or output.",
        "sourceSha256": sha256(source_copy),
        "sourceSize": list(original.size),
        "sourceUniqueColors": len(colors),
        "sourceAlphaValues": alpha,
        "dominantBackground": list(background),
        "dominantBackgroundPixels": background_count,
        "grid": {"cleanPixelGrid": clean_grid, "nativePixelGrid": True, "pixelsResampled": 0, "interpretation": "native 1px hard-edged art"},
        "detection": {"method": "8-connected opaque components with nearest-fragment joining; no fixed cell slicing", **detection},
        "cleanup": {"method": "shared boundary-connected magenta/matte removal from scripts/import_sheet.py", "removedColors": removed, "remainingMagentaPixels": remaining, "alphaValues": output_alpha, "pixelsResampled": 0},
        "paletteRemap": {"method": "shared dominant-green HSL transform with spatial fruit-body protection", "constants": {"SATURATION_SCALE": SATURATION_SCALE, "HUE_SHIFT": HUE_SHIFT, "LIGHTNESS_SCALE": LIGHTNESS_SCALE}},
        "frameSize": [FRAME_SIZE, FRAME_SIZE],
        "displayScale": 1,
        "candidate": {"path": str(candidate_path.relative_to(ROOT)), "sha256": sha256(candidate_path)},
        "prePaletteCandidate": {"path": str(pre_path.relative_to(ROOT)), "sha256": sha256(pre_path)},
        "cleanedSource": {"path": str(cleaned_path.relative_to(ROOT)), "sha256": sha256(cleaned_path)},
        "icons": reports,
        "warnings": ["green pepper has no existing runtime item key and is audit-only"] if spec["id"] != "fruit-tab" else ["meat-item is shared by grilled and raw meat", "watermelon-item and grape-item are shared with crop produce"],
    }
    (record / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest


def main() -> None:
    reports = [process_sheet(spec) for spec in SHEETS]
    print(json.dumps({"sheets": [{"sheet": report["sheet"], "frameSize": report["frameSize"], "icons": len(report["icons"])} for report in reports]}, indent=2))


if __name__ == "__main__":
    main()
