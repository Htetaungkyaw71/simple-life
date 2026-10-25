"""Verify, clean, palette-match, pack, and install horizontal crop sheets.

Geometry remains lossless: the importer never rescales or filters source art.
Background cleanup is boundary connected and ground cleanup is spatial. A
deterministic exact-colour lookup then maps living green pixels toward the
world palette; immutable pre-palette candidates allow later tuning without
re-running source cleanup. Runtime installation remains one batch operation.
"""
from __future__ import annotations

import argparse
import colorsys
import hashlib
import json
from collections import Counter, deque
from pathlib import Path
from statistics import median

from PIL import Image


STATES = ("seed", "sprout", "young", "flowering", "ripe", "dry", "wilted", "dead")

# Positive HUE_SHIFT means "toward yellow/olive" and is subtracted from the
# conventional HSL hue angle. These are the only colour-strength controls.
SATURATION_SCALE = 0.78
HUE_SHIFT = 8.0
LIGHTNESS_SCALE = 0.94
GREEN_HUE_MIN = 60.0
GREEN_HUE_MAX = 170.0
BRIGHT_GREEN_LIGHTNESS = 0.50
PALETTE_STAGES = frozenset(("sprout", "young", "flowering", "ripe"))


def parse_size(value: str) -> tuple[int, int]:
    try:
        width, height = (int(part) for part in value.lower().split("x", 1))
    except (TypeError, ValueError) as error:
        raise argparse.ArgumentTypeError("frame size must be WIDTHxHEIGHT") from error
    if width < 1 or height < 1:
        raise argparse.ArgumentTypeError("frame dimensions must be positive")
    return width, height


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def is_magenta(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel
    return bool(a and r >= 100 and b >= 80 and r > g * 2 and b > g * 2 and abs(r - b) <= 70)


def occupied_columns(image: Image.Image, background: tuple[int, int, int, int]) -> list[tuple[int, int]]:
    pixels = image.load()
    columns = [x for x in range(image.width) if any(pixels[x, y] != background for y in range(image.height))]
    if not columns:
        return []
    runs: list[tuple[int, int]] = []
    start = previous = columns[0]
    for x in columns[1:]:
        if x > previous + 1:
            runs.append((start, previous))
            start = x
        previous = x
    runs.append((start, previous))
    return runs


def occupied_alpha_columns(image: Image.Image) -> list[tuple[int, int]]:
    pixels = image.load()
    columns = [x for x in range(image.width) if any(pixels[x, y][3] for y in range(image.height))]
    if not columns:
        return []
    runs: list[tuple[int, int]] = []
    start = previous = columns[0]
    for x in columns[1:]:
        if x > previous + 1:
            runs.append((start, previous))
            start = x
        previous = x
    runs.append((start, previous))
    return runs


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.getchannel("A").getbbox()


def two_by_two_score(image: Image.Image, background: tuple[int, int, int, int]) -> dict:
    pixels = image.load()
    best = {"homogeneous": -1, "touched": 1, "offset": [0, 0]}
    for offset_y in (0, 1):
        for offset_x in (0, 1):
            homogeneous = touched = 0
            for y in range(offset_y, image.height - 1, 2):
                for x in range(offset_x, image.width - 1, 2):
                    values = [pixels[x + dx, y + dy] for dy in (0, 1) for dx in (0, 1)]
                    if any(value != background for value in values):
                        touched += 1
                        homogeneous += len(set(values)) == 1
            if homogeneous / max(1, touched) > best["homogeneous"] / max(1, best["touched"]):
                best = {"homogeneous": homogeneous, "touched": touched, "offset": [offset_x, offset_y]}
    best["ratio"] = best["homogeneous"] / best["touched"]
    return best


def source_bounds(image: Image.Image, runs: list[tuple[int, int]], background: tuple[int, int, int, int] | None = None) -> list[dict]:
    pixels = image.load()
    result = []
    for x0, x1 in runs:
        points = [
            (x, y)
            for y in range(image.height)
            for x in range(x0, x1 + 1)
            if pixels[x, y][3] and (background is None or pixels[x, y] != background)
        ]
        result.append({
            "x": min(x for x, _ in points),
            "y": min(y for _, y in points),
            "width": max(x for x, _ in points) - min(x for x, _ in points) + 1,
            "height": max(y for _, y in points) - min(y for _, y in points) + 1,
        })
    return result


def clean_magenta(image: Image.Image) -> tuple[Image.Image, list[list[int]], int]:
    """Remove only background-family pixels reachable from the canvas boundary.

    Pixel Snapper occasionally wraps a magenta sheet in a near-white matte. The
    matte is accepted only when connected to the outer edge, so white flowers
    and highlights inside a plant remain untouched.
    """
    cleaned = image.copy()
    pixels = cleaned.load()
    queue: deque[tuple[int, int]] = deque()
    matte: set[tuple[int, int]] = set()
    for x in range(cleaned.width):
        queue.extend(((x, 0), (x, cleaned.height - 1)))
    for y in range(cleaned.height):
        queue.extend(((0, y), (cleaned.width - 1, y)))
    while queue:
        point = queue.popleft()
        if point in matte:
            continue
        x, y = point
        pixel = pixels[x, y]
        if not (pixel[3] and min(pixel[:3]) >= 235):
            continue
        matte.add(point)
        for ny in range(max(0, y - 1), min(cleaned.height, y + 2)):
            for nx in range(max(0, x - 1), min(cleaned.width, x + 2)):
                if (nx, ny) not in matte:
                    queue.append((nx, ny))
    magenta: set[tuple[int, int]] = set()
    queue.clear()
    for x in range(cleaned.width):
        queue.extend(((x, 0), (x, cleaned.height - 1)))
    for y in range(cleaned.height):
        queue.extend(((0, y), (cleaned.width - 1, y)))
    for x, y in matte:
        for ny in range(max(0, y - 1), min(cleaned.height, y + 2)):
            for nx in range(max(0, x - 1), min(cleaned.width, x + 2)):
                queue.append((nx, ny))
    while queue:
        point = queue.popleft()
        if point in magenta or point in matte:
            continue
        x, y = point
        if not is_magenta(pixels[x, y]):
            continue
        magenta.add(point)
        for ny in range(max(0, y - 1), min(cleaned.height, y + 2)):
            for nx in range(max(0, x - 1), min(cleaned.width, x + 2)):
                if (nx, ny) not in magenta:
                    queue.append((nx, ny))
    seen = matte | magenta
    removed = Counter(pixels[x, y] for x, y in seen)
    for point in seen:
        pixels[point] = (0, 0, 0, 0)
    remaining_magenta = sum(
        is_magenta(pixels[x, y])
        for y in range(cleaned.height)
        for x in range(cleaned.width)
    )
    return cleaned, [list(color) + [count] for color, count in sorted(removed.items())], remaining_magenta


def stage_images(image: Image.Image, runs: list[tuple[int, int]]) -> list[Image.Image]:
    return [image.crop((x0, 0, x1 + 1, image.height)) for x0, x1 in runs]


def component_sets(points: set[tuple[int, int]]) -> list[set[tuple[int, int]]]:
    remaining = set(points)
    components: list[set[tuple[int, int]]] = []
    while remaining:
        start = remaining.pop()
        component = {start}
        queue = deque([start])
        while queue:
            x, y = queue.popleft()
            for ny in range(y - 1, y + 2):
                for nx in range(x - 1, x + 2):
                    point = (nx, ny)
                    if point in remaining:
                        remaining.remove(point)
                        component.add(point)
                        queue.append(point)
        components.append(component)
    return components


def opaque_count(image: Image.Image) -> int:
    return sum(bool(alpha) for alpha in image.getchannel("A").get_flattened_data())


def connected_shape_count(image: Image.Image) -> int:
    points = {
        (x, y)
        for y in range(image.height)
        for x in range(image.width)
        if image.getpixel((x, y))[3]
    }
    return len(component_sets(points))


def remove_soil_mounds(stages: list[Image.Image]) -> tuple[list[Image.Image], dict]:
    """Remove the repeated bottom-connected base region from stages 2-8.

    Pixels are compared at aligned bottom-centre offsets. A pixel enters the
    mask only when the same exact source pixel repeats in at least three stages
    and belongs to a broad component connected to the base line. This keeps the
    mask spatial/region based and prevents a plant-colour match elsewhere from
    deleting stems, vines, roots, or distressed leaves.
    """
    if len(stages) != len(STATES):
        return stages, {"valid": False, "reason": f"expected {len(STATES)} stages"}

    boxes = [alpha_bbox(stage) for stage in stages]
    if any(box is None for box in boxes):
        return stages, {"valid": False, "reason": "empty stage before ground cleanup"}
    bottoms = [box[3] - 1 for box in boxes if box]
    baseline = round(median(bottoms))
    band_top = max(0, baseline - 12)
    centres = []
    for stage, box, bottom in zip(stages, boxes, bottoms):
        span = [x for x in range(stage.width) if stage.getpixel((x, bottom))[3]]
        centres.append((min(span) + max(span)) // 2 if span else (box[0] + box[2] - 1) // 2)

    repeated: Counter[tuple[int, int]] = Counter()
    repeated_colors: dict[tuple[int, int], Counter] = {}
    for index, stage in enumerate(stages[1:], start=1):
        centre = centres[index]
        stage_bottom = bottoms[index]
        stage_top = max(0, stage_bottom - 12)
        for y in range(stage_top, min(stage.height, stage_bottom + 1)):
            for x in range(stage.width):
                pixel = stage.getpixel((x, y))
                if pixel[3]:
                    point = (x - centre, y - stage_bottom)
                    repeated[point] += 1
                    repeated_colors.setdefault(point, Counter())[pixel] += 1
    candidates = {point for point, count in repeated.items() if count >= 5}
    components = component_sets(candidates)
    ground_components = []
    for component in components:
        xs = [x for x, _ in component]
        ys = [y for _, y in component]
        if max(ys) >= -1 and max(xs) - min(xs) + 1 >= 8 and len(component) >= 18:
            ground_components.append(component)
    region = set().union(*ground_components) if ground_components else set()
    if not region:
        stage_reports = [{
            "stage": STATES[index],
            "opaqueBefore": opaque_count(stage),
            "removedPixels": 0,
            "opaqueAfter": opaque_count(stage),
            "removedRatio": 0.0,
            "over25Percent": False,
            "cleanupRolledBackToProtectPlant": False,
        } for index, stage in enumerate(stages)]
        return [stage.copy() for stage in stages], {
            "valid": True,
            "method": "no broad repeated bottom-connected ground region detected; plant pixels preserved",
            "bandTop": band_top,
            "baseline": baseline,
            "sourceCentres": centres,
            "maskPixelCount": 0,
            "removedPixels": 0,
            "stages": stage_reports,
            "over25PercentStages": [],
            "deadConnectedComponents": connected_shape_count(stages[-1]),
            "reason": None,
            "warnings": ["no removable repeated base region detected"],
        }

    cleaned = [stage.copy() for stage in stages]
    stage_reports = []
    total_removed = 0
    for index, stage in enumerate(cleaned):
        before = opaque_count(stage)
        removed = 0
        if index:
            centre = centres[index]
            pixels = stage.load()
            stage_bottom = bottoms[index]
            stage_top = max(0, stage_bottom - 12)
            # Preserve narrow plant paths entering the base band from above.
            # This is positional protection, not a colour whitelist.
            ingress = {
                x
                for x in range(stage.width)
                if any(
                    stage.getpixel((x, y))[3]
                    for y in range(max(0, stage_top - 3), stage_top + 1)
                )
            }
            protected = {
                (x, y)
                for x in range(stage.width)
                for y in range(stage_top, min(stage.height, stage_bottom + 1))
                if stage.getpixel((x, y))[3] and any(abs(x - root_x) <= 1 for root_x in ingress)
            }
            for dx, dy in region:
                x, y = centre + dx, stage_bottom + dy
                if not (0 <= x < stage.width and 0 <= y < stage.height):
                    continue
                if not pixels[x, y][3] or (x, y) in protected:
                    continue
                dominant, occurrences = repeated_colors[(dx, dy)].most_common(1)[0]
                if occurrences >= 5 and pixels[x, y] == dominant:
                    pixels[x, y] = (0, 0, 0, 0)
                    removed += 1
        rolled_back = False
        before_components = connected_shape_count(stages[index])
        after_components = connected_shape_count(stage)
        if after_components > before_components:
            cleaned[index] = stages[index].copy()
            stage = cleaned[index]
            removed = 0
            rolled_back = True
        after = opaque_count(stage)
        ratio = removed / max(1, before)
        stage_reports.append({
            "stage": STATES[index],
            "opaqueBefore": before,
            "removedPixels": removed,
            "opaqueAfter": after,
            "removedRatio": ratio,
            "over25Percent": ratio > 0.25,
            "cleanupRolledBackToProtectPlant": rolled_back,
        })
        total_removed += removed

    dead_components = connected_shape_count(cleaned[-1])
    return cleaned, {
        "valid": True,
        "method": "repeated opaque pixels within a broad bottom-connected spatial component, with plant-ingress protection",
        "bandTop": band_top,
        "baseline": baseline,
        "sourceCentres": centres,
        "maskPixelCount": len(region),
        "removedPixels": total_removed,
        "stages": stage_reports,
        "over25PercentStages": [row["stage"] for row in stage_reports if row["over25Percent"]],
        "deadConnectedComponents": dead_components,
        "reason": None,
        "warnings": [] if dead_components == 1 else [f"dead source remains {dead_components} proximity-connected components after ground removal"],
    }


def green_palette_lookup(stages: list[Image.Image]) -> dict[tuple[int, int, int, int], tuple[int, int, int, int]]:
    """Build one exact source-colour lookup for every living stage.

    Requiring green to be the dominant RGB channel protects yellow flowers,
    tan/dry foliage, soil, and brown stems even when their HSL hue touches the
    selector boundary. Alpha is copied verbatim.
    """
    lookup = {}
    colors = {
        pixel
        for state, stage in zip(STATES, stages)
        if state in PALETTE_STAGES
        for pixel in stage.get_flattened_data()
        if pixel[3]
    }
    for pixel in sorted(colors):
        r, g, b, alpha = pixel
        hue, lightness, saturation = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        hue_degrees = hue * 360
        if not (GREEN_HUE_MIN <= hue_degrees <= GREEN_HUE_MAX and g > r and g > b):
            continue
        mapped_hue = ((hue_degrees - HUE_SHIFT) % 360) / 360
        mapped_saturation = max(0.0, min(1.0, saturation * SATURATION_SCALE))
        mapped_lightness = lightness * LIGHTNESS_SCALE if lightness >= BRIGHT_GREEN_LIGHTNESS else lightness
        red, green, blue = colorsys.hls_to_rgb(mapped_hue, mapped_lightness, mapped_saturation)
        lookup[pixel] = (
            round(red * 255),
            round(green * 255),
            round(blue * 255),
            alpha,
        )
    return lookup


def remap_green_palette(stages: list[Image.Image]) -> tuple[list[Image.Image], dict]:
    lookup = green_palette_lookup(stages)
    remapped = []
    stage_reports = []
    for state, source in zip(STATES, stages):
        image = source.copy()
        before = list(source.get_flattened_data())
        if state in PALETTE_STAGES:
            image.putdata([lookup.get(pixel, pixel) for pixel in before])
        after = list(image.get_flattened_data())
        changed = sum(left != right for left, right in zip(before, after))
        if [pixel[3] for pixel in before] != [pixel[3] for pixel in after]:
            raise ValueError(f"palette remap changed alpha in {state}")
        stage_reports.append({"stage": state, "changedPixels": changed})
        remapped.append(image)

    ripe_greens = []
    for r, g, b, alpha in remapped[STATES.index("ripe")].get_flattened_data():
        if not alpha:
            continue
        hue, lightness, saturation = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        if GREEN_HUE_MIN <= hue * 360 <= GREEN_HUE_MAX and g > r and g > b:
            ripe_greens.append(lightness * 100)
    contrast = None
    if ripe_greens:
        contrast = {
            "greenLightnessMin": round(min(ripe_greens), 2),
            "greenLightnessMax": round(max(ripe_greens), 2),
            "greenLightnessSpan": round(max(ripe_greens) - min(ripe_greens), 2),
        }
    return remapped, {
        "method": "exact per-pixel RGBA lookup; no filtering, resampling, or palette-mode conversion",
        "selector": {
            "hueDegrees": [GREEN_HUE_MIN, GREEN_HUE_MAX],
            "greenChannelDominant": True,
            "stages": sorted(PALETTE_STAGES, key=STATES.index),
            "protectedStages": [state for state in STATES if state not in PALETTE_STAGES],
        },
        "constants": {
            "SATURATION_SCALE": SATURATION_SCALE,
            "HUE_SHIFT": HUE_SHIFT,
            "LIGHTNESS_SCALE": LIGHTNESS_SCALE,
        },
        "lookup": [
            {"from": list(source), "to": list(target)}
            for source, target in sorted(lookup.items())
        ],
        "changedPixels": sum(row["changedPixels"] for row in stage_reports),
        "stages": stage_reports,
        "ripeGreenContrast": contrast,
    }


def bottom_mass_center(image: Image.Image) -> float:
    """Return the weighted visual centre of the lowest opaque plant rows."""
    box = alpha_bbox(image)
    if box is None:
        raise ValueError("cannot anchor an empty frame")
    bottom = box[3] - 1
    top = max(box[1], bottom - 5)
    weighted_x = weight_sum = 0.0
    for y in range(top, bottom + 1):
        row_weight = y - top + 1
        for x in range(image.width):
            if image.getpixel((x, y))[3]:
                weighted_x += (x + 0.5) * row_weight
                weight_sum += row_weight
    return weighted_x / weight_sum


def packed_anchor(sheet: Image.Image, frame_width: int, frame_height: int) -> dict:
    frames = [
        sheet.crop((index * frame_width, 0, (index + 1) * frame_width, frame_height))
        for index in range(len(STATES))
    ]
    centres = [bottom_mass_center(frame) for frame in frames]
    living = centres[1:5]
    anchor_x = round(median(living) * 2) / 2
    return {
        "method": "median of weighted bottom-six-row visual centres for sprout, young, flowering, and ripe",
        "anchorX": anchor_x,
        "anchorY": frame_height,
        "perStageBaseCenters": {
            state: round(value, 3) for state, value in zip(STATES, centres)
        },
    }


def pack_frames(stages: list[Image.Image]) -> tuple[Image.Image, list[dict], tuple[int, int], dict]:
    boxes = [alpha_bbox(stage) for stage in stages]
    if any(box is None for box in boxes):
        raise ValueError("a stage is empty after cleaning")
    sprites = [stage.crop(box) for stage, box in zip(stages, boxes)]
    frame_width = max(sprite.width for sprite in sprites)
    frame_height = max(sprite.height for sprite in sprites)
    sheet = Image.new("RGBA", (frame_width * len(stages), frame_height))
    placements = []
    for index, sprite in enumerate(sprites):
        x = index * frame_width + (frame_width - sprite.width) // 2
        y = frame_height - sprite.height
        sheet.alpha_composite(sprite, (x, y))
        placements.append({
            "trimmedWidth": sprite.width,
            "trimmedHeight": sprite.height,
            "uniqueOpaqueColors": len({pixel for pixel in sprite.get_flattened_data() if pixel[3]}),
            "frameX": index * frame_width,
            "pasteX": x - index * frame_width,
            "pasteY": y,
            "anchorX": frame_width / 2,
            "anchorY": frame_height,
        })
    anchor = packed_anchor(sheet, frame_width, frame_height)
    for placement in placements:
        placement["anchorX"] = anchor["anchorX"]
        placement["anchorY"] = anchor["anchorY"]
    return sheet, placements, (frame_width, frame_height), anchor


def import_sheet(args: argparse.Namespace) -> dict:
    keys = [key.strip() for key in args.keys.split(",") if key.strip()]
    if len(keys) != args.frame_count:
        raise ValueError(f"expected {args.frame_count} keys, got {len(keys)}")
    if args.frame_count != len(STATES):
        raise ValueError(f"runtime crop import requires {len(STATES)} stages")

    original = Image.open(args.input)
    original_alpha = sorted(set(original.convert("RGBA").getchannel("A").get_flattened_data()))
    source = original.convert("RGBA")
    colors = Counter(source.get_flattened_data())
    background = colors.most_common(1)[0][0]
    transparent, removed_magenta, remaining_magenta = clean_magenta(source)
    runs = occupied_alpha_columns(transparent)
    if len(runs) != args.frame_count:
        raise ValueError(f"expected {args.frame_count} separated stages, found {len(runs)}")

    raw_bounds = source_bounds(transparent, runs)
    grid = two_by_two_score(source, background)
    grid_valid = original_alpha in ([255], [0, 255]) and len(colors) <= 64 and background[3] == 255
    if not grid_valid:
        raise ValueError(
            f"sheet is not a clean hard-pixel grid: colors={len(colors)}, alpha={original_alpha}, background={background}"
        )

    stages, soil = remove_soil_mounds(stage_images(transparent, runs))
    if not soil.get("valid"):
        raise ValueError(soil.get("reason", "ground cleanup validation failed"))
    pre_palette_candidate, pre_placements, pre_frame_size, pre_anchor = pack_frames(stages)
    remapped_stages, palette_remap = remap_green_palette(stages)
    candidate, placements, frame_size, anchor = pack_frames(remapped_stages)
    if frame_size != pre_frame_size:
        raise ValueError("palette remap changed frame geometry")
    if pre_palette_candidate.getchannel("A").tobytes() != candidate.getchannel("A").tobytes():
        raise ValueError("palette remap changed packed-frame alpha or geometry")
    if anchor != pre_anchor:
        raise ValueError("palette remap changed the shared crop anchor")
    alpha_values = sorted(set(candidate.getchannel("A").get_flattened_data()))
    if alpha_values != [0, 255]:
        raise ValueError(f"output alpha is not binary: {alpha_values}")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    cleaned_source_path = args.output_dir / "cleaned-source.png"
    pre_palette_path = args.output_dir / "candidate-b-pre-palette.png"
    candidate_path = args.output_dir / "candidate-b.png"
    evidence_path = args.output_dir / "source.png"
    evidence_path.write_bytes(args.input.read_bytes())
    cleaned_source = Image.new("RGBA", source.size)
    for stage, (x0, _) in zip(remapped_stages, runs):
        cleaned_source.alpha_composite(stage, (x0, 0))
    cleaned_source.save(cleaned_source_path)
    pre_palette_candidate.save(pre_palette_path)
    candidate.save(candidate_path)

    candidate_colors = set(candidate.get_flattened_data())
    manifest = {
        "crop": args.crop,
        "source": str(args.input),
        "sourceSha256": sha256(args.input),
        "sourceSize": list(source.size),
        "sourceUniqueColors": len(colors),
        "sourceAlphaValues": original_alpha,
        "background": list(background),
        "sourceStageBounds": [{"key": key, **bounds} for key, bounds in zip(keys, raw_bounds)],
        "grid": {
            "nativePixelGrid": True,
            "cleanPixelGrid": grid_valid,
            "requestedScale": args.grid_scale,
            "best2x2Offset": grid["offset"],
            "homogeneousTouchedBlocks": grid["homogeneous"],
            "touchedBlocks": grid["touched"],
            "homogeneousRatio": grid["ratio"],
            "interpretation": "native 1px hard-edged art; no reduction or resampling performed",
        },
        "cleanup": {
            "method": "boundary-connected magenta plus repeated bottom-connected ground region",
            "removedMagentaColors": removed_magenta,
            "remainingInteriorMagentaPixels": remaining_magenta,
            "soil": soil,
            "alphaValues": alpha_values,
            "colorsRepainted": len(palette_remap["lookup"]),
            "pixelsResampled": 0,
            "paletteConversions": 0,
        },
        "paletteRemap": palette_remap,
        "candidateB": {
            "available": True,
            "frameSize": list(frame_size),
            "path": str(candidate_path),
            "sha256": sha256(candidate_path),
            "uniqueColors": len(candidate_colors),
            "uniqueOpaqueColors": len({pixel for pixel in candidate_colors if pixel[3]}),
            "placements": placements,
            "maxTrimmedStage": list(frame_size),
            "anchor": anchor,
            "prePalettePath": str(pre_palette_path),
            "prePaletteSha256": sha256(pre_palette_path),
        },
        "cleanedSource": {"path": str(cleaned_source_path), "sha256": sha256(cleaned_source_path)},
        "evidenceSource": {"path": str(evidence_path), "sha256": sha256(evidence_path)},
        "keys": keys,
    }
    manifest_path = args.output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps(manifest, indent=2))
    return manifest


def atlas_record(frame: dict) -> dict:
    width, height = frame["w"], frame["h"]
    return {
        "frame": frame,
        "rotated": False,
        "trimmed": False,
        "spriteSourceSize": {"x": 0, "y": 0, "w": width, "h": height},
        "sourceSize": {"w": width, "h": height},
    }


def candidate_frames(record_dir: Path) -> dict[str, Image.Image]:
    """Load one verified candidate strip for source-pipeline regeneration."""
    manifest = json.loads((record_dir / "manifest.json").read_text())
    frame_width, frame_height = manifest["candidateB"]["frameSize"]
    sheet = Image.open(manifest["candidateB"]["path"]).convert("RGBA")
    if sheet.size != (frame_width * len(STATES), frame_height):
        raise ValueError(f"unexpected candidate size for {manifest['crop']}: {sheet.size}")
    if sorted(set(sheet.getchannel("A").get_flattened_data())) != [0, 255]:
        raise ValueError(f"non-binary alpha in {manifest['crop']}")
    return {
        state: sheet.crop((index * frame_width, 0, (index + 1) * frame_width, frame_height))
        for index, state in enumerate(STATES)
    }


def recolor_record(record_dir: Path, candidate_output: Path | None = None) -> dict:
    """Regenerate a colour-matched candidate from immutable cleaned pixels."""
    manifest_path = record_dir / "manifest.json"
    manifest = json.loads(manifest_path.read_text())
    frame_width, frame_height = manifest["candidateB"]["frameSize"]
    pre_palette_path = Path(manifest["candidateB"].get("prePalettePath", record_dir / "candidate-b-pre-palette.png"))
    if not pre_palette_path.exists():
        raise ValueError(f"missing immutable pre-palette candidate: {pre_palette_path}")
    source = Image.open(pre_palette_path).convert("RGBA")
    expected_size = (frame_width * len(STATES), frame_height)
    if source.size != expected_size:
        raise ValueError(f"unexpected pre-palette candidate size for {manifest['crop']}: {source.size}")
    stages = [
        source.crop((index * frame_width, 0, (index + 1) * frame_width, frame_height))
        for index in range(len(STATES))
    ]
    remapped, palette_remap = remap_green_palette(stages)
    candidate = Image.new("RGBA", source.size)
    for index, stage in enumerate(remapped):
        candidate.alpha_composite(stage, (index * frame_width, 0))
    if source.getchannel("A").tobytes() != candidate.getchannel("A").tobytes():
        raise ValueError("palette-only regeneration changed alpha or geometry")
    anchor = packed_anchor(candidate, frame_width, frame_height)
    placements = []
    for index, stage in enumerate(remapped):
        box = alpha_bbox(stage)
        if box is None:
            raise ValueError(f"empty {STATES[index]} frame")
        cropped = stage.crop(box)
        placements.append({
            "trimmedWidth": cropped.width,
            "trimmedHeight": cropped.height,
            "uniqueOpaqueColors": len({pixel for pixel in cropped.get_flattened_data() if pixel[3]}),
            "frameX": index * frame_width,
            "pasteX": box[0],
            "pasteY": box[1],
            "anchorX": anchor["anchorX"],
            "anchorY": anchor["anchorY"],
        })
    output = candidate_output or Path(manifest["candidateB"]["path"])
    candidate.save(output)
    colors = set(candidate.get_flattened_data())
    manifest["cleanup"]["alphaValues"] = sorted(set(candidate.getchannel("A").get_flattened_data()))
    manifest["cleanup"]["colorsRepainted"] = len(palette_remap["lookup"])
    manifest["cleanup"]["pixelsResampled"] = 0
    manifest["cleanup"]["paletteConversions"] = 0
    manifest["paletteRemap"] = palette_remap
    manifest["candidateB"].update({
        "path": str(output),
        "sha256": sha256(output),
        "uniqueColors": len(colors),
        "uniqueOpaqueColors": len({pixel for pixel in colors if pixel[3]}),
        "placements": placements,
        "anchor": anchor,
        "prePalettePath": str(pre_palette_path),
        "prePaletteSha256": sha256(pre_palette_path),
    })
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({
        "crop": manifest["crop"],
        "candidate": str(output),
        "frameSize": [frame_width, frame_height],
        "anchor": anchor,
        "paletteRemap": palette_remap,
    }, indent=2))
    return manifest


def install_atlas(args: argparse.Namespace) -> None:
    if not args.record_dir:
        raise ValueError("--record-dir is required for --install-atlas")
    atlas_path = args.atlas_png
    metadata_path = args.atlas_json
    old_atlas = Image.open(atlas_path).convert("RGBA")
    metadata = json.loads(metadata_path.read_text())
    records = []
    for directory in args.record_dir:
        manifest = json.loads((directory / "manifest.json").read_text())
        sheet = Image.open(manifest["candidateB"]["path"]).convert("RGBA")
        frame_width, frame_height = manifest["candidateB"]["frameSize"]
        if sheet.size != (frame_width * len(STATES), frame_height):
            raise ValueError(f"unexpected candidate size for {manifest['crop']}: {sheet.size}")
        if sorted(set(sheet.getchannel("A").get_flattened_data())) != [0, 255]:
            raise ValueError(f"non-binary alpha in {manifest['crop']}")
        records.append((directory, manifest, sheet, frame_width, frame_height))

    gap = 2
    reusable = all(
        all(
            metadata["frames"].get(key, {}).get("frame", {}).get("w") == frame_width
            and metadata["frames"].get(key, {}).get("frame", {}).get("h") == frame_height
            for key in manifest["keys"]
        )
        for _, manifest, _, frame_width, frame_height in records
    )
    extra_height = 0 if reusable else sum(frame_height + gap for _, _, _, _, frame_height in records) + gap
    atlas = Image.new("RGBA", (old_atlas.width, old_atlas.height + extra_height))
    atlas.paste(old_atlas, (0, 0))
    y = old_atlas.height + gap
    installed = []
    for directory, manifest, sheet, frame_width, frame_height in records:
        row_width = len(STATES) * (frame_width + gap) - gap
        if row_width > atlas.width:
            raise ValueError(f"{manifest['crop']} row width {row_width} exceeds atlas width {atlas.width}")
        if reusable:
            y = metadata["frames"][manifest["keys"][0]]["frame"]["y"]
        for index, key in enumerate(manifest["keys"]):
            old = metadata["frames"].get(key, {}).get("frame")
            if old:
                atlas.paste((0, 0, 0, 0), (old["x"], old["y"], old["x"] + old["w"], old["y"] + old["h"]))
            image = sheet.crop((index * frame_width, 0, (index + 1) * frame_width, frame_height))
            x = index * (frame_width + gap)
            atlas.paste(image, (x, y))
            metadata["frames"][key] = atlas_record({"x": x, "y": y, "w": frame_width, "h": frame_height})
        manifest["runtimeAtlas"] = {
            "image": str(atlas_path),
            "metadata": str(metadata_path),
            "rowY": y,
            "frameSize": [frame_width, frame_height],
            "installedKeys": manifest["keys"],
        }
        (directory / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
        installed.append({"crop": manifest["crop"], "frameSize": [frame_width, frame_height], "rowY": y})
        if not reusable:
            y += frame_height + gap
    if not reusable:
        atlas = atlas.crop((0, 0, old_atlas.width, y))
    atlas.save(atlas_path)
    metadata["meta"]["size"] = {"w": atlas.width, "h": atlas.height}
    metadata_path.write_text(json.dumps(metadata, indent=2) + "\n")
    print(json.dumps({
        "atlas": str(atlas_path),
        "oldSize": list(old_atlas.size),
        "newSize": list(atlas.size),
        "installed": installed,
        "nonTargetFrameCoordinatesPreserved": True,
    }, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path)
    parser.add_argument("--crop")
    parser.add_argument("--frame-count", type=int, default=len(STATES))
    parser.add_argument("--frame-size", type=parse_size, help="Legacy expected size; retained for command compatibility")
    parser.add_argument("--keys", help="Comma-separated runtime keys in source order")
    parser.add_argument("--output-dir", type=Path)
    parser.add_argument("--grid-scale", type=int, default=1)
    parser.add_argument("--install-atlas", action="store_true")
    parser.add_argument("--recolor-record", type=Path)
    parser.add_argument("--candidate-output", type=Path)
    parser.add_argument("--record-dir", action="append", type=Path)
    parser.add_argument("--atlas-png", type=Path, default=Path("public/assets/pixel/processed/town.png"))
    parser.add_argument("--atlas-json", type=Path, default=Path("public/assets/pixel/processed/town.json"))
    args = parser.parse_args()
    if args.install_atlas:
        install_atlas(args)
        return
    if args.recolor_record:
        recolor_record(args.recolor_record, args.candidate_output)
        return
    missing = [name for name in ("input", "crop", "keys", "output_dir") if getattr(args, name) is None]
    if missing:
        parser.error("missing required import arguments: " + ", ".join("--" + name.replace("_", "-") for name in missing))
    import_sheet(args)


if __name__ == "__main__":
    main()
