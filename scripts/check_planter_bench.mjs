import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PNG} from './prop_pixels.mjs';
const muted=process.argv.includes('--muted'),out=muted?'output/art/planter-bench-muted-v2':'output/art/planter-bench-v1',proof=muted?'docs/verification/planter-bench-muted-v2':'docs/verification/planter-bench-v1',read=p=>PNG.sync.read(fs.readFileSync(p)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const baseline=JSON.parse(fs.readFileSync(proof+'/baseline-hashes.json'));
for(const [p,h]of Object.entries(baseline))if(!p.endsWith('/town.png')&&!p.endsWith('/town.json'))assert.equal(hash(p),h,p);
const old=JSON.parse(fs.readFileSync(out+'/before-town.json')),actual=JSON.parse(fs.readFileSync('public/assets/pixel/processed/town.json')),before=read(out+'/before-town.png'),now=read('public/assets/pixel/processed/town.png');
for(const [n,f]of Object.entries(old.frames))assert.deepEqual(actual.frames[n],f,n);
if(muted){
 assert.deepEqual(actual,old,'all atlas metadata unchanged');assert.equal(now.width,before.width);assert.equal(now.height,before.height);
 const r=actual.frames['planter-bench-vertical-review'].frame;
 for(let y=0;y<now.height;y++)for(let x=0;x<now.width;x++)if(x<r.x||x>=r.x+r.w||y<r.y||y>=r.y+r.h){const i=(y*now.width+x)*4;assert.ok(before.data.subarray(i,i+4).equals(now.data.subarray(i,i+4)),'only target frame can change');}
}else{assert.ok(before.data.equals(now.data.subarray(0,before.data.length)),'complete old RGBA region intact');assert.equal(Object.keys(actual.frames).length,Object.keys(old.frames).length+1);}
const f=actual.frames['planter-bench-vertical-review'].frame,native=read(out+'/native.png');
for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){const i=(y*f.w+x)*4,j=((f.y+y)*now.width+f.x+x)*4;assert.ok(native.data.subarray(i,i+4).equals(now.data.subarray(j,j+4)));assert.ok([0,255].includes(native.data[i+3]));}
const source=out+(muted?'/planter-bench-muted-original.png':'/planter-bench-vertical-original.png');assert.equal(hash(source),muted?'f0f4d33196f38155c5c497b64851679b2fee7ccc20cc52ca5e5add2e8f412362':'cdea9eba1cb56522dc3a240a59c2a45e461eeadeb95bfe140e4a44d17064fb48');
assert.equal(hash('output/art/planter-bench-v1/planter-bench-vertical-original.png'),'cdea9eba1cb56522dc3a240a59c2a45e461eeadeb95bfe140e4a44d17064fb48');
const preview=new PNG({width:native.width*6,height:native.height*6});for(let y=0;y<preview.height;y++)for(let x=0;x<preview.width;x++){const i=(Math.floor(y/6)*native.width+Math.floor(x/6))*4;preview.data.set(native.data[i+3]?native.data.subarray(i,i+4):[222,212,186,255],(y*preview.width+x)*4);}fs.writeFileSync(proof+'/native-inspection.png',PNG.sync.write(preview));
const report={result:'PASS',oldAtlasFramesExact:Object.keys(old.frames).length,oldAtlasRGBAExact:!muted,outsideTargetFrameRGBAExact:true,otherRuntimeArtExact:Object.keys(baseline).length-2,addedFrames:muted?0:1,sourceOriginalPreserved:true,nativeDimensions:[f.w,f.h],binaryAlpha:true,atlas:actual.meta.size,browser:muted?'PASS: actual City view after in-app browser reload; full input/device checks not performed':'unverified: historical integration'};
fs.writeFileSync(proof+'/art-audit.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
