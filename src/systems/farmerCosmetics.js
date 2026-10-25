import {COSMETIC_ART,COSMETIC_FRAMES} from '../data/farmerCosmetics.js';
// The five clothing ramps replace only the source olive fabric. Skin, eyes,
// outlines, boots and tools keep their source colours and native geometry.
const CLOTH={
 worker:[[69,67,49],[85,83,59],[96,98,67],[103,106,73],[109,110,77]],
 gardener:[[49,65,58],[63,83,73],[75,97,83],[84,106,91],[96,115,99]],
 copper:[[92,52,38],[118,69,46],[140,86,56],[152,98,65],[164,110,76]],
 plum:[[66,47,62],[85,60,78],[103,76,94],[114,87,104],[125,98,114]],
 forest:[[49,58,38],[66,78,48],[79,91,57],[91,103,67],[103,114,79]],
};
const OLIVE=['69,67,49','85,83,59','96,98,67','103,106,73','109,110,77'];
const HAIR={midnight:[[43,25,24],[47,33,30],[63,43,41],[73,51,46],[89,58,50],[91,49,32],[103,75,59]],copper:[[68,35,26],[80,40,27],[103,51,31],[120,63,38],[139,76,43],[143,78,44],[160,94,57]],chestnut:[[43,25,24],[47,33,30],[63,38,33],[73,51,46],[89,58,50],[91,49,32],[103,75,59]],golden:[[83,58,34],[99,71,39],[120,88,44],[138,105,54],[157,122,65],[162,126,66],[178,144,82]]};
const BROWN=['43,25,24','47,33,30','63,43,41','73,51,46','89,58,50','91,49,32','103,75,59','63,38,33'];
export function cosmeticSignature(a,character){return [character,a?.outfit||'worker',a?.hair||(character==='girl'?'chestnut':'midnight'),...['hat','glasses','bag'].map(k=>a?.accessories?.[k]||'')].join(':');}
export function baseFarmerStyle(a,character){return !a||a.outfit===(character==='girl'?'gardener':'worker')&&a.hair===(character==='girl'?'chestnut':'midnight')&&!Object.values(a.accessories||{}).some(Boolean);}
// Compose native bitmap layers into the body atlas once per appearance change.
// Reflections, shallow-water crops and carried-hand overlays then share it.
export function farmerCosmeticPixels(input,width,character,appearance){
 const data=new Uint8ClampedArray(input),a=appearance||{},frames=COSMETIC_FRAMES[character];
 const defaultOutfit=character==='girl'?'gardener':'worker';
 const cloth=a.outfit===defaultOutfit?null:CLOTH[character==='girl'&&a.outfit==='worker'?'gardener':a.outfit],hair=a.hair===(character==='girl'?'chestnut':'midnight')?null:HAIR[a.hair];
 const equipped=a.accessories||{};
 for(const [frame,anchor] of Object.entries(frames)){
  const [cx,top,faceX,eyeY,shoulder,dir,headDir=dir]=anchor,ox=Number(frame)%8*64,oy=Math.floor(Number(frame)/8)*64;
  const at=(x,y)=>((oy+y)*width+ox+x)*4;
  const original=(x,y)=>{const i=at(x,y);return input.subarray(i,i+4);};
  const fabric=p=>OLIVE.indexOf(p.slice(0,3).join(','));
  const hairPixels=new Set(),pending=[];
  if(hair){
   // Follow the connected hair, including the ponytail, rather than dyeing
   // brown boots, tool handles, face shading or detached eye marks.
   for(let y=top;y<top+8;y++)for(let x=cx-8;x<=cx+8;x++)if(BROWN.includes(original(x,y).slice(0,3).join(',')))pending.push([x,y]);
   while(pending.length){
    const [x,y]=pending.pop(),key=y*64+x;
    if(hairPixels.has(key)||x<cx-10||x>cx+10||y<top||y>top+24||!BROWN.includes(original(x,y).slice(0,3).join(',')))continue;
    hairPixels.add(key);pending.push([x-1,y],[x+1,y],[x,y-1],[x,y+1]);
   }
  }
  for(let y=top;y<57;y++)for(let x=Math.max(0,cx-12);x<Math.min(64,cx+13);x++){
   const i=at(x,y);if(!data[i+3])continue;const p=original(x,y),c=fabric(p),h=BROWN.indexOf(p.slice(0,3).join(','));
   const replacement=cloth&&c>=0?cloth[c]:hair&&h>=0&&hairPixels.has(y*64+x)?hair[h]||hair[2]:null;
   if(replacement)data.set(replacement,i);
  }
  const stamp=(name,row,x,y,predicate=()=>true,behind=false)=>{
   const view=COSMETIC_ART[name][row];
   for(const [px,py,r,g,b]of view.pixels){const xx=x+px,yy=y+py;if(xx<1||xx>62||yy<1||yy>62||!predicate(xx,yy))continue;const i=at(xx,yy);if(behind&&input[i+3])continue;data.set([r,g,b,255],i);}
  };
  if(equipped.bag==='canvas'){
   const view=COSMETIC_ART.backpack[dir],bx=cx-Math.floor(view.width/2)+(dir===2?5:dir===3?-5:0),by=shoulder-2;
   if(dir>=2)stamp('backpack',dir,bx,by,()=>true,true);
   else stamp('backpack',dir,bx,by,(x,y)=>{
    const p=original(x,y);return y>=shoulder-2&&y<shoulder+11&&p[3]&&(fabric(p)>=0||p[0]>200&&Math.abs(p[0]-p[1])<35);
   });
  }
  if(equipped.hat==='straw'){
   const view=COSMETIC_ART.hat[headDir];stamp('hat',headDir,cx-Math.floor(view.width/2),top+7-view.height,(x,y)=>y<Math.min(eyeY-2,top+8));
  }
  if(equipped.glasses==='round'&&dir!==1&&headDir!==1){
   const gx=headDir===0?faceX-5:headDir===2?faceX-4:faceX-2;
   stamp('glasses',headDir,gx,eyeY-1,(x,y)=>{
    const p=original(x,y);if(!p[3]||y<top+7||y>top+14)return false;
    // The original dark pupil is kept even when a sampled rim crosses it.
    const skin=q=>q[0]>=188&&q[0]>q[1]*1.25&&q[1]>q[2]*1.22;
    return !(p[0]<60&&(skin(original(x-1,y))||skin(original(x+1,y))));
   });
  }
 }
 return data;
}
