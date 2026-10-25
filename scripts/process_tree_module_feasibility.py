#!/usr/bin/env python3
"""Process review-only tree modules and assemble one fixed-seed scale-1 tree.

Nothing produced here is installed in public/ or registered with Phaser.  The
generated previews are reconstructed by majority vote on their logical grid,
palette locked without dithering, and composed only for the user's feasibility
checkpoint.
"""

from __future__ import annotations

import hashlib
import json
import random
from collections import Counter, deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

import process_clump_checkpoint_v3 as logical_grid


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/art/modular-tree-feasibility-v1"
SOURCE_OUT = OUT / "source"
EVIDENCE = ROOT / "docs/assets/licenses/modular-tree-feasibility-v1"
GENERATED = {
    "leaf-small": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-61c60c1e-344c-4877-a30d-47a8d3cfb7ee.png"),
    "leaf-medium": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-b354420e-0d42-47ea-b4c3-36b86b94e062.png"),
    "leaf-large": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-deeea826-1f96-45ef-b416-af900dce977f.png"),
    "trunk-branching": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-db0022b1-8a2f-4b49-ac15-2d68a82e38c5.png"),
    "trunk-pale": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-56a5d4b0-e3a2-442c-a945-8c8312c293c6.png"),
    "root-flare": Path("/Users/mac/.codex/generated_images/01a14a52-a872-7a51-b219-12192545853a/exec-5808c1d0-0d16-4290-8015-6eeb2276469e.png"),
}
FINAL = {
    "leaf-small": (32, 24), "leaf-medium": (42, 32), "leaf-large": (50, 40),
    "trunk-branching": (34, 50), "trunk-pale": (26, 50), "root-flare": (52, 28),
}
FOLIAGE_HEX = ["#3B4028", "#53582D", "#6A7138", "#858B49", "#A1A35C"]
TRUNK_HEX = ["#3B4028", "#5A3528", "#744733", "#925B3D", "#B47D55", "#C49A70"]
PALE_HEX = ["#3B4028", "#746B58", "#9A9178", "#B8AF94", "#D0C7AB"]


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def rgb(hexes: list[str]) -> np.ndarray:
    return np.asarray([tuple(int(value[i:i + 2], 16) for i in (1, 3, 5)) for value in hexes], dtype=np.int32)


def palette_for(name: str) -> tuple[list[str], np.ndarray]:
    values = FOLIAGE_HEX if name.startswith("leaf") else PALE_HEX if name == "trunk-pale" else TRUNK_HEX
    return values, rgb(values)


def largest(mask: np.ndarray) -> tuple[np.ndarray, int]:
    h, w = mask.shape; seen = np.zeros_like(mask); parts = []
    for y, x in zip(*np.where(mask & ~seen)):
        if seen[y, x]:
            continue
        stack = [(int(x), int(y))]; seen[y, x] = True; points = []
        while stack:
            px, py = stack.pop(); points.append((px, py))
            for nx, ny in ((px-1,py),(px+1,py),(px,py-1),(px,py+1)):
                if 0 <= nx < w and 0 <= ny < h and mask[ny,nx] and not seen[ny,nx]:
                    seen[ny,nx] = True; stack.append((nx,ny))
        parts.append(points)
    parts.sort(key=len, reverse=True); result = np.zeros_like(mask)
    if parts:
        for x, y in parts[0]: result[y,x] = True
    return result, len(parts)


def fill_holes(labels: np.ndarray, background: int) -> tuple[np.ndarray, int]:
    mask = labels != background; h, w = mask.shape
    exterior = np.zeros_like(mask); queue: deque[tuple[int,int]] = deque()
    for x in range(w):
        for y in (0,h-1):
            if not mask[y,x]: exterior[y,x] = True; queue.append((x,y))
    for y in range(h):
        for x in (0,w-1):
            if not mask[y,x] and not exterior[y,x]: exterior[y,x] = True; queue.append((x,y))
    while queue:
        x,y = queue.popleft()
        for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
            if 0 <= nx < w and 0 <= ny < h and not mask[ny,nx] and not exterior[ny,nx]:
                exterior[ny,nx] = True; queue.append((nx,ny))
    holes = ~mask & ~exterior; out = labels.copy(); out[holes] = 1
    return out, int(holes.sum())


def labels_to_image(labels: np.ndarray, palette: np.ndarray, background: int) -> Image.Image:
    out = np.zeros((*labels.shape,4), dtype=np.uint8); mask = labels != background
    out[mask,:3] = palette[labels[mask]].astype(np.uint8); out[mask,3] = 255
    return Image.fromarray(out, "RGBA")


def process(name: str) -> tuple[Image.Image, dict]:
    source = Image.open(GENERATED[name]).convert("RGB")
    SOURCE_OUT.mkdir(parents=True, exist_ok=True)
    source_path = SOURCE_OUT / f"{name}-generated.png"; source.save(source_path, optimize=False)
    palette_hex, palette = palette_for(name)
    logical_grid.PALETTE = palette
    logical_grid.PALETTE_HEX = palette_hex
    logical_grid.BACKGROUND = len(palette)
    labels = logical_grid.label_source(np.asarray(source))
    detection = logical_grid.detect_grid(labels, FINAL[name])
    bbox = tuple(detection["sourceObjectBoundsPx"])
    # Majority-vote directly into the final module footprint. This preserves
    # every output pixel as a logical cell rather than point-sampling a large
    # image-model preview.
    voted = logical_grid.majority_grid(labels, bbox, FINAL[name])
    keep, before_components = largest(voted != logical_grid.BACKGROUND)
    voted[~keep] = logical_grid.BACKGROUND
    voted, holes = fill_holes(voted, logical_grid.BACKGROUND)
    mask = voted != logical_grid.BACKGROUND
    boundary = np.zeros_like(mask)
    for y,x in zip(*np.where(mask)):
        if any(not (0 <= nx < mask.shape[1] and 0 <= ny < mask.shape[0]) or not mask[ny,nx]
               for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1))): boundary[y,x] = True
    voted[boundary] = 0
    image = labels_to_image(voted, palette, logical_grid.BACKGROUND)
    output = OUT / f"{name}.png"; image.save(output, optimize=False)
    array = np.asarray(image); opaque = array[:,:,3] > 0
    _, components = largest(opaque)
    used = sorted({"#"+"".join(f"{c:02X}" for c in p) for p in array[opaque,:3]})
    check = {
        "rawCanvasPx": list(source.size),
        "rawSourceSha256": digest(GENERATED[name]),
        "detectedCellPx": detection["detectedCellPx"],
        "detectedCleanLogicalSize": detection["nativeLogicalSize"],
        "finalCanvasPx": list(image.size), "runtimeScale": 1,
        "componentsBeforeCleanup": before_components, "objectCount": components,
        "pinholesFilled": holes, "binaryAlpha": sorted(map(int,np.unique(array[:,:,3]))) == [0,255],
        "onlyLockedPalette": set(used) <= set(palette_hex), "usedColors": used,
        "processing": "logical-cell majority vote, palette lock, no point sampling/dither/blur/antialias",
        "sha256": digest(output),
    }
    if not (check["objectCount"] == 1 and check["binaryAlpha"] and check["onlyLockedPalette"]):
        raise AssertionError({name: check})
    return image, check


def paste_center(canvas: Image.Image, image: Image.Image, center_x: int, bottom_y: int, flip=False) -> None:
    sprite = image.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if flip else image
    canvas.alpha_composite(sprite, (round(center_x-sprite.width/2), bottom_y-sprite.height))


def assemble(modules: dict[str,Image.Image]) -> tuple[Image.Image, list[dict]]:
    canvas = Image.new("RGBA", (175,225), (0,0,0,0)); placements=[]
    # Root and repeated trunk modules form the full 225px silhouette. Canopy
    # modules intentionally overlap so the final object is one chunky tree.
    for bottom, flip in ((211,False),(174,True),(137,False)):
        paste_center(canvas, modules["trunk-branching"], 88, bottom, flip)
        placements.append({"module":"trunk-branching","centerX":88,"bottomY":bottom,"flip":flip})
    paste_center(canvas, modules["root-flare"], 88, 225)
    placements.append({"module":"root-flare","centerX":88,"bottomY":225,"flip":False})
    rng=random.Random(20261021)
    canopy=[
        ("leaf-large",88,69),("leaf-large",55,84),("leaf-large",121,85),
        ("leaf-medium",35,106),("leaf-medium",70,107),("leaf-medium",106,108),("leaf-medium",140,107),
        ("leaf-medium",88,94),("leaf-large",88,119),
        ("leaf-large",52,128),("leaf-large",91,132),("leaf-large",128,130),
        ("leaf-small",25,132),("leaf-small",151,133),("leaf-small",74,151),("leaf-small",111,150),
    ]
    for name,cx,by in canopy:
        flip=bool(rng.getrandbits(1)); paste_center(canvas,modules[name],cx,by,flip)
        placements.append({"module":name,"centerX":cx,"bottomY":by,"flip":flip})
    canvas.save(OUT/"assembled-test-tree.png",optimize=False)
    return canvas,placements


def player_frame() -> Image.Image:
    sheet=Image.open(ROOT/"public/assets/pixel/processed/boy.png").convert("RGBA")
    return sheet.crop((0,0,64,64)).resize((96,96),Image.Resampling.NEAREST)


def reviews(modules: dict[str,Image.Image], tree: Image.Image) -> None:
    repeat=Image.open(ROOT/"output/art/ground-grass-v3/grass_ground_12x12_2x.png").convert("RGB")
    lawn=repeat.crop((320,360,970,680)); fit=lawn.copy(); player=player_frame()
    fit.paste(player,(92,203),player); fit.paste(tree,(325,70),tree)
    fit.save(OUT/"assembled-tree-fit-1x.png",optimize=False)
    fit.resize((1950,960),Image.Resampling.NEAREST).save(OUT/"assembled-tree-fit-3x.png",optimize=False)
    panel=Image.new("RGB",(740,250),"#6C7749"); draw=ImageDraw.Draw(panel)
    x=18
    for name in ("leaf-small","leaf-medium","leaf-large","trunk-branching","trunk-pale","root-flare"):
        image=modules[name].resize((modules[name].width*3,modules[name].height*3),Image.Resampling.NEAREST)
        panel.paste(image,(x,205-image.height),image); draw.text((x,220),name,fill="#F6E8C8"); x+=image.width+22
    panel.save(OUT/"tree-modules-3x.png",optimize=False)


def main() -> None:
    OUT.mkdir(parents=True,exist_ok=True); EVIDENCE.mkdir(parents=True,exist_ok=True)
    modules={}; checks={}
    for name in GENERATED: modules[name],checks[name]=process(name)
    tree,placements=assemble(modules); reviews(modules,tree)
    report={
        "date":"2026-10-21","status":"review-only feasibility test; nothing integrated",
        "largestObservedCleanLogicalAxisPx":49,"recommendedSingleGenerationLimitPx":50,
        "targetTreePx":[175,225],"targetPalmPx":[176,256],
        "verdict":"one clean generation is not large enough; modular fixed-seed composition is feasible",
        "fixedSeed":20261021,"assembledTreePx":list(tree.size),"runtimeScale":1,
        "modules":checks,"placements":placements,
        "outputs":{p.name:digest(p) for p in sorted(OUT.glob("*.png"))},
    }
    (OUT/"module-checks.json").write_text(json.dumps(report,indent=2)+"\n")
    (EVIDENCE/"checks.json").write_text(json.dumps(report,indent=2)+"\n")
    (EVIDENCE/"SOURCE_RECORD.md").write_text(
        "# Modular tree feasibility v1 (review only)\n\n"
        "Six original components were made in six separate OpenAI built-in image-generation calls: three "
        "olive leaf-cluster sizes, two trunk types and one root flare. Each output was reconstructed by "
        "logical-cell majority vote, quantized to the locked foliage/trunk palettes without dithering, and "
        "assembled with fixed seed 20261021 on a 175×225 scale-1 canvas. These files remain under output/ "
        "and are not shipped or registered at runtime pending approval.\n"
    )
    print(json.dumps(report,indent=2))


if __name__ == "__main__": main()
