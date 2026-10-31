import {button,UI_COLORS} from './pixelWidgets.js';
import {joystickVector} from '../systems/movement.js';
import {pixels} from './statusArt.js';
// Native pixel circles share the cream/olive HUD palette.
function disc(g,x,y,r,color){g.fillStyle(color);for(let dy=-r;dy<=r;dy++){const half=Math.floor(Math.sqrt(r*r-dy*dy));g.fillRect(Math.round(x-half),Math.round(y+dy),half*2+1,1);}}
export function mobileControls(ui,parent){
 const app=ui.app,portrait=ui.w<ui.h,r=20,cx=ui.safe.left+36,cy=ui.h-ui.safe.bottom-27,g=ui.add.graphics();parent.add(g);
 let pointerId=null,knob={x:0,y:0};
 const paint=()=>{g.clear();disc(g,cx+1,cy+2,r,UI_COLORS.ink);disc(g,cx,cy,r,UI_COLORS.border);disc(g,cx,cy,r-2,UI_COLORS.panel);disc(g,cx,cy,r-5,0xd4d9af);disc(g,cx+knob.x,cy+knob.y,10,UI_COLORS.border);disc(g,cx+knob.x,cy+knob.y,8,UI_COLORS.cream);};
 const reset=()=>{pointerId=null;knob={x:0,y:0};app.input.stick={x:0,y:0};paint();};
 const move=p=>{if(p.id!==pointerId)return;const x=p.x/2-cx,y=p.y/2-cy,len=Math.hypot(x,y),scale=Math.min(1,(r-10)/(len||1));knob={x:x*scale,y:y*scale};app.input.stick=joystickVector(x,y,r-10);paint();};
 const control={id:'move-stick',label:'Move',x:cx-r,y:cy-r,w:r*2,h:r*2,box:g,move,reset,release:p=>{if(p.id===pointerId)reset();}};ui.controls.push(control);
 g.setInteractive({hitArea:{cx,cy,r},hitAreaCallback:(a,x,y)=>Math.hypot(x-a.cx,y-a.cy)<=a.r});
 g.on('pointerdown',(p,x,y,event)=>{event.stopPropagation();if(pointerId!==null)return;pointerId=p.id;move(p);});paint();
 const right=ui.w-ui.safe.right,actions=[[right-62,cy-12],[right-30,cy-12]];
 const glyph=name=>(g,x,y,c)=>pixels(g,name,x,y,c);
 button(ui,parent,'Jump',...actions[0],24,24,()=>app.scene.jump(),{id:'jump',glyph:glyph('jump'),disabled:['interior','barber','clothing'].includes(app.state.area)});
 const attack=button(ui,parent,'Use',...actions[1],24,24,()=>{
  const c=app.scene.context();if(c&&c.type!=='hint')app.use();else if(!c&&app.state.selected==='axe'&&!['interior','barber','clothing'].includes(app.state.area))app.attack();else app.ui.feedback(c?.label||'Move closer to use');
 },{id:'attack',glyph:glyph('use'),sound:false});
 control.updateAction=c=>{const label=app.state.selected==='axe'&&(!c||['hunt','chop'].includes(c.type))&&!['interior','barber','clothing'].includes(app.state.area)?'Hit':'Use';attack.label=label;};
 return control;
}
