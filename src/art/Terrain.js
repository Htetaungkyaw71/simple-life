import {MAP_SIZE} from '../data/mapLayouts.js';
import {waterRows} from '../data/water.js';
import {groundHash,paintGround,paintGroundDetails,shoreDistance,paintWater} from './groundSurface.js';
// Bake static ground once per location. Pixel-space masks give paths/ponds
// irregular, connected shores without thousands of individual display objects.
export function terrain(scene,area,map){
 const key='ground-'+area;if(area==='forest'&&scene.textures.exists(key)){scene.add.image(0,0,key).setOrigin(0).setScale(2).setDepth(-2);return;}if(scene.textures.exists(key))scene.textures.remove(key);
 const size=map.size||MAP_SIZE,texture=scene.textures.createCanvas(key,size.width/2,size.height/2),ctx=texture.context;
 ctx.imageSmoothingEnabled=false;
 const frame=name=>scene.textures.getFrame('town',name),source=scene.textures.get('town').getSourceImage();
 const stamp=(name,x,y)=>{const f=frame(name);ctx.drawImage(source,f.cutX,f.cutY,f.cutWidth,f.cutHeight,x,y,f.cutWidth,f.cutHeight);};
 const w=texture.width,h=texture.height,mask=new Uint8Array(w*h);
 for(const [rx,ry,rw,rh]of map.paths){
  const x0=rx/2,y0=ry/2,ww=rw/2,hh=rh/2;
  for(let y=Math.max(0,y0-4);y<Math.min(h,y0+hh+4);y++)for(let x=Math.max(0,x0-4);x<Math.min(w,x0+ww+4);x++){
   const cx=Math.max(x0+8,Math.min(x0+ww-8,x)),cy=Math.max(y0+8,Math.min(y0+hh-8,y));
   if(Math.hypot(x-cx,y-cy)<8+Math.sin(x*.14+y*.07)*2+Math.sin(y*.3)*1.5)mask[y*w+x]=1;
  }
 }
 const pixels=ctx.createImageData(w,h),fields=paintGround(pixels.data,w,h,map.biomes);
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++)if(mask[y*w+x]){
  const p=y*w+x,i=p*4,edge=!mask[(y-1)*w+x]||!mask[y*w+x-1]||!mask[(y+1)*w+x]||!mask[y*w+x+1];
  const variation=Math.floor((fields.small[p]-.5)*10)*2,grain=groundHash(Math.floor(x/3),Math.floor(y/2),771)%13===0?-5:0;
  const color=edge?[112,127,78]:[192,164,112];
  for(let c=0;c<3;c++)pixels.data[i+c]=color[c]+variation+grain;pixels.data[i+3]=255;
 }
 // Union surfaces before painting banks: no oval caps or seams along a river.
 const water=new Uint8Array(w*h);
 for(const [x,y,pw]of waterRows(map)){const yy=Math.floor(y/2);if(yy<0||yy>=h)continue;for(let xx=Math.max(0,x/2);xx<Math.min(w,(x+pw)/2);xx++)water[yy*w+xx]=1;}
 const distance=shoreDistance(water,w,h);paintWater(pixels.data,water,distance,w,h,fields);
 ctx.putImageData(pixels,0,0);paintGroundDetails(ctx,w,h,mask,water,distance,map.biomes);
 // Native licensed cliff faces, shallow stepped rims and a walkable stair gap.
 for(const t of map.terraces||[]){
  const x=t.x/2,y=t.y/2;const top=ctx.getImageData(x+2,y+2,t.w/2-4,t.h/2-14);for(let n=0;n<top.data.length;n+=4)for(let c=0;c<3;c++)top.data[n+c]=Math.min(255,top.data[n+c]+9);ctx.putImageData(top,x+2,y+2);
  for(let yy=0;yy<t.h/2-16;yy+=16){stamp('cliff-left',x, y+yy);stamp('cliff-right',x+t.w/2-16,y+yy);}
  for(let i=0;i<8;i++){if(i===3||i===4)continue;const off=[0,0,8,8,8,8,0,0][i];stamp('cliff-face',x+i*16,y+t.h/2-16-off);}
  stamp('cliff-stairs',x+48,y+t.h/2-24);
 }
 if(area==='city')scene.add.tileSprite(-1024,-1024,size.width+2048,size.height+2048,'town','grass0').setOrigin(0).setTileScale(2).setDepth(-3);
 texture.refresh();scene.add.image(0,0,key).setOrigin(0).setScale(2).setDepth(-2);
}
