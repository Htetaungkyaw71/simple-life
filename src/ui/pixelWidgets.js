import {propImage} from '../art/PropArt.js';
import {translate,translateButton} from '../i18n/language.js';
import {myanmarText} from '../i18n/myanmarText.js';
import {coloredFont} from './coloredFont.js';
import {itemIconDisplaySize} from '../data/itemIconArt.js';
export const UI_COLORS={ink:0x423a32,border:0xc6d799,edge:0xc6d799,panel:0xf3eccf,light:0x35462e,muted:0x747154,gold:0xa37035,cream:0xfffbe5,selected:0xc6d699,wood:0x93694c,paper:0xeed7a6};
// Keep the established layered bevel and hard shadow, with clean square corners.
export function frame(g,x,y,w,h,color=UI_COLORS.panel,style='leaf',edge=UI_COLORS.border,thick=1){
 const rect=(c,a,b,ww,hh)=>g.fillStyle(c).fillRect(a,b,ww,hh),inset=Math.max(1,Math.round(thick));
 rect(UI_COLORS.ink,x+1,y+2,w,h);rect(UI_COLORS.ink,x,y,w,h);
 rect(UI_COLORS.border,x+1,y+1,w-2,h-2);
 rect(color,x+1+inset,y+1+inset,w-2*(inset+1),h-2*(inset+1));
 rect(UI_COLORS.cream,x+2,y+2,w-4,1);rect(style==='wood'?0xc59768:0xd3d8ae,x+2,y+h-3,w-4,1);
 if(style==='wood'&&h>40){rect(0xb78554,x+6,y+6,w-12,1);rect(0xb78554,x+6,y+h-7,w-12,1);rect(0xb78554,x+6,y+6,1,h-12);rect(0xb78554,x+w-7,y+6,1,h-12);}
 return g;
}
export function panel(scene,parent,x,y,w,h,color=UI_COLORS.panel,style='leaf'){const g=scene.add.graphics();parent.add(g);return frame(g,x,y,w,h,color,style);}
export function text(scene,parent,x,y,value,size=8,tint=UI_COLORS.light,width,bold=false,role=size>=10?'heading':'body'){
 if((scene.app?.language?.current==='mm'&&role!=='numeric'&&!/^[0-9\s<>?X%+.:-]+$/.test(String(value))&&!['SIMPLE LIFE','SIMPLE\nLIFE','Simple Life'].includes(value))||/[\u1000-\u109f]/u.test(String(value))){const t=myanmarText(scene,x,y,value,role==='heading'?(size>=24?24:12):8,tint,width);parent.add(t);return t;}
 const family=role==='heading'?'thaleah':'m5x7',data=scene.cache.bitmapFont.get(family).data,native=data.size;
 let multiple=role==='heading'?(size>=24?3:size>=12?2:1):1;
 const measure=v=>Math.max(...String(v).split('\n').map(line=>[...line].reduce((n,c)=>n+(data.chars[c.charCodeAt(0)]?.xAdvance||0),0)));
 if(width)while(multiple>1&&measure(value)*multiple>width)multiple--;
 const t=scene.add.bitmapText(Math.round(x),Math.round(y),coloredFont(scene,tint,family),value,native*multiple);const original=t.setText.bind(t);t.setText=v=>original(translate(v,scene.app?.language?.current));t.sourceText=value;t.uiText=true;t.setLineSpacing(2);if(width)t.setMaxWidth(Math.floor(width));parent.add(t);return t;
}
export function icon(scene,parent,name,x,y,scale=1){const i=propImage(scene,name,x,y,scale);parent.add(i);return i;}
export function button(scene,parent,label,x,y,w,h,action,{disabled=false,id=label,iconName=null,glyph=null,preview=null,bold=false,fontSize=8,textTint=null,sound=true}={}){
 const box=scene.add.graphics();parent.add(box);let fill=disabled?0xd7d2b4:UI_COLORS.cream,stroke=1,base=fill;
 const paint=()=>{box.clear();frame(box,x,y,w,h,fill,'leaf',UI_COLORS.border,stroke);if(glyph)glyph(box,Math.round(x+w/2-4),Math.round(y+h/2-4),disabled?UI_COLORS.muted:UI_COLORS.light);};
 box.setFillStyle=c=>{base=fill=c;paint();return box;};box.setStrokeStyle=size=>{stroke=size;paint();return box;};paint();
 if(iconName){const size=itemIconDisplaySize(iconName);icon(scene,parent,iconName,Math.round(x+(w-size)/2),Math.round(y+(h-size)/2));}
 if(preview)preview(scene,parent,x+w/2,y+h/2,w-8,h-8);
 const t=iconName||glyph||preview?null:text(scene,parent,x+w/2,0,translateButton(label,scene.app?.language?.current),fontSize,textTint??(disabled?UI_COLORS.muted:UI_COLORS.light),w-6,bold,'body');
 if(t){if(t.height>h-6){let short=label;while(short.length&&(t.width>w-6||t.height>h-6)){short=scene.app?.language?.current==='mm'?'':short.slice(0,-1);t.setText(short+'...');}}t.setOrigin(.5,0).setPosition(Math.round(x+w/2),Math.round(y+(h-t.height)/2));}
 const invoke=(...args)=>{if(sound)scene.app?.sound?.(disabled?'ui:disabled':/^(Cancel|Skip|Not yet|Keep my farm)$/i.test(label)?'ui:cancel':'ui:confirm');if(!disabled)return action(...args);};const control={id,label,x,y,w,h,disabled,action:invoke,box,text:t};scene.controls.push(control);
 box.setInteractive({useHandCursor:!disabled,hitArea:{x,y,width:w,height:h},hitAreaCallback:(a,px,py)=>px>=a.x&&py>=a.y&&px<a.x+a.width&&py<a.y+a.height});box.on('pointerdown',(p,lx,ly,event)=>{event.stopPropagation();invoke(p);});if(!disabled){box.on('pointerover',()=>{fill=UI_COLORS.selected;paint();});box.on('pointerout',()=>{fill=base;paint();});}
 return control;
}
