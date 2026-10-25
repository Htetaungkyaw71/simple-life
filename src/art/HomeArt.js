import {HOMES,homeArtDefinition,homeWorldPlacement} from '../data/homes.js';
import {ROOM} from '../data/interior.js';
import {homeInteriorSurface} from './homeInteriorSurface.js';
// Both Home choices use existing approved City frames without generating art.
export function homeTexture(scene,id){
 const d=HOMES[id]||HOMES.starter;return {key:'cityBuildings',frame:d.artFrame};
}
export function drawHomeArt(scene,parent,id,x=0,y=0,scale=2,depth=0){
 const t=homeTexture(scene,id),image=scene.add.image(x,y,t.key,t.frame).setOrigin(0).setScale(scale).setDepth(depth);parent?.add(image);return image;
}
export function drawHomeWorldArt(scene,building,id){const p=homeWorldPlacement(id,building);return drawHomeArt(scene,null,id,p.x,p.y,p.scale,p.depth);}
export function homePreview(id,inside=false){return (u,parent,cx,cy,w,h)=>{
 const d=HOMES[id]||HOMES.starter;
 if(!inside){const art=homeArtDefinition(id),scale=Math.min(w/art.width,h/art.height);drawHomeArt(u,parent,id,Math.round(cx-art.width*scale/2),Math.round(cy-art.height*scale/2),scale);return;}
 const g=u.add.graphics();parent.add(g);g.setPosition(cx-w/2,cy-h/2);const r=(c,x,y,a,b)=>g.fillStyle(c).fillRect(x,y,a,b);
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
 const {width:w,height:h}=ROOM,design=s?.home?.design||'starter',key=`room-surface-${design}-${w}-${h}`;
 if(!scene.textures.exists(key+'-back')){
  const surface=homeInteriorSurface(w,h,design);
  for(const layer of ['back','front']){
   const texture=scene.textures.createCanvas(key+'-'+layer,w,h),pixels=texture.context.createImageData(w,h);
   pixels.data.set(surface[layer]);texture.context.putImageData(pixels,0,0);texture.setFilter(1);texture.refresh();
  }
 }
 scene.add.image(0,0,key+'-back').setName('interior:architecture').setOrigin(0).setDepth(0);
 scene.add.image(0,0,key+'-front').setName('interior:cutaway').setOrigin(0).setDepth(h+4);
}
