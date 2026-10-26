# Item-icon runtime processing dependencies

The deterministic runtime import used the Codex bundled Python 3.12 runtime and Pillow 12.3.0. Pillow's retained licence text is `docs/licenses/Pillow-LICENSE.txt`. The browser verification used the existing bundled Playwright runtime with the installed local Google Chrome.

These are development tools only. No package was added to `package.json`, and the browser game requires no Python, Playwright, remote request or new runtime dependency. The integration consumes only the committed local atlas and metadata.
