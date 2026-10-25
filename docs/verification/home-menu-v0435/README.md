# Home menu and two City houses — v0.43.5

Date: 2026-10-23

## Result

- PASS — Home + Garden exposes exactly `House designs` and `Wardrobe`.
- PASS — the active catalogue contains Green Bay and Blue Slate only.
- PASS — buying Blue Slate charges 2,000 coins once; owned designs switch for free and survive Continue.
- PASS — both previews and the outdoor Home use existing local City atlas frames.
- PASS — exterior placement preserves the Home door/ground anchor and switches to frame-matched collision rows.
- PASS — Green Bay keeps the approved warm room and Blue Slate uses a visibly different cool-blue room surface while retaining the furnished layout and interaction anchors.
- PASS — retired paid Home ownership maps to Blue Slate under schema 19 without changing other progress.
- PASS — Wardrobe remains reachable at desktop and phone sizes.

## Automated checks

- `npm test`: 409 passed, 0 failed.
- `npm run build`: production build passed; 190 modules transformed.
- `tests/browser/customization.mjs`: 6 passed cases in `browser-checks.json` with no captured console warnings, console errors or page errors.

Browser cases:

- fresh game at 1280×720
- fresh game at 390×844 with touch input
- fresh game at 640×360 with touch input
- Blue Slate purchase, exterior, entry and furnished interior
- schema-17 continuation at 1280×720
- schema-17 continuation at 390×844

## Visual evidence

- [Desktop two-item menu](fresh-1280-home-menu.png)
- [Portrait-phone two-item menu](fresh-390-home-menu.png)
- [Short-landscape two-item menu](fresh-640-home-menu.png)
- [Blue Slate design page](house-slate-exterior-preview.png)
- [Blue Slate outdoor Home](house-slate-outside.png)
- [Blue Slate furnished interior](house-slate-inside.png)
- [Machine-readable browser record](browser-checks.json)

## Limits

The browser acceptance run used local headless Chromium plus a separate interactive in-app Chromium inspection. Physical phones, Safari, Firefox and Edge were not newly checked. Craft/materials, garden/tree shopping and room-furniture shopping are hidden from Home + Garden but deliberately retained in code and save normalization for future restoration. No deployment, publication or push was performed.
