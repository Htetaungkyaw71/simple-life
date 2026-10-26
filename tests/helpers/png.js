import assert from 'node:assert/strict';
import {inflateSync} from 'node:zlib';

export function decodeRgbaPng(buffer){
 assert.deepEqual([...buffer.subarray(0,8)],[137,80,78,71,13,10,26,10]);
 let offset=8,width=0,height=0,bitDepth=0,colorType=0,interlace=0;const idat=[];
 while(offset<buffer.length){
  const length=buffer.readUInt32BE(offset),type=buffer.toString('ascii',offset+4,offset+8),data=buffer.subarray(offset+8,offset+8+length);offset+=12+length;
  if(type==='IHDR'){width=data.readUInt32BE(0);height=data.readUInt32BE(4);bitDepth=data[8];colorType=data[9];interlace=data[12];}
  else if(type==='IDAT')idat.push(data);else if(type==='IEND')break;
 }
 assert.deepEqual({bitDepth,colorType,interlace},{bitDepth:8,colorType:6,interlace:0});
 const packed=inflateSync(Buffer.concat(idat)),stride=width*4,data=Buffer.alloc(stride*height);let source=0;
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<height;y++){
  const filter=packed[source++],row=y*stride,previous=row-stride;
  for(let x=0;x<stride;x++){
   const value=packed[source++],left=x>=4?data[row+x-4]:0,up=y?data[previous+x]:0,upperLeft=y&&x>=4?data[previous+x-4]:0;
   const prediction=filter===0?0:filter===1?left:filter===2?up:filter===3?Math.floor((left+up)/2):filter===4?paeth(left,up,upperLeft):NaN;
   assert.equal(Number.isNaN(prediction),false,`unsupported PNG filter ${filter}`);
   data[row+x]=(value+prediction)&255;
  }
 }
 return {width,height,data,pixels:data};
}
