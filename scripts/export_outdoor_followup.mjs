// Six source-derived replacements and a larger derivative of the unchanged approved well.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PNG} from './prop_pixels.mjs';
const out='output/art/outdoor-followup-v1',runtime='public/assets/pixel/processed';
const read=p=>PNG.sync.read(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const old=JSON.parse(fs.readFileSync(out+'/before-town.json')),before=read(out+'/before-town.png'),meta=structuredClone(old),atlas=new PNG({width:before.width,height:before.height+100});
PNG.bitblt(before,atlas,0,0,before.width,before.height,0,0);
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

const rows=[['notice-board',['cedar-notice']],['route-board',['cedar-road-sign','cedar-farm-sign']],['wheelbarrow',['cedar-wheelbarrow']],['ground-wildflowers',['cedar-flowers',...Array.from({length:5},(_,i)=>'cedar-flowers'+i),'cedar-prop-flowers']],['fountain',['cedar-city-fountain0']],['canvas-tent',['cedar-city-tent','cedar-camp-tent']]];
const changed=[];
for(const [source,frames]of rows)for(const name of frames){const f=meta.frames[name].frame,im=native(read(out+'/png/'+source+'.png'),f.w,f.h);PNG.bitblt(im,atlas,0,0,f.w,f.h,f.x,f.y);fs.writeFileSync(out+'/native/'+name+'.png',PNG.sync.write(im));changed.push({name,source,size:[f.w,f.h]});}
const wellSource='output/art/outdoor-collection-v1/png/10-stone-well.png',well=native(read(wellSource),72,96),row=before.height+2;
meta.frames['outdoor-well-large']={frame:{x:2,y:row,w:72,h:96},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:72,h:96},sourceSize:{w:72,h:96}};
PNG.bitblt(well,atlas,0,0,72,96,2,row);fs.writeFileSync(out+'/native/outdoor-well-large.png',PNG.sync.write(well));changed.push({name:'outdoor-well-large',source:wellSource,size:[72,96]});meta.meta.size.h=atlas.height;
for(const [name,a]of Object.entries(old.frames)){assert.deepEqual(meta.frames[name],a);if(changed.some(c=>c.name===name))continue;const f=a.frame;for(let y=0;y<f.h;y++){const i=((f.y+y)*before.width+f.x)*4;assert.ok(before.data.subarray(i,i+f.w*4).equals(atlas.data.subarray(i,i+f.w*4)),name);}}
const sources=JSON.parse(fs.readFileSync(out+'/sources.json'));for(const s of sources)assert.equal(hash(out+'/originals/'+s.name+'.png'),s.sha256);
assert.ok(atlas.height<=4096);
fs.writeFileSync(out+'/town-preview.png',PNG.sync.write(atlas));fs.writeFileSync(out+'/town-preview.json',JSON.stringify(meta,null,2)+'\n');
fs.writeFileSync(out+'/export.json',JSON.stringify({date:'2026-10-16',changed,oldFrames:Object.keys(old.frames).length,atlas:meta.meta.size,originalsPreserved:6,wellSource,wellSourceSha256:hash(wellSource)},null,2)+'\n');
if(process.argv.includes('--install'))for(const ext of ['png','json'])fs.copyFileSync(out+'/town-preview.'+ext,runtime+'/town.'+ext);
console.log(JSON.stringify({nativeFrames:changed.length,atlas:meta.meta.size}));
