import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url),{PNG}=require(process.env.SIMPLE_LIFE_PNGJS||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const dir='output/art/nature-v1',meta=JSON.parse(fs.readFileSync('public/assets/pixel/processed/town.json')),oldMeta=JSON.parse(fs.readFileSync(dir+'/before-town.json')),record=JSON.parse(fs.readFileSync(dir+'/manifest.json'));
const before=PNG.sync.read(fs.readFileSync(dir+'/before-town.png')),now=PNG.sync.read(fs.readFileSync('public/assets/pixel/processed/town.png'));
const changed=new Set(record.changedFrames),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
let preserved=0,opaque=0,transparent=0;
for(const [name,v]of Object.entries(oldMeta.frames)){
 const f=v.frame;if(JSON.stringify(v)!==JSON.stringify(meta.frames[name]))throw Error('Moved original frame '+name);
 if(changed.has(name))continue;
 for(let y=0;y<f.h;y++){const a=((f.y+y)*before.width+f.x)*4,b=((f.y+y)*now.width+f.x)*4;if(!before.data.subarray(a,a+f.w*4).equals(now.data.subarray(b,b+f.w*4)))throw Error('Protected pixel changed '+name);}
 preserved++;
}
for(const name of [...changed,...record.addedFrames]){const f=meta.frames[name].frame;for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){const a=now.data[((f.y+y)*now.width+f.x+x)*4+3];if(a!==0&&a!==255)throw Error('Nonbinary alpha '+name);if(a)opaque++;else transparent++;}}
for(const [name,s]of Object.entries(record.sources))if(hash(dir+'/'+s.file)!==s.sha256)throw Error('Original source changed '+name);
const result={date:'2026-10-15',protectedFrames:preserved,modifiedFrames:changed.size,addedFrames:record.addedFrames.length,allOldFrameCoordinatesUnchanged:true,binaryAlpha:true,opaquePixels:opaque,transparentPixels:transparent,sourceHashesMatch:true,PNG:hash('public/assets/pixel/processed/town.png'),metadata:hash('public/assets/pixel/processed/town.json')};
fs.mkdirSync('docs/verification/nature-v1',{recursive:true});fs.writeFileSync('docs/verification/nature-v1/pixel-audit.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
