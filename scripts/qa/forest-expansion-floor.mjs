// Offline pixel-material QA only; this is not a browser acceptance harness.
import {writeFileSync} from 'node:fs';
import {FOREST_MAP,FOREST_SIZE} from '../../src/data/forest.js';
import {waterRows} from '../../src/data/water.js';
import {paintGround,paintWater,shoreDistance,paintGroundDetails} from '../../src/art/groundSurface.js';
const w=FOREST_SIZE.width/2,h=FOREST_SIZE.height/2,pixels=new Uint8ClampedArray(w*h*4),water=new Uint8Array(w*h),path=new Uint8Array(w*h);
const start=performance.now(),fields=paintGround(pixels,w,h,FOREST_MAP.biomes);
for(const [x,y,pw] of waterRows(FOREST_MAP))for(let xx=Math.max(0,x/2);xx<Math.min(w,(x+pw)/2);xx++)water[Math.floor(y/2)*w+xx]=1;
const distance=shoreDistance(water,w,h);paintWater(pixels,water,distance,w,h,fields);
const ctx={fillStyle:'#000000',fillRect(x,y,ww,hh){const c=this.fillStyle.startsWith('#')?this.fillStyle.slice(1).match(/../g).map(v=>parseInt(v,16)):this.fillStyle.match(/\d+/g).map(Number);for(let yy=Math.max(0,y);yy<Math.min(h,y+hh);yy++)for(let xx=Math.max(0,x);xx<Math.min(w,x+ww);xx++){const i=(yy*w+xx)*4;pixels.set(c,i);pixels[i+3]=255;}}};
paintGroundDetails(ctx,w,h,path,water,distance,FOREST_MAP.biomes,fields.soil);
writeFileSync('/tmp/simplelife-expansion-floor.rgba',pixels);writeFileSync('/tmp/simplelife-expansion-map.json',JSON.stringify(FOREST_MAP));console.log('Offline terrain bake ms',Math.round(performance.now()-start));
