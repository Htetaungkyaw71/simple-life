#!/usr/bin/env python3
"""Create a deterministic six-frame water loop from the supplied fountain PNG.

Only pixels selected by ``build_water_mask`` may change.  Every frame is
validated against the original RGBA source outside that mask and against the
source's exact RGB palette before it is written.
"""

from __future__ import annotations

import argparse
import shutil
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


FRAME_COUNT = 6
FRAME_DURATION_MS = 125  # 8 fps
PREVIEW_SCALE = 4

BASE_TEAL = np.array((23, 104, 89), dtype=np.uint8)
RIPPLE_BRIGHT = np.array((245, 232, 205), dtype=np.uint8)
RIPPLE_MID = np.array((238, 203, 166), dtype=np.uint8)
RIPPLE_DIM = np.array((183, 167, 132), dtype=np.uint8)
RIPPLE_FADE = np.array((130, 121, 88), dtype=np.uint8)

# Coordinates are for the reviewed 213x214 Pixel Snapper source.
BASIN_POLYGON = (
    (50, 82),
    (77, 59),
    (134, 59),
    (162, 83),
    (162, 123),
    (135, 147),
    (77, 147),
    (50, 123),
)
TOP_TIER_BOX = (96, 48, 117, 68)  # x0, y0, x1-exclusive, y1-exclusive
RIPPLE_CENTERS = ((84, 104), (129, 104), (107, 116))
RIPPLE_OFFSETS = (0, 2, 4)
STREAM_BOXES = (
    (87, 75, 89, 104),
    (125, 75, 127, 104),
    (106, 96, 108, 116),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="transparent source fountain PNG")
    parser.add_argument("output", type=Path, help="directory for frames and exports")
    return parser.parse_args()


def polygon_mask(size: tuple[int, int], points: tuple[tuple[int, int], ...]) -> np.ndarray:
    width, height = size
    image = Image.new("L", (width, height), 0)
    ImageDraw.Draw(image).polygon(points, fill=255)
    return np.asarray(image, dtype=np.uint8) > 0


def color_mask(rgb: np.ndarray, color: np.ndarray) -> np.ndarray:
    return np.all(rgb == color, axis=2)


def box_mask(shape: tuple[int, int], box: tuple[int, int, int, int]) -> np.ndarray:
    height, width = shape
    x0, y0, x1, y1 = box
    result = np.zeros((height, width), dtype=bool)
    result[max(0, y0) : min(height, y1), max(0, x0) : min(width, x1)] = True
    return result


def disk_mask(shape: tuple[int, int], center: tuple[int, int], radius: float) -> np.ndarray:
    height, width = shape
    cx, cy = center
    yy, xx = np.ogrid[:height, :width]
    return (xx - cx) ** 2 + (yy - cy) ** 2 <= radius * radius


def connected_component(binary: np.ndarray, seed: tuple[int, int]) -> np.ndarray:
    """Return the four-connected component containing an (x, y) seed."""
    height, width = binary.shape
    seed_x, seed_y = seed
    if not binary[seed_y, seed_x]:
        raise ValueError(f"component seed {seed} is not selected")
    result = np.zeros_like(binary)
    result[seed_y, seed_x] = True
    queue: deque[tuple[int, int]] = deque(((seed_x, seed_y),))
    while queue:
        x, y = queue.popleft()
        for next_x, next_y in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if (
                0 <= next_x < width
                and 0 <= next_y < height
                and binary[next_y, next_x]
                and not result[next_y, next_x]
            ):
                result[next_y, next_x] = True
                queue.append((next_x, next_y))
    return result


def largest_component(binary: np.ndarray) -> np.ndarray:
    remaining = binary.copy()
    largest = np.zeros_like(binary)
    while remaining.any():
        seed_y, seed_x = np.argwhere(remaining)[0]
        component = connected_component(remaining, (int(seed_x), int(seed_y)))
        if component.sum() > largest.sum():
            largest = component
        remaining[component] = False
    return largest


def dilate(binary: np.ndarray, iterations: int = 1) -> np.ndarray:
    result = binary.copy()
    for _ in range(iterations):
        padded = np.pad(result, 1, mode="constant", constant_values=False)
        expanded = np.zeros_like(result)
        for dy in range(3):
            for dx in range(3):
                expanded |= padded[dy : dy + result.shape[0], dx : dx + result.shape[1]]
        result = expanded
    return result


def build_water_mask(source: np.ndarray) -> tuple[np.ndarray, dict[str, np.ndarray]]:
    height, width = source.shape[:2]
    if (width, height) != (213, 214):
        raise ValueError(f"expected the reviewed 213x214 source, got {width}x{height}")

    rgb = source[..., :3]
    basin = polygon_mask((width, height), BASIN_POLYGON)
    base_teal = color_mask(rgb, BASE_TEAL)
    # The palette reuses teal in a few stone shadows.  Taking only the connected
    # pool component prevents those same-color stone pixels from entering the mask.
    surface = largest_component(basin & base_teal)

    top_box = box_mask((height, width), TOP_TIER_BOX)
    top_tier = top_box & base_teal

    effect_palette = np.zeros((height, width), dtype=bool)
    for color in (RIPPLE_BRIGHT, RIPPLE_MID, RIPPLE_DIM, RIPPLE_FADE):
        effect_palette |= color_mask(rgb, color)

    stream_regions: list[np.ndarray] = []
    streams = np.zeros((height, width), dtype=bool)
    for box in STREAM_BOXES:
        region = box_mask((height, width), box) & effect_palette
        stream_regions.append(region)
        streams |= region

    ripple_zones = np.zeros((height, width), dtype=bool)
    yy, xx = np.ogrid[:height, :width]
    for center in RIPPLE_CENTERS:
        cx, cy = center
        distance_sq = (xx - cx) ** 2 + (yy - cy) ** 2
        ripple_zones |= (distance_sq >= 2 * 2) & (distance_sq <= 10 * 10)
    source_ripples = (
        basin
        & ripple_zones
        & effect_palette
        & dilate(surface, 2)
        & ~streams
    )

    water = surface | top_tier | source_ripples | streams
    parts = {
        "surface": surface,
        "top_tier": top_tier,
        "source_ripples": source_ripples,
        "streams": streams,
        "stream_0": stream_regions[0],
        "stream_1": stream_regions[1],
        "stream_2": stream_regions[2],
    }

    counts = {name: int(mask.sum()) for name, mask in parts.items()}
    if counts["surface"] < 1_500:
        raise ValueError(f"water surface selection is unexpectedly small: {counts}")
    if counts["top_tier"] < 8 or counts["source_ripples"] < 12:
        raise ValueError(f"water-effect selection is unexpectedly small: {counts}")
    if any(counts[f"stream_{index}"] < 8 for index in range(3)):
        raise ValueError(f"one or more stream selections are unexpectedly small: {counts}")

    return water, parts


def ring_mask(
    shape: tuple[int, int], center: tuple[int, int], radius: float, thickness: float = 0.62
) -> np.ndarray:
    height, width = shape
    cx, cy = center
    yy, xx = np.ogrid[:height, :width]
    distance = np.sqrt((xx - cx) ** 2 + ((yy - cy) * 1.12) ** 2)
    return np.abs(distance - radius) <= thickness


def choose_shimmer_pixels(surface: np.ndarray, forbidden: np.ndarray) -> np.ndarray:
    """Choose stable, well-spaced teal pixels away from the animated landings."""
    padded = np.pad(surface, 1, mode="constant", constant_values=False)
    surrounded = np.ones_like(surface)
    for dy in range(3):
        for dx in range(3):
            surrounded &= padded[dy : dy + surface.shape[0], dx : dx + surface.shape[1]]
    candidates = np.argwhere(surrounded & ~forbidden)
    if len(candidates) < 60:
        raise ValueError(f"not enough safe shimmer pixels: {len(candidates)}")

    # Evenly sample the deterministic row-major candidate list, then distribute
    # five different pixels to each of the six animation phases.
    indices = np.linspace(0, len(candidates) - 1, 30, dtype=int)
    return candidates[indices]


def animate(source: np.ndarray, water: np.ndarray, parts: dict[str, np.ndarray]) -> list[np.ndarray]:
    height, width = source.shape[:2]
    allowed_ring_pixels = parts["surface"] | parts["source_ripples"]

    forbidden = parts["source_ripples"] | parts["streams"]
    for center in RIPPLE_CENTERS:
        forbidden |= disk_mask((height, width), center, 12.0)
    shimmer_pixels = choose_shimmer_pixels(parts["surface"], forbidden)

    top_candidates = np.argwhere(parts["top_tier"])
    top_indices = np.linspace(0, len(top_candidates) - 1, 3, dtype=int)
    top_pixels = top_candidates[top_indices]

    ripple_colors = (RIPPLE_BRIGHT, RIPPLE_MID, RIPPLE_DIM, RIPPLE_FADE, BASE_TEAL, BASE_TEAL)
    stream_colors = (RIPPLE_BRIGHT, RIPPLE_MID, RIPPLE_DIM, RIPPLE_DIM, RIPPLE_FADE, RIPPLE_MID)

    frames: list[np.ndarray] = []
    for frame_index in range(FRAME_COUNT):
        frame = source.copy()

        # Clear the original landing-ring pixels to the exact source teal before
        # drawing each expanded/faded phase.
        frame[parts["source_ripples"], :3] = BASE_TEAL
        for center, offset in zip(RIPPLE_CENTERS, RIPPLE_OFFSETS, strict=True):
            phase = (frame_index + offset) % FRAME_COUNT
            radius = 2.0 + phase
            ring = ring_mask((height, width), center, radius) & allowed_ring_pixels
            frame[ring, :3] = ripple_colors[phase]

        # Each source stream keeps its exact silhouette.  A six-pixel palette
        # phase moves down one row per frame and wraps from frame six to one.
        for stream_index in range(3):
            stream = parts[f"stream_{stream_index}"]
            ys, xs = np.nonzero(stream)
            if not len(ys):
                continue
            y_origin = int(ys.min())
            phases = (ys - y_origin - frame_index) % FRAME_COUNT
            for phase, color in enumerate(stream_colors):
                selected = phases == phase
                frame[ys[selected], xs[selected], :3] = color

        # Five isolated surface pixels shimmer in different positions each phase.
        phase_points = shimmer_pixels[frame_index * 5 : (frame_index + 1) * 5]
        frame[phase_points[:, 0], phase_points[:, 1], :3] = RIPPLE_DIM

        # Rotate a three-pixel glint across the small pool at the top of the urn.
        top_y, top_x = top_pixels[frame_index % 3]
        frame[top_y, top_x, :3] = RIPPLE_DIM

        # Hard guarantees requested by the user.
        if not np.array_equal(frame[~water], source[~water]):
            raise AssertionError(f"frame {frame_index + 1} changed pixels outside water mask")
        frames.append(frame)

    return frames


def assert_palette(frames: list[np.ndarray], source: np.ndarray) -> None:
    source_colors = {tuple(color) for color in source[source[..., 3] > 0, :3]}
    for index, frame in enumerate(frames, start=1):
        frame_colors = {tuple(color) for color in frame[frame[..., 3] > 0, :3]}
        unexpected = frame_colors - source_colors
        if unexpected:
            raise AssertionError(f"frame {index} introduced colors: {sorted(unexpected)}")


def save_preview(frames: list[Image.Image], path: Path) -> None:
    enlarged = [
        frame.resize(
            (frame.width * PREVIEW_SCALE, frame.height * PREVIEW_SCALE),
            Image.Resampling.NEAREST,
        )
        for frame in frames
    ]
    enlarged[0].save(
        path,
        save_all=True,
        append_images=enlarged[1:],
        # GIF timing is stored in 10 ms units. Alternating 120/130 ms yields an
        # exact 125 ms average frame time (8 fps) across the six-frame loop.
        duration=[120, 130] * (FRAME_COUNT // 2),
        loop=0,
        disposal=2,
        transparency=0,
        optimize=False,
    )


def main() -> None:
    args = parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    source_image = Image.open(args.source).convert("RGBA")
    source = np.asarray(source_image, dtype=np.uint8)
    water, parts = build_water_mask(source)
    frames = animate(source, water, parts)
    assert_palette(frames, source)

    Image.fromarray((water.astype(np.uint8) * 255), mode="L").save(args.output / "water_mask.png")
    shutil.copyfile(args.source, args.output / "fountain_static.png")

    pil_frames: list[Image.Image] = []
    for index, frame in enumerate(frames, start=1):
        image = Image.fromarray(frame, mode="RGBA")
        image.save(args.output / f"fountain_f{index}.png")
        pil_frames.append(image)

    sheet = Image.new(
        "RGBA",
        (source_image.width * FRAME_COUNT, source_image.height),
        (0, 0, 0, 0),
    )
    for index, frame in enumerate(pil_frames):
        sheet.paste(frame, (index * source_image.width, 0))
    sheet.save(args.output / "fountain_sheet.png")
    save_preview(pil_frames, args.output / "fountain_preview.gif")

    print(f"frame_size={source_image.width}x{source_image.height}")
    print(f"sheet_size={sheet.width}x{sheet.height}")
    print(f"water_pixels={int(water.sum())}")
    print("outside_mask_identity=verified")
    print("palette_identity=verified")


if __name__ == "__main__":
    main()
