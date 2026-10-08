import {test} from 'node:test';
import assert from 'node:assert/strict';
import {paintGround,shoreDistance,paintWater} from '../src/art/groundSurface.js';

test('ground has coherent variations without the former 16-pixel tile repetition',()=>{
 const w=128,h=96,a=new Uint8ClampedArray(w*h*4),b=new Uint8ClampedArray(w*h*4);
 paintGround(a,w,h);paintGround(b,w,h);assert.deepEqual(a,b,'reloading reproduces the same ground');
 let differences=0;for(let y=0;y<h;y++)for(let x=0;x<w-16;x++)if(a[(y*w+x)*4]!==a[(y*w+x+16)*4])differences++;
 assert.ok(differences>(w-16)*h*.6,'ground cannot repeat one flat tile');
 const colors=new Set();for(let i=0;i<a.length;i+=4){colors.add(a.slice(i,i+3).join(','));assert.equal(a[i+3],255);}assert.ok(colors.size>10);
});
test('bank distances follow the actual water union, including narrow bends and inner islands',()=>{
 const w=40,h=40,water=new Uint8Array(w*h);for(let y=4;y<36;y++)for(let x=4;x<36;x++)water[y*w+x]=1;
 for(let y=16;y<24;y++)for(let x=16;x<24;x++)water[y*w+x]=0;
 const d=shoreDistance(water,w,h);assert.equal(d[4*w+8],0);assert.equal(d[3*w+8],0);assert.equal(d[8*w+8],4);assert.equal(d[16*w+18],0);assert.equal(d[15*w+18],0);assert.equal(d[20*w+20],3);
});
test('neighbouring habitat colours blend at their shared boundary',()=>{
 const w=160,h=100,pixels=new Uint8ClampedArray(w*h*4);
 paintGround(pixels,w,h,[{x:0,y:0,w:160,h:200,biome:'jungle'},{x:160,y:0,w:160,h:200,biome:'savanna'}]);
 const jungle=new Uint8ClampedArray(pixels.length),savanna=new Uint8ClampedArray(pixels.length);
 paintGround(jungle,w,h,[{x:0,y:0,w:320,h:200,biome:'jungle'}]);paintGround(savanna,w,h,[{x:0,y:0,w:320,h:200,biome:'savanna'}]);
 // Compare palette blending independently of the intentional sharp moss edges.
 for(let y=0;y<h;y++)for(const x of [79,80])for(let c=0;c<3;c++){const i=(y*w+x)*4+c;assert.ok(Math.abs(pixels[i]-(jungle[i]+savanna[i])/2)<=1,'shared habitat edge blends the two palettes');}
 const fields=paintGround(pixels,w,h,[{x:0,y:0,w:160,h:200,biome:'jungle'},{x:160,y:0,w:160,h:200,biome:'savanna'}]);
 assert.ok(fields.soil.some(Boolean),'forest has exposed soil pockets');

});
test('deep channel is darker than shallow water, and distant land stays intact',()=>{
 const w=100,h=100,water=new Uint8Array(w*h),pixels=new Uint8ClampedArray(w*h*4),fields=paintGround(pixels,w,h),land=pixels.slice(0,4);
 for(let y=20;y<80;y++)for(let x=20;x<80;x++)water[y*w+x]=1;
 paintWater(pixels,water,shoreDistance(water,w,h),w,h,fields);assert.deepEqual(pixels.slice(0,4),land);
 const brightness=(x,y)=>pixels[(y*w+x)*4]+pixels[(y*w+x)*4+1]+pixels[(y*w+x)*4+2];
 assert.ok(brightness(50,50)<brightness(25,50)-50);for(let i=3;i<pixels.length;i+=4)assert.equal(pixels[i],255);
});
