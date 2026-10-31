# Built-in image-generation extraction prompt — rejected production attempt

Use case: background-extraction  
Asset type: production pixel-art NPC sprite sheet for a Phaser game  
Input image: the attached seed seller 3×6 sprite sheet is the edit target.  
Primary request: remove only the flat bright-magenta (`#FF00FF`) background and replace it with genuine full transparency.  
Constraints: preserve the entire 1200×720 canvas; preserve the exact perfectly even 3-row × 6-column layout; preserve every character pixel, pose, color, outline, accessory, spacing, baseline, and crisp hard pixel edge exactly; do not redraw, restyle, rescale, move, crop, blur, antialias, recolor, or regenerate any character content; no shadow, grid, text, watermark, or added pixels. The only permitted change is `#FF00FF` background pixels becoming alpha 0.

The built-in result was 1619×971 and therefore failed the exact-canvas invariant. It is retained as rejected evidence only and is not a runtime source.
