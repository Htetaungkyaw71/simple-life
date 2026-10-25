import {groundHash} from './groundSurface.js';

export const GROUND_TILE_SIZE=128;
export const GROUND_TILE_KEYS=['grassGroundA','grassGroundB','grassGroundC'];
export const LAWN_PALETTE=['#6C7749','#798455','#859056','#8C9564','#939C67','#9EA66B'];
export const GROUND_SEED=20261021;

const rgb=value=>[parseInt(value.slice(1,3),16),parseInt(value.slice(3,5),16),parseInt(value.slice(5,7),16)];
const palette=LAWN_PALETTE.map(rgb);
const paletteIndex=new Map(palette.map((color,index)=>[((color[0]<<16)|(color[1]<<8)|color[2])>>>0,index]));
const sourceCache=new WeakMap();

function texturePixels(scene,key){
 const source=scene.textures.get(key).getSourceImage();
 let record=sourceCache.get(source);if(record)return record;
 const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;
 const context=canvas.getContext('2d',{willReadFrequently:true});context.imageSmoothingEnabled=false;context.drawImage(source,0,0);
 record={width:source.width,height:source.height,data:context.getImageData(0,0,source.width,source.height).data};sourceCache.set(source,record);return record;
}

function organicBlob(mask,width,height,cx,cy,rx,ry,salt){
 const x0=Math.max(0,cx-rx-5),x1=Math.min(width,cx+rx+6),y0=Math.max(0,cy-ry-5),y1=Math.min(height,cy+ry+6);
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
  const dx=(x+.5-cx)/Math.max(1,rx),dy=(y+.5-cy)/Math.max(1,ry),distance=dx*dx+dy*dy;
  // Two fixed world-coordinate noise scales break straight ellipse sides and
  // rows. The hard threshold keeps the result on the pixel grid.
  const fine=groundHash(Math.floor(x/5),Math.floor(y/5),salt)%31-15;
  const broad=groundHash(Math.floor(x/13),Math.floor(y/13),salt+1)%25-12;
  if(distance*100<=100+fine+broad)mask[y*width+x]=1;
 }
}

export function groundBlobField(width,height,{cell,chance,minRadius,maxRadius,salt}){
 const mask=new Uint8Array(width*height),extra=2;
 for(let gy=-extra;gy<=Math.floor(height/cell)+extra;gy++)for(let gx=-extra;gx<=Math.floor(width/cell)+extra;gx++){
  if(groundHash(gx,gy,salt)%100>=chance)continue;
  const cx=gx*cell+groundHash(gx,gy,salt+1)%cell,cy=gy*cell+groundHash(gx,gy,salt+2)%cell;
  const range=maxRadius-minRadius+1,rx=minRadius+groundHash(gx,gy,salt+3)%range;
  const ry=Math.max(12,Math.floor(rx*(58+groundHash(gx,gy,salt+4)%31)/100));
  organicBlob(mask,width,height,cx,cy,rx,ry,salt+5);
 }
 return mask;
}

function paintTufts(ctx,width,height){
 for(let gy=-1;gy<Math.floor(height/76)+2;gy++)for(let gx=-1;gx<Math.floor(width/76)+2;gx++){
  if(groundHash(gx,gy,GROUND_SEED+300)%100>=48)continue;
  const centerX=gx*76+groundHash(gx,gy,GROUND_SEED+301)%76,centerY=gy*76+groundHash(gx,gy,GROUND_SEED+302)%76;
  const count=3+groundHash(gx,gy,GROUND_SEED+303)%4;
  for(let mark=0;mark<count;mark++){
   const dx=groundHash(gx*11+mark,gy,GROUND_SEED+304)%49-24,dy=groundHash(gx,gy*13+mark,GROUND_SEED+305)%37-18;
   const x=centerX+dx,y=centerY+dy;if(x<1||x>=width-1||y<1||y>=height-2)continue;
   ctx.fillStyle=LAWN_PALETTE[mark%3?5:4];ctx.fillRect(x,y,1,1);ctx.fillRect(x-1,y+1,1,1);ctx.fillRect(x+1,y+1,1,1);
  }
 }
}

// B is the continuous lawn. C only appears through irregular world-coordinate
// islands, so a 128px asset boundary can never become a rectangular patch.
export function paintGroundTiles(ctx,scene,width,height){
 const b=texturePixels(scene,'grassGroundB'),c=texturePixels(scene,'grassGroundC');
 const alternate=groundBlobField(width,height,{cell:96,chance:22,minRadius:16,maxRadius:34,salt:GROUND_SEED+100});
 const pockets=groundBlobField(width,height,{cell:94,chance:40,minRadius:20,maxRadius:60,salt:GROUND_SEED+200});
 const image=ctx.createImageData(width,height),out=image.data;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const p=y*width+x,source=alternate[p]?c:b,si=((y%source.height)*source.width+(x%source.width))*4,di=p*4;
  let red=source.data[si],green=source.data[si+1],blue=source.data[si+2];
  if(pockets[p]){const index=paletteIndex.get(((red<<16)|(green<<8)|blue)>>>0);if(index>0)[red,green,blue]=palette[index-1];}
  out[di]=red;out[di+1]=green;out[di+2]=blue;out[di+3]=255;
 }
 ctx.putImageData(image,0,0);paintTufts(ctx,width,height);
}

// A is intentionally absent from ordinary lawns. It is restricted to a
// stepped, irregular shade band at the authored Forest's outer world edge.
export function applyForestEdgeShade(data,scene,width,height){
 const a=texturePixels(scene,'grassGroundA');
 const shade=(x,y)=>{
  const depth=18+groundHash(Math.floor(x/8),Math.floor(y/8),GROUND_SEED+400)%43;
  if(Math.min(x,y,width-1-x,height-1-y)>=depth)return;
  const si=((y%a.height)*a.width+(x%a.width))*4,di=(y*width+x)*4;
  data[di]=a.data[si];data[di+1]=a.data[si+1];data[di+2]=a.data[si+2];data[di+3]=255;
 };
 const band=Math.min(60,Math.ceil(Math.min(width,height)/2));
 for(let y=0;y<height;y++){for(let x=0;x<band;x++)shade(x,y);for(let x=Math.max(band,width-band);x<width;x++)shade(x,y);}
 for(let y=0;y<band;y++)for(let x=band;x<width-band;x++)shade(x,y);
 for(let y=Math.max(band,height-band);y<height;y++)for(let x=band;x<width-band;x++)shade(x,y);
}
