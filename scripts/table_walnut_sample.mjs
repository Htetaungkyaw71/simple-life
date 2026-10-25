import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PNG,propPixels} from './prop_pixels.mjs';
import {ROOM,FURNITURE,ROOM_SOLIDS,DINING_TABLE_ART} from '../src/data/interior.js';
const out='output/art/walnut-table-v1',runtime='public/assets/pixel/processed',name='table-walnut-review';
const read=p=>PNG.sync.read(fs.readFileSync(p)),write=(p,im)=>fs.writeFileSync(p,PNG.sync.write(im)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const colors=['50312c','754a38','9e684b','c18b62','d8a878','a58b70','d6c2a0','f2e2bd','fff0cf','82483a','b4664c','d89069','ebba8f'].map(s=>s.match(/../g).map(v=>parseInt(v,16)));
const before=read(out+'/before-town.png'),old=JSON.parse(fs.readFileSync(out+'/before-town.json')),meta=structuredClone(old),im=propPixels(read(out+'/selected-source.png'),64,40,{padding:1,colors,clean:true});
const y=before.height+2,atlas=new PNG({width:before.width,height:y+42});PNG.bitblt(before,atlas,0,0,before.width,before.height,0,0);PNG.bitblt(im,atlas,0,0,64,40,2,y);
meta.frames[name]={frame:{x:2,y,w:64,h:40},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:64,h:40},sourceSize:{w:64,h:40}};meta.meta.size.h=atlas.height;
write(out+'/native.png',im);write(out+'/town-preview.png',atlas);fs.writeFileSync(out+'/town-preview.json',JSON.stringify(meta,null,2)+'\n');
const review=new PNG({width:512,height:320});for(let yy=0;yy<320;yy++)for(let xx=0;xx<512;xx++){const i=(Math.floor(yy/8)*64+Math.floor(xx/8))*4;review.data.set(im.data[i+3]?im.data.subarray(i,i+4):[211,203,178,255],(yy*512+xx)*4);}write(out+'/native-review.png',review);
const record={date:'2026-10-15',version:'0.36.2',frame:name,nativeSize:[64,40],worldScale:2,worldSize:[128,80],scope:'One fixed interior home-table; catalog and placed tables unchanged',pendingUserApproval:true,source:{file:out+'/selected-source.png',sha256:hash(out+'/selected-source.png')},palette:colors,oldFrames:Object.keys(old.frames).length,newFrames:Object.keys(meta.frames).length,atlas:meta.meta.size};fs.writeFileSync(out+'/export.json',JSON.stringify(record,null,2)+'\n');
if(process.argv.includes('--install')){fs.copyFileSync(out+'/town-preview.png',runtime+'/town.png');fs.copyFileSync(out+'/town-preview.json',runtime+'/town.json');}
if(process.argv.includes('--audit')){
 const now=read(runtime+'/town.png'),actual=JSON.parse(fs.readFileSync(runtime+'/town.json'));
 for(const[n,f]of Object.entries(old.frames))assert.deepEqual(actual.frames[n],f);assert.ok(before.data.equals(now.data.subarray(0,before.data.length)));
 assert.equal(Object.keys(actual.frames).length,Object.keys(old.frames).length+1);assert.deepEqual(actual.frames[name],meta.frames[name]);
 const f=actual.frames[name].frame;for(let row=0;row<40;row++){const i=((f.y+row)*now.width+f.x)*4;assert.ok(im.data.subarray(row*64*4,(row+1)*64*4).equals(now.data.subarray(i,i+64*4)));}
 assert.deepEqual(DINING_TABLE_ART,{frame:name,scale:2});assert.equal(FURNITURE.filter(([n])=>n==='home-table').length,1);assert.ok(ROOM_SOLIDS.some(b=>JSON.stringify(b)===JSON.stringify([ROOM.width/2-184,ROOM.height-148,128,72])));
 for(let i=3;i<im.data.length;i+=4)assert.ok([0,255].includes(im.data[i]));console.log(JSON.stringify({result:'PASS',previousFramesExact:Object.keys(old.frames).length,wholePreviousAtlasRGBAExact:true,oneInteriorTable:true,worldSize:[128,80],originalCollider:true,binaryAlpha:true,sourceHash:record.source.sha256,frame:actual.frames[name]}));
}else console.log(JSON.stringify({stageOnly:!process.argv.includes('--install'),native:record.nativeSize,world:record.worldSize}));
