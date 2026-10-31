"""Import the user-supplied 3x6 Clara sheet into the local runtime allowlist.

The supplied 1200x720 review sheet is a 4x presentation of a 50x60 logical
cell inside a 200x240 grid. This importer removes only the magenta matte,
samples whole logical pixels, and pads each result into the established 64x64
resident rig without redrawing any character pixels.
"""

from __future__ import annotations

import hashlib
import json
import shutil
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "public/assets/pixel/processed/seed-seller.png"
EVIDENCE = ROOT / "docs/assets/licenses/seed-seller-v1"
SOURCE_COPY = EVIDENCE / "seed_seller_3x6_sprite_sheet_fixed.png"
REJECTED_GENERATED = Path(
    "/Users/mac/.codex/generated_images/01a180c6-4e5c-7bb1-9810-80688b483dc1/"
    "exec-daa4853f-64ca-446b-9ff7-d7c49e042e49.png"
)

SOURCE_SIZE = (1200, 720)
SOURCE_CELL = (200, 240)
LOGICAL_CELL = (50, 60)
RUNTIME_CELL = (64, 64)
COLS = 6
ROWS = 3


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def is_magenta_matte(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, _ = pixel
    # The matte is exact #ff00ff with magenta antialias blends around the
    # character. Clara has no purple/magenta garment pixels, so this bounded
    # hue key removes spill without touching her brown/olive/ivory palette.
    return min(r, b) >= 120 and max(r, b) > g * 2 and abs(r - b) <= 80


def main(source_arg: str) -> None:
    source = Path(source_arg).resolve()
    image = Image.open(source).convert("RGBA")
    if image.size != SOURCE_SIZE:
        raise ValueError(f"expected {SOURCE_SIZE}, got {image.size}")

    EVIDENCE.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, SOURCE_COPY)
    if REJECTED_GENERATED.exists():
        shutil.copyfile(REJECTED_GENERATED, EVIDENCE / "rejected-imagegen-extraction.png")

    pixels = list(image.get_flattened_data())
    keyed = Image.new("RGBA", image.size)
    keyed.putdata([(0, 0, 0, 0) if is_magenta_matte(p) else (*p[:3], 255) for p in pixels])

    runtime = Image.new("RGBA", (COLS * RUNTIME_CELL[0], ROWS * RUNTIME_CELL[1]))
    frames = []
    for row in range(ROWS):
        for col in range(COLS):
            left = col * SOURCE_CELL[0]
            top = row * SOURCE_CELL[1]
            frame = keyed.crop((left, top, left + SOURCE_CELL[0], top + SOURCE_CELL[1]))
            frame = frame.resize(LOGICAL_CELL, Image.Resampling.NEAREST)
            x = col * RUNTIME_CELL[0] + (RUNTIME_CELL[0] - LOGICAL_CELL[0]) // 2
            y = row * RUNTIME_CELL[1]
            runtime.alpha_composite(frame, (x, y))
            bbox = frame.getbbox()
            if not bbox:
                raise ValueError(f"empty frame at row {row}, column {col}")
            frames.append({"row": row, "column": col, "logicalBounds": list(bbox)})

    alpha = set(runtime.getchannel("A").get_flattened_data())
    if not alpha <= {0, 255} or 0 not in alpha or 255 not in alpha:
        raise ValueError(f"runtime alpha is not binary: {sorted(alpha)}")
    for p in runtime.get_flattened_data():
        if p[3] and is_magenta_matte(p):
            raise ValueError(f"opaque magenta spill remains: {p}")

    RUNTIME.parent.mkdir(parents=True, exist_ok=True)
    runtime.save(RUNTIME, optimize=True)
    record = {
        "date": "2026-10-28",
        "character": "Clara",
        "role": "seed seller",
        "source": str(SOURCE_COPY.relative_to(ROOT)),
        "sourceSha256": sha256(SOURCE_COPY),
        "sourceSize": list(SOURCE_SIZE),
        "sourceCell": list(SOURCE_CELL),
        "runtime": str(RUNTIME.relative_to(ROOT)),
        "runtimeSha256": sha256(RUNTIME),
        "runtimeSize": list(runtime.size),
        "runtimeCell": list(RUNTIME_CELL),
        "frames": frames,
        "alpha": "binary 0/255",
        "processing": (
            "deterministic magenta hue-key, nearest 4x-to-1x sampling, centered 50x60 "
            "logical cells in 64x64 runtime frames; no redraw, recolor, interpolation or pose synthesis"
        ),
        "rejectedImagegenExtractionSha256": (
            sha256(EVIDENCE / "rejected-imagegen-extraction.png")
            if (EVIDENCE / "rejected-imagegen-extraction.png").exists()
            else None
        ),
    }
    (EVIDENCE / "record.json").write_text(json.dumps(record, indent=2) + "\n")
    print(json.dumps({"runtime": str(RUNTIME), "sha256": record["runtimeSha256"], "frames": len(frames)}))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: import_seed_seller.py SOURCE_PNG")
    main(sys.argv[1])
