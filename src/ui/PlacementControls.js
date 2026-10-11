import {pixelArrow} from './statusArt.js';
import {DECORATIONS} from '../data/settlement.js';
import {button,panel,text,UI_COLORS} from './pixelWidgets.js';
export function placementLayout(u){const w=Math.min(306,u.w-u.safe.left-u.safe.right-12),narrow=w<246,h=narrow?90:58;return {w,h,narrow,x:Math.floor(u.safe.left+(u.w-u.safe.left-u.safe.right-w)/2),y:u.h-u.safe.bottom-h-8};}
export function placementControls(u,parent){
 const a=u.app,d=a.placement.draft,q=a.placement.quote(),l=placementLayout(u),{x,y,w,narrow}=l;panel(u,parent,x,y,w,l.h,UI_COLORS.cream);
 const direction={down:'South',left:'West',up:'North',right:'East'}[d.direction];text(u,parent,x+6,y+5,DECORATIONS[d.type].name+' / '+direction+(a.placement.original?' / Move':''),7,UI_COLORS.light,w-12,true);text(u,parent,x+6,y+18,q.ok?'Tap any clear spot. Turn, then Add.':q.message,6,q.ok?UI_COLORS.muted:0x995744,w-12);
 const top=y+(narrow?37:32),arrows=[['Left',-1,0,4],['Up',0,-1,6],['Down',0,1,2],['Right',1,0,0]],start=narrow?x+6:x+Math.floor((w-242)/2);
 arrows.forEach(([label,dx,dy,direction],i)=>button(u,parent,label,start+i*27,top,24,24,()=>a.placement.nudge(dx,dy),{id:'placement-'+['left','up','down','right'][i],glyph:(g,cx,cy,color)=>pixelArrow(g,direction,cx+4,cy+4,color)}));
 button(u,parent,'Turn',start+108,top,narrow?w-120:50,24,()=>a.placement.turn(),{id:'placement-turn'});
 if(narrow){const aw=Math.floor((w-16)/2);button(u,parent,'Cancel',x+6,y+63,aw,24,()=>a.placement.cancel(),{id:'placement-cancel'});const b=button(u,parent,'Add',x+10+aw,y+63,aw,24,()=>a.placement.confirm(),{id:'placement-confirm',disabled:!q.ok,bold:true,fontSize:9,textTint:UI_COLORS.light});if(q.ok)b.box.setFillStyle(UI_COLORS.selected);}
 else{const b=button(u,parent,'Add',start+161,top,54,24,()=>a.placement.confirm(),{id:'placement-confirm',disabled:!q.ok,bold:true,fontSize:9,textTint:UI_COLORS.light});if(q.ok)b.box.setFillStyle(UI_COLORS.selected);button(u,parent,'X',start+218,top,24,24,()=>a.placement.cancel(),{id:'placement-cancel'});}
}
