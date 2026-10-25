// Verify native Pixel Snapper pixels, alpha removal and atlas preservation.
import fs from 'node:fs';
import {PNG} from './prop_pixels.mjs';

const root=new URL('../',import.meta.url),path=name=>new URL(name,root);
const read=name=>fs.readFileSync(path(name));
const output='output/art/city-cottage-snapper-v2/';
const source=PNG.sync.read(read(output+'original-pixel-snapper.png'));
const native=PNG.sync.read(read(output+'native-transparent-167x110.png'));
const before=PNG.sync.read(read(output+'before-town.png'));
const current=PNG.sync.read(read('public/assets/pixel/processed/town.png'));
const beforeMeta=JSON.parse(read(output+'before-town.json'));
const currentMeta=JSON.parse(read('public/assets/pixel/processed/town.json'));
const frame='city-review-cottage-terracotta-snapper',f=currentMeta.frames[frame].frame;
if(JSON.stringify(f)!==JSON.stringify({x:774,y:3927,w:167,h:110}))throw Error('Unexpected cottage atlas frame');
if(source.width!==native.width||source.height!==native.height)throw Error('Native canvas was resized');
for(let i=0;i<source.data.length;i+=4){
 const white=source.data[i]===255&&source.data[i+1]===255&&source.data[i+2]===255;
 if(white){if(native.data[i]||native.data[i+1]||native.data[i+2]||native.data[i+3])throw Error('White backdrop not transparent at pixel '+i/4);}
 else for(let c=0;c<4;c++)if(native.data[i+c]!==source.data[i+c])throw Error('Changed cottage pixel '+i/4+','+c);
}
for(const [name,record]of Object.entries(beforeMeta.frames))if(JSON.stringify(currentMeta.frames[name])!==JSON.stringify(record))throw Error('Changed frame '+name);
for(let y=0;y<current.height;y++)for(let x=0;x<current.width;x++){
 const i=(y*current.width+x)*4,inside=x>=f.x&&x<f.x+f.w&&y>=f.y&&y<f.y+f.h;
 for(let c=0;c<4;c++){
  const expected=inside?native.data[((y-f.y)*native.width+(x-f.x))*4+c]:before.data[i+c];
  if(current.data[i+c]!==expected)throw Error(`Unexpected atlas pixel ${x},${y},${c}`);
 }
}
const result={sourceCanvasExact:[source.width,source.height],nonWhitePixelsExact:true,transparentBackdrop:true,preExistingFramesExact:Object.keys(beforeMeta.frames).length,preExistingPixelsExact:true,nativePixelsExact:true,newFrame:frame,atlas:[current.width,current.height]};
fs.writeFileSync(path(output+'preservation-check.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
