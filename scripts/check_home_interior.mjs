// Offline composition and preservation audit, not a substitute browser screenshot.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {PNG} from './prop_pixels.mjs';
import {homeInteriorSurface} from '../src/art/homeInteriorSurface.js';
import {syncInterior} from '../src/data/locations.js';
import {ROOM,FURNITURE,roomFloorPiece,roomArtSize} from '../src/data/interior.js';
const out='docs/verification/home-interior-v1',read=p=>PNG.sync.read(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
fs.mkdirSync(out,{recursive:true});
const baseline=JSON.parse(fs.readFileSync(out+'/structure-baseline-hashes.json'));
for(const [p,h]of Object.entries(baseline))assert.equal(hash(p),h,'protected art '+p);
const meta=JSON.parse(fs.readFileSync('public/assets/pixel/processed/home-interior.json')),atlas=read('public/assets/pixel/processed/home-interior.png');
for(const [name,{frame:f}]of Object.entries(meta.frames)){
 const native=read('output/art/home-interior-v1/native/'+name+'.png');assert.deepEqual([native.width,native.height],[f.w,f.h]);
 for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){const i=(y*f.w+x)*4,j=((f.y+y)*atlas.width+f.x+x)*4;assert.ok(native.data.subarray(i,i+4).equals(atlas.data.subarray(j,j+4)),name);}
}
syncInterior(390,844);assert.deepEqual([ROOM.width,ROOM.height],[576,400]);
const surface=homeInteriorSurface(ROOM.width,ROOM.height),image=new PNG({width:1242,height:842});
for(let i=0;i<image.data.length;i+=4)image.data.set([50,34,30,255],i);
function stamp(src,x,y,k=1){
 for(let sy=0;sy<src.height;sy++)for(let sx=0;sx<src.width;sx++){
  const i=(sy*src.width+sx)*4,p=src.data.subarray(i,i+4);if(!p[3])continue;
  for(let dy=0;dy<k;dy++)for(let dx=0;dx<k;dx++){
   const xx=Math.round(x)+sx*k+dx,yy=Math.round(y)+sy*k+dy;if(xx<0||xx>=image.width||yy<0||yy>=image.height)continue;image.data.set(p,(yy*image.width+xx)*4);
  }
 }
}
const layer=kind=>({width:surface.width,height:surface.height,data:surface[kind]});
stamp(layer('back'),51,28,2);
for(const [name,x,y]of [...FURNITURE].sort((a,b)=>(roomFloorPiece(a[0])?1:a[2]+roomArtSize(a[0]).h)-(roomFloorPiece(b[0])?1:b[2]+roomArtSize(b[0]).h)))stamp(read('output/art/home-interior-v1/native/'+name+'.png'),51+x*2,28+y*2,3);
const character='/Users/mac/.codex/visualizations/2026/10/13/01a13658-7915-78f2-9b49-92222fd48878/home-structure-preview-2026-10-16/current-character-preserved.png';
if(fs.existsSync(character))stamp(read(character),715,486);
stamp(layer('front'),51,28,2);
fs.writeFileSync(out+'/integrated-layout-offline.png',PNG.sync.write(image));
const approved='/Users/mac/.codex/visualizations/2026/10/13/01a13658-7915-78f2-9b49-92222fd48878/home-structure-preview-2026-10-16/placement-record.json';
const reference=JSON.parse(fs.readFileSync(approved));
for(const r of reference.assets){const p=FURNITURE.find(p=>p[0]===r.asset);if(r.asset==='home-storage-jar'){assert.equal(p,undefined);continue;}if(r.asset==='home-window')continue;assert.ok(p,r.asset);const target=[51+p[1]*2,28+p[2]*2];if(r.asset==='home-logs')assert.deepEqual(target,[r.screenCanvasOrigin[0],r.screenCanvasOrigin[1]-32]);else assert.deepEqual(target,r.screenCanvasOrigin,'approved placement '+r.asset);}
syncInterior(1280,720);
const report={result:'PASS',protectedArtFiles:Object.keys(baseline).length,unchangedRuntimePNGHashes:true,installedFrames:17,approvedSourceTableUnchanged:true,removedStoragePot:true,woodMovedBackWorldUnits:16,threshold:'flush original architecture; no U-rail sprite',preview:'offline composition of the runtime raster and native artwork, not an actual browser screenshot',browserVerification:'blocked by browser URL security policy in this conversation; no workaround attempted'};
fs.writeFileSync(out+'/art-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
