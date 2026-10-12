// Original, code-authored native pixel art. No skulls, outside image or runtime download.
export function cavePixels(g,stage='sealed'){
 const r=(c,x,y,w,h)=>g.fillStyle(c).fillRect(x,y,w,h),ink=0x303e36,stone=0x69705a,light=0x929777;
 r(ink,4,46,40,6);r(stone,1,49,46,3);r(light,5,48,36,1);
 for(const [x,y,w,h]of [[7,9,34,14],[4,18,40,29],[11,5,26,12],[16,2,16,10]]){r(ink,x,y,w,h);r(stone,x+2,y+2,w-4,h-3);r(light,x+3,y+2,w-6,2);}
 for(const [x,y,w,h]of [[8,12,9,7],[19,7,11,7],[31,13,8,7],[5,25,7,10],[36,24,7,12],[7,38,6,8],[35,38,6,8]]){r(ink,x,y,w,h);r(light,x+1,y+1,w-2,2);}
 r(ink,14,21,20,27);r(0x192a2a,16,23,16,25);r(0x445348,17,24,14,2);
 if(stage==='broken'){
  r(0x502e43,20,27,8,19);r(0x97604e,22,34,3,9);r(0xb57c58,23,36,1,5);
  for(const [x,y]of [[13,44],[21,47],[30,45]]){r(ink,x,y,6,4);r(light,x+1,y,4,2);}
 }else{
  r(0x858267,16,24,16,23);r(0xb2af88,17,25,14,2);r(0x4c5b4b,23,27,1,19);
  const gold=stage==='restored'?0xc4ce8b:0xe3bc70;
  r(ink,19,31,10,10);r(gold,20,32,8,8);r(ink,22,34,4,4);r(gold,23,35,2,2);
 }
 for(const [x,y]of [[5,20],[34,9],[4,43],[37,40]]){r(0x42533a,x,y,7,3);r(0x809161,x+1,y,4,1);}
 if(stage==='restored'){r(0xa9bf77,8,45,3,3);r(0xead29c,8,44,2,2);r(0xa9bf77,37,44,3,4);r(0xead29c,38,43,2,2);}
}
export function ghostPixels(g,frame=0){
 const r=(c,x,y,w,h)=>g.fillStyle(c).fillRect(x,y,w,h),ink=0x2d3a39,cloth=0xa6b99f,light=0xd6dec0;
 r(ink,5,2,10,8);r(ink,3,7,14,14);r(cloth,6,3,8,7);r(light,7,3,6,2);
 r(0x516956,6,6,8,4);r(0xe6bc73,7,6,2,2);r(0xe6bc73,11,6,2,2);
 r(cloth,4,11,12,9);r(light,6,11,5,7);r(0x738a74,13,12,2,8);
 r(ink,0,12+frame,5,5);r(cloth,1,13+frame,4,2);r(ink,15,11-frame,5,5);r(cloth,15,12-frame,4,2);
 for(const [x,h]of [[4,3],[7,5-frame],[10,3],[13,4+frame]]){r(ink,x,19,3,h+1);r(cloth,x,19,2,h);}
}
export function curseTextures(scene){
 for(const stage of ['sealed','broken','restored']){const key='curse-cave-'+stage;if(!scene.textures.exists(key)){const g=scene.make.graphics({add:false});cavePixels(g,stage);g.generateTexture(key,48,52);g.destroy();scene.textures.get(key).setFilter(1);}}
 for(let i=0;i<2;i++){const key='curse-spirit-'+i;if(!scene.textures.exists(key)){const g=scene.make.graphics({add:false});ghostPixels(g,i);g.generateTexture(key,20,26);g.destroy();scene.textures.get(key).setFilter(1);}}
}
