import {BANK_PROFILE} from '../data/forestGrowth.js';
import {groundHash} from './groundSurface.js';
// Original native earth faces and grassy ramps. No columns, masonry or stairs.
export function bankTerrain(ctx,t){
 const x=t.x/2,y=t.y/2,w=t.w/2,front=i=>y+(t.h-24-BANK_PROFILE[i])/2;
 const rim=()=>{for(let i=0;i<8;i++){ctx.lineTo(x+i*16,front(i));ctx.lineTo(x+(i+1)*16,front(i));}};
 // One continuous exposed earth face, with a dark soil base and chipped strata.
 ctx.beginPath();ctx.moveTo(x,front(0));rim();
 for(let i=7;i>=0;i--){ctx.lineTo(x+(i+1)*16,front(i)+16);ctx.lineTo(x+i*16,front(i)+16);}
 ctx.closePath();ctx.fillStyle='#87543d';ctx.fill();
 for(let i=0;i<8;i++){
  const a=x+i*16,b=front(i);
  ctx.fillStyle='#624435';ctx.fillRect(a,b+13,16,3);ctx.fillStyle='#a46c43';ctx.fillRect(a,b+2,16,5);
  for(let n=0;n<18;n++){
   const seed=groundHash(i,n,t.x+t.y),xx=a+seed%16,yy=b+4+(seed>>>5)%11;
   ctx.fillStyle=seed%3?'#95613e':'#ba8854';ctx.fillRect(xx,yy,1+seed%3,1+seed%2);
  }
 }
 // Irregular turf silhouette preserves the underlying material glyphs.
 ctx.save();ctx.beginPath();ctx.moveTo(x,y+20);
 for(const [dx,dy]of [[8,8],[28,0],[54,2],[68,8],[108,4],[120,12],[128,26]])ctx.lineTo(x+dx,y+dy);
 ctx.lineTo(x+w,front(7));
 for(let i=7;i>=0;i--){ctx.lineTo(x+(i+1)*16,front(i));ctx.lineTo(x+i*16,front(i));}
 ctx.closePath();ctx.clip();ctx.fillStyle='rgba(180,192,115,.30)';ctx.fillRect(x,y,w,t.h/2);ctx.restore();
 for(let i=0;i<8;i++){ctx.fillStyle='#4f5c35';ctx.fillRect(x+i*16,front(i),16,2);}
 // The slope is ground all the way down, rather than a wooden stair sprite.
 const b=front(3);ctx.beginPath();ctx.moveTo(x+50,b-2);ctx.lineTo(x+78,b-2);ctx.lineTo(x+86,b+18);ctx.lineTo(x+42,b+18);ctx.closePath();ctx.fillStyle='#8a9b5b';ctx.fill();
 for(let n=0;n<22;n++){const seed=groundHash(n,t.y,813),xx=x+48+seed%30,yy=b+(seed>>>5)%18;ctx.fillStyle=seed%2?'#788c4d':'#a4ad6a';ctx.fillRect(xx,yy,2,1);}
}
