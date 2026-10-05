// Terrain uses two world units per source pixel. Keep display pixels integral.
export function displayZoom(width, height) {
  return (height < 600 || width < 600 ? 2 : 3) / 2;
}
