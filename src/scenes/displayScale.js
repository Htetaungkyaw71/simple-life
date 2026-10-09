// Closer three-quarter framing; integer source pixels (3px desktop / 2px compact).
export function displayZoom(width,height) { return width>=1000&&height>=640?1.5:1; }
