import {visiblePlots} from '../systems/expansion.js';
import {plotAt} from '../systems/plots.js';
import {wetAt} from '../systems/farmGround.js';
import {CROPS} from '../data/crops.js';
import {cropVisual,missed,wateredToday} from '../systems/watering.js';
import {pixels} from '../ui/statusArt.js';
const hash=(x,y)=>{let n=Math.imul(x,374761393)^Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;};
function soilNoise(x,y,size){const gx=Math.floor(x/size),gy=Math.floor(y/size),fx=x/size-gx,fy=y/size-gy,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);const a=hash(gx,gy)*(1-sx)+hash(gx+1,gy)*sx,b=hash(gx,gy+1)*(1-sx)+hash(gx+1,gy+1)*sx;return a*(1-sy)+b*sy;}
// A shallow, stepped turf edge gives connected fields a clear planting boundary.
const fringe=u=>1+Math.floor((Math.sin(u/9)+Math.sin(u/19)+2)*.38);
// World-coordinate soil patches cross cell boundaries; only exposed edges have turf.
// Bits N/E/S/W. Transparent corners let the real grass show through.
export function soilPixels(mask,wet=false,ox=0,oy=0,wetNeighbours=15){
 const data=new Uint8ClampedArray(24*24*4);
 for(let y=0;y<24;y++)for(let x=0;x<24;x++){
  const gx=ox+x,gy=oy+y,i=(y*24+x)*4,n=hash(gx,gy);
  let edge=100;
  if(!(mask&1))edge=Math.min(edge,y-fringe(gx));if(!(mask&2))edge=Math.min(edge,23-x-fringe(gy));
  if(!(mask&4))edge=Math.min(edge,23-y-fringe(gx+19));if(!(mask&8))edge=Math.min(edge,x-fringe(gy+11));
  // Round each exposed corner instead of ending with a right angle.
  for(const [cx,cy,bits]of [[3,3,9],[20,3,3],[3,20,12],[20,20,6]])if(!(mask&bits)&&(cx===3?x<3:x>20)&&(cy===3?y<3:y>20))edge=Math.min(edge,3-Math.hypot(x-cx,y-cy)-2);
  if(edge<-2)continue;
  let color;
  if(edge<0)color=edge<-1?[122,135,76]:[139,151,84];
  else {
   const patch=soilNoise(gx,gy,24),mottle=soilNoise(gx+81,gy-17,11),grain=n<.008?4:n>.994?-5:0;
   const dark=mottle<.3?-8:0;color=[134+Math.round(patch*30),65+Math.round(patch*20),41+Math.round(patch*12)].map(c=>c+grain+dark);
   if(wet){
    // Fade only against dry neighbours. Joined watered cells share one material.
    const joined=wetNeighbours|(~mask&15);let distance=100;
    if(!(joined&1))distance=Math.min(distance,y);if(!(joined&2))distance=Math.min(distance,23-x);
    if(!(joined&4))distance=Math.min(distance,23-y);if(!(joined&8))distance=Math.min(distance,x);
    const damp=Math.max(0,Math.min(1,(distance-1+soilNoise(gx+31,gy-47,5)*2)/4));
    color=color.map((c,j)=>Math.round(c*(1-damp+damp*[.69,.76,.8][j])));
   }
   if(edge<1)color=n<.55?[128,140,76]:[104,76,43];
  }
  data.set([...color,255],i);
 }
 return data;
}
export function bedMask(b,beds){return [[0,-48,1],[48,0,2],[0,48,4],[-48,0,8]].reduce((m,[dx,dy,bit])=>m|(beds.some(p=>p.x===b.x+dx&&p.y===b.y+dy)?bit:0),0);}
export function cropMarker(p,s){if(!p?.crop)return null;if(missed(p)>=4)return 'warning';if(p.growth>=CROPS[p.crop].growthDays)return 'basket';if(missed(p)>=3)return 'warning';return !wateredToday(s,p)?'drop':null;}
function soilTexture(scene,mask,wet,b,wetNeighbours){const ox=b.x/2-12,oy=b.y/2-12,key='farm-soil-'+mask+'-'+Number(wet)+'-'+wetNeighbours+'-'+ox+'-'+oy;if(!scene.textures.exists(key)){const t=scene.textures.createCanvas(key,24,24),d=t.context.createImageData(24,24);d.data.set(soilPixels(mask,wet,ox,oy,wetNeighbours));t.context.putImageData(d,0,0);t.setFilter(1);t.refresh();}return key;}
export function drawFarmBeds(scene,group){
 group.clear(true,true);const s=scene.app.state||{minute:360,plots:[],farms:[{fields:[true,false,false,false]}]},beds=visiblePlots(s),watered=beds.filter(b=>wetAt(s,b.x,b.y)),wetKeys=new Set(watered.map(b=>b.x+','+b.y));
 for(const b of beds){
  const p=plotAt(s,b.index),wet=wetKeys.has(b.x+','+b.y);
  group.add(scene.add.image(b.x-24,b.y-24,soilTexture(scene,bedMask(b,beds),wet,b,wet?bedMask(b,watered):0)).setOrigin(0).setScale(2).setDepth(2));
  if(!p?.crop)continue;
  const definition=CROPS[p.crop];
  const plantBaseY=b.y+definition.baseOffsetY;
  const plant=scene.add.image(b.x,plantBaseY,'town',definition.sprites[cropVisual(p,s)]);plant.setOrigin(definition.anchorX==null ? .5 : definition.anchorX/plant.frame.width,1).setScale(definition.visualScale).setDepth(plantBaseY);group.add(plant);
  if(p.growth>=CROPS[p.crop].growthDays&&missed(p)<4&&scene.tweens){const bob=scene.tweens.add({targets:plant,y:plant.y-2,duration:700,yoyo:true,repeat:-1});plant.once('destroy',()=>bob.remove());}
  const mark=cropMarker(p,s);if(mark){const g=scene.add.graphics().setPosition(b.x-14,b.y+definition.signOffsetY).setScale(2).setDepth(plantBaseY+50);g.fillStyle(0x4e4936).fillRect(0,0,14,16).fillRect(5,16,4,2);g.fillStyle(0xf3eccf).fillRect(1,1,12,14).fillRect(6,15,2,2);if(mark==='warning')g.fillStyle(0xbd5040).fillRect(6,3,2,7).fillRect(6,12,2,2);else pixels(g,mark,3,3,mark==='drop'?0x608596:0x76874d);if(mark==='drop'){g.fillStyle(0xc0d2c2).fillRect(5,8,1,3);}group.add(g);}
 }
}
export function drawWetGround(scene,group){
 group.clear(true,true);const s=scene.app.state,beds=s.area==='farm'?visiblePlots(s):[];
 for(const p of s.wetGround||[]){if(p.area!==s.area||s.area==='farm'&&p.farm!==(s.currentFarm||0)||beds.some(b=>b.x===p.x&&b.y===p.y))continue;
  const g=scene.add.graphics().setPosition(p.x-24,p.y-24).setDepth(1);g.fillStyle(0x403e2e,.5);g.fillRect(6,2,36,44).fillRect(2,6,44,36);g.fillStyle(0x729097,.32);for(let i=0;i<5;i++)g.fillRect(8+i*7,10+(i*11)%27,4,2);group.add(g);
 }
}
