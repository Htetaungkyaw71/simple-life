export const UI_COLORS={ink:0x34344f,edge:0x719a92,panel:0x354c5a,light:0xffedcc,muted:0xb2c9bd,gold:0xe6b875};
export function panel(scene,parent,x,y,w,h,color=UI_COLORS.panel){
  const g=scene.add.graphics();parent.add(g);g.fillStyle(UI_COLORS.ink,.95);g.fillRect(x,y,w,h);g.fillStyle(UI_COLORS.edge);g.fillRect(x+1,y+1,w-2,h-2);g.fillStyle(color,.96);g.fillRect(x+2,y+2,w-4,h-4);g.fillStyle(0x94b8ac);g.fillRect(x+3,y+2,w-6,1);return g;
}
export function text(scene,parent,x,y,value,size=8,tint=UI_COLORS.light,width){const t=scene.add.bitmapText(Math.round(x),Math.round(y),'pixel',value,size).setTint(tint);if(width)t.setMaxWidth(width);parent.add(t);return t;}
export function icon(scene,parent,name,x,y,scale=1){const i=scene.add.image(x,y,scene.textures.get('town').has(name)?'town':'world',name).setOrigin(0).setScale(scale);parent.add(i);return i;}
export function button(scene,parent,label,x,y,w,h,action,{disabled=false,id=label,iconName=null}={}){
  const box=scene.add.rectangle(x,y,w,h,disabled?0x344b40:0x516d49).setOrigin(0).setStrokeStyle(1,disabled?0x516d49:0x98a76b);parent.add(box);
  if(iconName)icon(scene,parent,iconName,x+(w-16)/2,y+(h-16)/2);
  const t=iconName?null:text(scene,parent,x+w/2,y+(h-8)/2,label,8,disabled?0x728454:0xe1d7ad);t?.setOrigin(.5,0);
  const control={id,label,x,y,w,h,disabled,action,box};scene.controls.push(control);
  if(!disabled){box.setInteractive({useHandCursor:true});box.on('pointerdown',(p,lx,ly,event)=>{event.stopPropagation();action(p);});box.on('pointerover',()=>box.setFillStyle(0x728454));box.on('pointerout',()=>box.setFillStyle(0x516d49));}
  return control;
}
