#!/usr/bin/env python3
"""Measure current nature sprite pixels and gameplay anchors for redesign review."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output/art/nature-redesign-v1"


def atlas_frame(image: Image.Image, meta: dict, name: str) -> Image.Image:
    f = meta["frames"][name]["frame"]
    return image.crop((f["x"], f["y"], f["x"] + f["w"], f["y"] + f["h"]))


def measure(image: Image.Image, scale: float) -> dict:
    bbox = image.getchannel("A").getbbox()
    if bbox is None:
        raise AssertionError("empty sprite")
    left, top, right, bottom = bbox
    return {
        "framePx": list(image.size),
        "opaqueBoundsPx": list(bbox),
        "opaqueSizePx": [right - left, bottom - top],
        "runtimeScale": scale,
        "renderedOpaquePx": [round((right - left) * scale, 2), round((bottom - top) * scale, 2)],
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    town_image = Image.open(ROOT / "public/assets/pixel/processed/town.png").convert("RGBA")
    town_meta = json.loads((ROOT / "public/assets/pixel/processed/town.json").read_text())
    snap_image = Image.open(ROOT / "public/assets/pixel/processed/pixel-snapper-assets.png").convert("RGBA")
    snap_meta = json.loads((ROOT / "public/assets/pixel/processed/pixel-snapper-assets.json").read_text())

    clumps = {}
    for label, frame in (("wide", "tall-grass-0-0"), ("tall", "tall-grass-1-0"), ("small", "tall-grass-2-0")):
        clumps[label] = {"frame": frame, **measure(atlas_frame(town_image, town_meta, frame), 2),
                         "collision": None, "anchor": "bottom-centre vegetation foot"}

    bush_measure = measure(atlas_frame(snap_image, snap_meta, "snapper-bush-new"), .45)
    bushes = {
        "darkRound": {"runtimeAlias": "nature-bush-leafy", "frame": "snapper-bush-new", **bush_measure},
        "paleSage": {"runtimeAlias": "nature-bush-berry", "frame": "snapper-bush-new", **bush_measure},
        "creamFlowering": {"runtimeAlias": "nature-bush-flower", "frame": "snapper-bush-new", **bush_measure},
    }
    for item in bushes.values():
        item.update({"collision": None, "anchor": "saved vegetation foot; originX alias preserved"})

    tree_specs = {
        "broadleaf": ("forest-oak-0", "snapper-tree-broadleaf", .7),
        "round": ("forest-oak-2", "snapper-tree-broadleaf", .7),
        "tallThin": ("forest-oak-1", "snapper-tree-tall", 1.1),
        "palm0": ("forest-palm-0", "snapper-tree-palm", 1.66),
        "palm1": ("forest-palm-1", "snapper-tree-palm", 1.66),
    }
    trees = {}
    for label, (alias, frame, scale) in tree_specs.items():
        trees[label] = {
            "runtimeAlias": alias,
            "frame": frame,
            **measure(atlas_frame(snap_image, snap_meta, frame), scale),
            "collisionLocalPx": [22, 76, 20, 16],
            "trunkFootLocalPx": [32, 90],
            "anchor": "treeVisual originX and saved prop position stay unchanged",
        }
    trees["treeWideGameplayException"] = {
        "usesBroadleafVisual": True,
        "collisionLocalPx": [26, 76, 42, 16],
        "trunkFootLocalPx": [32, 90],
    }

    report = {
        "date": "2026-10-21",
        "scope": "measurement only; no new nature sprites integrated",
        "playerBasis": {"nativeFramePx": [40, 72], "nativeVisibleHeightPx": 64},
        "clumps": clumps,
        "bushes": bushes,
        "trees": trees,
        "preservationRule": "replacement frame, opaque footprint, origin, collision and trunk-foot offsets remain exact",
    }
    (OUT / "existing-footprints.json").write_text(json.dumps(report, indent=2) + "\n")

    lines = [
        "# Existing nature footprints", "",
        "| Asset | Frame | Native frame | Opaque pixels | Runtime scale | Rendered opaque | Collision / anchor |",
        "|---|---|---:|---:|---:|---:|---|",
    ]
    for group in (clumps, bushes, {k: v for k, v in trees.items() if "frame" in v}):
        for name, item in group.items():
            collision = item.get("collisionLocalPx", item.get("collision"))
            anchor = f"collision {collision}" if collision else "no collision"
            lines.append(
                f"| {name} | {item['frame']} | {item['framePx'][0]}x{item['framePx'][1]} | "
                f"{item['opaqueSizePx'][0]}x{item['opaqueSizePx'][1]} | {item['runtimeScale']} | "
                f"{item['renderedOpaquePx'][0]}x{item['renderedOpaquePx'][1]} | {anchor} |"
            )
    lines += ["", "All tree trunk feet remain at local (32, 90). The `tree-wide` collision exception remains [26, 76, 42, 16]."]
    (OUT / "existing-footprints.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
