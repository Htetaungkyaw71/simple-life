// Source-derived native export; original canvases and prior atlas stay untouched.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PNG} from './prop_pixels.mjs';
const out='output/art/outdoor-collection-v1',runtime='public/assets/pixel/processed';
const read=p=>PNG.sync.read(fs.readFileSync(p)),write=(p,im)=>fs.writeFileSync(p,PNG.sync.write(im)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=JSON.parse(fs.readFileSync(out+'/manifest.json')),old=JSON.parse(fs.readFileSync(out+'/before-town.json')),before=read(out+'/before-town.png'),meta=structuredClone(old);
const source=id=>read(id===1?out+'/references/approved-street-lamp.png':out+'/'+manifest.assets.find(a=>a.id===id).file);
function bounds(im){let x0=im.width,y0=im.height,x1=-1,y1=-1;for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++)if(im.data[(y*im.width+x)*4+3]>=128){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}return {x0,y0,w:x1-x0+1,h:y1-y0+1};}
function native(src,w,h){
 const b=bounds(src),s=Math.min((w-4)/b.w,(h-4)/b.h),left=(w-b.w*s)/2,top=h-2-b.h*s,im=new PNG({width:w,height:h});
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  let count=0;const votes=new Map();
  for(const dy of [.2,.5,.8])for(const dx of [.2,.5,.8]){
   const sx=Math.floor(b.x0+(x+dx-left)/s),sy=Math.floor(b.y0+(y+dy-top)/s);
   if(sx<b.x0||sx>=b.x0+b.w||sy<b.y0||sy>=b.y0+b.h)continue;
   const i=(sy*src.width+sx)*4,p=src.data.subarray(i,i+4);if(p[3]<128)continue;
   count++;const k=[p[0]>>4,p[1]>>4,p[2]>>4].join(','),v=votes.get(k)||[];v.push(p);votes.set(k,v);
  }
  if(count<5)continue;const v=[...votes.values()].sort((a,b)=>b.length-a.length)[0],p=v[Math.floor(v.length/2)];im.data.set([p[0],p[1],p[2],255],(y*w+x)*4);
 }
 return im;
}
// Shorten the rail span, preserving end-post widths/heights rather than squashing posts.
function fence(src,w,h,vertical){
 const long=native(src,vertical?w:128,vertical?128:h),im=new PNG({width:w,height:h});
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const sx=vertical?x:x<8?x:x>=w-8?128-(w-x):8+Math.floor((x-8)*112/(w-16));
  const sy=!vertical?y:y<12?y:y>=h-14?128-(h-y):12+Math.floor((y-12)*102/(h-26));
  long.data.copy(im.data,(y*w+x)*4,(sy*long.width+sx)*4,(sy*long.width+sx+1)*4);
 }
 return im;
}
const rows=[
 [1,['cedar-lamp','cedar-city-lamp']], [2,['bench-cedar-review']], [3,['cedar-sign']],
 [4,['cedar-mailbox']], [5,['cedar-crate']], [6,['cedar-barrel']],
 [7,['cedar-fence']], [8,['cedar-fence-v','cedar-prop-fence-left']],
 [10,['cedar-well']], [11,['nature-bush-small','nature-bush-leafy']],
 [12,['cedar-env-boulder','cedar-rock','cedar-loose-stones']],
 [13,['forest-oak-0','forest-oak-1','forest-oak-2']],
 [14,['cedar-planter','cedar-prop-planter','cedar-city-flowerpot']],
 [15,['cedar-seed-stall','cedar-produce-stall','cedar-outfitter-stall']]
];
const gate=native(source(9),96,32),atlas=new PNG({width:before.width,height:before.height+132});
PNG.bitblt(before,atlas,0,0,before.width,before.height,0,0);
fs.mkdirSync(out+'/native',{recursive:true});const changed=[],anchors={};
function install(frame,im,id){
 const f=meta.frames[frame].frame;assert.deepEqual([f.w,f.h],[im.width,im.height]);
 PNG.bitblt(im,atlas,0,0,f.w,f.h,f.x,f.y);write(out+'/native/'+frame+'.png',im);changed.push({id,frame,size:[f.w,f.h],visibleBounds:bounds(im)});
 if(frame.startsWith('forest-oak')||frame.startsWith('nature-bush')){let sum=0,n=0;const b=bounds(im);for(let y=b.y0+b.h-5;y<b.y0+b.h;y++)for(let x=0;x<im.width;x++)if(im.data[(y*im.width+x)*4+3]){sum+=x+.5;n++;}anchors[frame]=Math.round(sum/n/im.width*10000)/10000;}
}
for(const [id,frames]of rows)for(const frame of frames){
 const f=meta.frames[frame]?.frame;assert.ok(f,frame);
 let im=id===7||id===8?fence(source(id),f.w,f.h,id===8):native(source(id),f.w,f.h);
 // The legacy boulder canvas is large; fit the small cluster to its existing 50-unit ground mask.
 if(frame==='cedar-env-boulder'){im=new PNG({width:f.w,height:f.h});const small=native(source(id),112,80);PNG.bitblt(small,im,0,0,112,80,(f.w-112)/2,f.h-80);}
 install(frame,im,id);
}
function addFrame(name,x,y,w,h){meta.frames[name]={frame:{x,y,w,h},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w,h},sourceSize:{w,h}};}
const row=before.height+2;addFrame('outdoor-closed-gate',2,row,96,32);install('outdoor-closed-gate',gate,9);
addFrame('outdoor-fence-h',100,row,128,32);install('outdoor-fence-h',native(source(7),128,32),7);
addFrame('outdoor-fence-v',232,row,32,128);install('outdoor-fence-v',native(source(8),32,128),8);
for(const [name,x,y,w,h]of [['h-start',100,row,12,32],['h-rail',112,row,104,32],['h-end',216,row,12,32],['v-start',232,row,32,28],['v-rail',232,row+28,32,72],['v-end',232,row+100,32,28]])addFrame('outdoor-fence-'+name,x,y,w,h);
meta.meta.size.h=atlas.height;
write(out+'/town-preview.png',atlas);fs.writeFileSync(out+'/town-preview.json',JSON.stringify(meta,null,2)+'\n');
// Every preceding cell outside the explicit replacement list remains byte exact.
for(const [name,a]of Object.entries(old.frames)){assert.deepEqual(meta.frames[name],a);if(changed.some(c=>c.frame===name))continue;const f=a.frame;for(let y=0;y<f.h;y++){const i=((f.y+y)*before.width+f.x)*4;assert.ok(before.data.subarray(i,i+f.w*4).equals(atlas.data.subarray(i,i+f.w*4)),name);}}
for(const a of manifest.assets)assert.equal(hash(out+'/'+a.original),a.originalSha256);
assert.ok(atlas.height<=4096);assert.equal(changed.length,28);
fs.writeFileSync(out+'/export.json',JSON.stringify({date:'2026-10-16',changed,anchors,oldFrames:Object.keys(old.frames).length,atlas:meta.meta.size,originalsPreserved:true,binaryAlpha:true},null,2)+'\n');
if(process.argv.includes('--install'))for(const ext of ['png','json'])fs.copyFileSync(out+'/town-preview.'+ext,runtime+'/town.'+ext);
console.log(JSON.stringify({frames:changed.length,oldFrames:Object.keys(old.frames).length,atlas:meta.meta.size,anchors}));
