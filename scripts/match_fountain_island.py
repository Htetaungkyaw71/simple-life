#!/usr/bin/env python3
"""Pixel-only palette and silhouette cleanup for the fountain island.

The script deliberately uses only Pillow raster primitives and numpy arrays.
It never resamples the source except for the 2x comparison, which uses NEAREST.
"""

from __future__ import annotations

import argparse
import colorsys
import json
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


EXPECTED_SIZE = (213, 214)
ISLAND_POINTS = (
    (70, 8), (143, 8), (171, 19), (194, 43), (205, 73), (206, 106),
    (196, 133), (178, 154), (151, 169), (125, 177), (88, 177),
    (57, 169), (31, 153), (13, 131), (6, 103), (7, 75), (18, 48),
    (39, 25),
)
PROTECTED_RECTS = (
    (18, 10, 95, 72),    # hydrangeas and upper-left foliage
    (129, 6, 184, 61),   # upper barrel and tulips
    (146, 45, 207, 129), # right flowers and leaves
    (25, 108, 86, 169),  # lower barrel and tulips
    (45, 43, 168, 153),  # fountain, water, rim and urn
    (124, 117, 187, 177),# lower-right fern and shrub
    (21, 73, 38, 90),    # two retained left mushrooms
    (157, 132, 177, 148),# retained right mushrooms
)
CLEAR_RECTS = (
    (103, 36, 121, 48),  # white sparkle cluster above the fountain
    (91, 31, 103, 54),   # loose petals on the upper lawn
    (38, 67, 58, 80),    # loose petals left of the basin
    (82, 145, 115, 166), # loose petals on the lower lawn
    (177, 127, 193, 155),# loose petals beyond the retained mushrooms
)
SHADOW_SHAPES = (
    ("ellipse", (49, 51, 166, 151)),
    ("ellipse", (130, 9, 185, 61)),
    ("ellipse", (27, 113, 88, 171)),
    ("ellipse", (16, 8, 99, 76)),
    ("ellipse", (143, 43, 210, 133)),
    ("ellipse", (121, 115, 190, 179)),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("screenshot", type=Path)
    parser.add_argument("output", type=Path)
    return parser.parse_args()


def rgb_to_hsv(rgb: np.ndarray) -> np.ndarray:
    values = rgb.astype(np.float32) / 255.0
    maximum = values.max(axis=-1)
    minimum = values.min(axis=-1)
    delta = maximum - minimum
    hue = np.zeros_like(maximum)
    active = delta > 1e-6
    red = active & (maximum == values[..., 0])
    green = active & (maximum == values[..., 1])
    blue = active & (maximum == values[..., 2])
    hue[red] = ((values[..., 1][red] - values[..., 2][red]) / delta[red]) % 6
    hue[green] = (values[..., 2][green] - values[..., 0][green]) / delta[green] + 2
    hue[blue] = (values[..., 0][blue] - values[..., 1][blue]) / delta[blue] + 4
    hue /= 6.0
    saturation = np.zeros_like(maximum)
    nonzero = maximum > 1e-6
    saturation[nonzero] = delta[nonzero] / maximum[nonzero]
    return np.stack((hue, saturation, maximum), axis=-1)


def dominant_colors(pixels: np.ndarray, count: int) -> list[tuple[int, int, int]]:
    """Weighted deterministic RGB k-means over exact screenshot pixels."""
    pixels = pixels.reshape(-1, 3).astype(np.uint8)
    unique, weights = np.unique(pixels, axis=0, return_counts=True)
    if len(unique) <= count:
        order = np.argsort(weights)[::-1]
        return [tuple(map(int, color)) for color in unique[order]]
    points = unique.astype(np.float64)
    centers = [points[int(np.argmax(weights))]]
    for _ in range(1, count):
        distance = np.min(
            np.sum((points[:, None, :] - np.asarray(centers)[None, :, :]) ** 2, axis=2),
            axis=1,
        )
        centers.append(points[int(np.argmax(distance * np.sqrt(weights)))])
    centers = np.asarray(centers)
    for _ in range(20):
        assignment = np.argmin(
            np.sum((points[:, None, :] - centers[None, :, :]) ** 2, axis=2), axis=1
        )
        updated = centers.copy()
        for index in range(count):
            members = assignment == index
            if members.any():
                updated[index] = np.average(points[members], axis=0, weights=weights[members])
        if np.max(np.abs(updated - centers)) < 0.25:
            centers = updated
            break
        centers = updated
    cluster_weight = np.array([weights[assignment == i].sum() for i in range(count)])
    return [tuple(map(int, np.rint(centers[i]))) for i in np.argsort(cluster_weight)[::-1]]


def softened(color: tuple[int, int, int]) -> tuple[int, int, int]:
    red, green, blue = (channel / 255.0 for channel in color)
    hue, saturation, value = colorsys.rgb_to_hsv(red, green, blue)
    saturation *= 0.70
    if 0.12 <= hue <= 0.46 and saturation > 0.08:
        # Pull foliage toward the screenshot's warm olive lawn without flattening it.
        hue = hue * 0.65 + 0.205 * 0.35
    result = colorsys.hsv_to_rgb(hue, saturation, value)
    return tuple(int(round(channel * 255)) for channel in result)


def build_palette(game: np.ndarray) -> list[tuple[int, int, int]]:
    height, width = game.shape[:2]
    rgb = game[..., :3]
    hsv = rgb_to_hsv(rgb)
    yy, xx = np.ogrid[:height, :width]
    island = (xx >= width * 0.23) & (xx <= width * 0.73) & (yy >= height * 0.10) & (yy <= height * 0.90)
    plaza = ~island & (yy < height * 0.95) & (hsv[..., 1] < 0.20) & (hsv[..., 2] > 0.20)
    greens = island & (hsv[..., 0] >= 0.12) & (hsv[..., 0] <= 0.46) & (hsv[..., 1] > 0.22)
    teals = island & (hsv[..., 0] >= 0.42) & (hsv[..., 0] <= 0.58) & (hsv[..., 1] > 0.22)
    accents = island & (((hsv[..., 0] <= 0.10) | (hsv[..., 0] >= 0.92)) & (hsv[..., 1] > 0.16) | ((hsv[..., 1] < 0.24) & (hsv[..., 2] > 0.62)))
    darks = island & (hsv[..., 2] < 0.34)
    groups = ((greens, 7), (plaza, 5), (teals, 4), (accents, 5), (darks, 3))
    palette: list[tuple[int, int, int]] = []
    for mask, quota in groups:
        if mask.any():
            palette.extend(dominant_colors(rgb[mask], quota))
    softened_palette: list[tuple[int, int, int]] = []
    for color in palette:
        candidate = softened(color)
        if candidate not in softened_palette:
            softened_palette.append(candidate)
    # Exact semantic anchors are themselves sampled approximations of the supplied game capture.
    anchors = ((55, 62, 43), (91, 100, 62), (126, 145, 79), (197, 199, 176), (222, 215, 190), (39, 105, 93), (92, 153, 142), (224, 151, 145), (247, 221, 196))
    for color in anchors:
        candidate = softened(color)
        if candidate not in softened_palette:
            softened_palette.append(candidate)
    # Preserve exactly 24 colors while retaining the darkest and lightest anchors.
    return softened_palette[:24]


def nearest_palette(rgb: np.ndarray, palette: np.ndarray) -> np.ndarray:
    flat = rgb.reshape(-1, 3).astype(np.int16)
    target = palette.astype(np.int16)
    delta = flat[:, None, :] - target[None, :, :]
    weights = np.array((0.30, 0.58, 0.12), dtype=np.float32)
    distance = np.sum(delta.astype(np.float32) ** 2 * weights, axis=2)
    return target[np.argmin(distance, axis=1)].astype(np.uint8).reshape(rgb.shape)


def polygon_mask(size: tuple[int, int], points: tuple[tuple[int, int], ...]) -> np.ndarray:
    image = Image.new("1", size, 0)
    ImageDraw.Draw(image).polygon(points, fill=1)
    return np.asarray(image, dtype=bool)


def erode(mask: np.ndarray, amount: int) -> np.ndarray:
    result = mask.copy()
    for _ in range(amount):
        padded = np.pad(result, 1, constant_values=False)
        neighbors = np.ones_like(result)
        for dy, dx in ((0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)):
            neighbors &= padded[dy : dy + result.shape[0], dx : dx + result.shape[1]]
        result = neighbors
    return result


def shape_mask(size: tuple[int, int], kind: str, box: tuple[int, int, int, int]) -> np.ndarray:
    image = Image.new("1", size, 0)
    draw = ImageDraw.Draw(image)
    getattr(draw, kind)(box, fill=1)
    return np.asarray(image, dtype=bool)


def shift_mask(mask: np.ndarray, dx: int, dy: int) -> np.ndarray:
    shifted = np.zeros_like(mask)
    shifted[max(0, dy) :, max(0, dx) :] = mask[: mask.shape[0] - max(0, dy), : mask.shape[1] - max(0, dx)]
    return shifted


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


def main() -> None:
    args = parse_args()
    source_image = Image.open(args.source).convert("RGBA")
    game_image = Image.open(args.screenshot).convert("RGBA")
    if source_image.size != EXPECTED_SIZE:
        raise ValueError(f"expected {EXPECTED_SIZE} source, got {source_image.size}")
    source = np.asarray(source_image, dtype=np.uint8)
    game = np.asarray(game_image, dtype=np.uint8)
    height, width = source.shape[:2]

    palette_list = build_palette(game)
    palette = np.asarray(palette_list, dtype=np.uint8)
    remapped = nearest_palette(source[..., :3], palette)
    opaque = source[..., 3] >= 128

    outer = polygon_mask((width, height), ISLAND_POINTS)
    inner = erode(outer, 2)
    curb = outer & ~inner
    base_target = np.array((126, 145, 79), dtype=np.uint8)
    grass = palette[np.argmin(np.sum((palette.astype(int) - base_target.astype(int)) ** 2, axis=1))]
    curb_light_target = np.array((222, 215, 190), dtype=np.uint8)
    curb_dark_target = np.array((197, 199, 176), dtype=np.uint8)
    curb_light = palette[np.argmin(np.sum((palette.astype(int) - curb_light_target.astype(int)) ** 2, axis=1))]
    curb_dark = palette[np.argmin(np.sum((palette.astype(int) - curb_dark_target.astype(int)) ** 2, axis=1))]

    result = np.zeros_like(source)
    result[inner, :3] = grass
    result[inner, 3] = 255
    # Existing pixels are retained only within the clean interior; this hard-clips the old fuzzy edge and path.
    retained = opaque & inner
    result[retained, :3] = remapped[retained]
    result[retained, 3] = 255

    protected = np.zeros((height, width), dtype=bool)
    for x0, y0, x1, y1 in PROTECTED_RECTS:
        protected[y0:y1, x0:x1] = True
    hsv = rgb_to_hsv(source[..., :3])
    sparkle = opaque & inner & ~protected & (hsv[..., 1] < 0.22) & (hsv[..., 2] > 0.72)
    petal = opaque & inner & ~protected & (((hsv[..., 0] < 0.10) | (hsv[..., 0] > 0.92)) & (hsv[..., 1] > 0.18) & (hsv[..., 2] > 0.48))
    removed_components = 0
    removed_pixels = 0
    for index, component in enumerate(components(sparkle | petal)):
        size = int(component.sum())
        if size <= 14 and index % 10 < 7:  # deterministically remove about 70 percent
            result[component, :3] = grass
            result[component, 3] = 255
            removed_components += 1
            removed_pixels += size

    clear_zone = np.zeros((height, width), dtype=bool)
    for x0, y0, x1, y1 in CLEAR_RECTS:
        clear_zone[y0:y1, x0:x1] = True
    explicit_noise = clear_zone & opaque & ((hsv[..., 2] > 0.60) | petal)
    result[explicit_noise, :3] = grass
    result[explicit_noise, 3] = 255
    removed_pixels += int(explicit_noise.sum())

    shadow_base = np.array((43, 50, 40), dtype=np.float32)
    shadow_blend = np.rint(grass.astype(np.float32) * 0.75 + shadow_base * 0.25).astype(np.uint8)
    shadow_color = palette[np.argmin(np.sum((palette.astype(int) - shadow_blend.astype(int)) ** 2, axis=1))]
    shadow = np.zeros((height, width), dtype=bool)
    for kind, box in SHADOW_SHAPES:
        shape = shape_mask((width, height), kind, box)
        shadow |= shift_mask(shape, 2, 3) & ~shape
    shadow &= inner
    result[shadow, :3] = shadow_color
    result[shadow, 3] = 255

    # A strict two-pixel stepped curb closes the island and cleanly terminates the former path.
    result[curb, :3] = curb_light
    result[curb, 3] = 255
    lower_right = curb & shift_mask(inner, 1, 1)
    result[lower_right, :3] = curb_dark

    if set(np.unique(result[..., 3])) - {0, 255}:
        raise AssertionError("matched sprite contains anti-aliased alpha")
    used_colors = {tuple(map(int, color)) for color in np.unique(result[result[..., 3] == 255, :3], axis=0)}
    if not used_colors.issubset(set(palette_list)):
        raise AssertionError("matched sprite contains a color outside the sampled target palette")

    args.output.mkdir(parents=True, exist_ok=True)
    matched_path = args.output / "fountain_island_matched.png"
    Image.fromarray(result, "RGBA").save(matched_path, optimize=False)

    # Build a clean comparison field from the supplied plaza's untouched top band.
    game_rgb = Image.fromarray(game, "RGBA")
    band_height = 80
    band = game_rgb.crop((0, 0, game_rgb.width, band_height))
    comparison = Image.new("RGBA", game_rgb.size)
    for y in range(0, comparison.height, band_height):
        comparison.paste(band, (0, y))
    enlarged = Image.fromarray(result, "RGBA").resize((width * 2, height * 2), Image.Resampling.NEAREST)
    comparison.alpha_composite(enlarged, ((comparison.width - enlarged.width) // 2, (comparison.height - enlarged.height) // 2))
    compare_path = args.output / "fountain_island_compare.png"
    comparison.save(compare_path, optimize=False)

    metadata = {
        "source": str(args.source),
        "screenshot": str(args.screenshot),
        "canvas": [width, height],
        "comparison": list(comparison.size),
        "palette": ["#%02x%02x%02x" % color for color in palette_list],
        "opaque_colors": len(used_colors),
        "removed_small_components": removed_components,
        "removed_small_pixels": removed_pixels,
        "resampling": "nearest-neighbor only",
    }
    (args.output / "palette_and_process.json").write_text(json.dumps(metadata, indent=2) + "\n")
    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
