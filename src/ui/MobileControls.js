import {button,text,UI_COLORS} from './pixelWidgets.js';
import {joystickVector} from '../systems/movement.js';
// Native pixel circles share the cream/olive HUD palette.
function disc(g,x,y,r,color){g.fillStyle(color);for(let dy=-r;dy<=r;dy++){const half=Math.floor(Math.sqrt(r*r-dy*dy));g.fillRect(Math.round(x-half),Math.round(y+dy),half*2+1,1);}}
export function mobileControls(ui,parent){
 const app=ui.app,portrait=ui.w<ui.h,r=30,cx=ui.safe.left+39,cy=ui.h-ui.safe.bottom-39,g=ui.add.graphics();parent.add(g);
 let pointerId=null,knob={x:0,y:0};
 const paint=()=>{g.clear();disc(g,cx+1,cy+2,r,UI_COLORS.ink);disc(g,cx,cy,r,UI_COLORS.edge);disc(g,cx,cy,r-2,UI_COLORS.panel);disc(g,cx,cy,r-5,0xd4d9af);disc(g,cx+knob.x,cy+knob.y,12,UI_COLORS.ink);disc(g,cx+knob.x,cy+knob.y,10,pointerId===null?UI_COLORS.cream:UI_COLORS.selected);};
 const reset=()=>{pointerId=null;knob={x:0,y:0};app.input.stick={x:0,y:0};paint();};
 const move=p=>{if(p.id!==pointerId)return;const x=p.x/2-cx,y=p.y/2-cy,len=Math.hypot(x,y),scale=Math.min(1,(r-12)/(len||1));knob={x:x*scale,y:y*scale};app.input.stick=joystickVector(x,y,r-12);paint();};
 const control={id:'move-stick',label:'Move',x:cx-r,y:cy-r,w:r*2,h:r*2,box:g,move,reset,release:p=>{if(p.id===pointerId)reset();}};ui.controls.push(control);
 g.setInteractive({hitArea:{cx,cy,r},hitAreaCallback:(a,x,y)=>Math.hypot(x-a.cx,y-a.cy)<=a.r});
 g.on('pointerdown',(p,x,y,event)=>{event.stopPropagation();if(pointerId!==null)return;pointerId=p.id;move(p);});paint();
 const right=ui.w-ui.safe.right,actions=portrait?[[right-79,cy-14],[right-39,cy-14]]:[[right-39,ui.h-ui.safe.bottom-86],[right-39,ui.h-ui.safe.bottom-39]];
 const jump=button(ui,parent,'',...actions[0],28,28,()=>app.scene.jump(),{id:'jump',disabled:app.state.area==='interior'});
 const attack=button(ui,parent,'',...actions[1],28,28,()=>{const c=app.scene.context();if(app.state.selected==='axe'&&c?.type==='chop')app.use();else app.attack();},{id:'attack',disabled:app.state.area==='interior'});
 for(const [b,label]of [[jump,'JUMP'],[attack,'ATTACK']]){b.label=label;text(ui,parent,Math.min(ui.w-ui.safe.right-19,b.x+b.w/2),b.y+11,label,6,b.disabled?UI_COLORS.muted:UI_COLORS.light).setOrigin(.5,0);}
 return control;
}
