"""Verify, clean and stage a horizontal pixel-art crop sheet for review.

This tool never writes the runtime atlas. It keeps source colors byte-exact,
removes only keyed magenta/base pixels, and uses nearest-neighbour resizing.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path
from statistics import median

from PIL import Image


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


def source_bounds(image: Image.Image, runs: list[tuple[int, int]], background: tuple[int, int, int, int]) -> list[dict]:
    pixels = image.load()
    result = []
    for x0, x1 in runs:
        points = [(x, y) for y in range(image.height) for x in range(x0, x1 + 1) if pixels[x, y] != background]
        min_x = min(x for x, _ in points)
        max_x = max(x for x, _ in points)
        min_y = min(y for _, y in points)
        max_y = max(y for _, y in points)
        result.append({"x": min_x, "y": min_y, "width": max_x - min_x + 1, "height": max_y - min_y + 1})
    return result


def clean_magenta(image: Image.Image) -> tuple[Image.Image, list[list[int]]]:
    cleaned = image.copy()
    pixels = cleaned.load()
    removed = Counter()
    for y in range(cleaned.height):
        for x in range(cleaned.width):
            pixel = pixels[x, y]
            if is_magenta(pixel):
                removed[pixel] += 1
                pixels[x, y] = (0, 0, 0, 0)
    return cleaned, [list(color) + [count] for color, count in sorted(removed.items())]


def stage_images(image: Image.Image, runs: list[tuple[int, int]]) -> list[Image.Image]:
    return [image.crop((x0, 0, x1 + 1, image.height)) for x0, x1 in runs]


def opaque_span(image: Image.Image, y: int) -> tuple[int, int] | None:
    alpha = image.getchannel("A")
    xs = [x for x in range(image.width) if alpha.getpixel((x, y))]
    return (min(xs), max(xs)) if xs else None


def remove_soil_mounds(stages: list[Image.Image]) -> tuple[list[Image.Image], dict]:
    if len(stages) < 3:
        return stages, {"removedPixels": 0, "reason": "fewer than three stages"}

    reference_indices = list(range(1, len(stages) - 1))
    reference_bottoms = []
    reference_centres = {}
    for index in reference_indices:
        bbox = alpha_bbox(stages[index])
        if not bbox:
            continue
        bottom = bbox[3] - 1
        reference_bottoms.append(bottom)
        span = opaque_span(stages[index], bottom)
        reference_centres[index] = (span[0] + span[1]) // 2 if span else (bbox[0] + bbox[2] - 1) // 2
    mound_bottom = round(median(reference_bottoms))
    mound_top = mound_bottom - 8

    # Union of the repeated nine-row mound footprints. This deletes base art
    # without recoloring any plant pixel and works even when a stem overlaps it.
    mound_offsets: set[tuple[int, int]] = set()
    for index in reference_indices:
        stage = stages[index]
        centre = reference_centres[index]
        alpha = stage.getchannel("A")
        for y in range(mound_top, min(mound_bottom + 1, stage.height)):
            for x in range(stage.width):
                if alpha.getpixel((x, y)):
                    mound_offsets.add((x - centre, y - mound_top))

    cleaned = [stage.copy() for stage in stages]
    removed = 0
    centres = []
    for index, stage in enumerate(cleaned):
        bbox = alpha_bbox(stage)
        if not bbox:
            centres.append(stage.width // 2)
            continue
        if index in reference_centres:
            centre = reference_centres[index]
        else:
            centre = (bbox[0] + bbox[2] - 1) // 2
        centres.append(centre)
        if index == 0:
            continue
        pixels = stage.load()
        for dx, dy in mound_offsets:
            x, y = centre + dx, mound_top + dy
            if 0 <= x < stage.width and 0 <= y < stage.height and pixels[x, y][3]:
                pixels[x, y] = (0, 0, 0, 0)
                removed += 1

    return cleaned, {
        "removedPixels": removed,
        "moundTop": mound_top,
        "moundBottom": mound_bottom,
        "sourceCentres": centres,
        "maskPixelCount": len(mound_offsets),
    }


def remove_isolated_pixels(stages: list[Image.Image]) -> tuple[list[Image.Image], int]:
    cleaned = [stage.copy() for stage in stages]
    removed = 0
    for stage in cleaned:
        alpha = stage.getchannel("A")
        pixels = stage.load()
        isolated = []
        for y in range(stage.height):
            for x in range(stage.width):
                if not alpha.getpixel((x, y)):
                    continue
                neighbours = (
                    (nx, ny)
                    for ny in range(max(0, y - 1), min(stage.height, y + 2))
                    for nx in range(max(0, x - 1), min(stage.width, x + 2))
                    if (nx, ny) != (x, y)
                )
                if not any(alpha.getpixel(point) for point in neighbours):
                    isolated.append((x, y))
        for point in isolated:
            pixels[point] = (0, 0, 0, 0)
        removed += len(isolated)
    return cleaned, removed


def pack_frames(stages: list[Image.Image], frame_size: tuple[int, int]) -> tuple[Image.Image, list[dict]]:
    frame_width, frame_height = frame_size
    sheet = Image.new("RGBA", (frame_width * len(stages), frame_height))
    placements = []
    for index, stage in enumerate(stages):
        bbox = alpha_bbox(stage)
        if not bbox:
            raise ValueError(f"stage {index + 1} is empty after cleaning")
        sprite = stage.crop(bbox)
        if sprite.width > frame_width or sprite.height > frame_height:
            raise ValueError(
                f"stage {index + 1} ({sprite.width}x{sprite.height}) does not fit {frame_width}x{frame_height}"
            )
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
            "anchorX": frame_width // 2,
            "anchorY": frame_height - 1,
        })
    return sheet, placements


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--crop", required=True)
    parser.add_argument("--frame-count", required=True, type=int)
    parser.add_argument("--frame-size", required=True, type=parse_size, help="Candidate A frame, e.g. 24x48")
    parser.add_argument("--keys", required=True, help="Comma-separated runtime keys in source order")
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--grid-scale", type=int, default=2)
    args = parser.parse_args()

    keys = [key.strip() for key in args.keys.split(",") if key.strip()]
    if len(keys) != args.frame_count:
        raise ValueError(f"expected {args.frame_count} keys, got {len(keys)}")

    source = Image.open(args.input).convert("RGBA")
    colors = Counter(source.get_flattened_data())
    background = colors.most_common(1)[0][0]
    runs = occupied_columns(source, background)
    if len(runs) != args.frame_count:
        raise ValueError(f"expected {args.frame_count} separated stages, found {len(runs)}")

    raw_bounds = source_bounds(source, runs, background)
    grid = two_by_two_score(source, background)
    candidate_a_eligible = args.grid_scale == 2 and grid["ratio"] >= 0.98

    transparent, removed_magenta = clean_magenta(source)
    stages, soil = remove_soil_mounds(stage_images(transparent, runs))
    stages, isolated_removed = remove_isolated_pixels(stages)
    max_width = max(alpha_bbox(stage)[2] - alpha_bbox(stage)[0] for stage in stages)
    max_height = max(alpha_bbox(stage)[3] - alpha_bbox(stage)[1] for stage in stages)
    candidate_b_size = (
        max(args.frame_size[0] * args.grid_scale, max_width),
        max_height,
    )
    candidate_b, placements_b = pack_frames(stages, candidate_b_size)

    args.output_dir.mkdir(parents=True, exist_ok=True)
    cleaned_source_path = args.output_dir / "cleaned-source.png"
    candidate_b_path = args.output_dir / "candidate-b.png"
    cleaned_source = Image.new("RGBA", source.size)
    for stage, (x0, _) in zip(stages, runs):
        cleaned_source.alpha_composite(stage, (x0, 0))
    cleaned_source.save(cleaned_source_path)
    candidate_b.save(candidate_b_path)

    candidate_a_path = None
    placements_a = None
    if candidate_a_eligible:
        candidate_a_path = args.output_dir / "candidate-a.png"
        candidate_a = candidate_b.resize(
            (args.frame_size[0] * args.frame_count, args.frame_size[1]), Image.Resampling.NEAREST
        )
        candidate_a.save(candidate_a_path)
        placements_a = [{
            "frameX": index * args.frame_size[0],
            "anchorX": args.frame_size[0] // 2,
            "anchorY": args.frame_size[1] - 1,
        } for index in range(args.frame_count)]

    alpha_values = sorted(set(candidate_b.getchannel("A").get_flattened_data()))
    candidate_b_colors = set(candidate_b.get_flattened_data())
    manifest = {
        "crop": args.crop,
        "source": str(args.input),
        "sourceSha256": sha256(args.input),
        "sourceSize": list(source.size),
        "sourceUniqueColors": len(colors),
        "sourceAlphaValues": sorted(set(pixel[3] for pixel in colors)),
        "background": list(background),
        "sourceStageBounds": [{"key": key, **bounds} for key, bounds in zip(keys, raw_bounds)],
        "grid": {
            "nativePixelGrid": True,
            "requestedScale": args.grid_scale,
            "best2x2Offset": grid["offset"],
            "homogeneousTouchedBlocks": grid["homogeneous"],
            "touchedBlocks": grid["touched"],
            "homogeneousRatio": grid["ratio"],
        },
        "cleanup": {
            "removedMagentaColors": removed_magenta,
            "soil": soil,
            "isolatedNonMagentaPixelsRemoved": isolated_removed,
            "alphaValues": alpha_values,
            "colorsRepainted": 0,
        },
        "candidateA": {
            "available": candidate_a_eligible,
            "frameSize": list(args.frame_size),
            "path": str(candidate_a_path) if candidate_a_path else None,
            "placements": placements_a,
            "reason": None if candidate_a_eligible else (
                "Source is native 1px art, not a uniform 2x enlargement: "
                f"only {grid['homogeneous']}/{grid['touched']} non-background 2x2 blocks are homogeneous."
            ),
        },
        "candidateB": {
            "available": True,
            "frameSize": list(candidate_b_size),
            "path": str(candidate_b_path),
            "sha256": sha256(candidate_b_path),
            "uniqueColors": len(candidate_b_colors),
            "uniqueOpaqueColors": len({pixel for pixel in candidate_b_colors if pixel[3]}),
            "placements": placements_b,
            "maxTrimmedStage": [max_width, max_height],
        },
        "cleanedSource": {
            "path": str(cleaned_source_path),
            "sha256": sha256(cleaned_source_path),
        },
        "keys": keys,
    }
    manifest_path = args.output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
