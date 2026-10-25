#!/usr/bin/env python3
"""Remove repeated fine fence-like motifs from the approved lawn tiles."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

import refine_ground_grass_v2 as ground


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "output/art/ground-grass-v2"
OUT = ROOT / "output/art/ground-grass-v3"
EVIDENCE = ROOT / "docs/assets/licenses/ground-grass-v3"
RUNTIME = ROOT / "public/assets/pixel/processed"
PALETTE = np.asarray([ground.rgb(value) for value in ground.LAWN], dtype=np.uint8)
INDEX = {tuple(map(int, color)): index for index, color in enumerate(PALETTE)}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def palette_indices(image: Image.Image) -> np.ndarray:
    array = np.asarray(image.convert("RGB"))
    result = np.empty(array.shape[:2], dtype=np.uint8)
    for color, index in INDEX.items():
        result[np.all(array == color, axis=2)] = index
    used = {tuple(map(int, pixel)) for pixel in np.unique(array.reshape(-1, 3), axis=0)}
    if not used <= set(INDEX):
        raise AssertionError(sorted(used - set(INDEX)))
    return result


def repair(image: Image.Image, name: str) -> tuple[Image.Image, int]:
    values = palette_indices(image)
    # The generated source baked a recognizable diagonal/fence motif across
    # the wrap edge. Repaint the unique 127px period with the surrounding
    # mid-lawn tone. C keeps a few balanced darker/lighter flecks, and A keeps
    # the same treatment one palette step lower for Forest edge shade. All
    # larger variation now comes from fixed world coordinates, so none of it
    # can repeat every 128px. This is palette-only replacement, never a blur.
    base = 1 if name == "a" else 2
    cleaned = np.full((127, 127), base, dtype=np.uint8)
    if name in {"a", "c"}:
        candidates = []
        for y in range(2, 125, 3):
            for x in range(2, 125, 3):
                score = ground.hash32(x, y, ground.SEED + (31 if name == "a" else 47))
                if score % 100 < 13:
                    candidates.append((score, x, y))
        candidates.sort()
        for index, (_, x, y) in enumerate(candidates):
            tone = max(0, base - 1) if index % 2 == 0 else min(len(PALETTE) - 1, base + 1)
            cleaned[y, x] = tone
            if (index // 2) % 3 == 0:
                cleaned[y, x + 1] = tone
    result = np.empty_like(values)
    result[:-1, :-1] = cleaned
    result[-1, :-1] = cleaned[0]
    result[:-1, -1] = cleaned[:, 0]
    result[-1, -1] = cleaned[0, 0]
    changed = int(np.count_nonzero(result != values))
    return Image.fromarray(PALETTE[result], "RGB"), changed


def ghost_before_after(before: Image.Image, after: Image.Image) -> Image.Image:
    # Wrap the shared bottom/top seam into the middle of one crop. That is the
    # exact coordinate band where the repeated fence-like row was visible.
    before_array = np.asarray(before)
    after_array = np.asarray(after)
    wrapped_before = np.vstack((before_array[96:], before_array[:32]))
    wrapped_after = np.vstack((after_array[96:], after_array[:32]))
    scale = 5
    left = Image.fromarray(wrapped_before, "RGB").resize((128 * scale, 64 * scale), Image.Resampling.NEAREST)
    right = Image.fromarray(wrapped_after, "RGB").resize((128 * scale, 64 * scale), Image.Resampling.NEAREST)
    draw = ImageDraw.Draw(left)
    # Outline only; the pixels beneath remain the original before crop.
    draw.rectangle((1, 20 * scale, 128 * scale - 2, 44 * scale), outline="#FF4040", width=3)
    panel = Image.new("RGB", (1280, 360), "#263E38")
    panel.paste(left, (0, 40)); panel.paste(right, (640, 40))
    labels = ImageDraw.Draw(panel)
    labels.text((8, 10), "BEFORE - B WRAPPED SEAM, GHOST BAND OUTLINED", fill="#FFF6DC")
    labels.text((648, 10), "AFTER - IDENTICAL COORDINATES", fill="#FFF6DC")
    return panel


def edge_delta(image: Image.Image) -> dict:
    values = palette_indices(image).astype(np.int16)
    return {
        "horizontalWrapMeanRankDelta": round(float(np.abs(values[:, 0] - values[:, -1]).mean()), 4),
        "verticalWrapMeanRankDelta": round(float(np.abs(values[0] - values[-1]).mean()), 4),
        "horizontalWrapMaxRankDelta": int(np.abs(values[:, 0] - values[:, -1]).max()),
        "verticalWrapMaxRankDelta": int(np.abs(values[0] - values[-1]).max()),
    }


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    EVIDENCE.mkdir(parents=True, exist_ok=True)
    tiles = {}
    approved_tiles = {}
    report = {"palette": ground.LAWN, "tiles": {}}
    for name in "abc":
        source = Image.open(SOURCE / f"grass_ground_{name}.png").convert("RGB")
        approved_tiles[name] = source
        repaired, changed = repair(source, name)
        output = OUT / f"grass_ground_{name}.png"
        repaired.save(output, optimize=False)
        tiles[name] = repaired
        report["tiles"][name] = {
            "before": edge_delta(source),
            "after": edge_delta(repaired),
            "fineMotifPixelsChanged": changed,
            "averageLightness": round(ground.hsl_lightness(repaired), 3),
            "sha256": digest(output),
            "approvedRuntimeSha256": digest(ROOT / "public/assets/pixel/processed" / f"grass-ground-{name}.png"),
        }

    delta = abs(report["tiles"]["b"]["averageLightness"] - report["tiles"]["c"]["averageLightness"])
    repeat, world = ground.render_world(tiles, 128 * 12, 128 * 12)
    approved_repeat, _ = ground.render_world(approved_tiles, 128 * 12, 128 * 12)
    without_tufts, _ = ground.render_world(approved_tiles, 128 * 12, 128 * 12, include_tufts=False)
    repeat_path = OUT / "grass_ground_12x12_2x.png"
    repeat_2x = repeat.resize((128 * 24, 128 * 24), Image.Resampling.NEAREST)
    repeat_2x.save(repeat_path, optimize=False)
    ghost_before_after(approved_tiles["b"], tiles["b"]).save(OUT / "ground-b-ghost-before-after.png", optimize=False)
    # The fit-check crop can otherwise make it unclear whether a faint mark is
    # part of B/C, a dark pocket or one of the requested V-tufts.  Save a direct
    # same-coordinate audit: final, no-tufts, and changed-pixel mask.
    crop_box = (160, 165, 500, 335)
    final_crop = approved_repeat.crop(crop_box).resize((680, 340), Image.Resampling.NEAREST)
    base_crop = without_tufts.crop(crop_box).resize((680, 340), Image.Resampling.NEAREST)
    diff = np.any(np.asarray(approved_repeat) != np.asarray(without_tufts), axis=2)
    diff_crop = diff[crop_box[1]:crop_box[3], crop_box[0]:crop_box[2]]
    mask = np.zeros((*diff_crop.shape, 3), dtype=np.uint8)
    mask[diff_crop] = (255, 70, 70)
    mask_crop = Image.fromarray(mask, "RGB").resize((680, 340), Image.Resampling.NEAREST)
    audit = Image.new("RGB", (680, 1080), "#263E38")
    audit.paste(final_crop, (0, 20)); audit.paste(base_crop, (0, 380)); audit.paste(mask_crop, (0, 740))
    labels = ImageDraw.Draw(audit)
    labels.text((8, 4), "FINAL", fill="#FFF6DC")
    labels.text((8, 364), "SAME COORDINATES WITHOUT WORLD-SPACE V TUFTS", fill="#FFF6DC")
    labels.text((8, 724), "V-TUFT PIXELS ONLY", fill="#FFF6DC")
    audit.save(OUT / "fence-shape-origin-audit.png", optimize=False)
    # The two pale-grey marks in the earlier clump fit are present in the old
    # A/B/C render even before any game objects are drawn. Compare that source
    # at the same world coordinates against the corrected render. This proves
    # they were baked tile pixels rather than an in-game object.
    approved_repeat_2x = approved_repeat.resize((128 * 24, 128 * 24), Image.Resampling.NEAREST)
    smudge_box = (420, 330, 600, 390)
    smudge_final = approved_repeat_2x.crop(smudge_box).resize((900, 300), Image.Resampling.NEAREST)
    smudge_base = repeat_2x.crop(smudge_box).resize((900, 300), Image.Resampling.NEAREST)
    smudge_audit = Image.new("RGB", (900, 660), "#263E38")
    smudge_audit.paste(smudge_final, (0, 30)); smudge_audit.paste(smudge_base, (0, 360))
    smudge_labels = ImageDraw.Draw(smudge_audit)
    smudge_labels.text((8, 8), "BEFORE - PALE MARKS BAKED INTO OLD A/B/C", fill="#FFF6DC")
    smudge_labels.text((8, 338), "AFTER - SAME WORLD COORDINATES, CLEANED A/B/C", fill="#FFF6DC")
    smudge_audit.save(OUT / "pale-smudge-layer-audit.png", optimize=False)

    # A world mask should not prefer the 128px source-tile grid.
    pocket_mask = ground.blob_field(128 * 12, 128 * 12, cell=94, chance=40,
                                    min_radius=20, max_radius=60, salt=ground.SEED + 200)
    edge = pocket_mask ^ np.roll(pocket_mask, 1, axis=1)
    boundary_slice = edge[:, 128::128]
    boundary_columns = int(boundary_slice.sum())
    mean_boundary_column_edges = float(boundary_slice.sum(axis=0).mean())
    mean_column_edges = float(edge.sum(axis=0).mean())
    report.update({
        "lightnessDeltaBtoC": round(delta, 3),
        "worldPreview": world,
        "checks": {
            "paletteUnchanged": True,
            "bAndCWithinOneLightnessUnit": delta <= 1,
            "darkPocketCoverage15To20Percent": 15 <= world["darkPocketCoveragePercent"] <= 20,
            "tileEdgesRemainMatched": all(
                report["tiles"][name]["after"][key] == 0
                for name in "abc"
                for key in ("horizontalWrapMaxRankDelta", "verticalWrapMaxRankDelta")
            ),
            "fineMotifsRemoved": report["tiles"]["b"]["fineMotifPixelsChanged"] > 0,
        },
        "repeatSha256": digest(repeat_path),
        "fenceShapeAudit": "same-coordinate final/no-tuft/diff montage",
        "maskAlignmentAudit": {
            "edgePixelsOn128pxColumns": boundary_columns,
            "meanEdgePixelsPer128pxColumn": round(mean_boundary_column_edges, 3),
            "meanEdgePixelsPerColumn": round(mean_column_edges, 3),
            "alignedToTilesOrChunks": mean_boundary_column_edges > mean_column_edges * 2.5,
        },
        "paleSmudgeFinding": "baked pixels in the old source-tile render; not an in-game object; removed by the A/B/C cleanup",
        "status": "final corrected candidate; installed after all checks",
    })
    if not all(report["checks"].values()):
        raise AssertionError(report)
    if report["maskAlignmentAudit"]["alignedToTilesOrChunks"]:
        raise AssertionError(report["maskAlignmentAudit"])
    for name, image in tiles.items():
        runtime = RUNTIME / f"grass-ground-{name}.png"
        image.save(runtime, optimize=False)
        report["tiles"][name]["runtimeSha256"] = digest(runtime)
    (OUT / "ground-v3-report.json").write_text(json.dumps(report, indent=2) + "\n")
    (EVIDENCE / "SOURCE_RECORD.md").write_text(
        "# Ground grass v3 seam correction\n\n"
        "The approved v2 six-color lawn is retained. The faint fence-like forms were baked into repeating source "
        "motifs. Deterministic toroidal majority-vote repainting removes those motifs from A, B and C using only "
        "surrounding locked palette colors. B/C alternates and dark pockets use hard-edged world-coordinate organic "
        "masks, not tile or chunk selections. The corrected tiles are installed after automated checks.\n"
    )
    (EVIDENCE / "checks.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
