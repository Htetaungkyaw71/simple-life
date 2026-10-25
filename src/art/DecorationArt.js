import {propFrame,propTexture} from '../data/propArt.js';
import {groundShadow} from './GroundShadow.js';
import {decorationShape} from '../systems/settlementGeometry.js';
// Every catalog thumbnail, placement ghost and saved piece uses these same pixels.
export const DECORATION_FRAMES={path:'path',bench:'bench',planter:'prop-planter',fence:'fence',table:'table',barrel:'barrel',lantern:'lamp',blossom:'prop-blossom',hedge:'prop-hedge',flowers:'prop-flowers',birdbath:'prop-birdbath',rug:'prop-rug',bookcase:'prop-bookcase',vase:'prop-vase',oak:'forest-oak-0',palm:'forest-palm-0'};
const sideFrame=(type,direction='down')=>{
 const side=['left','right'].includes(direction);
 if(side&&['bench','table','fence'].includes(type))return 'prop-'+type+'-left';
 if(type==='bench'&&direction==='up')return 'prop-bench-up';
 return DECORATION_FRAMES[type];
};
export const decorationFrame=(type,direction='down')=>propFrame(sideFrame(type,direction));
export function decorationArtSize(type,direction='down'){
 const shape=decorationShape({type,direction});return {w:shape.w/2,h:type==='planter'?24:shape.h/2};
}
export function drawDecorationArt(scene,parent,type,direction='down',x=0,y=0,scale=2,depth=0){
 const shape=decorationShape({type,direction}),w=shape.w/2,h=shape.h/2;
 const logical=sideFrame(type,direction),frame=propFrame(logical),texture=propTexture(logical)||'town',f=scene.textures.getFrame(texture,frame),height=decorationArtSize(type,direction).h,s=Math.min(w/f.width,height/f.height)*scale;
 // Upright side views are authored separately; never rotate a prop onto its side.
 if(!parent&&!['rug','flowers','path'].includes(type))groundShadow(scene,x+w*scale/2,y+h*scale-2,w*scale*.7,8,.18);
 const node=scene.add.image(x+w*scale/2,y+h*scale,texture,frame).setOrigin(.5,1).setScale(s).setDepth(depth).setFlipX(direction==='right');parent?.add(node);return node;
}
