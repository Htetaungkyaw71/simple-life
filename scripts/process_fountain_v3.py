#!/usr/bin/env python3
"""Convert the fountain-v3 draft into native art and a six-frame water loop."""

from __future__ import annotations

import argparse
import json
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


FRAME_SIZE = (192, 160)
CONTENT_LIMIT = (174, 146)
FRAME_COUNT = 6
FRAME_MS = 125
GIF_DURATIONS = (120, 130, 120, 130, 120, 130)  # GIF uses 10 ms ticks; average is exactly 8 fps.


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("screenshot", type=Path)
    parser.add_argument("palette", type=Path)
    parser.add_argument("output", type=Path)
    return parser.parse_args()


def rgb(value: str) -> tuple[int, int, int]:
    value = value.removeprefix("#")
    return tuple(int(value[index : index + 2], 16) for index in (0, 2, 4))


def components(mask: np.ndarray) -> list[np.ndarray]:
    remaining = mask.copy()
    result: list[np.ndarray] = []
    height, width = mask.shape
    while remaining.any():
        seed_y, seed_x = np.argwhere(remaining)[0]
        queue = deque(((int(seed_x), int(seed_y)),))
        remaining[seed_y, seed_x] = False
        points: list[tuple[int, int]] = []
        while queue:
            x, y = queue.popleft()
            points.append((x, y))
            for next_y in range(max(0, y - 1), min(height, y + 2)):
                for next_x in range(max(0, x - 1), min(width, x + 2)):
                    if remaining[next_y, next_x]:
                        remaining[next_y, next_x] = False
                        queue.append((next_x, next_y))
        component = np.zeros_like(mask)
        xs, ys = zip(*points, strict=True)
        component[np.asarray(ys), np.asarray(xs)] = True
        result.append(component)
    return result


def largest_component(mask: np.ndarray) -> np.ndarray:
    groups = components(mask)
    return max(groups, key=lambda item: int(item.sum())) if groups else np.zeros_like(mask)


def dilate(mask: np.ndarray, amount: int = 1) -> np.ndarray:
    result = mask.copy()
    for _ in range(amount):
        padded = np.pad(result, 1, constant_values=False)
        expanded = np.zeros_like(result)
        for dy in range(3):
            for dx in range(3):
                expanded |= padded[dy : dy + result.shape[0], dx : dx + result.shape[1]]
        result = expanded
    return result


def color_mask(array: np.ndarray, color: tuple[int, int, int]) -> np.ndarray:
    return np.all(array[..., :3] == np.asarray(color, dtype=np.uint8), axis=2)


def quantize(array: np.ndarray, palette: np.ndarray, mask: np.ndarray) -> np.ndarray:
    result = array.copy()
    pixels = array[mask, :3].astype(np.int16)
    targets = palette.astype(np.int16)
    delta = pixels[:, None, :] - targets[None, :, :]
    weights = np.asarray((0.30, 0.58, 0.12), dtype=np.float32)
    distance = np.sum(delta.astype(np.float32) ** 2 * weights, axis=2)
    result[mask, :3] = targets[np.argmin(distance, axis=1)].astype(np.uint8)
    return result


def native_sprite(source: Image.Image, palette: np.ndarray) -> np.ndarray:
    source_array = np.asarray(source.convert("RGBA"), dtype=np.uint8)
    red, green, blue = (source_array[..., index] for index in range(3))
    magenta = (red > 180) & (blue > 160) & (green < 105) & ((red.astype(int) - green) > 80) & ((blue.astype(int) - green) > 70)
    foreground = largest_component(~magenta)
    ys, xs = np.where(foreground)
    if not len(xs):
        raise ValueError("generated source has no foreground separated from magenta")
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    crop = source.crop(box).convert("RGBA")
    crop_mask = Image.fromarray((foreground[box[1] : box[3], box[0] : box[2]] * 255).astype(np.uint8), "L")
    scale = min(CONTENT_LIMIT[0] / crop.width, CONTENT_LIMIT[1] / crop.height)
    size = (max(1, int(round(crop.width * scale))), max(1, int(round(crop.height * scale))))
    crop = crop.resize(size, Image.Resampling.NEAREST)
    crop_mask = crop_mask.resize(size, Image.Resampling.NEAREST)
    crop_array = np.asarray(crop, dtype=np.uint8).copy()
    hard_mask = np.asarray(crop_mask, dtype=np.uint8) >= 128
    crop_array[..., 3] = np.where(hard_mask, 255, 0).astype(np.uint8)
    crop_array = quantize(crop_array, palette, hard_mask)

    result = np.zeros((FRAME_SIZE[1], FRAME_SIZE[0], 4), dtype=np.uint8)
    x = (FRAME_SIZE[0] - size[0]) // 2
    y = (FRAME_SIZE[1] - size[1]) // 2
    target = result[y : y + size[1], x : x + size[0]]
    target[hard_mask] = crop_array[hard_mask]
    return result


def match_lawn_value(frame: np.ndarray, lawn_colors: list[tuple[int, int, int]]) -> np.ndarray:
    """Darken only the broad generated lawn fill to the sampled game mid-olive."""
    result = frame.copy()
    light_fill = color_mask(frame, lawn_colors[2]) & (frame[..., 3] == 255)
    lawn = largest_component(light_fill)
    if int(lawn.sum()) < 1_000:
        raise ValueError(f"generated lawn component unexpectedly small: {int(lawn.sum())}")
    result[lawn, :3] = np.asarray(lawn_colors[1], dtype=np.uint8)
    return result


def build_water_mask(frame: np.ndarray, water_colors: list[tuple[int, int, int]]) -> tuple[np.ndarray, dict[str, object]]:
    height, width = frame.shape[:2]
    center_region = np.zeros((height, width), dtype=bool)
    center_region[int(height * 0.20) : int(height * 0.79), int(width * 0.21) : int(width * 0.79)] = True
    candidate = np.zeros((height, width), dtype=bool)
    for color in water_colors:
        candidate |= color_mask(frame, color)
    candidate &= center_region & (frame[..., 3] == 255)
    base = color_mask(frame, water_colors[0]) & candidate
    surface = largest_component(base)
    if int(surface.sum()) < 300:
        raise ValueError(f"water base component too small: {int(surface.sum())}")
    expanded = dilate(surface, 3)
    water = largest_component(candidate & expanded)
    # Grow through touching water-colored stream and bowl pixels without admitting distant palette reuse.
    for _ in range(18):
        grown = dilate(water, 1) & candidate
        if np.array_equal(grown, water):
            break
        water = grown
    ys, xs = np.where(surface)
    bounds = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    return water, {"surface": surface, "bounds": bounds, "candidate": candidate}


def ellipse_ring(shape: tuple[int, int], center: tuple[int, int], radius: int) -> np.ndarray:
    height, width = shape
    cx, cy = center
    yy, xx = np.ogrid[:height, :width]
    distance = np.sqrt((xx - cx) ** 2 + ((yy - cy) * 1.65) ** 2)
    return np.abs(distance - radius) <= 0.58


def animate(frame: np.ndarray, water: np.ndarray, info: dict[str, object], water_colors: list[tuple[int, int, int]]) -> list[np.ndarray]:
    base_color = np.asarray(water_colors[0], dtype=np.uint8)
    mid_color = np.asarray(water_colors[1], dtype=np.uint8)
    light_color = np.asarray(water_colors[2], dtype=np.uint8)
    x0, y0, x1, y1 = info["bounds"]
    basin_width, basin_height = x1 - x0, y1 - y0
    centers = (
        (int(round(x0 + basin_width * 0.34)), int(round(y0 + basin_height * 0.66))),
        (int(round(x0 + basin_width * 0.69)), int(round(y0 + basin_height * 0.66))),
    )
    ring_zone = np.zeros_like(water)
    for center in centers:
        yy, xx = np.ogrid[: water.shape[0], : water.shape[1]]
        ring_zone |= ((xx - center[0]) ** 2 <= 9 ** 2) & ((yy - center[1]) ** 2 <= 6 ** 2)
    ring_zone &= water

    # Thin vertical stream strips are derived from their landing centers and clipped to the reviewed water mask.
    stream_masks: list[np.ndarray] = []
    for cx, cy in centers:
        strip = np.zeros_like(water)
        strip[max(0, y0 - 4) : cy + 1, max(0, cx - 1) : min(water.shape[1], cx + 2)] = True
        strip &= water
        stream_masks.append(strip)

    forbidden = ring_zone.copy()
    for stream in stream_masks:
        forbidden |= stream
    shimmer_candidates = np.argwhere(info["surface"] & ~forbidden)
    if len(shimmer_candidates) < 30:
        raise ValueError("not enough open water pixels for shimmer")
    shimmer_points = shimmer_candidates[np.linspace(0, len(shimmer_candidates) - 1, 30, dtype=int)]
    bowl_candidates = np.argwhere(water & (np.indices(water.shape)[0] < y0 + max(4, basin_height // 4)))
    bowl_points = bowl_candidates[np.linspace(0, len(bowl_candidates) - 1, min(18, len(bowl_candidates)), dtype=int)] if len(bowl_candidates) else np.empty((0, 2), dtype=int)

    phases = (light_color, mid_color, mid_color, base_color, base_color, base_color)
    frames: list[np.ndarray] = []
    for frame_index in range(FRAME_COUNT):
        current = frame.copy()
        current[ring_zone, :3] = base_color
        for ring_index, center in enumerate(centers):
            phase = (frame_index + ring_index * 3) % FRAME_COUNT
            ring = ellipse_ring(water.shape, center, 2 + phase) & water
            current[ring, :3] = phases[phase]

        for stream in stream_masks:
            for x in np.unique(np.where(stream)[1]):
                ys = np.where(stream[:, x])[0]
                if len(ys) < 2:
                    continue
                original = frame[ys, x, :3]
                current[ys, x, :3] = np.roll(original, frame_index, axis=0)

        points = shimmer_points[frame_index * 5 : frame_index * 5 + 5]
        current[points[:, 0], points[:, 1], :3] = mid_color
        if len(bowl_points):
            start = (frame_index * 3) % len(bowl_points)
            bowl = bowl_points[np.asarray([(start + offset) % len(bowl_points) for offset in range(3)])]
            current[bowl[:, 0], bowl[:, 1], :3] = mid_color
        if not np.array_equal(current[~water], frame[~water]):
            raise AssertionError("animation changed a pixel outside the water mask")
        frames.append(current)
    return frames


def make_fit_background(screenshot: Image.Image) -> Image.Image:
    native = screenshot.resize((screenshot.width // 2, screenshot.height // 2), Image.Resampling.NEAREST)
    return native.crop((190, 35, 590, 335)).convert("RGBA")


def composite_fit(background: Image.Image, frame: np.ndarray) -> Image.Image:
    canvas = background.copy()
    canvas.alpha_composite(Image.fromarray(frame, "RGBA"), (198, 68))
    return canvas.resize((canvas.width * 2, canvas.height * 2), Image.Resampling.NEAREST)


def main() -> None:
    args = parse_args()
    palette_record = json.loads(args.palette.read_text())
    palette = np.asarray([rgb(value) for value in palette_record["palette"]], dtype=np.uint8)
    water_colors = [rgb(value) for value in palette_record["categories"]["water"]]
    lawn_colors = [rgb(value) for value in palette_record["categories"]["lawn"]]
    source = Image.open(args.source).convert("RGBA")
    screenshot = Image.open(args.screenshot).convert("RGBA")
    args.output.mkdir(parents=True, exist_ok=True)

    # The built-in generator may return its native square size; normalize the
    # selected pass to the requested 1024 source canvas with NEAREST only.
    if source.size != (1024, 1024):
        source = source.resize((1024, 1024), Image.Resampling.NEAREST)
    source.save(args.output / "generated_source_1024.png", optimize=False)

    static = match_lawn_value(native_sprite(source, palette), lawn_colors)
    if set(np.unique(static[..., 3])) - {0, 255}:
        raise AssertionError("native sprite has anti-aliased alpha")
    used = {tuple(map(int, color)) for color in np.unique(static[static[..., 3] == 255, :3], axis=0)}
    if not used.issubset({tuple(map(int, color)) for color in palette}):
        raise AssertionError("native sprite contains colors outside the locked palette")

    one_x = Image.fromarray(static, "RGBA")
    one_x.save(args.output / "fountain_island_v3_1x.png", optimize=False)
    one_x.resize((FRAME_SIZE[0] * 4, FRAME_SIZE[1] * 4), Image.Resampling.NEAREST).save(args.output / "fountain_island_v3_4x.png", optimize=False)
    fit_background = make_fit_background(screenshot)
    composite_fit(fit_background, static).save(args.output / "fit_check.png", optimize=False)

    water, info = build_water_mask(static, water_colors)
    Image.fromarray((water * 255).astype(np.uint8), "L").save(args.output / "water_mask.png", optimize=False)
    frames = animate(static, water, info, water_colors)
    for index, array in enumerate(frames, start=1):
        Image.fromarray(array, "RGBA").save(args.output / f"fountain_v3_f{index}.png", optimize=False)
    Image.fromarray(frames[0], "RGBA").save(args.output / "fountain_v3_base.png", optimize=False)

    sheet = Image.new("RGBA", (FRAME_SIZE[0] * FRAME_COUNT, FRAME_SIZE[1]))
    for index, array in enumerate(frames):
        sheet.paste(Image.fromarray(array, "RGBA"), (FRAME_SIZE[0] * index, 0))
    sheet.save(args.output / "fountain_v3_sheet.png", optimize=False)

    preview_frames = [Image.fromarray(array, "RGBA").resize((FRAME_SIZE[0] * 4, FRAME_SIZE[1] * 4), Image.Resampling.NEAREST) for array in frames]
    preview_frames[0].save(args.output / "fountain_v3_preview.gif", save_all=True, append_images=preview_frames[1:], duration=GIF_DURATIONS, loop=0, disposal=2)
    fit_frames = [composite_fit(fit_background, array).convert("P", palette=Image.Palette.ADAPTIVE, colors=64) for array in frames]
    fit_frames[0].save(args.output / "fountain_v3_fit.gif", save_all=True, append_images=fit_frames[1:], duration=GIF_DURATIONS, loop=0, disposal=2)

    report = {
        "frame_size": list(FRAME_SIZE),
        "sheet_size": [FRAME_SIZE[0] * FRAME_COUNT, FRAME_SIZE[1]],
        "frame_count": FRAME_COUNT,
        "fps": 8,
        "locked_palette_colors": len(palette),
        "used_sprite_colors": len(used),
        "water_mask_pixels": int(water.sum()),
        "alpha_values": list(map(int, np.unique(static[..., 3]))),
        "plant_groups": 5,
        "source_generation_pass": 2,
    }
    (args.output / "process_report.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
