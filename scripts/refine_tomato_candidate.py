"""Create the approved runtime Tomato strip with smaller ripe fruit.

Candidate B remains the immutable cleaned import. This refinement changes only
the red fruit objects in the ripe frame, using nearest-neighbour resampling and
preserving the 48x70 frame grid, alpha, palette, and bottom-centre anchor.
"""
from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs/assets/licenses/tomato-import-v1/candidate-b.png"
OUTPUT = ROOT / "docs/assets/licenses/tomato-import-v1/candidate-b-runtime.png"
FRAME_WIDTH = 48
FRAME_HEIGHT = 70
RIPE_INDEX = 4
SCALE = 0.75

RED = (214, 29, 12, 255)
OUTLINE = {(42, 21, 13, 255), (85, 40, 20, 255)}
HIGHLIGHT = {(216, 179, 91, 255), (247, 221, 146, 255)}


def red_components(frame: Image.Image) -> list[set[tuple[int, int]]]:
    remaining = {
        (x, y)
        for y in range(frame.height)
        for x in range(frame.width)
        if frame.getpixel((x, y)) == RED
    }
    components: list[set[tuple[int, int]]] = []
    while remaining:
        start = remaining.pop()
        component = {start}
        queue = deque([start])
        while queue:
            x, y = queue.popleft()
            for nx in range(x - 1, x + 2):
                for ny in range(y - 1, y + 2):
                    point = (nx, ny)
                    if point in remaining:
                        remaining.remove(point)
                        component.add(point)
                        queue.append(point)
        if len(component) >= 10:
            components.append(component)
    return sorted(components, key=lambda points: min(y for _, y in points))


def fruit_mask(frame: Image.Image, red: set[tuple[int, int]]) -> set[tuple[int, int]]:
    xs = [x for x, _ in red]
    ys = [y for _, y in red]
    x0, y0, x1, y1 = min(xs) - 1, min(ys) - 1, max(xs) + 2, max(ys) + 2
    mask = set(red)
    for y in range(max(0, y0), min(frame.height, y1)):
        for x in range(max(0, x0), min(frame.width, x1)):
            color = frame.getpixel((x, y))
            if color in HIGHLIGHT:
                mask.add((x, y))
            elif color in OUTLINE and any(
                (x + dx, y + dy) in red
                for dx in (-1, 0, 1)
                for dy in (-1, 0, 1)
            ):
                mask.add((x, y))
    return mask


def shrink_fruit(frame: Image.Image, mask: set[tuple[int, int]]) -> None:
    xs = [x for x, _ in mask]
    ys = [y for _, y in mask]
    x0, y0, x1, y1 = min(xs), min(ys), max(xs) + 1, max(ys) + 1
    fruit = Image.new("RGBA", (x1 - x0, y1 - y0))
    for x, y in mask:
        fruit.putpixel((x - x0, y - y0), frame.getpixel((x, y)))
        frame.putpixel((x, y), (0, 0, 0, 0))

    width = max(1, round(fruit.width * SCALE))
    height = max(1, round(fruit.height * SCALE))
    fruit = fruit.resize((width, height), Image.Resampling.NEAREST)
    # Keep the hanging point fixed beneath the existing calyx, while centring
    # the narrower fruit on its original horizontal axis.
    paste_x = round((x0 + x1) / 2 - width / 2)
    frame.alpha_composite(fruit, (paste_x, y0))


def main() -> None:
    sheet = Image.open(SOURCE).convert("RGBA")
    assert sheet.size == (FRAME_WIDTH * 8, FRAME_HEIGHT), sheet.size
    assert set(sheet.getchannel("A").get_flattened_data()) <= {0, 255}
    ripe = sheet.crop((
        RIPE_INDEX * FRAME_WIDTH,
        0,
        (RIPE_INDEX + 1) * FRAME_WIDTH,
        FRAME_HEIGHT,
    ))
    components = red_components(ripe)
    assert len(components) == 5, len(components)
    for component in components:
        shrink_fruit(ripe, fruit_mask(ripe, component))
    sheet.paste(ripe, (RIPE_INDEX * FRAME_WIDTH, 0))
    assert set(sheet.getchannel("A").get_flattened_data()) <= {0, 255}
    sheet.save(OUTPUT)
    print(f"Wrote {OUTPUT.relative_to(ROOT)} with {len(components)} ripe fruits at {SCALE:.0%} size")


if __name__ == "__main__":
    main()
