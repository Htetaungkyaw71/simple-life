import {panel,text,button,UI_COLORS} from './pixelWidgets.js';
import {introArt} from './IntroArt.js';
export const START_PAGES=[
 {title:'Your goal',art:'farm',body:"Grow crops, sell your harvest, and help the town. Follow the Journal to recover Grandfather's Keepsake and bring it home."},
 {title:'Controls',art:null,body:'WASD or arrows: move. E: use. Space: jump. B: Bag. Escape: menu. Select seeds, watering can and harvest tool from the toolbar.',touch:'Circle: move. Star: use the nearby object or selected tool. Arrow: jump outdoors. Bag: seeds, tools and food. Menu: Journal, save and language.'},
 {title:'The farming loop',art:null,body:'Choose seeds in Bag, then use an empty bed. Select the watering can and water once each day. Sleep at Home; after 3 watered nights, harvest Tomato and sell to Niko in City.'},
 {title:'Your first job',art:'farm',body:'Walk to the crate beside your front steps. Use it to collect 3 free Tomato seeds. Then follow the south FARM sign.'},
];
function background(u,w,h){const x=u.safe.left+Math.floor((u.w-u.safe.left-u.safe.right-w)/2),y=u.safe.top+Math.floor((u.h-u.safe.top-u.safe.bottom-h)/2);const veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.6).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());panel(u,u.root,x,y,w,h);u.menuBounds={x:x*2,y:y*2,w:w*2,h:h*2};return {x,y,w,h};}
export function drawLanguageMenu(u,choose){
 const w=Math.min(240,u.w-u.safe.left-u.safe.right-16),h=Math.min(180,u.h-u.safe.top-u.safe.bottom-12),l=background(u,w,h);
 text(u,u.root,l.x+12,l.y+10,'English / မြန်မာ',14,UI_COLORS.light,w-24,false,'heading');
 const y=l.y+Math.max(44,h-88);button(u,u.root,'English',l.x+12,y,w-24,32,()=>choose('en'),{id:'language-en'});button(u,u.root,'မြန်မာ',l.x+12,y+38,w-24,32,()=>choose('mm'),{id:'language-mm',disabled:u.app.myanmarFontReady===false});if(u.app.myanmarFontReady===false)text(u,u.root,l.x+12,l.y+32,'Font unavailable / refresh to retry',7,UI_COLORS.gold,w-24);u.highlight();
}
export function drawGettingStarted(u,page,next,finish,leaf=0){
 const d=START_PAGES[page],w=Math.min(320,u.w-u.safe.left-u.safe.right-16),h=Math.min(252,u.h-u.safe.top-u.safe.bottom-12),l=background(u,w,h);
 const heading=text(u,u.root,l.x+12,l.y+8,(page+1)+' / 4  '+d.title,10,UI_COLORS.light,w-24,false,'heading');let y=heading.y+heading.height+6;
 if(d.art&&h>220){introArt(u,l,d.art,y,40);y+=46;}
 const copy=text(u,u.root,l.x+12,y,u.touch&&d.touch?d.touch:d.body,8,UI_COLORS.light,w-24),limit=l.y+h-36;
 const lines=copy.getTextBounds().wrappedText.split('\n'),step=u.app.language.current==='mm'?19:12,count=Math.max(1,Math.floor((limit-y)/step)),pages=Math.max(1,Math.ceil(lines.length/count));
 copy.setText(lines.slice(leaf*count,(leaf+1)*count).join('\n'));
 const bw=Math.floor((w-28)/2),by=l.y+h-30;
 button(u,u.root,page?'Back':'Close',l.x+12,by,bw,24,()=>page?next(page-1):finish(),{id:'guide-back'});
 button(u,u.root,leaf+1<pages?'Next':page===3?'Start farming':'Next',l.x+16+bw,by,bw,24,()=>{if(leaf+1<pages){u.menu.draw=()=>drawGettingStarted(u,page,next,finish,leaf+1);u.layout();}else if(page===3)finish();else next(page+1);},{id:'guide-next'});u.highlight();
}
