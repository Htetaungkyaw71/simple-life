// Original native-pixel contact shadows. They sit above floors/decks and below
// every upright object; height never changes an object's ground sorting anchor.
export const SHADOW_DEPTH=3;
export function shadowTexture(scene,width=28,height=8){
 const w=Math.max(4,Math.round(width/2)),h=Math.max(2,Math.round(height/2)),key=`contact-shadow-${w}-${h}`;
 if(!scene.textures.exists(key)){
  const t=scene.textures.createCanvas(key,w,h),pixels=t.context.createImageData(w,h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const distance=((x+.5-w/2)/(w/2))**2+((y+.5-h/2)/(h/2))**2;
   if(distance>1)continue;const i=(y*w+x)*4;pixels.data.set([48,55,37,distance>.6?160:255],i);
  }
  t.context.putImageData(pixels,0,0);t.setFilter(1);t.refresh();
 }
 return key;
}
export function groundShadow(scene,x,y,width=28,height=8,alpha=.22){
 return scene.add.image(Math.round(x),Math.round(y),shadowTexture(scene,width,height)).setOrigin(.5).setScale(2).setAlpha(alpha).setDepth(SHADOW_DEPTH);
}
