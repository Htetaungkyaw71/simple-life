# Fountain animation build-tool dependencies

The animation was produced with the read-only bundled Codex workspace runtime; no package was installed and no dependency was added to `package.json` or the production build.

- Python 3.12.14
- Pillow 12.3.0 — installed metadata license expression: `MIT-CMU`
- NumPy 2.3.5 — installed metadata license: BSD-3-Clause, with its wheel's bundled-library notices retained in the installed distribution

These tools are used only to generate review PNG/GIF files locally. The browser game does not import or ship Python, Pillow or NumPy.
