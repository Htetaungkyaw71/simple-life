import {HOMES} from '../data/homes.js';
const channels=c=>[c>>16&255,c>>8&255,c&255];
const shade=(c,n)=>channels(c).map(v=>Math.max(0,Math.min(255,Math.round(v*n))));
// Reuse the original starter pixels: palette/material changes never move ink.
// Every roof edge, door, window, planter and step keeps its exact native pixel.
export function homePixels(source,id,width=180){
 const out=new Uint8ClampedArray(source),d=HOMES[id];
 if(!d||id==='starter')return out;
 for(let i=0;i<out.length;i+=4){
  if(!out[i+3])continue;
  const x=i/4%width,y=Math.floor(i/4/width),c=source[i]*65536+source[i+1]*256+source[i+2];
  if(y>=129)continue;
  let color;
  if(c===0x493e33)color=shade(d.trim,.65);
  else if(c===0x75523e)color=channels(d.trim);
  else if(c===0xe9d4b9)color=channels(d.wall);
  else if(c===0xb99a78)color=channels(y<76?d.roof:d.trim);
  else if([0xcbb18d,0xc8ac89,0xb18a68,0xb19374,0xbb956e,0xd3b595,0x94765c,0xb58a67].includes(c))color=shade(y<76?d.roof:d.trim,(source[i]+source[i+1]+source[i+2])/459);
  else if(c===0x91a393||c===0x8e9d8f)color=shade(['coastal','glass'].includes(id)?0xa6c6be:0xabc2a7,c===0x8e9d8f?.92:1);
  else if(c===0x718347)color=channels(id==='rose'&&y>115&&y<123&&x%7<3?0xcf887d:d.accent);
  // Materials are confined to existing roof/wall pixels; structural trim and
  // patterned glazing retain their ink, spacing and positions.
  if(c===0xb99a78&&y<74){
   if(id==='glass'&&(x%17===0||y%13===0))color=channels(d.trim);
   if(id==='glass'&&x%17>2&&y%13>2)color=shade(d.roof,1.08);
  }
  if(c===0xe9d4b9&&y>78){
   if(id==='brick'&&(y%6===0||(x+(Math.floor(y/6)%2)*7)%14===0))color=shade(d.wall,.8);
   if(['orchard','alpine'].includes(id)&&(y%12===0||[24,65,111,151].includes(x)))color=channels(d.trim);
   if(id==='bamboo'&&(x%8===0||y%16===0))color=shade(d.trim,1.2);
   if(id==='manor'&&([24,25,26,65,66,67,110,111,112,151,152,153].includes(x)))color=channels(d.accent);
  }
  if(color)out.set(color,i);
 }
 return out;
}
