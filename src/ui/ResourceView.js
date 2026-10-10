import {button,panel,text,icon,UI_COLORS} from './pixelWidgets.js';
import {decorationPreview,projectPreview} from './resourcePreviews.js';

// Image-first pages share a compact two-column layout and tall portrait cards.
export function drawResourcePage(u,page){
 const short=u.h<220,narrow=u.w<240,w=Math.min(370,u.w-u.safe.left-u.safe.right-16),h=Math.min(narrow?306:280,u.h-u.safe.top-u.safe.bottom-16),x=Math.floor(u.safe.left+(u.w-u.safe.left-u.safe.right-w)/2),y=Math.max(u.safe.top+8,Math.floor((u.h-h)/2)),inner=w-24;
 u.menuBounds={x:x*2,y:y*2,w:w*2,h:h*2};
 const veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.65).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());panel(u,u.root,x,y,w,h,UI_COLORS.cream);
 text(u,u.root,x+12,y+9,page.kicker+(short&&page.kicker==='Farm workshop'?' / Hand packs it':''),7,UI_COLORS.muted,inner-28);
 text(u,u.root,x+12,y+21,page.title,narrow?9:14,UI_COLORS.light,inner-28,true);
 const close=button(u,u.root,'X',x+w-32,y+8,22,22,()=>u.close(),{id:'resource-close',bold:true});close.box.setFillStyle(0xe3a08b);
 let top=y+46;
 if(page.tabs?.length){const gap=3,tw=Math.floor((inner-gap*(page.tabs.length-1))/page.tabs.length);page.tabs.forEach((tab,i)=>{const bx=x+12+i*(tw+gap),c=button(u,u.root,tab.label,bx,top,tw,short?26:38,tab.action,{id:tab.id,preview:(s,p,cx)=>{tab.preview(s,p,cx,top+(short?9:14),tw-8,short?14:24);if(tab.caption)text(s,p,cx,top+(short?18:28),tab.caption,short?5:6,UI_COLORS.light).setOrigin(.5,0);}});if(tab.selected)c.box.setFillStyle(UI_COLORS.selected);});top+=short?30:43;}
 const bottom=y+h-36;
 if(page.home){const rows=page.home,step=short?27:43;rows.forEach((row,i)=>{const ry=top+i*step;button(u,u.root,row.label,x+12,ry,inner,short?24:39,row.action,{id:row.id,preview:(s,p)=>{row.preview(s,p,x+30,ry+(short?12:19),26,short?18:27);text(s,p,x+51,ry+(short?8:15),row.label,narrow?7:9,UI_COLORS.light,inner-50,true);}});});text(u,u.root,x+12,bottom+8,page.note,7,UI_COLORS.muted,inner);u.highlight();return;}
 const vertical=narrow&&!short,iw=vertical?inner:short?76:112,ih=vertical?(page.preview==='stove'?80:55):short?Math.max(26,bottom-top-(page.reward?26:4)):92,px=x+12,py=top;
 panel(u,u.root,px,py,iw,ih,0xe4e9c6,'plain');
 if(page.project)projectPreview(u,u.root,page.project,px+iw/2,py+ih/2,iw-12,ih-10);else decorationPreview(u,u.root,page.preview,px+iw/2,py+ih/2,iw-12,ih-10);
 const tx=vertical?px:px+iw+10,ty=vertical?py+ih+7:py,tw=vertical?inner:inner-iw-10;
 let cy=ty;
 if(!short){text(u,u.root,tx,cy,page.description,8,UI_COLORS.muted,tw);cy+=vertical?23:30;}
 if(!short){text(u,u.root,tx,cy,'Need / In your bag',7,UI_COLORS.muted,tw);cy+=14;}
 for(const m of page.materials||[]){icon(u,u.root,m.icon,tx,cy-2,.75);text(u,u.root,tx+16,cy,m.name+' '+m.need+' / '+m.have,short?7:8,m.have>=m.need?UI_COLORS.light:0xa45a43,tw-16);cy+=short?17:21;}
 if(page.food){const fy=short?cy+3:vertical?cy+4:top+111;icon(u,u.root,page.food,short?tx:x+12,fy-1,.75);text(u,u.root,(short?tx:x+12)+17,fy+2,'+50 HP / +35 EP',7,UI_COLORS.gold,short?tw-17:inner-17);}
 if(page.reward){const ry=short?bottom-18:vertical?Math.min(cy+3,bottom-42):top+106;icon(u,u.root,'coin',x+12,ry,.75);text(u,u.root,x+28,ry+2,'+'+page.reward.coins,8,UI_COLORS.gold);icon(u,u.root,page.reward.seedIcon,x+inner/2,ry,.75);text(u,u.root,x+inner/2+17,ry+2,'+'+page.reward.seeds+' seeds',8,UI_COLORS.light);}
 if(!short){text(u,u.root,x+12,bottom-27,page.note,7,UI_COLORS.muted,inner);}
 else if(page.status&&!page.reward)text(u,u.root,tx,Math.min(cy+(page.food?20:1),bottom-12),page.status,6,UI_COLORS.gold,tw);
 const actions=page.actions,aw=Math.floor((inner-4*(actions.length-1))/actions.length);actions.forEach(([label,fn,disabled],i)=>{const c=button(u,u.root,label,x+12+i*(aw+4),bottom,aw,24,fn,{id:'resource-action-'+i,disabled,bold:true,fontSize:narrow?8:9});if(i===0&&!disabled)c.box.setFillStyle(0xa6b873);});u.highlight();
}
