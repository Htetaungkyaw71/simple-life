# Forest theme and bridge verification — v0.4.6 / schema 9

Baseline: 2360629 (v0.4.5). Final **99/99 npm tests**, `npm run build`, syntax checks and `git diff --check` pass. Logs: tests.txt / build.txt. Three new tests validate shared olive foliage versus retained bark/fruit/neutral snow, every bridge's full bank coverage/dry endpoints/collision-safe path, and complete nonoverlapping merged night bands. Updated earlier terrace assertions verify full removal and retained jumping/grounded-save rules. Farming/City/time/survival/cache/routes/migrations remain covered by the retained suite.

Browser QA uses CUA native actions in an agent-created in-app Chromium tab at **127.0.0.1:4176**, separate from the user's 4175 save. The existing test-only fixture server initializes explicit disposable saves; canvas DOM attributes provide copied read-only state. No gameplay mutation hook is called during interactions. The test server/exporter and evidence are excluded from production.

Affected flows:
- Desktop **1280×720 Canvas day** bridge has an opaque horizontal deck meeting both banks, rails and native planks; grass/teal ferns/artificial raised earth assemblies are absent from the deck/scene. Mixed forest tree silhouettes render in the shared olive palette (bridge-day.jpg / river-olive.jpg).
- **WebGL night** bridge retains established nearby illumination/distant darkness with no transparency cell grid across its planks (bridge-night-webgl.jpg). Pure band test checks coverage and retained near/far alpha values.
- **390×844 portrait** native directional controls walk from (2220,1744) → (2458.363,1744) → (2666.464,1744), crossing the entire deck onto the opposite bank. Wading stays false at the start/middle/end. UI controls fit; bridge-portrait.jpg records the deck.
- Pause freezes the clock. Native Save → reload without a fixture → Continue restores (2666.464,1744), and every reported forest canopy uses a cached forest-foliage texture. Native JUMP still starts an arc; portrait-jump.jpg. Jump/landing/collision/interruption/grounded-flight-save contracts also pass in pure tests.
- River fixture remains wet/walkable, with small scattered reflection clusters. Two screenshots of the same water-only crop change while lighting stays at zero alpha, confirming actual wave animation. After pausing, the crop and clock stay unchanged across separate tool calls. Results are recorded in results.json.
- Observed browser warnings/errors are empty. Temporary viewport override reset, temporary QA tab/server closed; user tab/save untouched.

Asset/build audit: all **eight allowlisted art files are byte-identical to baseline 2360629**, including both farmer sheets and the 555-cell atlas. Palette variants are cached native local Canvas textures from retained licensed/original cells; no art-file rewrite, runtime remote asset, backend, new dependency or source archive. **12 production files / 2,031,148 bytes**; build-audit.json includes hashes. Creation/adaptation record: ../../assets/licenses/forest-theme.md.

Reproduction:
```sh
npm test
npm run build
node tests/browser/forest-shore-server.mjs
# Disposable browser: http://127.0.0.1:4176/?qa&fixture=bridge
# Continue; inspect deck. Append &night&renderer=webgl for night rendering.
# fixture=bridgeApproach starts left of the bridge for real directional traversal.
# fixture=river shows natural shores, recoloured trees and wave clusters.
# Navigate to ?qa without a fixture to preserve the QA save during reload checks.
```

Checks use prepared starting saves and native pointer actions, not a complete new farming playthrough or physical touch device. Other engines/phones, long-term performance/balance and final human acceptance remain unverified. No publish/push/competition submission.
