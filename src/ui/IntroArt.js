import {keepsakePixels} from './KeepsakeArt.js';
// Original illustrations: integer pixels, deterministic texture and the world palette.
export function introArt(u,l,art,y,height){
 const g=u.add.graphics();u.root.add(g);const x=l.x+12,w=l.w-24,cx=Math.floor(x+w/2),floor=y+height-7;
 const r=(a,b,ww,hh,c)=>{a=Math.max(x,Math.floor(a));b=Math.max(y,Math.floor(b));ww=Math.min(ww,x+w-a);hh=Math.min(hh,y+height-b);if(ww>0&&hh>0)g.fillStyle(c).fillRect(a,b,ww,hh);};
 const grass=(top)=>{r(x,top,w,y+height-top,0x8d9b66);for(let i=0;i<w;i+=3){const py=top+(i*17)%Math.max(1,y+height-top);r(x+i,py,1,2,i%2?0xa5b67b:0x748557);}};
 const tree=(px,py,size,light)=>{
  r(px-2,py+size*.5,5,size*.65,0x76583d);r(px,py+size*.6,1,size*.45,0xb17c50);
  for(let row=0;row<5;row++){const half=Math.floor(size*(row===0?.24:row===4?.3:.46)),ty=py+row*size/7;r(px-half,ty,half*2,Math.ceil(size/5),light?0x607947:0x485f40);}
  for(let i=0;i<20;i++){const dx=(i*7)%Math.max(2,size)-size/2,dy=(i*11)%Math.max(2,size*.7);if(Math.abs(dx)<size*.36)r(px+dx,py+dy,3,2,light?(i%2?0x8d9d60:0x779055):0x627b4a);}
 };
 const person=(px,py,coat=0xc09555,hat=true)=>{
  r(px-3,py-13,6,5,0xe1b781);r(px+2,py-11,1,1,0x423a32);r(px-3,py-8,6,6,coat);r(px-4,py-7,1,4,0xe1b781);r(px+3,py-7,2,4,0x805c43);r(px-3,py-2,2,2,0x423a32);r(px+1,py-2,2,2,0x423a32);r(px-2,py-8,1,6,0xe5d3a2);if(hat){r(px-4,py-14,8,2,0xd8ac61);r(px-2,py-16,4,2,0xb7864b);}
 };
 r(x,y,w,height,art==='city'?0xa9b4ae:0xdedbb6);
 if(art==='city'){
  for(let i=0;i<9;i++){const px=x+3+i*Math.floor(w/9),bw=Math.floor(w/10),h=12+(i*7)%Math.max(13,height-12),top=floor-h;r(px,top,bw,h,i%2?0x787a68:0x8b9380);r(px,top,bw,2,0x596252);r(px+bw-3,top+2,3,h-2,0x626d60);for(let k=4;k<h-2;k+=7)for(let j=3;j<bw-3;j+=5){r(px+j,top+k,3,4,0x596252);r(px+j,top+k,2,2,i%3?0xe4d1a0:0xbdc6ab);}}
  r(x,floor,w,7,0x504943);for(let i=0;i<w;i+=17)r(x+i,floor+3,9,1,0xd8ac61);
  for(let i=0;i<5;i++)person(x+13+i*(w-26)/5,floor,0x747b65,false);
  r(cx-10,floor-2,20,2,0x3c443a);person(cx,floor,0xb88250);for(let i=0;i<3;i++)r(cx+7+i*4,floor-18-i*2,2,2,0xe9dfb8);
 }else if(art==='letter'){
  r(x,y,w,height,0x93694c);for(let i=0;i<height;i+=8){r(x,y+i,w,1,0x805c43);for(let j=0;j<w;j+=19)r(x+j+(i%3)*3,y+i+4,10,1,0x9f7853);}
  const px=cx-24,py=y+4,ph=height-9;r(px+2,py+2,49,ph,0x674e3a);r(px,py,48,ph,0xfff4d5);r(px+1,py+1,2,ph-2,0xddcba4);r(px+42,py+2,5,2,0xe1d4b0);
  for(let i=0;i<Math.min(6,Math.floor((ph-8)/5));i++){r(px+8,py+7+i*5,23+(i%2)*7,1,0xa37035);r(px+9+(i*7)%20,py+7+i*5,2,1,0xfff4d5);}
  r(cx-50,floor-5,19,7,0xdbcba3);r(cx-49,floor-5,17,1,0xfff4d5);r(cx-45,floor-3,7,1,0xab9573);r(cx+34,y+height/2,2,height/3,0x423a32);r(cx+34,y+height/2-3,2,4,0xd8ac61);keepsakePixels(g,cx+47,y+height/2-7);
 }else if(art==='farm'){
  grass(floor-9);for(const dx of [-w*.38,w*.37])tree(cx+dx,y+3,height*.65,true);
  const roof=y+5,base=floor-1;r(cx-26,roof+9,52,Math.max(8,base-roof-9),0xdbc399);r(cx+21,roof+9,5,base-roof-9,0xbca675);r(cx-26,base-3,52,4,0x8b805e);
  for(let i=roof+15;i<base-4;i+=5){r(cx-25,i,46,1,0xbdab80);for(let j=0;j<5;j++)r(cx-22+j*9+(i%3),i-2,3,1,0xe9d5ac);}
  r(cx-29,roof+7,58,4,0x79573f);r(cx-25,roof+3,50,5,0xa77453);r(cx-20,roof,40,4,0xc58d61);for(let row=0;row<3;row++)for(let i=0;i<7;i++)r(cx-24+i*7+(row%2)*2,roof+2+row*3,5,1,0xdfac79);
  r(cx+16,roof-3,5,7,0x89725b);r(cx+16,roof-3,6,1,0xb8a38a);
  for(const px of [cx-21,cx+10]){r(px,roof+14,12,9,0x79573f);r(px+1,roof+15,10,6,0xb4c897);r(px+6,roof+15,1,6,0xffefcf);r(px+1,roof+18,10,1,0xe8dfaf);r(px-1,roof+23,14,2,0x69814a);r(px+1,roof+22,2,2,0xd4ae76);}
  r(cx-5,base-13,10,14,0x76583d);r(cx-4,base-12,8,12,0xa78155);r(cx-1,base-12,1,11,0x79573f);r(cx+2,base-7,1,1,0xe1be75);r(cx-8,base+1,16,2,0xc6b087);r(cx-9,base+3,18,2,0xa99b77);
  for(const dx of [-60,48]){r(cx+dx,floor-2,20,6,0x76583d);for(let n=0;n<3;n++){r(cx+dx+2+n*6,floor-4,4,2,0x567440);r(cx+dx+3+n*6,floor-5,2,2,0x94ad62);}}
  person(cx+34,floor+5);
 }else{
  grass(floor-6);for(let layer=0;layer<2;layer++)for(let i=0;i<8;i++)tree(x+7+i*(w-14)/7+(layer?5:0),y+2+layer*9,height*(layer?.73:.65),!!layer);
  for(let row=0;row<9;row++)r(cx-row-2,floor-8+row,row*2+5,1,0xb4bc83);
  r(cx+23,floor-9,13,9,0x614b35);r(cx+24,floor-8,11,7,0x9e754c);r(cx+24,floor-8,11,2,0xc79c62);r(cx+27,floor-6,1,5,0x79573f);r(cx+31,floor-6,1,5,0x79573f);r(cx+29,floor-5,2,2,0xe6c47b);person(cx-4,floor+5);
 }
}
