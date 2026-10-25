#!/usr/bin/env python3
"""Build the approved lawn correction and its deterministic review sheet.

This is a pixel-only pass over the approved A/B/C sources. It warms the six
lawn tones, removes repeated bright specks from the source tiles, and renders
the same world-coordinate alternate/pocket/tuft layers used by the game.
"""

from __future__ import annotations

import colorsys
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "output/art/ground-grass-review-v1"
OUT = ROOT / "output/art/ground-grass-v2"
RUNTIME = ROOT / "public/assets/pixel/processed"
EVIDENCE = ROOT / "docs/assets/licenses/ground-grass-v2"

OLD = ["#687749", "#748455", "#7F9056", "#879564", "#8E9C67", "#98A66B"]
# A 5.75-degree source-HSL rotation lands the integer RGB palette at 71.52°
# average hue while preserving every tone's HSL lightness after rounding.
LAWN = ["#6C7749", "#798455", "#859056", "#8C9564", "#939C67", "#9EA66B"]
SEED = 20261021


def rgb(value: str) -> tuple[int, int, int]:
    value = value.removeprefix("#")
    return tuple(int(value[index:index + 2], 16) for index in (0, 2, 4))


def hex_rgb(value: tuple[int, int, int] | np.ndarray) -> str:
    return "#" + "".join(f"{int(channel):02X}" for channel in value)


def hash32(x: int, y: int, salt: int = 0) -> int:
    def u32(value: int) -> int:
        return value & 0xFFFFFFFF

    n = u32(u32((x ^ salt) * 374761393) ^ u32(y * 668265263))
    n = u32((n ^ (n >> 13)) * 1274126177)
    return u32(n ^ (n >> 16))


def organic_blob(mask: np.ndarray, cx: int, cy: int, rx: int, ry: int, salt: int) -> None:
    """Rasterize a hard-edged, world-seeded organic blob without row bands."""
    height, width = mask.shape
    x0, x1 = max(0, cx - rx - 5), min(width, cx + rx + 6)
    y0, y1 = max(0, cy - ry - 5), min(height, cy + ry + 6)
    for y in range(y0, y1):
        for x in range(x0, x1):
            dx = (x + 0.5 - cx) / max(1, rx)
            dy = (y + 0.5 - cy) / max(1, ry)
            fine = int(hash32(x // 5, y // 5, salt) % 31) - 15
            broad = int(hash32(x // 13, y // 13, salt + 1) % 25) - 12
            if (dx * dx + dy * dy) * 100 <= 100 + fine + broad:
                mask[y, x] = True


def blob_field(width: int, height: int, *, cell: int, chance: int,
               min_radius: int, max_radius: int, salt: int) -> np.ndarray:
    mask = np.zeros((height, width), dtype=bool)
    max_cells = 2
    for gy in range(-max_cells, (height // cell) + max_cells + 1):
        for gx in range(-max_cells, (width // cell) + max_cells + 1):
            roll = hash32(gx, gy, salt)
            if roll % 100 >= chance:
                continue
            cx = gx * cell + int(hash32(gx, gy, salt + 1) % cell)
            cy = gy * cell + int(hash32(gx, gy, salt + 2) % cell)
            radius_range = max_radius - min_radius + 1
            rx = min_radius + int(hash32(gx, gy, salt + 3) % radius_range)
            ry = max(12, int(rx * (58 + hash32(gx, gy, salt + 4) % 31) / 100))
            organic_blob(mask, cx, cy, rx, ry, salt + 5)
    return mask


def warm_tile(name: str) -> Image.Image:
    source = np.asarray(Image.open(SOURCE / f"grass_ground_{name}.png").convert("RGB"))
    result = np.empty_like(source)
    old = [rgb(value) for value in OLD]
    new = [rgb(value) for value in LAWN]
    flat = source.reshape(-1, 3)
    output = result.reshape(-1, 3)
    for index, pixel in enumerate(flat):
        color = tuple(map(int, pixel))
        if color in old:
            rank = old.index(color)
            # Reserve the brightest tone for sparse world-space V marks.
            output[index] = new[min(rank, 4)]
        else:
            # Remove cream specks and generated dirt flecks from the repeating
            # source. World-space tufts provide the only bright lawn accents.
            output[index] = new[3]
    return Image.fromarray(result, "RGB")


def hsl_lightness(image: Image.Image) -> float:
    values = np.asarray(image).reshape(-1, 3).astype(np.float32) / 255.0
    return float(((values.max(axis=1) + values.min(axis=1)) * 50).mean())


def palette_hues() -> list[float]:
    values = []
    for value in LAWN:
        r, g, b = (channel / 255 for channel in rgb(value))
        values.append(colorsys.rgb_to_hls(r, g, b)[0] * 360)
    return values


def render_world(tiles: dict[str, Image.Image], width: int, height: int, *, include_tufts: bool = True) -> tuple[Image.Image, dict]:
    b = np.asarray(tiles["b"])
    c = np.asarray(tiles["c"])
    yy, xx = np.indices((height, width))
    result = b[yy % 128, xx % 128].copy()

    # C is an occasional alternate through irregular world-space islands, not
    # a chunk choice. Its mean lightness is matched to B before this stage.
    alternate = blob_field(width, height, cell=96, chance=22,
                           min_radius=16, max_radius=34, salt=SEED + 100)
    c_pixels = c[yy % 128, xx % 128]
    result[alternate] = c_pixels[alternate]

    # 40-120 rendered-pixel pockets become 20-60 px in the half-resolution
    # ground bake. Each affected lawn tone moves exactly one locked step down.
    pockets = blob_field(width, height, cell=94, chance=40,
                         min_radius=20, max_radius=60, salt=SEED + 200)
    palette = [rgb(value) for value in LAWN]
    for index in range(1, len(palette)):
        select = pockets & np.all(result == palette[index], axis=2)
        result[select] = palette[index - 1]

    # Sparse loose clusters of high-contrast cream-green V marks. Every mark
    # is a three-pixel hard shape and never tied to 128px tile boundaries.
    tuft_pixels = 0
    if include_tufts:
        for gy in range(-1, height // 76 + 2):
            for gx in range(-1, width // 76 + 2):
                if hash32(gx, gy, SEED + 300) % 100 >= 48:
                    continue
                center_x = gx * 76 + int(hash32(gx, gy, SEED + 301) % 76)
                center_y = gy * 76 + int(hash32(gx, gy, SEED + 302) % 76)
                count = 3 + int(hash32(gx, gy, SEED + 303) % 4)
                for mark in range(count):
                    dx = int(hash32(gx * 11 + mark, gy, SEED + 304) % 49) - 24
                    dy = int(hash32(gx, gy * 13 + mark, SEED + 305) % 37) - 18
                    x, y = center_x + dx, center_y + dy
                    if 1 <= x < width - 1 and 1 <= y < height - 2:
                        color = palette[5] if mark % 3 else palette[4]
                        result[y, x] = color
                        result[y + 1, x - 1] = color
                        result[y + 1, x + 1] = color
                        tuft_pixels += 3

    used = {hex_rgb(value) for value in np.unique(result.reshape(-1, 3), axis=0)}
    if not used <= set(LAWN):
        raise AssertionError(sorted(used))
    return Image.fromarray(result, "RGB"), {
        "alternateCoveragePercent": round(float(alternate.mean() * 100), 2),
        "darkPocketCoveragePercent": round(float(pockets.mean() * 100), 2),
        "tuftPixels": tuft_pixels,
        "usedColors": sorted(used),
    }


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    RUNTIME.mkdir(parents=True, exist_ok=True)
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    tiles = {name: warm_tile(name) for name in "abc"}
    records = {}
    for name, image in tiles.items():
        output = OUT / f"grass_ground_{name}.png"
        runtime = RUNTIME / f"grass-ground-{name}.png"
        image.save(output, optimize=False)
        image.save(runtime, optimize=False)
        records[name] = {
            "averageLightness": round(hsl_lightness(image), 3),
            "sha256": digest(output),
            "runtimeSha256": digest(runtime),
        }
    delta = abs(records["b"]["averageLightness"] - records["c"]["averageLightness"])
    if delta > 1:
        raise AssertionError(f"B/C lightness mismatch {delta}")

    repeat, world = render_world(tiles, 128 * 12, 128 * 12)
    repeat.resize((128 * 24, 128 * 24), Image.Resampling.NEAREST).save(
        OUT / "grass_ground_12x12_2x.png", optimize=False
    )
    hues = palette_hues()
    report = {
        "seed": SEED,
        "palette": LAWN,
        "paletteHueDegrees": [round(value, 2) for value in hues],
        "averagePaletteHue": round(sum(hues) / len(hues), 2),
        "lightnessDeltaBtoC": round(delta, 3),
        "baseRule": "B everywhere; C only in irregular world-space alternate masks; A only at Forest edge shade",
        "worldPreview": world,
        "tiles": records,
        "checks": {
            "paletteHueTarget71To72": 71 <= sum(hues) / len(hues) <= 72,
            "bAndCWithinOneLightnessUnit": delta <= 1,
            "darkPocketCoverage15To20Percent": 15 <= world["darkPocketCoveragePercent"] <= 20,
            "integerNearestPreviewScale": 2,
        },
    }
    if not all(report["checks"].values()):
        raise AssertionError(report)
    (OUT / "ground-v2-report.json").write_text(json.dumps(report, indent=2) + "\n")
    (EVIDENCE / "SOURCE_RECORD.md").write_text(
        "# Ground grass v2 correction\n\n"
        "Pixel-only correction of the approved local A/B/C sources. No image generation was used. "
        "The six lawn colors were HSL-rotated toward yellow-olive, source specks were removed, and "
        "the runtime composes B/C, dark pockets and tuft clusters from fixed world coordinates.\n"
    )
    (EVIDENCE / "runtime-install.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
