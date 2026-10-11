import {HOMES,homeDefinition} from '../data/homes.js';
import {ROOM} from '../data/interior.js';
import {homePixels} from './homePalette.js';
// Cached local atlas derivatives preserve the starter architecture exactly.
export function homeTexture(scene,id){
 if(!HOMES[id]||id==='starter')return {key:'town',frame:'house-village-0'};
 const key='home-design-'+id;
 if(!scene.textures.exists(key)){
  const f=scene.textures.getFrame('town','house-village-0'),t=scene.textures.createCanvas(key,f.cutWidth,f.cutHeight),ctx=t.context;
  ctx.drawImage(f.source.image,f.cutX,f.cutY,f.cutWidth,f.cutHeight,0,0,f.cutWidth,f.cutHeight);
  const pixels=ctx.getImageData(0,0,f.cutWidth,f.cutHeight);pixels.data.set(homePixels(pixels.data,id,f.cutWidth));ctx.putImageData(pixels,0,0);t.setFilter(1);t.refresh();
 }
 return {key};
}
export function drawHomeArt(scene,parent,id,x=0,y=0,scale=2,depth=0){
 const t=homeTexture(scene,id),image=scene.add.image(x,y,t.key,t.frame).setOrigin(0).setScale(scale).setDepth(depth);parent?.add(image);return image;
}
export function homePreview(id,inside=false){return (u,parent,cx,cy,w,h)=>{
 if(!inside){const scale=Math.min(w/180,h/144);drawHomeArt(u,parent,id,Math.round(cx-90*scale),Math.round(cy-72*scale),scale);return;}
 const d=HOMES[id],g=u.add.graphics();parent.add(g);g.setPosition(cx-w/2,cy-h/2);const r=(c,x,y,a,b)=>g.fillStyle(c).fillRect(x,y,a,b);
 r(d.floor,0,0,w,h);r(d.wall,0,0,w,8);r(d.trim,0,8,w,2);r(d.accent,w*.1,h*.42,w*.45,h*.35);r(d.trim,w*.17,h*.47,w*.3,h*.18);r(d.accent,w*.77,h*.25,w*.14,h*.45);r(0xf5e7c8,w*.77,h*.25,w*.14,h*.12);
 for(let x=8;x<w-8;x+=22){r(d.trim,x,1,12,6);r(0xabc2a7,x+2,2,8,4);}drawRoomMotif(g,d,w,h,true);
};}
function drawRoomMotif(g,d,w,h,preview=false){
 const r=(c,x,y,a,b)=>g.fillStyle(c).fillRect(Math.round(x),Math.round(y),a,b),k=preview?.3:1;
 const x=preview?w*.58:w/2+68,y=preview?h*.18:6;
 if(d.style==='rose'){for(let i=0;i<3;i++){r(0x84935a,x+i*10*k,y+10*k,3*k,14*k);r(0xe39a93,x-3*k+i*10*k,y+6*k,9*k,6*k);}}
 if(['orchard','brick','alpine'].includes(d.style)){r(d.trim,x,y,48*k,40*k);for(let row=0;row<3;row++)for(let col=0;col<6;col++)r(col%2?d.accent:0xdbc898,x+(3+col*7)*k,y+(3+row*12)*k,4*k,8*k);}
 if(['coastal','manor'].includes(d.style)){r(d.trim,x,y,48*k,34*k);r(d.accent,x+3*k,y+3*k,42*k,28*k);for(let i=0;i<4;i++){r(0xf5e7c8,x+(10+i*8)*k,y+(6+i%2*6)*k,5*k,12*k);}}
 if(['bamboo','glass'].includes(d.style)){r(d.trim,x+5*k,y+26*k,30*k,10*k);for(let i=0;i<4;i++){r(0x5e7951,x+(8+i*7)*k,y+5*k,3*k,23*k);r(d.accent,x+(3+i*7)*k,y+(i%2?10:0)*k,14*k,7*k);}}
}
export function drawHomeRoom(scene,s){
 const d=homeDefinition(s);if(s.home.design==='starter')return;
 const w=ROOM.width,h=ROOM.height,g=scene.add.graphics().setDepth(.5),r=(c,x,y,a,b)=>g.fillStyle(c).fillRect(x,y,a,b);
 r(d.floor,16,48,w-32,h-80);
 for(let yy=48;yy<h-32;yy+=16)for(let xx=16;xx<w-16;xx+=16){
  if(['manor','coastal','glass'].includes(d.style)){r((xx+yy)%32?d.floor:d.wall,xx,yy,14,14);if(d.style==='manor')r(d.accent,xx+6,yy+6,2,2);}
  else{r(d.trim,xx,yy+14,16,1);if(d.style==='bamboo')r(d.accent,xx+2,yy+6,10,1);}
 }
 const wall=scene.add.graphics().setDepth(49);wall.fillStyle(d.wall).fillRect(16,2,w-32,42).fillStyle(d.trim).fillRect(16,38,w-32,6);
 const ornaments=scene.add.graphics().setDepth(129);drawRoomMotif(ornaments,d,w,h);
 for(const xx of [40,w-88]){ornaments.fillStyle(d.accent).fillRect(xx-3,16,5,24).fillRect(xx+30,16,5,24);}
 // Distinct room furnishings cover only their established furniture footprints.
 const rug=scene.add.graphics().setDepth(2).setPosition(w/2-216,h-184);rug.fillStyle(d.trim).fillRect(0,0,176,112).fillStyle(d.accent).fillRect(4,4,168,104);
 for(let i=0;i<6;i++)rug.fillStyle(d.wall).fillRect(12+i*26,10,8,d.style==='bamboo'?92:5).fillRect(12+i*26,97,8,5);
 const bed=scene.add.graphics().setDepth(229);bed.fillStyle(d.accent).fillRect(w-102,170,44,34).fillStyle(d.wall).fillRect(w-100,153,40,14);
 const table=scene.add.graphics().setPosition(w/2-184,h-156).setScale(2).setDepth(h-75),t=(c,x,y,a,b)=>table.fillStyle(c).fillRect(x,y,a,b);
 if(d.style==='rose'){t(0x8b9b63,30,9,2,10);t(0xd99898,27,6,8,5);t(0xdbb490,27,16,8,5);}
 if(d.style==='orchard'){t(0x79936a,14,12,11,6);t(0xe8d2a0,15,13,9,3);t(0xa47862,16,17,11,3);t(0xdfc393,40,11,7,7);}
 if(d.style==='coastal'){t(0x8fb8b3,16,13,33,3);for(const xx of [21,31,41]){t(0xf0dfbb,xx,11,5,3);t(0xb5c1a1,xx+1,10,3,1);}}
 if(d.style==='bamboo'){t(0x6e7650,20,13,25,6);t(0xd9be87,28,10,9,6);t(0x927653,31,8,3,2);for(const xx of [23,40])t(0xebd8a6,xx,12,4,4);}
 if(d.style==='brick'){t(0xddcb9d,18,12,15,9);t(0x6b6552,20,14,9,1);t(0x6b6552,20,17,9,1);t(0xd8b565,42,10,3,9);t(0xe7c876,41,7,5,3);}
 if(d.style==='glass'){t(0xa5b591,27,16,10,5);t(0x638553,31,7,3,11);t(0x8fab75,26,6,8,4);t(0x7d9d63,33,10,7,4);}
 if(d.style==='alpine'){t(0xe1cea5,15,10,28,11);for(let i=0;i<5;i++)t(d.accent,18+i*4,13+i%2*3,3,2);t(0x94755d,46,12,5,6);}
 if(d.style==='manor'){t(0xf2e7c7,18,8,30,17);t(d.accent,22,12,22,1);t(d.trim,32,6,2,13);t(d.accent,25,9,16,2);for(const xx of [25,32,39]){t(d.accent,xx,5,2,5);t(0xf2cf7d,xx,3,2,2);}}
}
