export const LOCATIONS = {
  home: { name: 'Home', subtitle: 'A quiet place to begin again', spawn: { x: 480, y: 400 }, bounds: [180, 135, 600, 355], obstacles: [[240, 180, 108, 140], [580, 174, 130, 55], [610, 340, 90, 65]], interactions: [{ type: 'bed', x: 295, y: 340, label: 'Rest at the bed' }, { type: 'travel', x: 480, y: 468, label: 'Step outside · Farm', to: 'farm', spawn: { x: 180, y: 270 } }] },
  farm: { name: 'Farm', subtitle: 'Small seeds. Good things ahead.', spawn: { x: 180, y: 270 }, bounds: [45, 90, 870, 405], obstacles: [[95, 110, 180, 120], [690, 345, 170, 112], [710, 115, 85, 90]], interactions: [{ type: 'travel', x: 180, y: 247, label: 'Go inside · Home', to: 'home', spawn: { x: 480, y: 420 } }, { type: 'travel', x: 865, y: 275, label: 'Take the lane · City', to: 'city', spawn: { x: 90, y: 290 } }] },
  city: { name: 'City', subtitle: 'The morning market welcomes you', spawn: { x: 90, y: 290 }, bounds: [45, 90, 870, 405], obstacles: [[270, 120, 180, 110], [560, 120, 180, 110], [695, 365, 140, 75]], interactions: [{ type: 'travel', x: 65, y: 290, label: 'Follow the lane · Farm', to: 'farm', spawn: { x: 820, y: 275 } }, { type: 'shop', x: 355, y: 250, label: 'Visit the seed shop' }, { type: 'sell', x: 650, y: 250, label: 'Visit the produce market' }] },
};
export function walkable(area, x, y, r = 12) {
  const map = LOCATIONS[area];
  if (!map || !Number.isFinite(x) || !Number.isFinite(y)) return false;
  const [bx, by, w, h] = map.bounds;
  return x >= bx+r && x <= bx+w-r && y >= by+r && y <= by+h-r && !map.obstacles.some(([ox,oy,ow,oh]) => x+r>ox && x-r<ox+ow && y+r>oy && y-r<oy+oh);
}
