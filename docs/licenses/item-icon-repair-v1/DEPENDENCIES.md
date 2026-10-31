# Item-icon repair build dependencies — 2026-10-26

The repair and audit scripts use the repository's existing local Python 3 and Pillow installation. No package was installed or updated for this work. Runtime assets are static local PNG/JSON atlas data and add no runtime dependency, network request or remote asset.

Reproduction entry points:

- `scripts/process_item_icon_repair.py`
- `scripts/import_item_icon_sheets.py`
- `scripts/import_sheet.py`
- `scripts/install_item_icon_atlas.py`
- `scripts/audit_item_icon_sizes.py`

The exact generated-source and output hashes are recorded in `docs/assets/licenses/item-icon-repair-v1/manifest.json`; the successful atlas write is recorded in `docs/verification/item-icons-runtime-v1/atlas-install.json`.
