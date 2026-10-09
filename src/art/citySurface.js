import {groundHash} from './groundSurface.js';
// Native pixel masonry uses quiet clusters and stepped curbs, not repeated sprite seams.
const inside=(x,y,rect,pad=0)=>{const [rx,ry,rw,rh]=rect;return x>=rx/2-pad&&x<(rx+rw)/2+pad&&y>=ry/2-pad&&y<(ry+rh)/2+pad;};
const rounded=(ctx,rect,color)=>{const [x,y,w,h]=rect.map(v=>v/2);ctx.fillStyle=color;ctx.fillRect(x+6,y,w-12,h);ctx.fillRect(x+2,y+2,w-4,h-4);ctx.fillRect(x,y+6,w,h-12);};
export function paintCity(ctx,map){
 const walks=[...map.sidewalks,...map.squares];
 for(const r of walks){rounded(ctx,r,'#655f51');rounded(ctx,[r[0]+2,r[1]+2,r[2]-4,r[3]-4],'#e6dcc4');rounded(ctx,[r[0]+6,r[1]+6,r[2]-12,r[3]-12],'#c9c1ab');}
 for(let y=88;y<map.size.height/2;y+=8)for(let x=0;x<map.size.width/2;x+=16){const xx=x+(y%16?8:0);if(walks.some(r=>inside(xx+8,y+4,r,-5))){ctx.fillStyle=['#c5beaa','#d1c7b2','#c9c1ac'][groundHash(x,y,195)%3];ctx.fillRect(xx,y,15,7);ctx.fillStyle='#b4af9e';ctx.fillRect(xx,y+7,15,1);}}
 const roads=[...map.paving,...map.squares.map(([x,y,w,h])=>[x+12,y+12,w-24,h-24])];
 for(const r of roads)rounded(ctx,r,'#aaa99a');
 for(let y=80;y<map.size.height/2;y+=6)for(let x=0;x<map.size.width/2;x+=18){const xx=x+(Math.floor(y/6)%2?9:0);if(roads.some(r=>inside(xx+9,y+3,r,-2))){const k=groundHash(Math.floor(xx/3),y,322)%5;ctx.fillStyle=['#b3b0a1','#a3a69b','#bdb7a6','#adb0a3','#a9a99f'][k];ctx.fillRect(xx,y,17,5);ctx.fillStyle='#8d928a';ctx.fillRect(xx,y+5,17,1);if(k===0){ctx.fillStyle='#c8c0ad';ctx.fillRect(xx+2,y,12,1);}}}
 for(const r of map.gardens){rounded(ctx,r,'#656554');rounded(ctx,[r[0]+4,r[1]+4,r[2]-8,r[3]-8],'#d1d0b7');rounded(ctx,[r[0]+12,r[1]+12,r[2]-24,r[3]-24],'#814d3b');const [x,y,w,h]=r.map(v=>v/2);for(let yy=y+9;yy<y+h-9;yy+=3)for(let xx=x+9;xx<x+w-9;xx+=3){const n=groundHash(xx,yy,33);if(n%7===0){ctx.fillStyle=n%2?'#916043':'#724836';ctx.fillRect(xx,yy,3,2);}}}
 // A cream river embankment; bridge landings remain open.
 ctx.fillStyle='#d7cfb5';ctx.fillRect(0,14,map.size.width/2,2);ctx.fillRect(0,80,map.size.width/2,3);ctx.fillStyle='#787e70';ctx.fillRect(0,83,map.size.width/2,2);
}
