#!/usr/bin/env python3
"""Record the measured image-generation logical-pixel ceiling for tree planning."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CLUMP = ROOT / "output/art/tall-grass-clump-review-v3/checks.json"
OUT = ROOT / "output/art/modular-tree-feasibility-v1"


def main() -> None:
    source = json.loads(CLUMP.read_text())
    samples = {}
    for name, item in source["checks"].items():
        canvas = item["rawCanvasPxBeforeAnyResize"]
        cell = item["detectedCellPx"]
        native = item["nativeLogicalSize"]
        samples[name] = {
            "rawCanvasPx": canvas,
            "detectedCellPx": cell,
            "cleanNativeLogicalSize": native,
            "rawCellCapacity": [round(canvas[0] / cell, 1), round(canvas[1] / cell, 1)],
        }
    observed = max(max(item["cleanNativeLogicalSize"]) for item in samples.values())
    report = {
        "status": "feasibility completed before modular generation",
        "samples": samples,
        "largestObservedCleanLogicalAxisPx": observed,
        "recommendedSingleModuleLimitPx": 50,
        "targetTreePx": [175, 225],
        "targetPalmPx": [176, 256],
        "singleGenerationVerdict": "not feasible at scale 1; the reliable clean logical axis is about 50px",
        "modularPlan": {
            "leafClusters": {"small": [32, 24], "medium": [42, 32], "large": [50, 40]},
            "trunkSegments": {"branching": [34, 50], "straightPale": [26, 50]},
            "rootFlare": [52, 28],
            "assembly": "fixed-seed overlap on a 175x225 scale-1 canvas; trunk modules repeat vertically under 3-tone canopy clusters",
        },
        "pixelScale": "all module pixels, player pixels and approved clump pixels are 1 logical pixel before unchanged camera zoom",
    }
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "feasibility.json").write_text(json.dumps(report, indent=2) + "\n")
    (OUT / "feasibility.md").write_text(
        "# Modular tree feasibility\n\n"
        f"Largest measured clean generated axis: **{observed}px**; recommended module limit: **50px**. "
        "A 175×225 scale-1 tree and 176×256 palm are therefore not clean one-call assets. "
        "Use three leaf-cluster sizes, two 50px trunk segments and one root flare, then assemble with a fixed seed.\n"
    )
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
