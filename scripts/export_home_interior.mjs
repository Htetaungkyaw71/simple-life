// Deterministic runtime export of the approved review collection. Originals stay intact.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {PNG} from './prop_pixels.mjs';

const root=process.env.SIMPLE_LIFE_HOME_REVIEW||'/Users/mac/.codex/visualizations/2026/10/13/01a13658-7915-78f2-9b49-92222fd48878/home-interior-review-2026-10-16';
const out='output/art/home-interior-v1',runtime='public/assets/pixel/processed';
const read=p=>PNG.sync.read(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.mkdirSync(out+'/sources',{recursive:true});fs.mkdirSync(out+'/native',{recursive:true});
const input=JSON.parse(fs.readFileSync(root+'/dimensions.json')).assets;
const names=['home-bed','home-bedside-rug','home-bench-front','home-bench','home-rug','home-counter','home-pottery','home-wall-shelf','home-fireplace','home-logs','home-fire','home-window','home-threshold','home-leafy-pot','home-flower-pot','home-storage-jar'];
function bounds(src){
 let x0=src.width,y0=src.height,x1=-1,y1=-1;
 for(let y=0;y<src.height;y++)for(let x=0;x<src.width;x++)if(src.data[(y*src.width+x)*4+3]>=128){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
 assert.ok(x1>=x0,'nonempty source');return [x0,y0,x1-x0+1,y1-y0+1];
}
// Pick existing source RGB samples on a regular native grid. No blur, new
// painted details, palette remapping, stretching or alteration of the originals.
function sample(src,box,w,h){
 const dst=new PNG({width:w+4,height:h+4}),[bx,by,bw,bh]=box;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const votes=new Map();let covered=0;
  for(const oy of [.2,.5,.8])for(const ox of [.2,.5,.8]){
   const sx=Math.min(src.width-1,Math.floor(bx+(x+ox)*bw/w)),sy=Math.min(src.height-1,Math.floor(by+(y+oy)*bh/h));
   const i=(sy*src.width+sx)*4,p=src.data.subarray(i,i+4);if(p[3]<128)continue;covered++;
   const key=[p[0]>>4,p[1]>>4,p[2]>>4].join(',');const bucket=votes.get(key)||[];bucket.push(p);votes.set(key,bucket);
  }
  if(covered<5)continue;const bucket=[...votes.values()].sort((a,b)=>b.length-a.length)[0],p=bucket[Math.floor(bucket.length/2)];dst.data.set([p[0],p[1],p[2],255],((y+2)*dst.width+x+2)*4);
 }
 return dst;
}
const assets=[],records=[];
for(const [i,a]of input.entries()){
 const saved=out+'/sources/'+path.basename(a.file);fs.copyFileSync(root+'/'+a.file,saved);
 const src=read(saved),box=bounds(src),anchor=i===4?164:a.planned_anchor_units;
 let w=a.planned_anchor==='width'?anchor:Math.round(box[2]*anchor/box[3]),h=a.planned_anchor==='height'?anchor:Math.round(box[3]*anchor/box[2]);
 let crop=box;
 if(i===10){const fireplace=records.find(r=>r.name==='home-fireplace');crop=fireplace.sourceBox;w=fireplace.nativeSize[0]-4;h=fireplace.nativeSize[1]-4;}
 const im=sample(src,crop,w,h),name=names[i];fs.writeFileSync(out+'/native/'+name+'.png',PNG.sync.write(im));assets.push({name,im});
 records.push({name,source:saved,sha256:sha(saved),originalCanvas:[src.width,src.height],sourceBox:crop,nativeSize:[im.width,im.height],scale:1.5,worldSize:[im.width*1.5,im.height*1.5],reviewAnchor:a.planned_anchor_units,runtimeAnchor:anchor});
}
// Reuse the already approved table design, without another generation or redraw.
// The old 32x24 trial remains untouched in town; this approved source joins the set.
const tableSource=process.env.SIMPLE_LIFE_APPROVED_TABLE||'/Users/mac/.codex/generated_images/01a13658-7915-78f2-9b49-92222fd48878/exec-993cc3a9-800d-48b0-bb4e-cc331b4d1550.png';
const tableSaved=out+'/sources/approved-table-unchanged.png';fs.copyFileSync(tableSource,tableSaved);
const table=read(tableSaved),tableBox=bounds(table),tableIm=sample(table,tableBox,100,Math.round(tableBox[3]*100/tableBox[2]));
assets.push({name:'home-table',im:tableIm});fs.writeFileSync(out+'/native/home-table.png',PNG.sync.write(tableIm));
records.push({name:'home-table',source:tableSaved,sha256:sha(tableSaved),originalCanvas:[table.width,table.height],sourceBox:tableBox,nativeSize:[tableIm.width,tableIm.height],scale:1.5,worldSize:[tableIm.width*1.5,tableIm.height*1.5],approvedExistingDesign:true});

const atlas=new PNG({width:512,height:512}),meta={frames:{},meta:{app:'Simple Life approved home collection',image:'home-interior.png',size:{w:512,h:512},scale:'1'}};let x=2,y=2,row=0;
for(const {name,im}of assets){
 if(x+im.width+2>512){x=2;y+=row+2;row=0;}assert.ok(y+im.height+2<=512,'atlas capacity');
 PNG.bitblt(im,atlas,0,0,im.width,im.height,x,y);meta.frames[name]={frame:{x,y,w:im.width,h:im.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:im.width,h:im.height},sourceSize:{w:im.width,h:im.height}};
 x+=im.width+2;row=Math.max(row,im.height);
}
fs.writeFileSync(out+'/home-interior.png',PNG.sync.write(atlas));fs.writeFileSync(out+'/home-interior.json',JSON.stringify(meta,null,2)+'\n');
fs.writeFileSync(out+'/export.json',JSON.stringify({date:'2026-10-16',method:'source-sample native export; originals preserved; binary alpha; nearest rendering',scale:1.5,fireOverlay:'same native canvas and crop as fireplace; composite at (0,0)',assets:records},null,2)+'\n');
const definitions=Object.fromEntries(records.map(r=>{const box=bounds(assets.find(a=>a.name===r.name).im);return [r.name,{frame:r.name,width:r.nativeSize[0],height:r.nativeSize[1],scale:r.scale,visibleBounds:[box[0],box[1],box[0]+box[2],box[1]+box[3]]}];}));
fs.writeFileSync('src/data/homeInteriorArt.js','// Approved collection runtime dimensions; generated by scripts/export_home_interior.mjs.\nexport const HOME_INTERIOR_ART='+JSON.stringify(definitions,null,2)+';\n');
if(process.argv.includes('--install'))for(const ext of ['png','json'])fs.copyFileSync(out+'/home-interior.'+ext,runtime+'/home-interior.'+ext);
console.log(JSON.stringify({assets:records.length,atlas:[512,512],installed:process.argv.includes('--install'),native:records.map(r=>[r.name,...r.nativeSize])}));
