# v0.5.0 UI verification

122/122 Node tests (tests.txt), production build (build.txt), exact eight-file art allowlist and byte comparison against v0.4.9 88ae91c (runtime-audit.json). Preview index and its matching app bundle were checked using read-only local HTTP; no gameplay browser acceptance is claimed.

42 PNG studies: title, farmer choice, pause, controls, bag seeds, bag food, map, Forest HUD, seed shop, market, Outfitter, crop inspection, Home HUD and City HUD at 1280×720, 390×844 and 640×360. Generated using actual UI draw commands through a test adapter and approximate Pillow bitmap metrics over an earlier offline world background. Selected screens were visually inspected, including desktop/mobile titles, HUDs, bags, maps, shops, crop and guide panels. Every PNG is explicitly labelled OFFLINE UI STUDY / NOT A BROWSER CAPTURE. Seven sizes have separate Node geometry checks; these studies do not test browser renderer, input dispatch, touch devices or live origin storage.

Reproduction:
```sh
node scripts/qa/notebook-ui.mjs
python3 scripts/qa/notebook-ui.py # Python with Pillow
npm test
npm run build
```

The browser tool previously rejected the local URL. No alternative browser, CDP, OS automation or indirect route was used to bypass that policy. Interaction/browser compatibility acceptance remains pending. Historical browser scripts expect old controls and must be adapted before a future permitted run. No live save was accessed, publication or push performed.
