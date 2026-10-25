import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {PNG} from './prop_pixels.mjs';
import {PLANTER_BENCH} from '../src/data/planterBench.js';
const muted=process.argv.includes('--muted'),base='output/art/planter-bench-v1',out=muted?'output/art/planter-bench-muted-v2':base,runtime='public/assets/pixel/processed',read=p=>PNG.sync.read(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const source=out+(muted?'/planter-bench-muted-original.png':'/planter-bench-vertical-original.png'),src=read(source);
let x0=src.width,y0=src.height,x1=-1,y1=-1;
for(let y=0;y<src.height;y++)for(let x=0;x<src.width;x++)if(src.data[(y*src.width+x)*4+3]>=128){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
const [w,h]=PLANTER_BENCH.nativeSize,native=new PNG({width:w,height:h});
// Source-derived colour votes on a regular native grid, with no redraw,
// hue remapping or alteration of the full-resolution original PNG.
for(let y=2;y<h-2;y++)for(let x=2;x<w-2;x++){
 const votes=new Map();let coverage=0;
 for(const oy of [.2,.5,.8])for(const ox of [.2,.5,.8]){
  const sx=Math.min(x1,Math.floor(x0+(x-2+ox)*(x1-x0+1)/(w-4))),sy=Math.min(y1,Math.floor(y0+(y-2+oy)*(y1-y0+1)/(h-4))),i=(sy*src.width+sx)*4,p=src.data.subarray(i,i+4);
  if(p[3]<128)continue;coverage++;const key=[p[0]>>4,p[1]>>4,p[2]>>4].join(','),bucket=votes.get(key)||[];bucket.push(p);votes.set(key,bucket);
 }
 if(coverage<5)continue;const bucket=[...votes.values()].sort((a,b)=>b.length-a.length)[0],p=bucket[Math.floor(bucket.length/2)];native.data.set([p[0],p[1],p[2],255],(y*w+x)*4);
}
const before=read(base+'/before-town.png'),old=JSON.parse(fs.readFileSync(base+'/before-town.json')),meta=structuredClone(old),row=before.height+2,atlas=new PNG({width:before.width,height:row+h+2});
PNG.bitblt(before,atlas,0,0,before.width,before.height,0,0);PNG.bitblt(native,atlas,0,0,w,h,2,row);
meta.frames[PLANTER_BENCH.frame]={frame:{x:2,y:row,w,h},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w,h},sourceSize:{w,h}};meta.meta.size.h=atlas.height;
for(const [file,png]of [['native.png',native],['town-preview.png',atlas]])fs.writeFileSync(out+'/'+file,PNG.sync.write(png));
fs.writeFileSync(out+'/town-preview.json',JSON.stringify(meta,null,2)+'\n');
const record={date:'2026-10-16',original:{file:source,sha256:hash(source),dimensions:[src.width,src.height],visibleAlphaBounds:[x0,y0,x1+1,y1+1]},native:{file:out+'/native.png',dimensions:[w,h],scale:PLANTER_BENCH.scale,worldCanvas:[w*1.5,h*1.5],binaryAlpha:true},scope:'one City planter bench below seed stall; five other planted benches unchanged',oldFrames:Object.keys(old.frames).length,atlas:meta.meta.size};
fs.writeFileSync(out+'/export.json',JSON.stringify(record,null,2)+'\n');
if(process.argv.includes('--install'))for(const ext of ['png','json'])fs.copyFileSync(out+'/town-preview.'+ext,runtime+'/town.'+ext);
assert.ok(atlas.height<=4096);console.log(JSON.stringify(record));
