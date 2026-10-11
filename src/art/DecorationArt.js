import {decorationShape} from '../systems/settlementGeometry.js';
// Shared native artwork: the preview and placed piece have identical pixels.
// Side/back views are redrawn at their ground anchor, never turned sideways.
export function drawDecorationArt(scene,parent,type,direction='down',x=0,y=0,scale=2,depth=0){
 const shape=decorationShape({type,direction}),w=shape.w/2,h=shape.h/2;
 const add=n=>{parent?.add(n);return n;};
 const image=(frame,xx=x,yy=y)=>add(scene.add.image(xx,yy,'town',frame).setOrigin(0).setScale(scale).setDepth(depth));
 const graphics=()=>add(scene.add.graphics().setPosition(x,y).setScale(scale).setDepth(depth));
 const side=['left','right'].includes(direction),back=direction==='up'||direction==='right';
 if(['oak','palm'].includes(type)){const frame=type==='oak'?'forest-oak-0':'forest-palm-0',f=scene.textures.getFrame('town',frame),s=Math.min(w/(f.width||56),h/(f.height||72))*scale;add(scene.add.image(x+w*scale/2,y+h*scale,'town',frame).setOrigin(.5,1).setScale(s).setDepth(depth));return;}
 if(['blossom','hedge','flowers','birdbath','rug','bookcase','vase'].includes(type)){
  const g=graphics(),r=(c,a,b,ww,hh)=>g.fillStyle(c).fillRect(a,b,ww,hh);
  if(type==='blossom'){r(0x69543b,21,26,6,34);r(0x947550,23,28,2,30);r(0x7a9160,8,10,32,30);r(0xb7808a,4,12,40,21);r(0xd9a1a3,8,6,32,29);r(0xe8b6ae,14,2,22,34);for(let i=0;i<10;i++)r(i%2?0xf2d3bd:0xba7c86,6+i*4,12+i%3*7,4,3);}
  if(type==='hedge'){r(0x665841,2,16,28,4);r(0x58794f,1,5,30,12);r(0x86a363,4,2,24,12);for(let i=0;i<6;i++)r(0xa7b778,3+i*5,5,3,2);}
  if(type==='flowers')for(let i=0;i<7;i++){const xx=2+i*3,yy=4+i%3*3;r(0x779052,xx,yy+3,2,9-yy/2);r(i%2?0xe4aa73:0xd28d92,xx-1,yy,4,3);r(0xf4df9c,xx,yy,1,1);}
  if(type==='birdbath'){r(0x667168,8,8,4,17);r(0xa3ada0,9,9,2,15);r(0x78847b,3,5,14,5);r(0xc5cbb5,2,3,16,4);r(0x8db3ad,4,3,12,2);r(0x78847b,5,24,10,3);r(0xb4bbaa,6,23,8,2);}
  if(type==='rug'){r(0x775a4b,0,0,32,24);r(0xd3aa75,1,1,30,22);r(0x89986a,3,3,26,18);for(let i=0;i<5;i++){r(0xe5cf9d,5+i*5,5,2,2);r(0xe5cf9d,5+i*5,17,2,2);}r(0xe5cf9d,13,8,6,8);}
  if(type==='bookcase'){r(0x624938,1,1,22,31);r(0xb48659,3,2,18,28);for(let row=0;row<3;row++){r(0x765740,3,9+row*9,18,2);for(let i=0;i<5;i++)r([0x859669,0xd4ab74,0x91aba3,0xc58a79,0x9b92a8][i],4+i*3,3+row*9,2,6);}}
  if(type==='vase'){r(0x708d59,7,1,2,11);r(0x708d59,11,2,2,10);r(0xd79794,5,0,5,4);r(0xe5bd75,10,1,5,4);r(0x839c99,3,11,10,9);r(0xaac0ac,5,12,6,10);r(0x637d76,5,21,6,2);}
  return;
 }
 if(type==='path'){const g=graphics();g.fillStyle(0x756f61).fillRect(0,0,24,24);for(let row=0;row<3;row++)for(let col=0;col<3;col++){const a=col*8,b=row*8;g.fillStyle((row+col)%2?0xa8a28d:0xb8b09a).fillRect(a+1,b+1,6,6);g.fillStyle(0xd4ccb6).fillRect(a+1,b+1,6,1);g.fillStyle(0x8c8673).fillRect(a+1,b+6,6,1);}return;}
 if(type==='table'||type==='bench'&&direction!=='down'){
  const g=graphics(),edge=0x543d32,wood=0x956748,light=0xc89b6b;
  const rect=(color,a,b,c,d)=>g.fillStyle(color).fillRect(a,b,c,d);
  if(type==='bench'){
   rect(edge,2,4,w-4,h-6);rect(wood,3,5,w-6,h-9);
   if(side){const bx=back?w-7:2;rect(edge,bx,1,5,h-5);for(let i=0;i<3;i++)rect(light,bx+1,2+i*8,3,6);rect(light,8,6,5,h-13);rect(edge,5,h-5,3,5);rect(edge,w-7,h-5,3,5);}
   else{for(let i=0;i<3;i++){rect(light,2,2+i*4,w-4,2);rect(wood,2,4+i*4,w-4,2);}rect(edge,4,h-5,3,5);rect(edge,w-7,h-5,3,5);}
  }else{
   rect(edge,side?6:3,side?3:6,side?w-12:w-6,side?h-6:h-12);
   rect(wood,side?7:4,side?4:7,side?w-14:w-8,side?h-8:h-14);
   for(let i=0;i<3;i++)if(side)rect(light,8+i*3,5,1,h-10);else rect(light,5,8+i*3,w-10,1);
   if(side){for(const a of [1,w-5]){rect(edge,a,5,4,h-8);rect(light,a+1,6,2,h-11);}}else for(const b of [1,h-5]){rect(edge,5,b,w-10,4);rect(light,6,b+1,w-12,2);}
   rect(edge,side?8:6,h-4,3,4);rect(edge,w-9,h-4,3,4);
  }return;
 }
 if(type==='fence'&&side){const g=graphics();g.fillStyle(0x553e32).fillRect(4,0,4,24);g.fillStyle(0x946746).fillRect(5,1,2,22);for(const yy of [2,9,17]){g.fillStyle(0xc49968).fillRect(2,yy,8,3);g.fillStyle(0x553e32).fillRect(2,yy+3,8,1);}return;}
 const frame={bench:'bench',planter:'planter',fence:'fence',barrel:'barrel',lantern:'lamp'}[type];
 image(frame).setFlipX(back);if(type==='planter')image('flowers2',x,y-8*scale).setFlipX(back);
}
