import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {PNG,cedarPixels,CEDAR_COLORS} from './cedar_pixels.mjs';
import {PROP_ART} from '../src/data/propArt.js';
const dir='output/art/cedar-props-v1',runtime='public/assets/pixel/processed',read=p=>PNG.sync.read(fs.readFileSync(p)),write=(p,im)=>fs.writeFileSync(p,PNG.sync.write(im)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const before=read(dir+'/before-town.png'),old=JSON.parse(fs.readFileSync(dir+'/before-town.json')),meta=structuredClone(old),pieces=[],sources={};
fs.mkdirSync(dir+'/native',{recursive:true});
for(const [name,a]of Object.entries(PROP_ART)){
 if(!a.source||pieces.some(p=>p.frame===a.frame))continue;
 const file=dir+'/sources/'+a.source+'.png';if(!fs.existsSync(file)){if(process.argv.includes('--partial'))continue;throw Error('Missing '+a.source);}
 sources[a.source]={file,sha256:hash(file)};let source=read(file);
 if(a.source==='door'){
  const part=Number(name.slice(-1)),width=Math.floor(source.width/3),cell=new PNG({width,height:source.height});PNG.bitblt(source,cell,part*width,0,width,source.height,0,0);source=cell;
 }
 const [w,h]=a.nativeSize||[old.frames[name].frame.w*2,old.frames[name].frame.h*2],im=cedarPixels(source,w,h,{stretch:['rug','path'].includes(a.source)||['road-sign','farm-sign'].includes(name)});
 // Virtual labelled signs reserve the original two text/arrow rows. Compress
 // the decorative upper rail and stretch only the blank board, leaving the post.
 if(['road-sign','farm-sign'].includes(name)){
  const original=Buffer.from(im.data);
  for(let yy=0;yy<h;yy++){const sy=yy<6?10+Math.floor(yy*14/6):yy<47?24+Math.floor((yy-6)*23/41):yy;original.copy(im.data,yy*w*4,sy*w*4,(sy+1)*w*4);}
 }
 // Retain the two established shop identities using restrained canopy colours.
 if(['produce-stall','outfitter-stall'].includes(name))for(let y=0;y<Math.floor(h*.57);y++)for(let x=0;x<w;x++){const i=(y*w+x)*4,r=im.data[i],g=im.data[i+1],b=im.data[i+2];if(!im.data[i+3]||g<=r||g-b<8)continue;const value=(r+g+b)/3,rgb=name==='produce-stall'?[value*1.12,value*.85,value*.79]:[value*.8,value*.94,value];im.data.set(rgb.map(v=>Math.round(Math.min(220,v))),i);}
 write(dir+'/native/'+a.frame+'.png',im);pieces.push({name,frame:a.frame,w,h,im});
}
let x=2,y=before.height+2,row=0;for(const p of pieces){if(x+p.w+2>before.width){x=2;y+=row+2;row=0;}p.x=x;p.y=y;x+=p.w+2;row=Math.max(row,p.h);}
const atlas=new PNG({width:before.width,height:y+row+2});PNG.bitblt(before,atlas,0,0,before.width,before.height,0,0);
for(const p of pieces){PNG.bitblt(p.im,atlas,0,0,p.w,p.h,p.x,p.y);meta.frames[p.frame]={frame:{x:p.x,y:p.y,w:p.w,h:p.h},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:p.w,h:p.h},sourceSize:{w:p.w,h:p.h}};}
meta.meta.size.h=atlas.height;write(dir+'/town-preview.png',atlas);fs.writeFileSync(dir+'/town-preview.json',JSON.stringify(meta,null,2)+'\n');
const record={date:'2026-10-15',approval:'Approved bench style rollout',existingFrames:Object.keys(old.frames).length,newFrames:pieces.length,atlas:meta.meta.size,palette:CEDAR_COLORS,sources,aliases:PROP_ART,approvedBench:{frame:'bench-cedar-review',nativeFile:'output/art/bench-cedar-v1/native.png',sha256:hash('output/art/bench-cedar-v1/native.png')}};
fs.writeFileSync(dir+'/export.json',JSON.stringify(record,null,2)+'\n');
const html='<!doctype html><meta charset="utf-8"><title>Cedar prop native review</title><style>body{background:#949c78;color:#292822;font:14px monospace}main{display:flex;flex-wrap:wrap;gap:12px}article{width:240px;height:260px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;background:#b1b59a}img{image-rendering:pixelated;max-width:230px;max-height:225px;object-fit:contain}p{margin:6px}</style><h1>Approved cedar style — native export</h1><main>'+pieces.map(p=>`<article><img src="native/${p.frame}.png" style="width:${p.w*3}px;height:${p.h*3}px"><p>${p.name} (${p.w}×${p.h})</p></article>`).join('')+'</main>';
fs.writeFileSync(dir+'/review.html',html);
if(process.argv.includes('--install')){fs.copyFileSync(dir+'/town-preview.png',runtime+'/town.png');fs.copyFileSync(dir+'/town-preview.json',runtime+'/town.json');}
if(process.argv.includes('--audit')){
 const now=read(runtime+'/town.png'),actual=JSON.parse(fs.readFileSync(runtime+'/town.json'));
 for(const [name,f]of Object.entries(old.frames))assert.deepEqual(actual.frames[name],f);
 assert.ok(before.data.equals(now.data.subarray(0,before.data.length)),'original atlas pixels including approved bench exact');
 for(const [name,a]of Object.entries(PROP_ART)){const f=actual.frames[a.frame]?.frame;assert.ok(f,a.frame);const size=a.nativeSize||[old.frames[name].frame.w*2,old.frames[name].frame.h*2];assert.deepEqual([f.w,f.h],size);}
 for(const p of pieces)for(let yy=0;yy<p.h;yy++){const i=((p.y+yy)*now.width+p.x)*4;assert.ok(p.im.data.subarray(yy*p.w*4,(yy+1)*p.w*4).equals(now.data.subarray(i,i+p.w*4)));}
 for(const p of pieces)for(let i=3;i<p.im.data.length;i+=4)assert.ok([0,255].includes(p.im.data[i]));
 console.log(JSON.stringify({result:'PASS',preservedFrames:Object.keys(old.frames).length,newFrames:pieces.length,aliases:Object.keys(PROP_ART).length,sourceCount:Object.keys(sources).length,binaryAlpha:true,atlas:meta.meta.size}));
}else console.log(JSON.stringify({stageOnly:!process.argv.includes('--install'),sources:Object.keys(sources).length,newFrames:pieces.length,atlas:meta.meta.size}));
