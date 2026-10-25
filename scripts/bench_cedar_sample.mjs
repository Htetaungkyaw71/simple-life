import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PNG,propPixels} from './prop_pixels.mjs';
import {MAPS} from '../src/data/mapLayouts.js';
const out='output/art/bench-cedar-v1',runtime='public/assets/pixel/processed',frameName='bench-cedar-review';
const read=p=>PNG.sync.read(fs.readFileSync(p)),write=(p,im)=>fs.writeFileSync(p,PNG.sync.write(im)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const colors=['2d2421','40312b','554034','6a4e3f','7b5c48','907059','a18469','b59b7b','c5b08d','3c4330','545d40','6e7751','8a9368','a3ac82','d6cbb1','e7dfc7','baa29a','ceafa7','e0c2ba','b39e70','cbb680','555650','797b70','402f2a','9e8a71','b8aa91','87907c','b9bea6','747764','464a3c','c8bfa8','c6b4a6'].map(s=>s.match(/../g).map(v=>parseInt(v,16)));
const before=read(out+'/before-town.png'),old=JSON.parse(fs.readFileSync(out+'/before-town.json')),meta=structuredClone(old);
// Reduce a 2x native staging grid with dark-edge tie preference. Thin source
// plank gaps must survive sampling instead of disappearing into the wood fill.
const high=propPixels(read(out+'/selected-source.png'),128,80,{colors}),im=new PNG({width:64,height:40});
for(let yy=0;yy<40;yy++)for(let xx=0;xx<64;xx++){
 const cells=[];for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const i=((yy*2+dy)*128+xx*2+dx)*4;cells.push([...high.data.subarray(i,i+4)]);}
 const ink=cells.filter(c=>c[3]);if(ink.length<2)continue;const counts=new Map();for(const c of ink){const k=c.join(',');counts.set(k,(counts.get(k)||0)+1);}
 const dark=ink.filter(c=>c[0]+c[1]+c[2]<225),winner=dark.length>=2?dark.sort((a,b)=>a[0]+a[1]+a[2]-b[0]-b[1]-b[2])[0]:[...counts].sort((a,b)=>b[1]-a[1])[0][0].split(',').map(Number);im.data.set(winner,(yy*64+xx)*4);
}
const y=before.height+2,atlas=new PNG({width:before.width,height:y+42});PNG.bitblt(before,atlas,0,0,before.width,before.height,0,0);PNG.bitblt(im,atlas,0,0,64,40,2,y);
meta.frames[frameName]={frame:{x:2,y,w:64,h:40},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:64,h:40},sourceSize:{w:64,h:40}};meta.meta.size.h=atlas.height;
write(out+'/native.png',im);write(out+'/town-preview.png',atlas);fs.writeFileSync(out+'/town-preview.json',JSON.stringify(meta,null,2)+'\n');
const review=new PNG({width:64*8,height:40*8});for(let yy=0;yy<review.height;yy++)for(let xx=0;xx<review.width;xx++){const i=(Math.floor(yy/8)*64+Math.floor(xx/8))*4,j=(yy*review.width+xx)*4;review.data.set(im.data[i+3]?im.data.subarray(i,i+4):[140,153,98,255],j);}write(out+'/native-review.png',review);
const record={version:'0.35.3',date:'2026-10-15',selectedSource:{file:out+'/selected-source.png',sha256:hash(out+'/selected-source.png')},frame:frameName,nativeSize:[64,40],worldScale:1,worldSize:[64,40],instance:{area:'home',x:960,y:824},palette:colors,existingFrames:Object.keys(old.frames).length,newFrames:Object.keys(meta.frames).length,atlas:meta.meta.size,pendingUserApproval:true};fs.writeFileSync(out+'/export.json',JSON.stringify(record,null,2)+'\n');
if(process.argv.includes('--install')){fs.copyFileSync(out+'/town-preview.png',runtime+'/town.png');fs.copyFileSync(out+'/town-preview.json',runtime+'/town.json');}
if(process.argv.includes('--audit')){
 const now=read(runtime+'/town.png'),actual=JSON.parse(fs.readFileSync(runtime+'/town.json'));
 for(let row=0;row<before.height;row++){const i=row*before.width*4;assert.ok(before.data.subarray(i,i+before.width*4).equals(now.data.subarray(i,i+before.width*4)),'all original atlas pixels unchanged');}
 for(const[name,f]of Object.entries(old.frames))assert.deepEqual(actual.frames[name],f);
 assert.deepEqual(actual.frames[frameName],meta.frames[frameName]);
 const f=actual.frames[frameName].frame;for(let row=0;row<40;row++){const i=((f.y+row)*now.width+f.x)*4;assert.ok(im.data.subarray(row*64*4,(row+1)*64*4).equals(now.data.subarray(i,i+64*4)),'installed sample equals selected native pixels');}
 const pieces=Object.entries(MAPS).flatMap(([area,m])=>(m.props||[]).filter(p=>p.artFrame===frameName).map(p=>({area,x:p.x,y:p.y,scale:p.artScale})));assert.deepEqual(pieces,[{area:'home',x:960,y:824,scale:1}]);assert.ok(MAPS.home.obstacles.some(b=>JSON.stringify(b)===JSON.stringify([960,842,64,18])),'original bench collision');
 assert.equal(Object.keys(actual.frames).length,Object.keys(old.frames).length+1);for(let i=3;i<im.data.length;i+=4)assert.ok(im.data[i]===0||im.data[i]===255);
 console.log(JSON.stringify({result:'PASS',existingFramesExact:Object.keys(old.frames).length,wholeOriginalAtlasRGBAExact:true,sampleInstances:pieces,unchangedCollision:[960,842,64,18],binaryAlpha:true,sourceHash:record.selectedSource.sha256,frame:actual.frames[frameName]}));
}else console.log(JSON.stringify({stageOnly:!process.argv.includes('--install'),sample:record.instance,native:record.nativeSize,world:record.worldSize}));
