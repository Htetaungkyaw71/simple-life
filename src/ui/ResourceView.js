import {button,panel,text,icon,UI_COLORS} from './pixelWidgets.js';
import {decorationPreview,projectPreview} from './resourcePreviews.js';

// Layout reserves separate header, content, reward and action bands.
export function drawResourcePage(u,page){
 const short=u.h-u.safe.top-u.safe.bottom<220,narrow=u.w-u.safe.left-u.safe.right<240,w=Math.min(370,u.w-u.safe.left-u.safe.right-12),h=Math.min(narrow?306:280,u.h-u.safe.top-u.safe.bottom-12),x=Math.floor(u.safe.left+(u.w-u.safe.left-u.safe.right-w)/2),y=Math.max(u.safe.top+6,Math.floor((u.h-h)/2)),inner=w-24,tiny=h<160;
 u.menuBounds={x:x*2,y:y*2,w:w*2,h:h*2};
 const veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.65).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());panel(u,u.root,x,y,w,h,UI_COLORS.cream);
 text(u,u.root,x+12,y+8,page.kicker,7,UI_COLORS.muted,inner-28);
 const heading=text(u,u.root,x+12,y+21,page.title,tiny||narrow?9:14,UI_COLORS.light,inner-28,true,'heading');
 const close=button(u,u.root,'X',x+w-32,y+8,22,22,()=>u.close(),{id:'resource-close'});close.box.setFillStyle(0xe3a08b);
 let top=y+Math.max(tiny?35:41,21+heading.height+(tiny?4:6));
 if(page.home){
  const cols=short&&page.home.length>2?2:1,rows=Math.ceil(page.home.length/cols),gap=5,available=y+h-10-top,bh=Math.min(short?34:43,Math.floor((available-gap*(rows-1))/rows)),bw=Math.floor((inner-gap*(cols-1))/cols);
  page.home.forEach((row,i)=>{const bx=x+12+i%cols*(bw+gap),by=top+Math.floor(i/cols)*(bh+gap);button(u,u.root,row.label,bx,by,bw,bh,row.action,{id:row.id,preview:(s,p)=>{
   row.preview(s,p,bx+17,by+bh/2,22,Math.min(24,bh-8));const label=text(s,p,bx+34,0,row.label,8,UI_COLORS.light,bw-42);label.setY(Math.round(by+(bh-label.height)/2));
  }});});u.highlight();return;
 }
 if(page.tabs?.length){
  const cols=narrow?Math.min(3,page.tabs.length):page.tabs.length,rows=Math.ceil(page.tabs.length/cols),gap=3,tw=Math.floor((inner-gap*(cols-1))/cols),th=tiny?22:short?28:38;
  page.tabs.forEach((tab,i)=>{const bx=x+12+i%cols*(tw+gap),by=top+Math.floor(i/cols)*(th+gap),c=button(u,u.root,tab.label,bx,by,tw,th,tab.action,{id:tab.id,preview:(s,p,cx)=>{
   tab.preview(s,p,cx,by+(tiny?6:short?8:13),tw-10,short?12:22);
   if(tab.caption){const label=text(s,p,cx,by+th-10,tab.caption,6,UI_COLORS.light).setOrigin(.5,0);if(label.width>tw-6)label.setText(tab.caption.slice(0,Math.max(1,Math.floor((tw-6)/6)-1))+'.');}
  }});if(tab.selected)c.box.setFillStyle(UI_COLORS.selected);});top+=rows*(th+gap)+1;
 }
 const bottom=y+h-30,vertical=narrow&&!short,iw=vertical?inner:short?64:112,ih=vertical?(page.customPreview?48:page.preview==='stove'?40:36):short?Math.max(24,bottom-top-(page.reward?20:6)):86,px=x+12,py=top;
 if(!tiny)panel(u,u.root,px,py,iw,ih,0xe4e9c6,'plain');
 if(!tiny){if(page.customPreview)page.customPreview(u,u.root,px+iw/2,py+ih/2,iw-12,ih-10);else if(page.project)projectPreview(u,u.root,page.project,px+iw/2,py+ih/2,iw-12,ih-10);else decorationPreview(u,u.root,page.preview,px+iw/2,py+ih/2,iw-12,ih-10);}
 const tx=tiny||vertical?px:px+iw+10,tw=tiny||vertical?inner:inner-iw-10;let cy=vertical?py+ih+8:py;
 if(!short){const description=text(u,u.root,tx,cy,page.description,8,UI_COLORS.muted,tw);cy+=description.height+6;const caption=text(u,u.root,tx,cy,page.customPreview||page.materials?.[0]?.icon==='coin'?'Price / Your coins':'Need / In your bag',7,UI_COLORS.muted,tw);cy+=caption.height+5;}
 const materialTop=cy,materials=page.materials||[],columns=tiny?2:1,columnWidth=Math.floor(tw/columns);materials.forEach((m,i)=>{const mx=tx+(i%columns)*columnWidth,my=materialTop+Math.floor(i/columns)*(short?12:16);icon(u,u.root,m.icon,mx,my,.75);text(u,u.root,mx+16,my+2,m.name+' '+m.need+' / '+m.have,7,m.have>=m.need?UI_COLORS.light:0xa45a43,columnWidth-18);});cy+=Math.ceil(materials.length/columns)*(short?12:16);
 if(page.food){icon(u,u.root,page.food,tx,cy+2,.75);text(u,u.root,tx+17,cy+(tiny?2:4),'+50 HP / +35 EP',7,UI_COLORS.gold,tw-17);cy+=18;}
 if(page.reward){const ry=short?bottom-(tiny?14:18):Math.min(Math.max(cy+5,top+100),bottom-22);icon(u,u.root,'coin',x+12,ry,.75);text(u,u.root,x+28,ry+2,'+'+page.reward.coins,8,UI_COLORS.gold);const seedX=x+12+Math.floor(inner/2);icon(u,u.root,page.reward.seedIcon,seedX,ry,.75);text(u,u.root,seedX+17,ry+2,'+'+page.reward.seeds+' seeds',8,UI_COLORS.light,inner/2-17);}
 else if(page.status&&short&&cy+12<bottom)text(u,u.root,tx,cy+3,page.status,7,UI_COLORS.gold,tw);
 else if(!short&&cy+25<bottom&&!page.reward){const note=text(u,u.root,x+12,bottom-20,page.note,7,UI_COLORS.muted,inner);if(note.height>14)note.destroy();}
 const aw=Math.floor((inner-4*(page.actions.length-1))/page.actions.length);page.actions.forEach(([label,fn,disabled],i)=>{const c=button(u,u.root,label,x+12+i*(aw+4),bottom,aw,24,fn,{id:'resource-action-'+i,disabled});if(i===0&&!disabled)c.box.setFillStyle(0xa6b873);});u.highlight();
}
