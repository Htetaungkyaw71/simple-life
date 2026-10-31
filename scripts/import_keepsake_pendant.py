"""Crop transparent padding from the user-supplied Keepsake pendant."""

from __future__ import annotations

import hashlib
import json
import shutil
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RUNTIME = ROOT / "public/assets/pixel/processed/keepsake-pendant.png"
EVIDENCE = ROOT / "docs/assets/licenses/keepsake-pendant-v1"
SOURCE_COPY = EVIDENCE / "Terracotta Gemstone Pendant Sprite-pixel-snapper.png"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main(source_arg: str) -> None:
    source = Path(source_arg).resolve()
    image = Image.open(source).convert("RGBA")
    bounds = image.getchannel("A").getbbox()
    if image.size != (91, 92) or bounds != (30, 23, 66, 69):
        raise ValueError(f"unexpected source geometry: {image.size}, {bounds}")

    EVIDENCE.mkdir(parents=True, exist_ok=True)
    RUNTIME.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, SOURCE_COPY)
    runtime = image.crop(bounds)
    runtime.save(RUNTIME, optimize=True)

    record = {
        "date": "2026-10-30",
        "source": str(SOURCE_COPY.relative_to(ROOT)),
        "sourceSha256": sha256(SOURCE_COPY),
        "sourceSize": list(image.size),
        "sourceVisibleBounds": list(bounds),
        "runtime": str(RUNTIME.relative_to(ROOT)),
        "runtimeSha256": sha256(RUNTIME),
        "runtimeSize": list(runtime.size),
        "processing": "transparent-bound crop only; visible RGBA pixels are unchanged",
    }
    (EVIDENCE / "record.json").write_text(json.dumps(record, indent=2) + "\n")
    print(json.dumps(record))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: import_keepsake_pendant.py SOURCE_PNG")
    main(sys.argv[1])
