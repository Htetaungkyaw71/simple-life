"""Clean and pack the eight user-supplied foliage sprites."""
from __future__ import annotations

import hashlib
import json
import shutil
from collections import Counter, deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output/art/forest-foliage-snapper-v1"
RUNTIME = ROOT / "public/assets/pixel/processed"
DATA = ROOT / "src/data/foliageSnapperArt.js"

ASSETS = (
    {
        "id": "foliage-tree-olive-canopy",
        "file": "tree_savanna_fixed.png",
        "scale": 2.20,
        "role": "olive broadleaf tree",
    },
    {
        "id": "foliage-bush-leafy",
        "file": "newbrush2.png",
        "scale": 1.15,
        "role": "round leafy bush",
    },
    {
        "id": "foliage-leaf-upright",
        "file": "newbrush3.png",
        "scale": 0.78,
        "role": "upright leafy ground plant",
    },
    {
        "id": "foliage-tree-palm",
        "file": "tree_palm_fixed.png",
        "scale": 1.75,
        "role": "tropical palm tree",
    },
    {
        "id": "foliage-tree-sparse",
        "file": "tree_sapling_fixed.png",
        "scale": 1.80,
        "role": "young sparse tree",
    },
    {
        "id": "foliage-tree-jungle",
        "file": "tree_jungle_fixed.png",
        "scale": 1.90,
        "role": "dense jungle tree",
    },
    {
        "id": "foliage-leaf-olive",
        "file": "new_plant_u_1-pixel-snapper.png",
        "scale": 0.95,
        "role": "low olive foliage",
    },
    {
        "id": "foliage-bush-tropical",
        "file": "newbrush4.png",
        "scale": 0.95,
        "role": "tropical leaf bush",
    },
)

ALIASES = {
    "nature-foliage-tree-olive": "foliage-tree-olive-canopy",
    "nature-foliage-tree-palm": "foliage-tree-palm",
    "nature-foliage-tree-sparse": "foliage-tree-sparse",
    "nature-foliage-tree-jungle": "foliage-tree-jungle",
    "nature-bush-foliage-leafy": "foliage-bush-leafy",
    "nature-bush-foliage-upright": "foliage-leaf-upright",
    "nature-bush-foliage-olive": "foliage-leaf-olive",
    "nature-bush-foliage-tropical": "foliage-bush-tropical",
}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def chroma(pixel: tuple[int, int, int, int]) -> bool:
    """Identify this batch's recorded magenta family, never ordinary foliage."""
    red, green, blue, alpha = pixel
    return bool(
        alpha
        and red >= 95
        and blue >= 80
        and red > green * 1.45
        and blue > green * 1.45
        and abs(red - blue) <= 80
    )


def clean_background(source: Image.Image) -> tuple[Image.Image, dict]:
    image = source.convert("RGBA")
    pixels = image.load()
    palette = Counter(image.get_flattened_data())
    chroma_palette = {color for color in palette if chroma(color)}
    if not chroma_palette:
        alpha_values = sorted(set(image.getchannel("A").get_flattened_data()))
        if alpha_values == [255]:
            raise ValueError("source has neither transparency nor a recorded magenta matte")
        return image, {
            "method": "source transparency preserved exactly; no matte cleanup required",
            "edgeConnectedPixels": 0,
            "removedPixels": 0,
            "removedColors": [],
            "remainingChromaPixels": 0,
            "retainedOpaquePixels": sum(1 for pixel in image.get_flattened_data() if pixel[3]),
            "alphaValues": alpha_values,
        }

    queue: deque[tuple[int, int]] = deque()
    for x in range(image.width):
        queue.extend(((x, 0), (x, image.height - 1)))
    for y in range(image.height):
        queue.extend(((0, y), (image.width - 1, y)))

    removed: set[tuple[int, int]] = set()
    while queue:
        point = queue.popleft()
        if point in removed:
            continue
        x, y = point
        if pixels[x, y] not in chroma_palette:
            continue
        removed.add(point)
        for yy in range(max(0, y - 1), min(image.height, y + 2)):
            for xx in range(max(0, x - 1), min(image.width, x + 2)):
                if (xx, yy) not in removed:
                    queue.append((xx, yy))

    # Pixel Snapper leaves a few matte holes and exact fringe-colour islands
    # enclosed by foliage. Once the source-specific chroma palette has been
    # proven to touch the outer canvas, remove every exact occurrence of that
    # palette. These eight sources contain no authored purple/pink subject.
    edge_connected = set(removed)
    removed.update(
        (x, y)
        for y in range(image.height)
        for x in range(image.width)
        if pixels[x, y] in chroma_palette
    )

    cleaned = image.copy()
    target = cleaned.load()
    removed_colors = Counter(pixels[x, y] for x, y in removed)
    for x, y in removed:
        target[x, y] = (0, 0, 0, 0)

    remaining_chroma = sum(
        1
        for pixel in cleaned.get_flattened_data()
        if pixel[3] and chroma(pixel)
    )
    alpha_values = sorted(set(cleaned.getchannel("A").get_flattened_data()))
    retained = sum(1 for pixel in cleaned.get_flattened_data() if pixel[3])
    if remaining_chroma or alpha_values != [0, 255] or not retained:
        raise AssertionError(
            {"remainingChroma": remaining_chroma, "alphaValues": alpha_values, "retained": retained}
        )
    return cleaned, {
        "method": "exact source-specific magenta-family palette established from the outer canvas; enclosed matte holes and matching fringe islands also removed",
        "edgeConnectedPixels": len(edge_connected),
        "removedPixels": len(removed),
        "removedColors": [list(color) + [count] for color, count in removed_colors.most_common()],
        "remainingChromaPixels": remaining_chroma,
        "retainedOpaquePixels": retained,
        "alphaValues": alpha_values,
    }


def visible_bounds(image: Image.Image) -> list[int]:
    box = image.getchannel("A").getbbox()
    if box is None:
        raise ValueError("empty processed asset")
    return list(box)


def frame_record(x: int, y: int, width: int, height: int) -> dict:
    return {
        "frame": {"x": x, "y": y, "w": width, "h": height},
        "rotated": False,
        "trimmed": False,
        "spriteSourceSize": {"x": 0, "y": 0, "w": width, "h": height},
        "sourceSize": {"w": width, "h": height},
    }


def main() -> None:
    originals = OUTPUT / "originals"
    processed = OUTPUT / "processed"
    originals.mkdir(parents=True, exist_ok=True)
    processed.mkdir(parents=True, exist_ok=True)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    RUNTIME.mkdir(parents=True, exist_ok=True)

    atlas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    frames: dict[str, dict] = {}
    art: dict[str, dict] = {}
    audit: list[dict] = []
    x = y = 2
    row_height = 0

    for spec in ASSETS:
        source_path = Path("/Users/mac/Downloads") / spec["file"]
        if not source_path.is_file():
            raise FileNotFoundError(source_path)
        original_path = originals / f'{spec["id"]}.png'
        shutil.copyfile(source_path, original_path)
        original = Image.open(original_path).convert("RGBA")
        cleaned, cleanup = clean_background(original)
        cleaned_path = processed / f'{spec["id"]}.png'
        cleaned.save(cleaned_path, optimize=False)

        if x + cleaned.width + 2 > atlas.width:
            x = 2
            y += row_height + 2
            row_height = 0
        if y + cleaned.height + 2 > atlas.height:
            raise ValueError(f'{spec["id"]} does not fit the 512x512 atlas')
        atlas.alpha_composite(cleaned, (x, y))
        frames[spec["id"]] = frame_record(x, y, cleaned.width, cleaned.height)
        bounds = visible_bounds(cleaned)
        art[spec["id"]] = {
            "texture": "foliageSnapper",
            "frame": spec["id"],
            "width": cleaned.width,
            "height": cleaned.height,
            "scale": spec["scale"],
            "visibleBounds": bounds,
        }
        audit.append(
            {
                "id": spec["id"],
                "role": spec["role"],
                "userSource": str(source_path),
                "original": str(original_path.relative_to(ROOT)),
                "processed": str(cleaned_path.relative_to(ROOT)),
                "sourceSha256": digest(original_path),
                "processedSha256": digest(cleaned_path),
                "dimensions": list(cleaned.size),
                "visibleBounds": bounds,
                "worldScale": spec["scale"],
                "visibleWorldSize": [
                    round((bounds[2] - bounds[0]) * spec["scale"], 2),
                    round((bounds[3] - bounds[1]) * spec["scale"], 2),
                ],
                "geometryUnchanged": True,
                "retainedColorsUnchanged": True,
                "resampled": False,
                "cleanup": cleanup,
            }
        )
        x += cleaned.width + 2
        row_height = max(row_height, cleaned.height)

    atlas_path = RUNTIME / "foliage-snapper.png"
    atlas_json_path = RUNTIME / "foliage-snapper.json"
    atlas.save(atlas_path, optimize=False)
    atlas_json_path.write_text(
        json.dumps(
            {
                "frames": frames,
                "meta": {
                    "app": "Simple Life user-supplied foliage",
                    "image": "foliage-snapper.png",
                    "size": {"w": atlas.width, "h": atlas.height},
                    "scale": "1",
                },
            },
            indent=2,
        )
        + "\n"
    )

    overrides = {
        alias: {
            "frame": frame,
            "texture": "foliageSnapper",
            "scale": art[frame]["scale"],
            "sourceScale": 2,
        }
        for alias, frame in ALIASES.items()
    }
    DATA.write_text(
        "// User-supplied foliage; generated by scripts/integrate_foliage_snapper.py.\n"
        f"export const FOLIAGE_SNAPPER_ART={json.dumps(art, separators=(',', ':'))};\n"
        f"export const FOLIAGE_SNAPPER_OVERRIDES={json.dumps(overrides, separators=(',', ':'))};\n"
    )

    manifest = {
        "date": "2026-10-26",
        "request": "Replace the earlier foliage with the eight updated supplied trees and bushes.",
        "processing": {
            "tool": "Pillow deterministic local importer",
            "imageGenerationUsed": False,
            "geometry": "full source canvases retained at original dimensions",
            "color": "all non-matte RGBA colours retained exactly",
            "scaling": "Phaser nearest-neighbour runtime transforms only",
        },
        "atlas": {
            "png": str(atlas_path.relative_to(ROOT)),
            "json": str(atlas_json_path.relative_to(ROOT)),
            "dimensions": list(atlas.size),
            "frames": len(frames),
            "pngSha256": digest(atlas_path),
            "jsonSha256": digest(atlas_json_path),
        },
        "assets": audit,
    }
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({"atlas": list(atlas.size), "frames": len(frames), "usedHeight": y + row_height + 2}, indent=2))


if __name__ == "__main__":
    main()
