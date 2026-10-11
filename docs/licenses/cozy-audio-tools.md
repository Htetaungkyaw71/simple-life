# Optional cozy-audio processing tools — 2026-10-11

Runtime dependencies remain pinned Phaser 3.90.0 and Vite 6.4.3 with their existing local licence evidence. No new runtime audio dependency.

Optional import/audit uses the configured bundled Python/NumPy and Homebrew FFmpeg 8.0 (`/opt/homebrew/bin/ffmpeg`). Exact FFmpeg copyright/version/compile configuration: ../assets/licenses/cozy-audio/ffmpeg-version.txt. It is an offline conversion tool; no executable/library is included in dist. Build consumes committed selected PCM WAVs and requires neither tool nor user ZIPs. Selected sound rights are separate: ../assets/licenses/cozy-audio/SOURCE_RECORD.md. Existing bundled Python/NumPy are also used by the original source-audio audit; no package was installed or dependency lock changed beyond project version.
