import {visiblePlots} from '../systems/expansion.js';
import {plotAt} from '../systems/plots.js';
import {wetAt} from '../systems/farmGround.js';
import {CROPS} from '../data/crops.js';
import {cropVisual,missed,waterPeriod} from '../systems/watering.js';
import {pixels} from '../ui/statusArt.js';
// Original connected native soil, with turf only on exposed sides. Bits N/E/S/W.
export function soilPixels(mask,wet=false){
 const data=new Uint8ClampedArray(24*24*4),base=wet?[79,48,36]:[132,70,47];
 for(let y=0;y<24;y++)for(let x=0;x<24;x++){
  const n=(x*17+y*29+x*y*3)%53,i=(y*24+x)*4;
  const top=!(mask&1)&&y<(x*7%3+1),right=!(mask&2)&&x>22-y*3%2,bottom=!(mask&4)&&y>22-x*5%2,left=!(mask&8)&&x<y*5%3+1;
  const color=top||left?[102,115,61]:right||bottom?[63,77,41]:base;
  const grain=top||left||right||bottom?0:n<4?5:n>49?-6:0;
  data.set([...color.map(c=>c+grain),255],i);
 }
 return data;
}
export function bedMask(b,beds){return [[0,-48,1],[48,0,2],[0,48,4],[-48,0,8]].reduce((m,[dx,dy,bit])=>m|(beds.some(p=>p.x===b.x+dx&&p.y===b.y+dy)?bit:0),0);}
export function cropMarker(p,s){if(!p?.crop)return null;if(missed(p))return 'warning';if(p.growth>=CROPS[p.crop].growthDays)return 'basket';const period=waterPeriod(s);return period&&!p[period]?'drop':null;}
function soilTexture(scene,mask,wet){const key='farm-soil-'+mask+'-'+Number(wet);if(!scene.textures.exists(key)){const t=scene.textures.createCanvas(key,24,24),d=t.context.createImageData(24,24);d.data.set(soilPixels(mask,wet));t.context.putImageData(d,0,0);t.setFilter(1);t.refresh();}return key;}
export function drawFarmBeds(scene,group){
 group.clear(true,true);const s=scene.app.state||{minute:360,plots:[],farms:[{fields:[true,false,false,false]}]},beds=visiblePlots(s);
 for(const b of beds){
  const p=plotAt(s,b.index),wet=wetAt(s,b.x,b.y);
  group.add(scene.add.image(b.x-24,b.y-24,soilTexture(scene,bedMask(b,beds),wet)).setOrigin(0).setScale(2).setDepth(2));
  if(!p?.crop)continue;
  group.add(scene.add.image(b.x,b.y+20,'town',CROPS[p.crop].sprites[cropVisual(p,s)]).setOrigin(.5,1).setScale(2).setDepth(b.y+20));
  const mark=cropMarker(p,s);if(mark){const g=scene.add.graphics().setPosition(b.x-14,b.y-54).setScale(2).setDepth(b.y+22);g.fillStyle(0x4e4936).fillRect(0,0,14,16).fillRect(5,16,4,2);g.fillStyle(0xf3eccf).fillRect(1,1,12,14).fillRect(6,15,2,2);if(mark==='warning')g.fillStyle(0xbd5040).fillRect(6,3,2,7).fillRect(6,12,2,2);else pixels(g,mark,3,3,mark==='drop'?0x608596:0x76874d);if(mark==='drop'){g.fillStyle(0xc0d2c2).fillRect(5,8,1,3);}group.add(g);}
 }
}
export function drawWetGround(scene,group){
 group.clear(true,true);const s=scene.app.state,beds=s.area==='farm'?visiblePlots(s):[];
 for(const p of s.wetGround||[]){if(p.area!==s.area||s.area==='farm'&&p.farm!==(s.currentFarm||0)||beds.some(b=>b.x===p.x&&b.y===p.y))continue;
  const g=scene.add.graphics().setPosition(p.x-24,p.y-24).setDepth(1);g.fillStyle(0x403e2e,.5);g.fillRect(6,2,36,44).fillRect(2,6,44,36);g.fillStyle(0x729097,.32);for(let i=0;i<5;i++)g.fillRect(8+i*7,10+(i*11)%27,4,2);group.add(g);
 }
}
