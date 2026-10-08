import {button,panel,text,UI_COLORS} from './pixelWidgets.js';
import {groundHash} from '../art/groundSurface.js';
import {pixels} from './statusArt.js';
export function titleBackdrop(u){
 const {w,h,root}=u,g=u.add.graphics();root.add(g);g.fillStyle(0xf4e8ba).fillRect(0,0,w,h);
 for(let i=0;i<13;i++){
  const seed=groundHash(i,4,192),x=Math.floor((i+.1*(seed%5-2))*w/12),tw=6+(seed>>>8)%7,by=Math.floor(h*.18)+(seed>>>12)%Math.max(1,Math.floor(h*.3)),side=i%2?1:-1;
  g.fillStyle(i%2?0xc6c2a3:0xd6c6a0,.55).fillRect(x,0,tw,h).fillRect(x+side*tw,by,tw,tw*2).fillRect(x+side*tw*2,by-tw,tw,tw*2);
  g.fillStyle(0xffedb2,.3).fillRect(x+tw,0,10,h);
 }
 for(let i=0;i<8;i++){const side=i%2,x=side?w-12-(i%4)*17:12+(i%4)*17,y=h-25+i%3*11;const tree=u.add.image(x,y,'town',i%3===0?'forest-palm-0':'forest-oak-'+i%3).setOrigin(.5,1).setScale(i<4?2:1).setAlpha(i<4?.8:.45);root.add(tree);}
 const river=u.add.graphics();root.add(river);river.fillStyle(0x719889).fillRect(0,h-33,w,33).fillStyle(0xa9c4ab).fillRect(0,h-32,w,3);
 for(let n=0;n<100;n++){const seed=groundHash(n,3,246);river.fillStyle(n%4?0xbed4b8:0x92b3a2,.7).fillRect(seed%Math.max(1,w),h-28+(seed>>>8)%25,5+seed%14,1);}
 const haze=u.add.graphics();root.add(haze);haze.fillStyle(0xffefc4,.4).fillRect(Math.floor(w*.25),0,Math.ceil(w*.5),h-34);
 if(w>300){root.add(u.add.sprite(40,h-34,'boy',0).setOrigin(.5,1).setScale(3));root.add(u.add.sprite(w-40,h-34,'girl',0).setOrigin(.5,1).setScale(3));}
}
export function drawModal(u){
 const {kicker,title,body:fullBody,buttons,kind}=u.menu,w=u.w,h=u.h,isTitle=kind==='title';
 const body=h<200&&kicker==='ART & CREDITS'?'LimeZu / CC BY 4.0\nCodex-assisted originals.':h<200&&kicker==='WILDLIFE & RUINS'?'Craftpix / Freebie licence\nSelected frames repacked.':fullBody;
 if(isTitle)titleBackdrop(u);
 const veil=u.add.rectangle(0,0,w,h,0x23362a,isTitle?0:.6).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());
 const pw=Math.min(isTitle?210:300,w-u.safe.left-u.safe.right-16),x=Math.floor((w-pw)/2),size=isTitle?h<240?16:Math.min(40,Math.floor((pw-20)/4)):12;
 const tm=text(u,u.root,0,0,isTitle?'SIMPLE\nLIFE':title,size,UI_COLORS.light,pw-24),th=tm.height;tm.destroy();
 const bm=text(u,u.root,0,0,body,h<200?6:7,UI_COLORS.muted,pw-24),bh=body?bm.height:0;bm.destroy();
 const choose=kind==='choose'?48:0,step=h<200?24:28,total=14+th+(isTitle?12:6)+bh+(bh?6:0)+choose+buttons.length*step+2;
 const y=Math.max(u.safe.top+5,Math.floor((h-total)/2));u.menuBounds={x:x*2,y:y*2,w:pw*2,h:total*2};
 if(!isTitle)panel(u,u.root,x,y,pw,total);
 if(isTitle){text(u,u.root,w/2+2,y+11,'SIMPLE\nLIFE',size,UI_COLORS.ink).setOrigin(.5,0).setCenterAlign();text(u,u.root,w/2,y+9,'SIMPLE\nLIFE',size,UI_COLORS.cream).setOrigin(.5,0).setCenterAlign();const leaf=u.add.graphics();u.root.add(leaf);pixels(leaf,'leaf',Math.round(w/2-pw/3),y+8,UI_COLORS.edge);}
 else text(u,u.root,w/2,y+10,title,size,UI_COLORS.light,pw-24).setOrigin(.5,0).setCenterAlign();
 let cy=y+14+th+(isTitle?12:6);
 if(choose){for(const [i,char]of ['boy','girl'].entries()){const sx=w/2+(i?35:-35);u.root.add(u.add.sprite(sx,cy+17,char,0));text(u,u.root,sx,cy+35,char,7).setOrigin(.5,0);}cy+=choose;}
 if(body){text(u,u.root,x+12,cy,body,h<200?6:7,UI_COLORS.muted,pw-24);cy+=bh+6;}
 buttons.forEach(([label,fn,disabled=false],i)=>button(u,u.root,label,x+12,cy+i*step,pw-24,step-2,fn,{disabled,id:label}));u.highlight();
}
