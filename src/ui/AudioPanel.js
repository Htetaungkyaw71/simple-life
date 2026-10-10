import {panel,text,button,UI_COLORS} from './pixelWidgets.js';
export function drawAudioPanel(u){
 const a=u.app.audio,p=a.preferences,w=Math.min(270,u.w-u.safe.left-u.safe.right-12),h=170,x=Math.floor((u.w-w)/2),y=Math.max(u.safe.top+5,Math.floor((u.h-h)/2));u.menuBounds={x:x*2,y:y*2,w:w*2,h:h*2};
 const veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.6).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());panel(u,u.root,x,y,w,h);text(u,u.root,x+12,y+10,'AUDIO',12,UI_COLORS.light,undefined,true);
 for(const [i,id]of ['master','music','ambience','effects'].entries()){
  const yy=y+31+i*26; text(u,u.root,x+12,yy+8,id[0].toUpperCase()+id.slice(1),7,UI_COLORS.light);
  const left=x+w-87;button(u,u.root,'-',left,yy,22,24,()=>change(id,-.25),{id:'audio-'+id+'-down'});text(u,u.root,left+41,yy+8,Math.round(p[id]*100),7,UI_COLORS.gold).setOrigin(.5,0);button(u,u.root,'+',left+60,yy,22,24,()=>change(id,.25),{id:'audio-'+id+'-up'});
 }
 const change=(id,step)=>{a.setVolume(id,Math.round((p[id]+step)*4)/4);a.effect('ui:confirm');u.layout();};
 button(u,u.root,p.muted?'Muted / ON':'Mute all / OFF',x+12,y+139,w-72,24,()=>{a.toggle();u.layout();a.effect('ui:confirm');},{id:'audio-mute',fontSize:7});button(u,u.root,'Back',x+w-56,y+139,44,24,()=>u.app.pauseMenu(),{id:'audio-back',fontSize:7});u.highlight();
}
