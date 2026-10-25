// Verify the cottage append is exact and changes no pre-existing atlas pixel/frame.
import fs from 'node:fs';
import {PNG} from './prop_pixels.mjs';

const root=new URL('../',import.meta.url),path=name=>new URL(name,root);
const read=name=>fs.readFileSync(path(name));
const output='output/art/city-cottage-terracotta-v1/';
const before=PNG.sync.read(read(output+'before-town.png'));
const current=PNG.sync.read(read('public/assets/pixel/processed/town.png'));
const native=PNG.sync.read(read(output+'native-120x112.png'));
const beforeMeta=JSON.parse(read(output+'before-town.json'));
const currentMeta=JSON.parse(read('public/assets/pixel/processed/town.json'));
const frame='city-review-cottage-terracotta',f=currentMeta.frames[frame].frame;
if(JSON.stringify(f)!==JSON.stringify({x:774,y:3927,w:120,h:112}))throw Error('Unexpected cottage atlas frame');
for(const [name,record]of Object.entries(beforeMeta.frames))if(JSON.stringify(currentMeta.frames[name])!==JSON.stringify(record))throw Error('Changed frame '+name);
for(let y=0;y<current.height;y++)for(let x=0;x<current.width;x++){
 const i=(y*current.width+x)*4,inside=x>=f.x&&x<f.x+f.w&&y>=f.y&&y<f.y+f.h;
 for(let c=0;c<4;c++){
  const expected=inside?native.data[((y-f.y)*native.width+(x-f.x))*4+c]:before.data[i+c];
  if(current.data[i+c]!==expected)throw Error(`Unexpected atlas pixel ${x},${y},${c}`);
 }
}
const result={preExistingFramesExact:Object.keys(beforeMeta.frames).length,preExistingPixelsExact:true,nativePixelsExact:true,newFrame:frame,atlas:[current.width,current.height]};
fs.writeFileSync(path(output+'preservation-check.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
