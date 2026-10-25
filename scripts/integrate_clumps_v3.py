#!/usr/bin/env python3
"""Pack the three approved scale-1 clumps into a fixed-cell runtime sheet."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "output/art/tall-grass-clump-review-v3"
RUNTIME = ROOT / "public/assets/pixel/processed/grass-clumps.png"
EVIDENCE = ROOT / "docs/assets/licenses/tall-grass-clump-review-v3"
NAMES = ("wide", "tall", "small")
CELL = (48, 48)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    sheet = Image.new("RGBA", (CELL[0] * len(NAMES), CELL[1]), (0, 0, 0, 0))
    frames = {}
    for index, name in enumerate(NAMES):
        source = SOURCE / f"clump-{name}.png"
        image = Image.open(source).convert("RGBA")
        x = index * CELL[0] + (CELL[0] - image.width) // 2
        y = CELL[1] - image.height
        sheet.alpha_composite(image, (x, y))
        frames[name] = {
            "index": index,
            "sourceSize": list(image.size),
            "cell": [index * CELL[0], 0, *CELL],
            "offset": [x - index * CELL[0], y],
            "sourceSha256": digest(source),
        }
    RUNTIME.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(RUNTIME, optimize=False)
    report = {
        "status": "approved and integrated",
        "selectedWideSource": "/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-aa76a8dc-7dd2-439d-82e6-1ea41f72b7be.png",
        "wideSelectionReason": "second wide candidate; fewer and broader blade groups",
        "runtimeScale": 1,
        "frameSize": list(CELL),
        "sheetSize": list(sheet.size),
        "frames": frames,
        "runtimeSha256": digest(RUNTIME),
    }
    (EVIDENCE / "runtime-install.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
