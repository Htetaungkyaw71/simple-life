import {button,text} from './pixelWidgets.js';
import {groundHash} from '../art/groundSurface.js';

const WELCOME_BACKDROP={key:'welcomeMysticalRiver',width:1672,height:941};
export const WELCOME_TITLE_STYLE={face:0xfff1c4,outline:0x34432e,shadow:0x202b22};
const TITLE_OUTLINE_OFFSETS=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];
// Conservative source-pixel channel through the painted river. Keeping motion
// inside this channel protects the irregular rocks, roots, bridge and foliage
// that overlap the broader water silhouette near the banks.
const WELCOME_WATER_SHORE=[
 [708,570,1110],
 [760,465,1300],
 [820,300,1360],
 [870,340,1290],
 [920,520,1190],
 [941,590,1130]
];

export function welcomeWaterBounds(sourceY){
 const y=Math.max(WELCOME_WATER_SHORE[0][0],Math.min(WELCOME_WATER_SHORE.at(-1)[0],sourceY));
 for(let i=1;i<WELCOME_WATER_SHORE.length;i++){
  const a=WELCOME_WATER_SHORE[i-1],b=WELCOME_WATER_SHORE[i];if(y>b[0])continue;
  const t=(y-a[0])/(b[0]-a[0]);return [a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
 }
 return WELCOME_WATER_SHORE.at(-1).slice(1);
}

// Native UI pixels, displayed at 2x. This disposable scenery never advances the farm.
export function welcomeLayout(w,h,count=4,safe={top:0,right:0,bottom:0,left:0}){
 const short=w>h*1.5&&h<225,available=h-safe.top-safe.bottom,columns=short?2:1;
 const bw=Math.floor(Math.min(short?190:188,short?w*.47:w-safe.left-safe.right-24));
 const bh=short?26:30,gap=short?8:9,x=Math.round(short?w*.73-bw/2:(w-bw)/2);
 const rows=Math.ceil(count/columns),group=rows*bh+(rows-1)*gap+34;
 const y=Math.round(short?safe.top+(available-group)/2:Math.min(Math.max(safe.top+108,(h-group)/2+30),h-safe.bottom-group));
 const langY=y+rows*(bh+gap)+3,cellW=columns===2?Math.floor((bw-gap)/2):bw;
 return {short,columns,cellW,bw,bh,gap,x,y,langY,logoX:short?Math.round(w*.24):Math.round(w/2),logoY:short?Math.max(safe.top+5,Math.round(h*.2)):Math.max(safe.top+8,y-104),logoWidth:short?Math.floor(w*.43):Math.min(w-24,240)};
}
export function welcomeMotion(seconds,index=0){
 const phase=seconds*.7+index*.63;
 return {sway:Math.round(Math.sin(phase)*1.4+Math.sin(phase*1.7)*.5),bob:Math.round(Math.sin(seconds*2.3+index)*1.1),wing:Math.floor(seconds*5+index)%4};
}
const rect=(g,color,x,y,w,h,alpha=1)=>g.fillStyle(color,alpha).fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
function welcomeTitle(u,root,x,y,value,size,width){
 text(u,root,x+2,y+3,value,size,WELCOME_TITLE_STYLE.shadow,width).setOrigin(.5,0).setCenterAlign();
 for(const [dx,dy]of TITLE_OUTLINE_OFFSETS)text(u,root,x+dx,y+dy,value,size,WELCOME_TITLE_STYLE.outline,width).setOrigin(.5,0).setCenterAlign();
 return text(u,root,x,y,value,size,WELCOME_TITLE_STYLE.face,width).setOrigin(.5,0).setCenterAlign();
}
function landscape(u){
 const {w,h,root}=u;
 // Original local raster, displayed as a cover crop. The interface remains
 // independent Phaser content so every control stays readable and interactive.
 const scale=Math.max(w/WELCOME_BACKDROP.width,h/WELCOME_BACKDROP.height);
 const backdrop=u.add.image(Math.round(w/2),Math.round(h/2),WELCOME_BACKDROP.key).setOrigin(.5).setScale(scale);root.add(backdrop);
 const water=u.add.graphics();root.add(water);
 const air=u.add.graphics();root.add(air);
 return {backdrop,water,crowns:[],air};
}
export class WelcomeView{
 constructor(u,layout){this.u=u;this.layout=layout;this.elapsed=0;this.lastFrame=-1;this.active=true;this.reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;Object.assign(this,landscape(u));this.buttons=[];this.update(0,0);}
 update(time,delta){
  if(!this.active)return;const u=this.u,{w,h}=u;this.elapsed+=Math.min(Math.max(delta||0,0),50)/1000;const s=this.reduced?0:this.elapsed,frame=Math.floor(s*24);if(frame===this.lastFrame)return;this.lastFrame=frame;
  // The reference uses small stepped highlight clusters, not screen-wide
  // travelling strokes. Work in backdrop source pixels so the effect follows
  // the same painted river after every responsive cover crop.
  this.water.clear();const scale=Math.max(w/WELCOME_BACKDROP.width,h/WELCOME_BACKDROP.height),left=(w-WELCOME_BACKDROP.width*scale)/2,top=(h-WELCOME_BACKDROP.height*scale)/2,waterFrame=Math.floor(s*4);this.waterFrame=waterFrame;
  for(let i=0;i<26;i++){
   const seed=groundHash(i,19,913),sy=714+(seed%207),bounds=welcomeWaterBounds(sy),span=bounds[1]-bounds[0],wide=9+(seed>>>8)%19,phase=(waterFrame+i)%4,shift=[-4,0,4,0][phase],cluster=wide+15;
   const sx=bounds[0]+8+(seed>>>14)%Math.max(1,Math.floor(span-cluster-16)),x=left+(sx+shift)*scale,y=top+sy*scale,unit=Math.max(1,Math.round(scale)),main=Math.max(2,Math.round(wide*scale)),side=Math.max(1,Math.round(wide*.42*scale));
   rect(this.water,i%3===0?0xefe5b1:0xc7e3cf,x,y,main,unit,i%3===0?.24:.2);
   rect(this.water,0xdcebd3,x+main+Math.max(1,Math.round(4*scale)),y-unit,side,unit,.16);
   if(i%4===0)rect(this.water,0x5f958a,x+Math.round(3*scale),y+unit*2,Math.max(1,Math.round(wide*.55*scale)),unit,.14);
  }
  this.air.clear();
  for(let i=0;i<3;i++){
   const x=((w*.65+s*11+i*16)%(w+90))-45,y=h*.15+Math.sin(s*.3)*6+i*7,m=welcomeMotion(s,i),wing=[-2,-1,1,-1][m.wing];
   rect(this.air,0x485342,x,y,2,1);rect(this.air,0x485342,x-2,y+wing,2,1);rect(this.air,0x485342,x+2,y+wing,2,1);
  }
  for(let i=0;i<8;i++){
   const seed=groundHash(i,0,92),x=(seed%w+s*(7+i%3))%w,y=(seed>>>8)%Math.max(1,Math.floor(h*.68))+Math.sin(s+i)*3;
   if(x>w*.24&&x<w*.76)continue;rect(this.air,0xb6b578,x,y,3,1,.8);rect(this.air,0x6d814b,x+1,y+1,2,1,.8);
  }
  if(this.cursor){this.cursor.clear();const choices=u.controls.filter(c=>!c.disabled),c=choices[u.focus%choices.length];if(c){const x=c.x+9,y=c.y+c.h/2+(this.reduced?0:Math.round(Math.sin(s*3)*1));rect(this.cursor,0x687d45,x,y,5,2);rect(this.cursor,0xa7b46a,x+2,y-2,3,2);}}
  for(const [i,c]of this.buttons.entries()){
   const intro=this.reduced?1:Math.min(1,Math.max(0,(this.elapsed-i*.045)/.28));c.box.setAlpha(intro);c.text?.setAlpha(intro);
  }
 }
 snapshot(){return {elapsed:Math.round(this.elapsed*100)/100,reducedMotion:this.reduced,composition:'front-facing-river',backdrop:WELCOME_BACKDROP.key,canopies:[],waterStyle:'shoreline-wavelets',waterFrame:this.waterFrame??0,birds:3,characters:0};}
 destroy(){this.active=false;this.buttons=[];this.crowns=[];}
}
export function drawWelcome(u){
 const {w,h,root,menu}=u,l=welcomeLayout(w,h,menu.buttons.length,u.safe);u.titleView=new WelcomeView(u,l);
 const veil=u.add.rectangle(0,0,w,h,0,0).setOrigin(0).setInteractive();root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());
 const heading='SIMPLE\nLIFE',logoY=l.logoY,logoSize=l.short?24:40;
 const logo=welcomeTitle(u,root,l.logoX,logoY,heading,logoSize,l.logoWidth);
 const ornament=u.add.graphics();root.add(ornament);const oy=Math.round(logoY+logo.height+7),cx=l.logoX;
 rect(ornament,0xd3c389,cx-28,oy,56,1);for(const side of [-1,1])for(let i=0;i<3;i++){rect(ornament,0x526d39,cx+side*(32+i*4),oy-i*2,4,2);rect(ornament,0xb6bc71,cx+side*(32+i*4),oy-i*2-1,2,1);}
 if(!l.short&&l.y-oy>13)text(u,root,cx,oy+7,'A TROPICAL FARMING ADVENTURE',7,0x35462e,Math.min(204,w-24)).setOrigin(.5,0);
 menu.buttons.forEach(([label,fn,disabled=false],i)=>{
  const c=button(u,root,label,l.x+i%l.columns*(l.cellW+l.gap),l.y+Math.floor(i/l.columns)*(l.bh+l.gap),l.cellW,l.bh,fn,{disabled,id:label});u.titleView.buttons.push(c);
  c.box.on('pointerover',()=>{const index=u.controls.filter(c=>!c.disabled).indexOf(c);if(index>=0){u.focus=index;u.highlight();}});
 });
 const language=u.app?.language?.current||'en',chipW=Math.min(86,(l.bw-8)/2),chipX=l.x+(l.bw-chipW*2-8)/2;
 for(const [i,lang,label]of [[0,'en','English'],[1,'mm','မြန်မာ']]){
  const c=button(u,root,label,chipX+i*(chipW+8),l.langY,chipW,24,()=>{
   if(u.app?.myanmarFontReady===false&&lang==='mm')return;
   u.app?.language?.select(lang);if(typeof document!=='undefined')document.documentElement.lang=lang==='mm'?'my':'en';u.title();
  },{id:'welcome-language-'+lang,disabled:lang==='mm'&&u.app?.myanmarFontReady===false,fontSize:7});
  if(language===lang)c.box.setFillStyle(0xd6dfb5);
 }
 if(menu.body&&!l.short&&l.langY+39<h-u.safe.bottom)text(u,root,w/2,l.langY+30,menu.body,7,0x35462e,w-24).setOrigin(.5,0);
 u.titleView.cursor=u.add.graphics();root.add(u.titleView.cursor);
 const scale=u.uiScale||2;u.menuBounds={x:Math.min(l.x,l.logoX-l.logoWidth/2)*scale,y:Math.min(logoY,l.y)*scale,w:Math.max(l.bw,l.logoWidth)*scale,h:(l.langY+24-Math.min(logoY,l.y))*scale};u.highlight();
 for(const c of u.titleView.buttons){c.box.setAlpha(u.titleView.reduced?1:0);c.text?.setAlpha(u.titleView.reduced?1:0);}
}
