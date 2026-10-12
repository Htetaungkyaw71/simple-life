import {visiblePlots} from '../systems/expansion.js';
import {plotAt} from '../systems/plots.js';
import {wetAt} from '../systems/farmGround.js';
import {CROPS} from '../data/crops.js';
import {cropVisual,missed,wateredToday} from '../systems/watering.js';
import {pixels} from '../ui/statusArt.js';
const hash=(x,y)=>{let n=Math.imul(x,374761393)^Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;};
function soilNoise(x,y,size){const gx=Math.floor(x/size),gy=Math.floor(y/size),fx=x/size-gx,fy=y/size-gy,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);const a=hash(gx,gy)*(1-sx)+hash(gx+1,gy)*sx,b=hash(gx,gy+1)*(1-sx)+hash(gx+1,gy+1)*sx;return a*(1-sy)+b*sy;}
const fringe=u=>3+Math.floor((Math.sin(u/5)+Math.sin(u/13)+2)*1.3);
// World-coordinate soil patches cross cell boundaries; only exposed edges have turf.
// Bits N/E/S/W. Transparent corners let the real grass show through.
export function soilPixels(mask,wet=false,ox=0,oy=0){
 const data=new Uint8ClampedArray(24*24*4);
 for(let y=0;y<24;y++)for(let x=0;x<24;x++){
  const gx=ox+x,gy=oy+y,i=(y*24+x)*4,n=hash(gx,gy);
  let edge=100;
  if(!(mask&1))edge=Math.min(edge,y-fringe(gx));if(!(mask&2))edge=Math.min(edge,23-x-fringe(gy));
  if(!(mask&4))edge=Math.min(edge,23-y-fringe(gx+19));if(!(mask&8))edge=Math.min(edge,x-fringe(gy+11));
  // Round each exposed corner instead of ending with a right angle.
  for(const [cx,cy,bits]of [[6,6,9],[17,6,3],[6,17,12],[17,17,6]])if(!(mask&bits)&&(cx===6?x<6:x>17)&&(cy===6?y<6:y>17))edge=Math.min(edge,6-Math.hypot(x-cx,y-cy)-2);
  if(edge<-2)continue;
  let color;
  if(edge<0)color=edge<-1?[122,135,76]:[139,151,84];
  else {
   const patch=soilNoise(gx,gy,19),mottle=soilNoise(gx+81,gy-17,7),grain=n<.04?10:n>.96?-11:0;
   const dark=mottle<.32?-13:0;color=[117+Math.round(patch*35),59+Math.round(patch*23),42+Math.round(patch*13)].map(c=>c+grain+dark);
   if(edge<1)color=n<.55?[128,140,76]:[115,84,51];else if(edge<2&&n<.4)color=[135,146,81];
   if(n>.993)color=[174,130,83];
   if(wet)color=color.map((c,j)=>Math.round(c*(j===2?.73:.62)));
  }
  data.set([...color,255],i);
 }
 return data;
}
export function bedMask(b,beds){return [[0,-48,1],[48,0,2],[0,48,4],[-48,0,8]].reduce((m,[dx,dy,bit])=>m|(beds.some(p=>p.x===b.x+dx&&p.y===b.y+dy)?bit:0),0);}
export function cropMarker(p,s){if(!p?.crop)return null;if(missed(p)>=4)return 'warning';if(p.growth>=CROPS[p.crop].growthDays)return 'basket';if(missed(p)>=3)return 'warning';return !wateredToday(s,p)?'drop':null;}
function soilTexture(scene,mask,wet,b){const ox=b.x/2-12,oy=b.y/2-12,key='farm-soil-'+mask+'-'+Number(wet)+'-'+ox+'-'+oy;if(!scene.textures.exists(key)){const t=scene.textures.createCanvas(key,24,24),d=t.context.createImageData(24,24);d.data.set(soilPixels(mask,wet,ox,oy));t.context.putImageData(d,0,0);t.setFilter(1);t.refresh();}return key;}
export function drawFarmBeds(scene,group){
 group.clear(true,true);const s=scene.app.state||{minute:360,plots:[],farms:[{fields:[true,false,false,false]}]},beds=visiblePlots(s);
 for(const b of beds){
  const p=plotAt(s,b.index),wet=wetAt(s,b.x,b.y);
  group.add(scene.add.image(b.x-24,b.y-24,soilTexture(scene,bedMask(b,beds),wet,b)).setOrigin(0).setScale(2).setDepth(2));
  if(!p?.crop)continue;
  const plant=scene.add.image(b.x,b.y+20,'town',CROPS[p.crop].sprites[cropVisual(p,s)]).setOrigin(.5,1).setScale(2).setDepth(b.y+20);group.add(plant);
  if(p.growth>=CROPS[p.crop].growthDays&&missed(p)<4&&scene.tweens){const bob=scene.tweens.add({targets:plant,y:plant.y-2,duration:700,yoyo:true,repeat:-1});plant.once('destroy',()=>bob.remove());}
  const mark=cropMarker(p,s);if(mark){const g=scene.add.graphics().setPosition(b.x-14,b.y-54).setScale(2).setDepth(b.y+22);g.fillStyle(0x4e4936).fillRect(0,0,14,16).fillRect(5,16,4,2);g.fillStyle(0xf3eccf).fillRect(1,1,12,14).fillRect(6,15,2,2);if(mark==='warning')g.fillStyle(0xbd5040).fillRect(6,3,2,7).fillRect(6,12,2,2);else pixels(g,mark,3,3,mark==='drop'?0x608596:0x76874d);if(mark==='drop'){g.fillStyle(0xc0d2c2).fillRect(5,8,1,3);}group.add(g);}
 }
}
export function drawWetGround(scene,group){
 group.clear(true,true);const s=scene.app.state,beds=s.area==='farm'?visiblePlots(s):[];
 for(const p of s.wetGround||[]){if(p.area!==s.area||s.area==='farm'&&p.farm!==(s.currentFarm||0)||beds.some(b=>b.x===p.x&&b.y===p.y))continue;
  const g=scene.add.graphics().setPosition(p.x-24,p.y-24).setDepth(1);g.fillStyle(0x403e2e,.5);g.fillRect(6,2,36,44).fillRect(2,6,44,36);g.fillStyle(0x729097,.32);for(let i=0;i<5;i++)g.fillRect(8+i*7,10+(i*11)%27,4,2);group.add(g);
 }
}
