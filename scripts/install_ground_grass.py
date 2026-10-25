#!/usr/bin/env python3
"""Install the three approved local lawn tiles without altering their pixels."""

from __future__ import annotations

import hashlib
import json
import shutil
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "output/art/ground-grass-review-v1"
TARGET = ROOT / "public/assets/pixel/processed"
EVIDENCE = ROOT / "docs/assets/licenses/ground-grass-review-v1/runtime-install.json"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    TARGET.mkdir(parents=True, exist_ok=True)
    records = []
    for suffix in "abc":
        source = SOURCE / f"grass_ground_{suffix}.png"
        target = TARGET / f"grass-ground-{suffix}.png"
        image = Image.open(source).convert("RGB")
        if image.size != (128, 128):
            raise AssertionError((source, image.size))
        shutil.copyfile(source, target)
        if digest(source) != digest(target):
            raise AssertionError(f"byte mismatch: {target}")
        records.append({
            "key": f"grassGround{suffix.upper()}",
            "source": str(source.relative_to(ROOT)),
            "runtime": str(target.relative_to(ROOT)),
            "size": [128, 128],
            "sha256": digest(target),
        })
    EVIDENCE.parent.mkdir(parents=True, exist_ok=True)
    EVIDENCE.write_text(json.dumps({
        "date": "2026-10-21",
        "method": "byte-identical local copy of approved review assets",
        "tiles": records,
    }, indent=2) + "\n")
    print(json.dumps(records, indent=2))


if __name__ == "__main__":
    main()
