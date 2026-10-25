import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {inflateSync} from 'node:zlib';
import {CROPS} from '../src/data/crops.js';

const CROPS_IMPORTED=['tomato','strawberry','carrot','corn','chili','eggplant','watermelon','pumpkin','grape','blueberry','sweetPotato'];
const STATES=['seed','sprout','young','flowering','ripe','dry','wilted','dead'];

function decodeRgbaPng(buffer){
 assert.deepEqual([...buffer.subarray(0,8)],[137,80,78,71,13,10,26,10]);
 let offset=8,width=0,height=0,bitDepth=0,colorType=0,interlace=0;const idat=[];
 while(offset<buffer.length){
  const length=buffer.readUInt32BE(offset),type=buffer.toString('ascii',offset+4,offset+8),data=buffer.subarray(offset+8,offset+8+length);offset+=12+length;
  if(type==='IHDR'){width=data.readUInt32BE(0);height=data.readUInt32BE(4);bitDepth=data[8];colorType=data[9];interlace=data[12];}
  else if(type==='IDAT')idat.push(data);else if(type==='IEND')break;
 }
 assert.deepEqual({bitDepth,colorType,interlace},{bitDepth:8,colorType:6,interlace:0});
 const packed=inflateSync(Buffer.concat(idat)),stride=width*4,pixels=Buffer.alloc(stride*height);let src=0;
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){
  const filter=packed[src++],row=y*stride,previous=row-stride;
  for(let x=0;x<stride;x++){
   const value=packed[src++],left=x>=4?pixels[row+x-4]:0,up=y?pixels[previous+x]:0,upperLeft=y&&x>=4?pixels[previous+x-4]:0;
   pixels[row+x]=(value+(filter===0?0:filter===1?left:filter===2?up:filter===3?Math.floor((left+up)/2):filter===4?paeth(left,up,upperLeft):NaN))&255;
  }
 }
 return {width,height,pixels};
}

test('all imported crop keys exist in the runtime atlas with binary alpha',async()=>{
 const [metadata,png]=await Promise.all([
  readFile('public/assets/pixel/processed/town.json','utf8').then(JSON.parse),
  readFile('public/assets/pixel/processed/town.png').then(decodeRgbaPng),
 ]);
 for(const crop of CROPS_IMPORTED){
  const manifest=JSON.parse(await readFile(`docs/assets/licenses/${crop}-import-v1/manifest.json`,'utf8'));
  const candidate=decodeRgbaPng(await readFile(manifest.candidateB.path));
  const prePalette=decodeRgbaPng(await readFile(manifest.candidateB.prePalettePath));
  assert.equal(CROPS[crop].visualScale,1,crop);
  assert.equal(CROPS[crop].anchorX,manifest.candidateB.anchor.anchorX,crop);
  assert.equal(CROPS[crop].signOffsetY,CROPS[crop].baseOffsetY-manifest.candidateB.placements[4].trimmedHeight-36,crop);
  assert.deepEqual(manifest.cleanup.alphaValues,[0,255],crop);
  if(manifest.cleanup.soil.over25PercentStages)assert.deepEqual(manifest.cleanup.soil.over25PercentStages,[],crop);
  if(manifest.cleanup.soil.deadConnectedComponents)assert.equal(manifest.cleanup.soil.deadConnectedComponents,1,crop);
  assert.equal(manifest.paletteRemap.constants.SATURATION_SCALE,.78,crop);
  assert.equal(manifest.paletteRemap.constants.HUE_SHIFT,8,crop);
  assert.equal(manifest.paletteRemap.constants.LIGHTNESS_SCALE,.94,crop);
  assert.ok(manifest.paletteRemap.ripeGreenContrast.greenLightnessSpan>=12,crop);
  assert.deepEqual([candidate.width,candidate.height],[manifest.candidateB.frameSize[0]*STATES.length,manifest.candidateB.frameSize[1]],crop);
  assert.deepEqual([prePalette.width,prePalette.height],[candidate.width,candidate.height],crop);
  for(const [stageIndex,state] of STATES.entries()){
   const key=`${crop}-${state}`,record=metadata.frames[key];assert.ok(record,key);
   assert.deepEqual(record.sourceSize,{w:manifest.candidateB.frameSize[0],h:manifest.candidateB.frameSize[1]},key);
   const {x,y,w,h}=record.frame;let opaque=0;
   for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){
    const atlasOffset=(yy*png.width+xx)*4,candidateOffset=((yy-y)*candidate.width+stageIndex*w+(xx-x))*4;
    assert.deepEqual([...png.pixels.subarray(atlasOffset,atlasOffset+4)],[...candidate.pixels.subarray(candidateOffset,candidateOffset+4)],`${key} source-exact pixel`);
    const alpha=png.pixels[atlasOffset+3];
    assert.ok(alpha===0||alpha===255,`${key} alpha ${alpha}`);opaque+=alpha===255;
   }
    assert.ok(opaque>0,`${key} is not empty`);
    for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){
     const offset=(yy*candidate.width+stageIndex*w+xx)*4;
     assert.equal(candidate.pixels[offset+3],prePalette.pixels[offset+3],`${key} palette remap changed alpha`);
     if(['seed','dry','wilted','dead'].includes(state))assert.deepEqual(candidate.pixels.subarray(offset,offset+4),prePalette.pixels.subarray(offset,offset+4),`${key} protected palette stage`);
    }
  }
 }
});
