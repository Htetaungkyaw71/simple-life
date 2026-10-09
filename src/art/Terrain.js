import {forestTexture} from './forestPalette.js';
import {habitatColor} from '../data/forestHabitats.js';
import {paintCity} from './citySurface.js';
import {terrainTiles} from './terrainTiles.js';
import {MAP_SIZE} from '../data/mapLayouts.js';
import {waterRows} from '../data/water.js';
import {groundHash,paintGround,paintGroundDetails,shoreDistance,paintWater} from './groundSurface.js';
// Bake static ground once per location. Pixel-space masks give paths/ponds
// irregular, connected shores without thousands of individual display objects.
export function terrain(scene,area,map){
 const size=map.size||MAP_SIZE,key='ground-'+area,tiles=area==='forest'?terrainTiles(size):[];
 const showTiles=()=>{for(const t of tiles)scene.add.image(t.x*2,t.y*2,t.key).setOrigin(0).setScale(2).setDepth(-2);};
 if(tiles.length&&tiles.every(t=>scene.textures.exists(t.key))){showTiles();return;}
 if(scene.textures.exists(key))scene.textures.remove(key);
 // Bake coherent materials before slicing; tile edges share exactly the same
 // world-space noise/water distances. Only small tiles enter the GPU cache.
 const texture=area==='forest'?null:scene.textures.createCanvas(key,size.width/2,size.height/2);
 const canvas=texture?.canvas||document.createElement('canvas');
 if(!texture){canvas.width=size.width/2;canvas.height=size.height/2;}
 const ctx=texture?.context||canvas.getContext('2d');
 ctx.imageSmoothingEnabled=false;
 const w=canvas.width,h=canvas.height,mask=new Uint8Array(w*h);
 for(const [rx,ry,rw,rh]of map.paths){
  const x0=rx/2,y0=ry/2,ww=rw/2,hh=rh/2;
  for(let y=Math.max(0,y0-4);y<Math.min(h,y0+hh+4);y++)for(let x=Math.max(0,x0-4);x<Math.min(w,x0+ww+4);x++){
   const cx=Math.max(x0+8,Math.min(x0+ww-8,x)),cy=Math.max(y0+8,Math.min(y0+hh-8,y));
   if(Math.hypot(x-cx,y-cy)<8+Math.sin(x*.14+y*.07)*2+Math.sin(y*.3)*1.5)mask[y*w+x]=1;
  }
 }
 const pixels=ctx.createImageData(w,h),fields=paintGround(pixels.data,w,h,map.biomes,map.habitats);
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
 ctx.putImageData(pixels,0,0);paintGroundDetails(ctx,w,h,mask,water,distance,map.biomes,fields.soil,map.habitats);
 if(area==='forest')paintShelves(ctx,scene,map);
 if(area==='city')paintCity(ctx,map);
 if(area==='city')scene.add.tileSprite(-1024,-1024,size.width+2048,size.height+2048,'town','grass0').setOrigin(0).setTileScale(2).setDepth(-3);
 if(tiles.length){for(const t of tiles){if(scene.textures.exists(t.key))scene.textures.remove(t.key);const tile=scene.textures.createCanvas(t.key,t.w,t.h);tile.context.imageSmoothingEnabled=false;tile.context.drawImage(canvas,t.x,t.y,t.w,t.h,0,0,t.w,t.h);tile.refresh();}showTiles();}
 else {texture.refresh();scene.add.image(0,0,key).setOrigin(0).setScale(2).setDepth(-2);}
}

// The face art is retained licensed scenery; shelf placement/shading is original.
function paintShelves(ctx,scene,map){
 for(const band of map.terraces)for(const l of band.segments){
  const x=l.x/2,y=l.y/2;
  ctx.fillStyle='rgba(48,54,35,.12)';ctx.fillRect(x,y-48,16,48);
  ctx.fillStyle='rgba(34,35,28,.22)';ctx.fillRect(x,y+16,16,3);
  ctx.fillStyle='#614739';ctx.fillRect(x,y,16,16);
  const f=scene.textures.getFrame(shelfTexture(scene,band.habitat));
  ctx.drawImage(f.source.image,f.cutX,f.cutY,f.cutWidth,f.cutHeight,x,y,16,16);
  // Jagged grassy lip in the local habitat palette instead of a flat straight rim.
  const color=habitatColor({x:l.x,y:l.y});ctx.fillStyle='rgb('+color.join(',')+')';
  for(let n=0;n<16;n+=2)ctx.fillRect(x+n,y-1,2,n%6===0?3:2);
 }
}

function shelfTexture(scene,habitat){
 const key='shelf-face-'+habitat;if(scene.textures.exists(key))return key;
 const source=scene.textures.getFrame(forestTexture(scene,'cliff-face',habitat)),texture=scene.textures.createCanvas(key,16,16),ctx=texture.context;
 ctx.drawImage(source.source.image,source.cutX,source.cutY,16,16,0,0,16,16);
 const pixels=ctx.getImageData(0,0,16,16);
 for(let y=3;y<16;y++)for(let x=0;x<16;x++){
  const i=(y*16+x)*4;if(!pixels.data[i+3])continue;
  const shade=Math.round((pixels.data[i]+pixels.data[i+1]+pixels.data[i+2])/3/16)*2;
  pixels.data[i]=78+shade;pixels.data[i+1]=55+shade;pixels.data[i+2]=43+shade;
 }
 ctx.putImageData(pixels,0,0);texture.refresh();return key;
}
