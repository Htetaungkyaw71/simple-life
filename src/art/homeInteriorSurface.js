import {HOMES} from '../data/homes.js';
import {ROOM_SURFACE} from '../data/interior.js';
const rgb=c=>[c>>16&255,c>>8&255,c&255];
const shift=(c,n)=>rgb(c).reduce((v,x,i)=>v+(Math.max(0,Math.min(255,x+n))<<(16-i*8)),0);
// Original pixel architecture from the human-approved standalone room preview.
// Integer rasterization keeps diagonal tile edges crisp in both Phaser renderers.
export function homeInteriorSurface(width,height,design='starter'){
 const back=new Uint8ClampedArray(width*height*4),front=new Uint8ClampedArray(back.length);
 const floorY=ROOM_SURFACE.floorY,frontY=height-ROOM_SURFACE.front,gap=[width/2-36,width/2+36];
 const custom=design!=='starter'&&HOMES[design],home=HOMES[design]||HOMES.starter;
 const wall=custom?home.wall:0xf0ddbc,side=custom?shift(home.wall,-18):0xdfc09e;
 const floor=custom?home.floor:0xc4937b,trim=custom?home.trim:0xb87e62;
 const ink=(buffer,x,y,c)=>{if(x<0||x>=width||y<0||y>=height)return;const i=(y*width+x)*4;buffer.set([...rgb(c),255],i);};
 const rect=(buffer,x,y,w,h,c)=>{for(let yy=Math.max(0,Math.round(y));yy<Math.min(height,Math.round(y+h));yy++)for(let xx=Math.max(0,Math.round(x));xx<Math.min(width,Math.round(x+w));xx++)ink(buffer,xx,yy,c);};
 const floorPixel=(x,y)=>x>=16&&x<width-16&&y>=floorY&&y<frontY||x>=gap[0]&&x<gap[1]&&y>=frontY&&y<height;
 const pixel=(x,y,c)=>{if(floorPixel(x,y))ink(back,x,y,c);};
 function line(x,y,tx,ty,c){
  const dx=Math.abs(tx-x),sx=x<tx?1:-1,dy=-Math.abs(ty-y),sy=y<ty?1:-1;let error=dx+dy;
  while(true){pixel(x,y,c);if(x===tx&&y===ty)break;const twice=2*error;if(twice>=dy){error+=dy;x+=sx;}if(twice<=dx){error+=dx;y+=sy;}}
 }
 for(let row=0,cy=floorY-32;cy<height+48;cy+=16,row++)for(let col=0,cx=-40;cx<width+80;cx+=40,col++){
  const center=cx+20*(row%2),fill=custom?shift(floor,[0,2,-2][(col+row*2)%3]):[0xc4937b,0xc6957d,0xc29179][(col+row*2)%3];
  for(let y=cy-16;y<=cy+16;y++){const half=Math.floor(20*(1-Math.abs(y-cy)/16));for(let x=center-half;x<=center+half;x++)pixel(x,y,fill);}
  const edge=custom?shift(floor,-15):0xb9836e,light=custom?shift(floor,12):0xd0a187;
  line(center,cy-16,center+20,cy,edge);line(center+20,cy,center,cy+16,edge);
  line(center,cy+16,center-20,cy,edge);line(center-20,cy,center,cy-16,edge);
  line(center-19,cy,center,cy-15,light);line(center,cy-15,center+19,cy,light);
 }
 rect(back,0,0,width,8,custom?shift(trim,-35):0x714b3b);
 rect(back,0,8,width,2,custom?shift(trim,22):0xbf8e6e);
 rect(back,0,10,width,86,wall);rect(back,16,10,width-32,3,shift(wall,9));
 rect(back,16,94,width-32,2,custom?shift(wall,-20):0xdec0a0);
 rect(back,16,96,width-32,2,trim);rect(back,16,98,width-32,2,custom?shift(wall,4):0xf5dfbc);
 rect(back,16,100,width-32,8,custom?shift(wall,-12):0xe9cba8);
 for(let x=32;x<width-16;x+=40)rect(back,x,101,1,7,custom?shift(wall,-28):0xd5ab89);
 rect(back,16,108,width-32,2,custom?shift(wall,-4):0xf2d7b1);
 rect(back,16,110,width-32,2,custom?shift(trim,-5):0xa8765c);
 // Continuous side faces; only their vertical profiles repeat along the edge.
 rect(front,0,8,16,height-8,side);rect(front,0,8,3,height-8,custom?shift(trim,-30):0x77503f);
 rect(front,3,10,2,height-10,custom?shift(wall,4):0xf3ddba);
 rect(front,14,10,2,frontY-10,custom?shift(side,-30):0xb98d70);
 rect(front,width-16,8,16,height-8,side);rect(front,width-3,8,3,height-8,custom?shift(trim,-30):0x77503f);
 rect(front,width-16,10,2,frontY-10,custom?shift(side,-30):0xb98d70);
 rect(front,width-5,10,2,height-10,custom?shift(wall,-4):0xefd5b1);
 for(const [left,right]of [[3,gap[0]],[gap[1],width-3]]){
  rect(front,left,frontY,right-left,32,custom?shift(wall,-16):0xe6c8a5);
  rect(front,left,frontY,right-left,3,custom?shift(trim,-12):0x8f604a);
  rect(front,left,frontY+3,right-left,2,custom?shift(wall,4):0xf5dfbd);
  rect(front,left,height-2,right-left,2,custom?shift(trim,15):0xb88c6c);
 }
 // Flush timber belongs to the floor plane, with no upright railing/posts.
 rect(back,gap[0],frontY-1,72,9,0x7e513b);rect(back,gap[0]+1,frontY,70,6,0xb37a52);
 rect(back,gap[0]+1,frontY,70,1,0xd4a174);rect(back,gap[0]+1,frontY+3,70,1,0x986241);
 for(const x of [gap[0]+22,gap[0]+48])rect(back,x,frontY+1,1,2,0x8d5a40);
 return {width,height,back,front};
}
