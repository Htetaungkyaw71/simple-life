# User-supplied fountain island — runtime source record

Date: 2026-10-21

Status: active City runtime art.

## Provenance

- Flowing source: `/Users/mac/Downloads/ChatGPT Image 20 Oct 2026, 20_53_33-pixel-snapper.png`
- Flowing source SHA-256: `a7e8a7b6651d390709f243ae02166b6cb4d5e0084dfbdc12d2d916242b8676cf`
- Calm source: `/Users/mac/Downloads/ChatGPT Image 20 Oct 2026, 20_53_49-pixel-snapper.png`
- Calm source SHA-256: `15191883dcbde241140c8c02e9f8ec382514c8bf7579b5d87b8214db0c5007bc`
- Creator/provenance supplied by the user: ChatGPT image-generation output.
- User explicitly requested that these images be added to the game.

The original files are retained byte-for-byte in this evidence folder. Their
magenta backgrounds are treated as transparency. No third-party asset pack or
remote runtime asset is involved.

## Initial deterministic processing (animation superseded)

`scripts/import_user_fountain_island.py` uses Pillow and numpy to remove the
magenta background and built the initial four-frame, 6-fps water-only sheet. The flowing
source owns all visible runtime object pixels. The calm source is retained as
evidence but is not mixed into the loop because its whole-object colour and
geometry differences produced distracting full-island flicker.

That historical loop allowed only teal/blue water pixels inside the basin to change. The pale
stream bodies stay continuously visible while short highlights descend, and
four tiny landing-ripple dashes alternate with the stream phase. The wider
basin is static: there is no random shimmer, dark wake, expanding ring or
abrupt reset. Every non-water pixel is byte-identical across all four frames;
there are no new dark or black stream colours.

The runtime sprite is displayed at exactly 1.35 scale and centered at world
coordinate `(704, 420)` in the City's main road plaza. Nine stepped collision
rows follow the visible island silhouette while leaving its transparent canvas
corners walkable.

## Superseded output

| File | Dimensions | SHA-256 |
| --- | --- | --- |
| Historical four-frame sheet | 828×214 (4 × 207×214) | `e99c5e085574afea45b4e436aa7a9e71ae610696bd02dc2aae1f14fca8d74d11` |

Machine-readable dimensions, bounds, changed-pixel counts and source hashes
for that initial import are recorded in `import-report.json`; its eligible
pixels are shown in `water-mask.png`. The current eight-frame runtime animation
is recorded separately in `../fountain-island-water-v4/SOURCE_RECORD.md`. This
user-supplied, AI-generated image is not represented as
hand-drawn, exclusive, or independently licensed by the project. Final
competition eligibility and rights acceptance remain the human team's
responsibility.
