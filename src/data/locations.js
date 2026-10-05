import {MAPS,MAP_SIZE} from './mapLayouts.js';
export const LOCATIONS = {
  home: { name: 'Home', subtitle: 'The shade garden', spawn: { x: 480, y: 400 }, interactions: [{ type: 'bed', x: 295, y: 280, label: 'Rest at the bed' }, { type: 'travel', x: 880, y: 640, label: 'Farm gate', to: 'farm', spawn: { x: 180, y: 270 } }] },
  farm: { name: 'Farm', subtitle: 'Four fields, one beginning', spawn: { x: 180, y: 270 }, interactions: [{ type: 'travel', x: 180, y: 247, label: 'Home lane', to: 'home', spawn: { x: 880, y: 640 } }, { type: 'travel', x: 865, y: 275, label: 'City lane', to: 'city', spawn: { x: 90, y: 290 } }] },
  city: { name: 'City', subtitle: 'Lantern Square', spawn: { x: 90, y: 290 }, interactions: [{ type: 'travel', x: 65, y: 290, label: 'Farm road', to: 'farm', spawn: { x: 820, y: 275 } }, { type: 'shop', x: 355, y: 250, label: 'Seed shop' }, { type: 'sell', x: 650, y: 250, label: 'Produce market' }] },
};
for(const [area,location]of Object.entries(LOCATIONS)){
 location.bounds=[32,32,MAP_SIZE.width-64,MAP_SIZE.height-64];location.obstacles=MAPS[area].obstacles;
 location.interactions.push(...MAPS[area].signs.map(p=>({...p,type:'dialog'})),...(MAPS[area].npcs||[]).map(p=>({...p,type:'dialog',title:p.name,label:'Talk to '+p.name})));
}
export function walkable(area, x, y, r = 12) {
 const map=LOCATIONS[area];if(!map||!Number.isFinite(x)||!Number.isFinite(y))return false;
 const [bx,by,w,h]=map.bounds;
 return x>=bx+r&&x<=bx+w-r&&y>=by+r&&y<=by+h-r&&!map.obstacles.some(([ox,oy,ow,oh])=>x+r>ox&&x-r<ox+ow&&y+r>oy&&y-r<oy+oh);
}
