"""Install the approved Tomato Candidate B frames into the current town atlas.

The full source packer requires the external Pipoya archive. This deterministic
fallback preserves every non-Tomato frame pixel and coordinate byte-for-byte,
clears the old Tomato cells, and appends the eight larger Tomato plant frames.
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/assets/pixel/processed"
SOURCE = ROOT / "docs/assets/licenses/tomato-import-v1/candidate-b-runtime.png"
STATES = ("seed", "sprout", "young", "flowering", "ripe", "dry", "wilted", "dead")


def main() -> None:
    atlas_path = OUT / "town.png"
    metadata_path = OUT / "town.json"
    old_atlas = Image.open(atlas_path).convert("RGBA")
    metadata = json.loads(metadata_path.read_text())
    source = Image.open(SOURCE).convert("RGBA")
    assert source.size == (48 * len(STATES), 70), source.size
    assert set(source.getchannel("A").get_flattened_data()) <= {0, 255}
    atlas_y = old_atlas.height + 2
    atlas = Image.new("RGBA", (old_atlas.width, atlas_y + 72))
    atlas.paste(old_atlas, (0, 0))
    for index, state in enumerate(STATES):
        name = f"tomato-{state}"
        old = metadata["frames"][name]["frame"]
        atlas.paste((0, 0, 0, 0), (old["x"], old["y"], old["x"] + old["w"], old["y"] + old["h"]))
        image = source.crop((index * 48, 0, (index + 1) * 48, 70))
        x = index * 50
        atlas.paste(image, (x, atlas_y))
        frame = {"x": x, "y": atlas_y, "w": image.width, "h": image.height}
        metadata["frames"][name] = {
            "frame": frame,
            "rotated": False,
            "trimmed": False,
            "spriteSourceSize": {"x": 0, "y": 0, "w": image.width, "h": image.height},
            "sourceSize": {"w": image.width, "h": image.height},
        }
    atlas.save(atlas_path)
    metadata["meta"]["size"] = {"w": atlas.width, "h": atlas.height}
    metadata_path.write_text(json.dumps(metadata, indent=2) + "\n")
    print(f"Preserved {len(metadata['frames']) - len(STATES)} frame coordinates; appended {len(STATES)} Tomato frames")


if __name__ == "__main__":
    main()
