"""Install only the approved Tomato icons into the current town atlas.

Every non-target frame keeps its existing pixels and metadata. The two native
24x24 candidates are appended without resizing and the superseded 16x16 cells
are cleared.
"""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public/assets/pixel/processed"
SOURCES = {
    "tomato-item": ROOT / "docs/assets/licenses/tomato-icons-v1/tomato-item-candidate.png",
    "tomato-seed-item": ROOT / "docs/assets/licenses/tomato-icons-v1/tomato-seed-item-candidate.png",
}


def metadata(image: Image.Image, x: int, y: int) -> dict:
    frame = {"x": x, "y": y, "w": image.width, "h": image.height}
    return {
        "frame": frame,
        "rotated": False,
        "trimmed": False,
        "spriteSourceSize": {"x": 0, "y": 0, "w": image.width, "h": image.height},
        "sourceSize": {"w": image.width, "h": image.height},
    }


def main() -> None:
    atlas_path = OUT / "town.png"
    metadata_path = OUT / "town.json"
    old_atlas = Image.open(atlas_path).convert("RGBA")
    atlas_data = json.loads(metadata_path.read_text())
    images = {name: Image.open(path).convert("RGBA") for name, path in SOURCES.items()}
    assert all(image.size == (24, 24) for image in images.values())
    assert all(set(image.getchannel("A").get_flattened_data()) <= {0, 255} for image in images.values())

    target_names = set(SOURCES)
    preserved_metadata = {name: value for name, value in atlas_data["frames"].items() if name not in target_names}
    preserved_pixels = {
        name: old_atlas.crop((frame["frame"]["x"], frame["frame"]["y"], frame["frame"]["x"] + frame["frame"]["w"], frame["frame"]["y"] + frame["frame"]["h"])).tobytes()
        for name, frame in preserved_metadata.items()
    }

    base_height = max(
        frame["frame"]["y"] + frame["frame"]["h"]
        for frame in preserved_metadata.values()
    ) + 2
    atlas_y = base_height + 2
    atlas = Image.new("RGBA", (old_atlas.width, atlas_y + 24))
    atlas.paste(old_atlas.crop((0, 0, old_atlas.width, base_height)), (0, 0))
    for index, (name, image) in enumerate(images.items()):
        old = atlas_data["frames"][name]["frame"]
        atlas.paste((0, 0, 0, 0), (old["x"], old["y"], old["x"] + old["w"], old["y"] + old["h"]))
        x = index * 26
        atlas.paste(image, (x, atlas_y))
        atlas_data["frames"][name] = metadata(image, x, atlas_y)

    atlas_data["meta"]["size"] = {"w": atlas.width, "h": atlas.height}
    assert all(atlas_data["frames"][name] == value for name, value in preserved_metadata.items())
    assert all(
        atlas.crop((frame["frame"]["x"], frame["frame"]["y"], frame["frame"]["x"] + frame["frame"]["w"], frame["frame"]["y"] + frame["frame"]["h"])).tobytes() == preserved_pixels[name]
        for name, frame in preserved_metadata.items()
    )
    atlas.save(atlas_path)
    metadata_path.write_text(json.dumps(atlas_data, indent=2) + "\n")
    print("Installed tomato-item and tomato-seed-item as native 24x24 frames; all other frames preserved")


if __name__ == "__main__":
    main()
