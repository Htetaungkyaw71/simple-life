import {FARMER} from '../data/appearance.js';
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
 if(w>300){for(const [x,char]of [[40,'boy'],[w-40,'girl']])root.add(u.add.sprite(x,h-34,char,0).setOrigin(.5,FARMER.originY).setScale(FARMER.scale*2));}
}
export function drawModal(u){
 const {kicker,title,body:fullBody,buttons,kind}=u.menu,w=u.w,h=u.h,isTitle=kind==='title';
 const short=u.touch&&w>h&&h<200;
 let body=short&&kicker==='FONT CREDITS'?'Thaleah / Rick Hoppmann\nCC BY 4.0 / bitmap conversion\nm5x7 / Daniel Linssen / CC0':short&&title==='Farm furniture'?'Tap/drag / adjust position\nArrows / adjust   R / turn\nE or Add / place\nCancel / keep item':short&&title==='Controls'?'Circle / move\nArrow / Jump   Star / Use or Hit\nBAG / seeds and tools\nMenu / pause and save':short&&title==='Your first harvest'?'Crate / 3 seeds\nWater once daily\nHarvest after 3-6 watered days\nBed / restore energy\nMiss 4 days / dead':h<200&&kicker==='ART & CREDITS'?'LimeZu / CC BY 4.0\nCodex-assisted originals.':h<200&&kicker==='WILDLIFE & RUINS'?'Craftpix / Freebie licence\nSelected frames repacked.':fullBody;
 if(isTitle)titleBackdrop(u);
 const veil=u.add.rectangle(0,0,w,h,0x23362a,isTitle?0:.6).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());
 const pw=Math.min(isTitle?210:300,w-u.safe.left-u.safe.right-16),x=Math.floor((w-pw)/2),size=isTitle?h<200?14:h<240?16:Math.min(40,Math.floor((pw-20)/4)):short?9:12;
 const heading=isTitle?(short?'SIMPLE LIFE':'SIMPLE\nLIFE'):title;
 const tm=text(u,u.root,0,0,heading,size,UI_COLORS.light,pw-24,!isTitle),th=tm.height;tm.destroy();
 let bm=text(u,u.root,0,0,body,h<200?6:7,UI_COLORS.muted,pw-24),bh=body?bm.height:0;
 const grid=short&&buttons.length>1||(title==='Paused'||kicker==='ART & CREDITS')&&buttons.length>=6,choose=kind==='choose'?(short?52:66):0,step=h<200?24:28;
 const fixed=(short?10:14)+th+(isTitle?12:short?4:6)+choose+(grid?Math.ceil(buttons.length/2):buttons.length)*step+8,available=h-u.safe.top-u.safe.bottom-12-fixed;
 let bodyPages=1,bodyDetails=null;
 if(body&&available<42){bodyDetails=body;body='';bm.setText('');bh=0;}

 if(body&&bh>available){const lines=bm.getTextBounds().wrappedText.split('\n'),lineHeight=u.app.language?.current==='mm'?19:12,count=Math.max(1,Math.floor((available-26)/lineHeight));bodyPages=Math.ceil(lines.length/count);const page=(u.menu.bodyPage||0)%bodyPages;body=lines.slice(page*count,(page+1)*count).join('\n');bm.setText(body);bh=bm.height;}
 bm.destroy();
 const pager=bodyPages>1?26:0,total=fixed-6+bh+(bh?(short?4:6):0)+pager;
 const y=Math.max(u.safe.top+(short?3:5),Math.floor((h-total)/2));u.menuBounds={x:x*2,y:y*2,w:pw*2,h:total*2};
 if(!isTitle)panel(u,u.root,x,y,pw,total);
 if(isTitle){text(u,u.root,w/2+2,y+11,heading,size,UI_COLORS.ink).setOrigin(.5,0).setCenterAlign();text(u,u.root,w/2,y+9,heading,size,UI_COLORS.cream).setOrigin(.5,0).setCenterAlign();const leaf=u.add.graphics();u.root.add(leaf);pixels(leaf,'leaf',Math.round(w/2-pw/3),y+8,UI_COLORS.edge);}
 else text(u,u.root,w/2,y+10,title,size,UI_COLORS.light,pw-24,true).setOrigin(.5,0).setCenterAlign();
 let cy=y+(short?10:14)+th+(isTitle?12:short?4:6);
 if(choose){for(const [i,char]of ['boy','girl'].entries()){const sx=w/2+(i?35:-35);u.root.add(u.add.sprite(sx,cy+44,char,0).setOrigin(.5,FARMER.originY).setScale(FARMER.scale*.5));if(!short)text(u,u.root,sx,cy+46,char,7).setOrigin(.5,0);}cy+=choose;}
 if(body){text(u,u.root,x+12,cy,body,h<200?6:7,UI_COLORS.muted,pw-24);cy+=bh+(short?4:6);}
 if(bodyPages>1){button(u,u.root,(u.menu.bodyPage||0)+1+' / '+bodyPages+' >',x+12,cy,pw-24,22,()=>{u.menu.bodyPage=((u.menu.bodyPage||0)+1)%bodyPages;u.layout();},{id:'modal-text-next'});cy+=26;}
 if(bodyDetails){button(u,u.root,'?',x+pw-34,y+5,22,22,()=>{const previous=u.menu;u.modal(kicker,title,bodyDetails,[['Back',()=>{u.menu=previous;u.layout();}]]);},{id:'modal-body-details'});}
 buttons.forEach(([label,fn,disabled=false],i)=>button(u,u.root,label,x+12+(grid?i%2*Math.floor((pw-20)/2):0),cy+(grid?Math.floor(i/2):i)*step,grid?Math.floor((pw-28)/2):pw-24,step-2,fn,{disabled,id:label}));u.highlight();
}
