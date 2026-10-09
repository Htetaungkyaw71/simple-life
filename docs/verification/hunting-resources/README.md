# v0.8.0 hunting, stones and healing verification — 2026-10-09

Production checks: npm test **175/175 pass**; npm run build **96 modules**, **12 files / 2,287,312 bytes**. No whitespace errors. Audit: 835 old cell pixels/metadata unchanged, three original resource cells appended (838 total), six other art files byte-identical, exactly eight runtime art files. Reproduce with npm test, npm run build and python3 scripts/qa/hunting-resources-audit.py (Pillow required for audit only).

Native in-app browser on isolated local origin 43867 used fixture saves and actual keyboard/pointer inputs; DOM canvas telemetry is read-only. User origin 4175 was only refreshed, never read/reset. Checks:

- 1280×720: W/K hunts a one-health Hare, +1 Meat, energy 100→98; Food page 2 shows Meat +25 HP / +20 EP. Eat changes health 55→80, energy 98→100 and Meat 1→0.
- Fruit at full energy: health 50→55, energy 100 unchanged, Wild Berry 1→0. Eat enabled while hurt.
- Four City axe facings captured from actual WASD: upper/outward blade, downward handle, no extra hand; up rear/front other depth retained.
- Forest Hand/E collects a pile: Stone 0→2, energy 100→99, known collected ID. Real browser found nearby grass intercepting E; context priority repaired, covered by regression and retested.
- 360×640: direct nearby Hare tap gives 1 Meat; paged Food→Meat→Eat restores 25 HP and consumes 1. Direct pile tap gives 2 Stone; fixture-free reload/Continue preserves 2 Stone and collected ID.
- Automated 640×360/360×640/1280×720 checks keep Food page 2/Eat and Axe attack control within canvas; equal vital meter sizes remain.
- Empty captured warnings/errors. Normal preview refreshed; viewport restored; temporary QA tab/server closed.

browser-checks.json retains pre-fix/mis-target observations marked superseded, with successful correction records. Screenshots: axe-left/right/up/down.png, meat-food.png, fruit-healing.png, stone-bag.png, phone-meat.png. console.json and runtime-audit.json contain logs/provenance.

Limits: isolated starting fixtures rather than a full New Game journey; viewport emulation, not a physical phone; only current browser engine. Forest initial construction is relatively heavy and once timed out an input callback during QA, after which state was observed before continuing. Sustained performance, other engines and human visual acceptance remain unverified. The new art is original project code drawing; existing licences/submission limitations remain. No external asset/dependency, backend, crafting, push or publication.
