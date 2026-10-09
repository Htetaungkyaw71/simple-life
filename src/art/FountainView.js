// Native-pixel cascading streams, falling highlights and expanding basin rings.
export class FountainView{
 constructor(scene){this.items=scene.fountains.map(f=>({sprite:f.sprite,g:scene.add.graphics().setScale(2).setPosition(f.sprite.x,f.sprite.y).setDepth(f.sprite.depth+.1)}));}
 update(time){const tick=Math.floor(time/110);if(tick===this.tick)return;this.tick=tick;
  for(const {g}of this.items){g.clear();
   for(const [i,x]of [25,30,48,54].entries()){
    g.fillStyle(0xa9c5c5,.6).fillRect(x,26,1,26);
    for(let j=0;j<3;j++){const y=27+(tick*2+i*4+j*9)%25;g.fillStyle(0xe7eddf,.9).fillRect(x,y,1,3).fillRect(x+(i%2?1:-1),y+3,1,1);}
   }
   for(let i=0;i<12;i++){const angle=i*Math.PI/6,r=9+(tick+i*2)%6,x=Math.round(40+Math.cos(angle)*r),y=Math.round(55+Math.sin(angle)*r*.4);g.fillStyle(i%3?0xdbe7db:0x98b7b7,.85).fillRect(x,y,i%2?2:1,1);}
   for(let ring=0;ring<2;ring++){const r=18+(tick+ring*8)%16;for(let i=0;i<24;i++){if((i+tick)%5===0)continue;const a=i*Math.PI/12,x=Math.round(40+Math.cos(a)*r),y=Math.round(54+Math.sin(a)*r*.4);g.fillStyle(ring?0xc3d5d0:0xb0c9c8,.55).fillRect(x,y,2,1);}}
   const spray=tick%6;g.fillStyle(0xdce8df,.9).fillRect(38,1-spray,1,2).fillRect(42,3-(spray+3)%6,1,2);
  }
 }
}
