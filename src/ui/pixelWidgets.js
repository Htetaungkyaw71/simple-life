import {coloredFont} from './coloredFont.js';
export const UI_COLORS={ink:0x423a32,edge:0x85945c,panel:0xf3eccf,light:0x35462e,muted:0x747154,gold:0xa37035,cream:0xfffbe5,selected:0xc6d699,wood:0x93694c,paper:0xeed7a6};
// Original stepped silhouettes, cream bevels and small leaf stitches.
export function frame(g,x,y,w,h,color=UI_COLORS.panel,style='leaf',edge=UI_COLORS.edge,thick=1){
 const cut=style==='badge'?8:h<18?1:h<35?4:6,rect=(c,a,b,ww,hh)=>g.fillStyle(c).fillRect(a,b,ww,hh);
 const shape=(c,a,b,ww,hh,k)=>{rect(c,a+k,b,ww-k*2,hh);rect(c,a,b+k,ww,hh-k*2);};
 shape(UI_COLORS.ink,x+1,y+2,w,h,cut);shape(UI_COLORS.ink,x,y,w,h,cut);
 shape(style==='wood'?UI_COLORS.wood:edge,x+1,y+1,w-2,h-2,Math.max(0,cut-1));
 shape(color,x+2+thick-1,y+2+thick-1,w-2*(thick+1),h-2*(thick+1),Math.max(0,cut-2));
 rect(UI_COLORS.cream,x+cut+1,y+2,w-2*cut-2,1);rect(style==='wood'?0xc59768:0xd3d8ae,x+cut+1,y+h-3,w-2*cut-2,1);
 if(w>40&&h>18&&style==='leaf')for(const [a,b]of [[x+2,y+h-6],[x+w-7,y+2]]){rect(0x566b3f,a,b+2,5,2);rect(0x839548,a+2,b,3,2);rect(0xa4b768,a+3,b+1,2,1);}
 if(style==='wood'&&h>40){rect(0xb78554,x+6,y+6,w-12,1);rect(0xb78554,x+6,y+h-7,w-12,1);rect(0xb78554,x+6,y+6,1,h-12);rect(0xb78554,x+w-7,y+6,1,h-12);}
 return g;
}
export function panel(scene,parent,x,y,w,h,color=UI_COLORS.panel,style='leaf'){const g=scene.add.graphics();parent.add(g);return frame(g,x,y,w,h,color,style);}
export function text(scene,parent,x,y,value,size=8,tint=UI_COLORS.light,width,bold=false){const t=scene.add.bitmapText(Math.round(x),Math.round(y),coloredFont(scene,tint,bold),value,size);if(width)t.setMaxWidth(width);parent.add(t);return t;}
export function icon(scene,parent,name,x,y,scale=1){const i=scene.add.image(x,y,scene.textures.get('town').has(name)?'town':'world',name).setOrigin(0).setScale(scale);parent.add(i);return i;}
export function button(scene,parent,label,x,y,w,h,action,{disabled=false,id=label,iconName=null,glyph=null,preview=null,bold=false,fontSize=8}={}){
 const box=scene.add.graphics();parent.add(box);let fill=disabled?0xd7d2b4:UI_COLORS.cream,edge=UI_COLORS.edge,stroke=1,base=fill;
 const paint=()=>{box.clear();frame(box,x,y,w,h,fill,'leaf',edge,stroke);if(glyph)glyph(box,Math.round(x+w/2-4),Math.round(y+h/2-4),disabled?UI_COLORS.muted:UI_COLORS.light);};
 box.setFillStyle=c=>{base=fill=c;paint();return box;};box.setStrokeStyle=(size,c)=>{stroke=size;edge=c;paint();return box;};paint();
 if(iconName)icon(scene,parent,iconName,Math.round(x+(w-16)/2),Math.round(y+(h-16)/2));
 if(preview)preview(scene,parent,x+w/2,y+h/2,w-8,h-8);
 const t=iconName||glyph||preview?null:text(scene,parent,x+w/2,y+(h-fontSize)/2,label,fontSize,disabled?UI_COLORS.muted:UI_COLORS.light,undefined,bold);t?.setOrigin(.5,0);
 const invoke=(...args)=>{scene.app?.sound?.(disabled?'ui:disabled':/^(Cancel|Skip|Not yet|Keep my farm)$/i.test(label)?'ui:cancel':'ui:confirm');if(!disabled)return action(...args);};const control={id,label,x,y,w,h,disabled,action:invoke,box,text:t};scene.controls.push(control);
 box.setInteractive({useHandCursor:!disabled,hitArea:{x,y,width:w,height:h},hitAreaCallback:(a,px,py)=>px>=a.x&&py>=a.y&&px<a.x+a.width&&py<a.y+a.height});box.on('pointerdown',(p,lx,ly,event)=>{event.stopPropagation();invoke(p);});if(!disabled){box.on('pointerover',()=>{fill=UI_COLORS.selected;paint();});box.on('pointerout',()=>{fill=base;paint();});}
 return control;
}
