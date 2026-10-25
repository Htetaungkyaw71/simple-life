import {MAPS} from '../data/mapLayouts.js';
import {areaDecorations,decorationRect} from '../systems/settlementGeometry.js';
export const lampNightStrength=light=>Math.max(0,Math.min(1,(light.alpha-.12)/.40));
export const lampGlassPixel=(r,g,b,a)=>a>0&&r>=160&&g>=145&&b>=100&&r-g<=45&&g-b>=18&&r-b>=35;
// Lighting is a separate nighttime layer. Approved daytime PNGs remain unchanged.
export class CityLights{
 constructor(scene,area){
  this.scene=scene;const props=(MAPS[area]?.props||[]).filter(p=>['lamp','city-lamp'].includes(p.name)).map(p=>({...p,frame:p.name==='city-lamp'?'cedar-city-lamp':'cedar-lamp'}));
  for(const d of areaDecorations(scene.app.state,area).filter(d=>d.type==='lantern'))props.push({...decorationRect(d),frame:'cedar-lamp'});
  this.lamps=props.map(p=>{
   const f=scene.textures.getFrame('town',p.frame),key='lamp-emission-'+p.frame;
   if(!scene.textures.exists(key)){
    const t=scene.textures.createCanvas(key,f.width,f.height),ctx=t.context;ctx.imageSmoothingEnabled=false;ctx.drawImage(f.source.image,f.cutX,f.cutY,f.cutWidth,f.cutHeight,0,0,f.width,f.height);
    const pixels=ctx.getImageData(0,0,f.width,f.height);
    for(let y=0;y<f.height;y++)for(let x=0;x<f.width;x++){const i=(y*f.width+x)*4,glass=y<f.height*.4&&lampGlassPixel(...pixels.data.subarray(i,i+4));pixels.data.set(glass?[255,218,143,255]:[0,0,0,0],i);}
    ctx.putImageData(pixels,0,0);t.setFilter(1);t.refresh();
   }
   return {...p,w:f.width,h:f.height,emission:scene.add.image(p.x,p.y,key).setOrigin(0).setDepth(10002).setAlpha(0)};
  });
  this.g=this.lamps.length?scene.add.graphics().setDepth(10001):null;
 }
 update(light){
  if(!this.g)return;const strength=lampNightStrength(light);this.g.clear();for(const p of this.lamps)p.emission.setAlpha(strength*.95);if(!strength)return;
  for(const p of this.lamps){const x=Math.round(p.x+p.w/2),head=Math.round((p.y+p.h*.19)/2)*2,foot=Math.round(p.y+p.h-4);
   this.g.fillStyle(0xf1bd72,.035*strength).fillRect(x-24,head-14,48,28).fillRect(x-18,head-20,36,40);
   this.g.fillStyle(0xf4cf8c,.07*strength).fillRect(x-12,head-10,24,20);
   this.g.fillStyle(0xeab878,.055*strength).fillRect(x-44,foot-12,88,24).fillRect(x-32,foot-20,64,40);
  }
 }
}
