# Farmer cosmetics verification — v0.29.0, 2026-10-14

The reported bug was routing paid clothes/hair combinations to complete legacy NPC bodies. `playerVisual` now resolves only the saved boy/girl identity. Selective fabric/hair colour changes and independent hat/glasses/bag slots use that same rig. New clothing is a set of workwear colour variants, not new garment silhouettes. No gameplay bonuses.

## Automated/native checks

- `npm test`:333tests pass (purchase atomicity, prices, service hours/distance, free ownership toggles, malformed accessories, old-save defaults, all forty gender/outfit/hair combinations retaining their rig, UI control bounds and existing gameplay regression).
- `npm run build`:passes. Existing production allowlist still emits46runtime files with no source PNGs, ZIPs, documentation or export tools. No runtime dependency added.
- `node scripts/check_farmer_cosmetics.mjs`:passes40styles/384authored body cells,43,253,760alpha comparisons, original warm face/near-black eye pixels, accessory eye preservation, original shared tool cells, clear frame margins and baseline PNG hashes. [Audit](asset-audit.json), [build](build-audit.json), [boy contact](boy-all-poses.png), [girl contact](girl-all-poses.png).
- Both original farmer PNGs and all six processed baseline files remain byte-identical. Original NPC art remains. Source accessory export uses existing bundled NumPy2.3.5/Pillow12.3.0/pngjs7.0.0 offline only; evidence under `docs/licenses/farmer-cosmetic-export`.

## In-app browser checks

Isolated test origin4213; the user's normal4205save was not read or modified. `tests/browser/farmer-cosmetics.html` uses disposable fixtures, real keyboard/canvas pointer events and the read-only QA snapshot. The harness is excluded from production. Desktop1280×720English and portrait390×844Myanmar pass for both boy and girl:

1. Approach Nell and buy all three paid outfits; remain the same farmer with the full64×64rig.
2. Buy straw hat55c, glasses40c and backpack75c. All three independent slots remain equipped; no duplicate charge.
3. Hair purchase is disabled away from Sol; approach Sol and buy Golden hair60c without changing identity.
4. Home & garden → Wardrobe → Extras: remove/re-equip owned hat freely; wallet remains unchanged.
5. Run in all four directions with all eight phases and equipped accessories; jump through all six poses with the carried axe.
6. Trigger harvesting, digging, chopping, watering and axe attack with dressed farmer; separate held tool hides during combined work and restores correctly.
7. Continue/reload preserves all equipped/owned cosmetics, character and wallet.

All menus pause gameplay. Manual final portrait and compact landscape640×360Myanmar visual checks cover the shortened Extras caption, full item names, Turn control, front/back preview and bounded action buttons. Source-pixel audit covers all other work phases. No browser console errors/warnings during the interaction runs. Normal production preview4205 is refreshed after the final build.

## Limits

These are desktop in-app Chromium checks at phone dimensions with synthetic pointer/keyboard input. Physical phones, real multitouch, Firefox and Safari were not tested. Accessories have four static views registered to every animated body pose; they do not have independent cloth/strap physics. Future garment shapes need matched directional artwork rather than palette ramps. User review of the final art remains appropriate. No deployment or push.
