import {decorationShape} from '../systems/settlementGeometry.js';
// Shared native artwork: the preview and placed piece have identical pixels.
// Side/back views are redrawn at their ground anchor, never turned sideways.
export function drawDecorationArt(scene,parent,type,direction='down',x=0,y=0,scale=2,depth=0){
 const shape=decorationShape({type,direction}),w=shape.w/2,h=shape.h/2;
 const add=n=>{parent?.add(n);return n;};
 const image=(frame,xx=x,yy=y)=>add(scene.add.image(xx,yy,'town',frame).setOrigin(0).setScale(scale).setDepth(depth));
 const graphics=()=>add(scene.add.graphics().setPosition(x,y).setScale(scale).setDepth(depth));
 const side=['left','right'].includes(direction),back=direction==='up'||direction==='right';
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
