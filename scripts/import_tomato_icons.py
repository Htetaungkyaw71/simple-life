"""Clean the user-supplied Tomato icon sheet for review only.

The script removes magenta-family background pixels, preserves every retained
RGBA value, and pads the three native sprites into 24x24 review frames. It does
not modify the runtime atlas.
"""
from __future__ import annotations

import hashlib
import json
import shutil
from collections import Counter, deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets-src/ChatGPT_Image_24_Oct_2026__21_08_37-pixel-snapper.png"
OUT = ROOT / "docs/assets/licenses/tomato-icons-v1"
FRAME_SIZE = (24, 24)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def magenta(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel
    return bool(a and r >= 100 and b >= 80 and r > g * 2 and b > g * 2 and abs(r - b) <= 70)


def components(image: Image.Image) -> list[set[tuple[int, int]]]:
    remaining = {
        (x, y)
        for y in range(image.height)
        for x in range(image.width)
        if image.getpixel((x, y))[3]
    }
    result: list[set[tuple[int, int]]] = []
    while remaining:
        start = remaining.pop()
        found = {start}
        queue = deque([start])
        while queue:
            x, y = queue.popleft()
            for nx in range(x - 1, x + 2):
                for ny in range(y - 1, y + 2):
                    point = (nx, ny)
                    if point in remaining:
                        remaining.remove(point)
                        found.add(point)
                        queue.append(point)
        result.append(found)
    return sorted(result, key=lambda points: (min(y for _, y in points), min(x for x, _ in points)))


def bounds(points: set[tuple[int, int]]) -> tuple[int, int, int, int]:
    xs = [x for x, _ in points]
    ys = [y for _, y in points]
    return min(xs), min(ys), max(xs) + 1, max(ys) + 1


def framed(sprite: Image.Image) -> tuple[Image.Image, list[int]]:
    if sprite.width > FRAME_SIZE[0] or sprite.height > FRAME_SIZE[1]:
        raise ValueError(f"{sprite.size} does not fit the review frame {FRAME_SIZE}")
    canvas = Image.new("RGBA", FRAME_SIZE)
    x = (FRAME_SIZE[0] - sprite.width) // 2
    y = (FRAME_SIZE[1] - sprite.height) // 2
    canvas.paste(sprite, (x, y))
    return canvas, [x, y]


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    source_colors = Counter(source.get_flattened_data())
    cleaned = source.copy()
    pixels = cleaned.load()
    removed = Counter()
    for y in range(cleaned.height):
        for x in range(cleaned.width):
            pixel = pixels[x, y]
            if magenta(pixel):
                removed[pixel] += 1
                pixels[x, y] = (0, 0, 0, 0)

    found = components(cleaned)
    if len(found) != 3:
        raise ValueError(f"expected 3 icons, found {len(found)}")
    names = ("tomato-item-candidate", "tomato-item-alternate", "tomato-seed-item-candidate")
    OUT.mkdir(parents=True, exist_ok=True)
    evidence_source = OUT / "source.png"
    shutil.copyfile(SOURCE, evidence_source)
    records = []
    retained_source_colors = {color for color in source_colors if not magenta(color)}
    retained_output_colors: set[tuple[int, int, int, int]] = set()
    for name, points in zip(names, found):
        box = bounds(points)
        sprite = cleaned.crop(box)
        frame, placement = framed(sprite)
        path = OUT / f"{name}.png"
        frame.save(path)
        retained_output_colors.update(color for color in frame.get_flattened_data() if color[3])
        records.append({
            "name": name,
            "sourceBounds": list(box),
            "trimmedSize": [sprite.width, sprite.height],
            "frameSize": list(FRAME_SIZE),
            "placement": placement,
            "sha256": sha256(path),
        })

    cleaned_path = OUT / "cleaned-sheet.png"
    cleaned.save(cleaned_path)
    assert set(cleaned.getchannel("A").get_flattened_data()) <= {0, 255}
    assert retained_output_colors == retained_source_colors
    audit = {
        "source": str(SOURCE.relative_to(ROOT)),
        "sourceSha256": sha256(SOURCE),
        "evidenceSource": str(evidence_source.relative_to(ROOT)),
        "sourceSize": list(source.size),
        "sourceUniqueColors": len(source_colors),
        "sourceAlphaValues": sorted({color[3] for color in source_colors}),
        "nativePixelGrid": True,
        "backgroundColorsRemoved": [list(color) + [count] for color, count in sorted(removed.items())],
        "retainedColorsChanged": 0,
        "outputAlphaValues": sorted(set(cleaned.getchannel("A").get_flattened_data())),
        "requiredFrameSize": list(FRAME_SIZE),
        "selectedProduce": "tomato-item-candidate",
        "icons": records,
        "cleanedSheetSha256": sha256(cleaned_path),
    }
    (OUT / "audit.json").write_text(json.dumps(audit, indent=2) + "\n")
    print(json.dumps(audit, indent=2))


if __name__ == "__main__":
    main()
