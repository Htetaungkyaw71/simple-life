import {MAP_SIZE,pondInset} from '../data/mapLayouts.js';
// Bake static ground once per location. Pixel-space masks give paths/ponds
// irregular, connected shores without thousands of individual display objects.
export function terrain(scene,area,map){
 const key='ground-'+area;if(area==='forest'&&scene.textures.exists(key)){scene.add.image(0,0,key).setOrigin(0).setScale(2).setDepth(-2);return;}if(scene.textures.exists(key))scene.textures.remove(key);
 const size=map.size||MAP_SIZE,texture=scene.textures.createCanvas(key,size.width/2,size.height/2),ctx=texture.context;
 ctx.imageSmoothingEnabled=false;
 const frame=name=>scene.textures.getFrame('town',name),source=scene.textures.get('town').getSourceImage();
 const stamp=(name,x,y)=>{const f=frame(name);ctx.drawImage(source,f.cutX,f.cutY,f.cutWidth,f.cutHeight,x,y,f.cutWidth,f.cutHeight);};
 for(let y=0;y<size.height/2;y+=16)for(let x=0;x<size.width/2;x+=16)stamp('grass'+((x*7+y*13)%4),x,y);
 const dirt=ctx.createImageData(16,16),scratch=document.createElement('canvas');scratch.width=scratch.height=16;const sc=scratch.getContext('2d');const f=frame('path');sc.drawImage(source,f.cutX,f.cutY,16,16,0,0,16,16);dirt.data.set(sc.getImageData(0,0,16,16).data);
 for(const r of map.biomes||[])if(r.biome==='stone'){ctx.fillStyle='#667674';ctx.fillRect((r.x+144)/2,(r.y+112)/2,152,136);ctx.fillStyle='#83938c';for(let n=0;n<24;n++)ctx.fillRect((r.x+168+(n*53)%240)/2,(r.y+136+(n*67)%200)/2,8,2);}
 const w=texture.width,h=texture.height,mask=new Uint8Array(w*h);
 for(const [rx,ry,rw,rh]of map.paths){
  const x0=rx/2,y0=ry/2,ww=rw/2,hh=rh/2;
  for(let y=Math.max(0,y0-4);y<Math.min(h,y0+hh+4);y++)for(let x=Math.max(0,x0-4);x<Math.min(w,x0+ww+4);x++){
   const cx=Math.max(x0+8,Math.min(x0+ww-8,x)),cy=Math.max(y0+8,Math.min(y0+hh-8,y));
   if(Math.hypot(x-cx,y-cy)<8+Math.sin(x*.14+y*.07)*2+Math.sin(y*.3)*1.5)mask[y*w+x]=1;
  }
 }
 const pixels=ctx.getImageData(0,0,w,h);
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)if(mask[y*w+x]){
  const i=(y*w+x)*4,j=((y%16)*16+x%16)*4,edge=!mask[(y-1)*w+x]||!mask[y*w+x-1]||!mask[(y+1)*w+x]||!mask[y*w+x+1];
  for(let c=0;c<3;c++)pixels.data[i+c]=edge?[135,158,91][c]:dirt.data[j+c];pixels.data[i+3]=255;
 }
 // Quiet regional palettes preserve source detail while changing the habitat.
 const palettes={snow:[188,210,204],savanna:[170,168,104],stone:[133,145,128],jungle:[76,146,104],bamboo:[101,160,99],pine:[90,138,120],marsh:[107,152,118],highland:[135,163,139]};
 for(const r of map.biomes||[]){const color=palettes[r.biome];if(!color)continue;for(let y=r.y/2;y<(r.y+r.h)/2;y++)for(let x=r.x/2;x<(r.x+r.w)/2;x++){if(mask[y*w+x])continue;const i=(y*w+x)*4,t=.75;for(let c=0;c<3;c++)pixels.data[i+c]=Math.round(pixels.data[i+c]*(1-t)+color[c]*t);}}
 ctx.putImageData(pixels,0,0);
 for(const [x,y,pw,ph]of map.water){
  for(let yy=0;yy<ph/2;yy++){
   const inset=Math.round(pondInset(yy*2,ph,pw)/2),left=x/2+inset,right=(x+pw)/2-inset;
   ctx.fillStyle='#c5b77d';ctx.fillRect(left-3,y/2+yy,right-left+6,1);
   ctx.fillStyle=yy<ph/2-4?'#70c7ce':'#347aa2';ctx.fillRect(left,y/2+yy,right-left,1);
   if(yy>3&&yy<ph/2-6){ctx.fillStyle='#4d9fc5';ctx.fillRect(left+3,y/2+yy,right-left-6,1);}
  }
 }
 if(area==='city')scene.add.tileSprite(-1024,-1024,size.width+2048,size.height+2048,'town','grass0').setOrigin(0).setTileScale(2).setDepth(-3);
 texture.refresh();scene.add.image(0,0,key).setOrigin(0).setScale(2).setDepth(-2);
}
