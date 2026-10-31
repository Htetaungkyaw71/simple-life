export const KEEPSAKE_TEXTURE='keepsakePendant';
export function keepsakeSprite(scene,parent,cx,cy,width=36){const image=scene.add.image(cx,cy,KEEPSAKE_TEXTURE).setOrigin(.5).setScale(width/36);parent?.add(image);return image;}
export function keepsakeThumb(u,parent,cx,cy){return keepsakeSprite(u,parent,cx,cy,24);}
