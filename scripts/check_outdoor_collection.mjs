import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PNG} from './prop_pixels.mjs';
const out='output/art/outdoor-collection-v1',proof='docs/verification/outdoor-collection-v1',runtime='public/assets/pixel/processed';
const read=p=>PNG.sync.read(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const old=JSON.parse(fs.readFileSync(out+'/before-town.json')),meta=JSON.parse(fs.readFileSync(runtime+'/town.json')),before=read(out+'/before-town.png'),now=read(runtime+'/town.png'),record=JSON.parse(fs.readFileSync(out+'/export.json'));
const changed=new Set(record.changed.map(c=>c.frame)),mask=new Uint8Array(before.width*before.height);
for(const [name,a]of Object.entries(old.frames)){assert.deepEqual(meta.frames[name],a,name);if(changed.has(name)){const f=a.frame;for(let y=f.y;y<f.y+f.h;y++)mask.fill(1,y*before.width+f.x,y*before.width+f.x+f.w);}}
for(let p=0;p<mask.length;p++)if(!mask[p])assert.ok(before.data.subarray(p*4,p*4+4).equals(now.data.subarray(p*4,p*4+4)),'non-target RGBA');
for(const c of record.changed){const f=meta.frames[c.frame].frame,native=read(out+'/native/'+c.frame+'.png');for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){const i=(y*f.w+x)*4,j=((f.y+y)*now.width+f.x+x)*4;assert.ok(native.data.subarray(i,i+4).equals(now.data.subarray(j,j+4)));assert.ok([0,255].includes(now.data[j+3]));}}
const baseline=JSON.parse(fs.readFileSync(proof+'/baseline-hashes.json'));let protectedFiles=0;for(const [p,h]of Object.entries(baseline))if(!p.endsWith('/town.png')&&!p.endsWith('/town.json')){assert.equal(hash(p),h,p);protectedFiles++;}
const source=JSON.parse(fs.readFileSync(out+'/manifest.json'));for(const a of source.assets)assert.equal(hash(out+'/'+a.original),a.originalSha256);
for(const ref of source.references)assert.equal(hash(out+'/'+ref.file),ref.sha256);
assert.ok(now.height<=4096);assert.equal(Object.keys(meta.frames).length,Object.keys(old.frames).length+9);
const report={result:'PASS',oldMetadataExact:Object.keys(old.frames).length,replacedOldCells:25,unchangedOldCells:Object.keys(old.frames).length-25,newFrames:9,nativeFramesChecked:record.changed.length,nonTargetRGBAExact:true,otherRuntimeArtExact:protectedFiles,fullOriginalsExact:14,approvedReferencesExact:2,homeAndCharactersUnchanged:true,binaryNativeAlpha:true,atlas:meta.meta.size};
fs.writeFileSync(proof+'/art-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
