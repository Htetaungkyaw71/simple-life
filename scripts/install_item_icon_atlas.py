#!/usr/bin/env python3
"""Install only the verified item frames while preserving the mixed atlas."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image

from item_icon_art import FRAME, ITEM_KEYS, add_item_icon_art


ROOT = Path(__file__).resolve().parents[1]
PNG = ROOT / "public/assets/pixel/processed/town.png"
JSON = ROOT / "public/assets/pixel/processed/town.json"


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def atlas_record(x: int, y: int) -> dict:
    frame = {"x": x, "y": y, "w": FRAME, "h": FRAME}
    return {
        "frame": frame,
        "rotated": False,
        "trimmed": False,
        "spriteSourceSize": {"x": 0, "y": 0, "w": FRAME, "h": FRAME},
        "sourceSize": {"w": FRAME, "h": FRAME},
    }


def main() -> None:
    old = Image.open(PNG).convert("RGBA")
    metadata = json.loads(JSON.read_text())
    targets = set(ITEM_KEYS)
    target_rects = {
        tuple(record["frame"][name] for name in ("x", "y", "w", "h"))
        for key, record in metadata["frames"].items()
        if key in targets
    }
    aliases = {
        key: record["frame"]
        for key, record in metadata["frames"].items()
        if key not in targets
        and tuple(record["frame"][name] for name in ("x", "y", "w", "h")) in target_rects
    }
    if aliases:
        raise ValueError(f"target frame rectangles are shared by non-target aliases: {aliases}")

    assets = {}
    add_item_icon_art(assets)
    if set(assets) != targets:
        raise ValueError(f"candidate/runtime key mismatch: {sorted(set(assets) ^ targets)}")

    gap = 2
    row_width = len(ITEM_KEYS) * (FRAME + gap) - gap
    if row_width > old.width:
        raise ValueError(f"item row {row_width}px exceeds atlas width {old.width}px")
    row_y = old.height + gap
    atlas = Image.new("RGBA", (old.width, row_y + FRAME + gap))
    atlas.paste(old, (0, 0))
    for key in ITEM_KEYS:
        record = metadata["frames"].get(key)
        if record:
            frame = record["frame"]
            atlas.paste((0, 0, 0, 0), (frame["x"], frame["y"], frame["x"] + frame["w"], frame["y"] + frame["h"]))
    for index, key in enumerate(ITEM_KEYS):
        x = index * (FRAME + gap)
        atlas.alpha_composite(assets[key], (x, row_y))
        metadata["frames"][key] = atlas_record(x, row_y)

    # Every old non-target pixel must remain byte-identical.
    before = old.tobytes()
    after = atlas.crop((0, 0, old.width, old.height)).tobytes()
    mask = bytearray(len(before))
    for x, y, w, h in target_rects:
        for yy in range(y, y + h):
            start = (yy * old.width + x) * 4
            mask[start:start + w * 4] = b"\x01" * (w * 4)
    changed_outside = sum(left != right and not mask[index] for index, (left, right) in enumerate(zip(before, after)))
    if changed_outside:
        raise ValueError(f"{changed_outside} non-target atlas bytes changed")

    atlas.save(PNG)
    metadata["meta"]["size"] = {"w": atlas.width, "h": atlas.height}
    JSON.write_text(json.dumps(metadata, indent=2) + "\n")
    audit = {
        "oldSize": list(old.size),
        "newSize": list(atlas.size),
        "rowY": row_y,
        "frameSize": [FRAME, FRAME],
        "installedKeys": list(ITEM_KEYS),
        "nonTargetFrameCoordinatesPreserved": True,
        "nonTargetAtlasBytesChanged": changed_outside,
        "townPngSha256": digest(PNG.read_bytes()),
        "townJsonSha256": digest(JSON.read_bytes()),
    }
    output = ROOT / "docs/verification/item-icons-runtime-v1"
    output.mkdir(parents=True, exist_ok=True)
    (output / "atlas-install.json").write_text(json.dumps(audit, indent=2) + "\n")
    for directory, _ in __import__("item_icon_art").SHEETS:
        manifest_path = ROOT / "docs/assets/licenses" / directory / "manifest.json"
        manifest = json.loads(manifest_path.read_text())
        manifest["runtimeAtlas"] = {"image": str(PNG.relative_to(ROOT)), "metadata": str(JSON.relative_to(ROOT)), "rowY": row_y, "frameSize": [FRAME, FRAME]}
        manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps(audit, indent=2))


if __name__ == "__main__":
    main()
