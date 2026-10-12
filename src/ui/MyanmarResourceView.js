import {translate,translateButton} from '../i18n/language.js';
import {panel,text,button,icon,UI_COLORS} from './pixelWidgets.js';
// Myanmar's shaped line metrics require a separate measured layout. The same
// page data/actions own all gameplay; this view only reserves readable bands.
export function drawMyanmarResourcePage(u,page,leaf=0){
 const w=Math.min(370,u.w-u.safe.left-u.safe.right-12),h=Math.min(280,u.h-u.safe.top-u.safe.bottom-12),x=u.safe.left+Math.floor((u.w-u.safe.left-u.safe.right-w)/2),y=u.safe.top+Math.floor((u.h-u.safe.top-u.safe.bottom-h)/2),short=h<180,inner=w-24;
 const veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.65).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());panel(u,u.root,x,y,w,h);u.menuBounds={x:x*2,y:y*2,w:w*2,h:h*2};
 const title=text(u,u.root,x+12,y+8,page.title,10,UI_COLORS.light,inner-28,false,'heading');button(u,u.root,'X',x+w-32,y+8,22,22,()=>u.close(),{id:'resource-close'});let top=title.y+title.height+7;
 if(page.home){const cols=short?2:1,rows=Math.ceil(page.home.length/cols),gap=4,bw=Math.floor((inner-gap*(cols-1))/cols),bh=Math.floor((y+h-10-top-gap*(rows-1))/rows);
 page.home.forEach((row,i)=>button(u,u.root,translateButton(row.label,'mm'),x+12+i%cols*(bw+gap),top+Math.floor(i/cols)*(bh+gap),bw,bh,row.action,{id:row.id}));u.highlight();return;}
 if(page.tabs?.length){const tw=Math.floor((inner-(page.tabs.length-1)*3)/page.tabs.length),th=short?22:38;page.tabs.forEach((tab,i)=>{const bx=x+12+i*(tw+3),c=button(u,u.root,tab.label,bx,top,tw,th,tab.action,{id:tab.id,preview:(s,p,cx,cy)=>tab.preview(s,p,cx,short?cy:top+10,tw-8,short?14:16)});if(tab.selected)c.box.setFillStyle(UI_COLORS.selected);if(!short&&tab.caption){const caption=text(u,u.root,bx+tw/2,top+19,translateButton(tab.caption,'mm'),6,UI_COLORS.light,tw-6).setOrigin(.5,0);if(caption.height>16||caption.width>tw-6)caption.destroy();}});top+=th+6;}
 const bottom=y+h-30,materials=page.materials||[],left=x+12,materialWidth=short?Math.floor(inner/2):inner;
 const lines=materials.map(m=>translate(m.name,'mm')+' '+m.need+' / '+m.have);
 if(short){let row=top;materials.forEach((m,i)=>{const mx=left+i%2*materialWidth;icon(u,u.root,m.icon,mx,row+Math.floor(i/2)*19,.6);text(u,u.root,mx+13,row+Math.floor(i/2)*19,lines[i],7,m.have>=m.need?UI_COLORS.light:UI_COLORS.gold,materialWidth-15);});}
 else{
  const values=[page.description,...lines,page.food?'+50 HP / +35 EP':'',page.reward?'+'+page.reward.coins+'c / +'+page.reward.seeds+' seeds':'',page.note||page.status].filter(Boolean),copy=text(u,u.root,left,top,values.join('\n'),8,UI_COLORS.light,inner-26),wrapped=copy.getTextBounds().wrappedText.split('\n'),count=Math.max(1,Math.floor((bottom-top-6)/19)),pages=Math.ceil(wrapped.length/count),part=leaf%Math.max(1,pages);copy.setText(wrapped.slice(part*count,(part+1)*count).join('\n'));if(pages>1)button(u,u.root,'>',x+w-34,bottom-27,22,22,()=>{u.menu.draw=()=>drawMyanmarResourcePage(u,page,(part+1)%pages);u.layout();},{id:'resource-text-next'});
 }
 const aw=Math.floor((inner-4*(page.actions.length-1))/page.actions.length);page.actions.forEach(([label,fn,disabled],i)=>button(u,u.root,label,x+12+i*(aw+4),bottom,aw,24,fn,{id:'resource-action-'+i,disabled}));
 // Full description/reward/status stays accessible on the shortest landscape.
 if(short)button(u,u.root,'?',x+w-58,y+8,22,22,()=>u.modal(page.kicker,page.title,[page.description,...lines,page.reward?'+'+page.reward.coins+'c / +'+page.reward.seeds+' seeds':'',page.note||page.status].filter(Boolean).join('\n'),[['Back',()=>{u.menu={kind:'resources',page,draw:()=>drawMyanmarResourcePage(u,page)};u.layout();}]]),{id:'resource-details'});
 u.highlight();
}
