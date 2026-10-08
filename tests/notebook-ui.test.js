import {test} from 'node:test';
import assert from 'node:assert/strict';
import {keyboardAction,touchJumpTap} from '../src/data/controls.js';
import {hudLayout,bagLayout,mapLayout,displayClock,facingIndex} from '../src/ui/layouts.js';
import {BagPanel,bagItems} from '../src/ui/BagPanel.js';
import {WildernessMap} from '../src/ui/WildernessMap.js';
import {forestMapPixels,mapPoint} from '../src/ui/forestMapArt.js';
import {FOREST_MAP,FOREST_SIZE} from '../src/data/forest.js';
import {newState} from '../src/systems/state.js';
import {recorder} from './helpers/uiRecorder.js';
const sizes=[[1440,900],[1280,720],[1024,768],[844,390],[390,844],[640,360],[360,640]];
function appFor(s,u=recorder()){const a={state:s,ui:u,paused:false,input:{},saveCount:0,save(){this.saveCount++;},sound(){},scene:{player:{direction:'up'},forestView:{energy(){}},keys:{} }};u.app=a;return a;}
test('Space jumps without attacking; forest-only actions and held/paused inputs are gated',()=>{
 for(const area of ['home','city','farm','interior'])for(const key of ['SPACE','M','K'])assert.equal(keyboardAction(key,area),null);
 assert.equal(keyboardAction('SPACE','forest'),'jump');assert.equal(keyboardAction('K','forest'),'attack');assert.equal(keyboardAction('M','forest'),'map');assert.equal(keyboardAction('B','home'),'bag');
 for(const key of ['SPACE','K','B','M'])for(const gate of [{paused:true},{repeat:true},{transitioning:true}])assert.equal(keyboardAction(key,'forest',gate),null);
});
test('touch jumping requires two nearby ground taps, rejects slow/far taps and consumes the pair',()=>{
 const first=touchJumpTap(null,{x:30,y:50},1000);assert.equal(first.jump,false);
 assert.deepEqual(touchJumpTap(first.tap,{x:35,y:52},1200),{jump:true,tap:null});
 assert.equal(touchJumpTap(first.tap,{x:35,y:52},1400).jump,false);assert.equal(touchJumpTap(first.tap,{x:90,y:52},1200).jump,false);
});
test('hotbar/bag/map layouts fit seven viewports with no upper or Jump buttons; maps keep world aspect',()=>{
 for(const [w,h]of sizes){const u=recorder(w,h);for(const forest of [false,true]){
  const l=hudLayout(u,forest,true);assert.ok(l.cell>=22);assert.ok(l.x>=0&&l.x+l.width<=u.w);assert.ok(l.y>u.h/2&&l.y+l.cell<=u.h);assert.equal(l.ids.includes('map'),forest);assert.ok(!l.ids.includes('jump'));
 }
 const b=bagLayout(u),m=mapLayout(u);for(const l of [b,m])assert.ok(l.x>=0&&l.y>=0&&l.x+l.w<=u.w&&l.y+l.h<=u.h,`${w}x${h}`);
 assert.ok(b.cell>=22);assert.equal(m.mw/m.mh,FOREST_SIZE.width/FOREST_SIZE.height);
 }
 assert.deepEqual([displayClock(0),displayClock(360),displayClock(720),displayClock(1439.995)],['12:00 am','6:00 am','12:00 pm','11:59 pm']);assert.deepEqual(facingIndex,{right:0,down:2,left:4,up:6});
});
test('bag actions select seeds without stock mutations and eat through existing guarded food rules',()=>{
 const s=newState(),a=appFor(s),b=new BagPanel(a);a.bagPanel=b;b.open('seeds');b.index=1;const before={...s.inventory};b.perform();assert.equal(s.selectedCrop,'strawberry');assert.deepEqual(s.inventory,before);assert.equal(a.ui.closed,true);
 a.ui.time.now+=1000;s.energy=80;s.inventory.wildBerry=2;b.open('food');b.perform();assert.equal(s.energy,92);assert.equal(s.inventory.wildBerry,1);b.perform();assert.equal(s.energy,92,'rapid duplicate is gated');
 a.ui.time.now+=1000;s.energy=100;b.perform();assert.equal(s.inventory.wildBerry,1);s.ownsClub=true;b.open('gear');b.index=bagItems(s,'gear').findIndex(i=>i.id==='club');a.ui.time.now+=1000;b.perform();assert.equal(s.clubEquipped,true);
 assert.equal(bagItems(s,'produce').length,13);assert.equal(bagItems(s,'food').length,12);
});
test('bag controls stay in bounds at each viewport and all inventory categories are available',()=>{
 for(const [w,h]of sizes){const u=recorder(w,h),a=appFor(newState(),u),b=new BagPanel(a);a.bagPanel=b;for(const tab of ['seeds','food','produce','gear']){b.open(tab);for(const c of u.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h,c.id+` ${w}x${h}`);}}
});
test('map cannot open outside Forest; parchment hides undiscovered terrain and maps the player accurately',()=>{
 for(const area of ['home','city','farm','interior']){const s=newState();s.area=area;const a=appFor(s);new WildernessMap(a).open();assert.equal(a.paused,false);assert.equal(a.ui.menu,undefined);}
 const all=FOREST_MAP.biomes.map(r=>r.id),hidden=forestMapPixels(FOREST_MAP,[],160,80),shown=forestMapPixels(FOREST_MAP,all,160,80);assert.notDeepEqual(hidden,shown);
 const colors=new Set();for(let i=0;i<hidden.length;i+=4)colors.add(hidden.slice(i,i+3).join(','));assert.equal(colors.size,2);
 assert.deepEqual(mapPoint({x:5120,y:2560},{x:10,y:20,w:200,h:100},FOREST_SIZE),{x:110,y:70});
 for(const [w,h]of sizes){const s=newState();s.area='forest';const u=recorder(w,h),a=appFor(s,u),map=new WildernessMap(a);map.open();assert.equal(a.paused,true);assert.equal(u.menu.kind,'wilderness');for(const c of u.controls)assert.ok(c.x+c.w<=u.w&&c.y+c.h<=u.h,c.id);}
});

test('actual HUD draws lower icon actions, forest-only map and touch movement without a Jump control',async()=>{
 const {Hud}=await import('../src/ui/Hud.js');
 for(const [w,h]of sizes)for(const area of ['home','city','farm','forest']){
  const s=newState();s.area=area;s.clubEquipped=true;const u=recorder(w,h),a=appFor(s,u);a.bagPanel={open(){}};a.wildernessMap={open(){}};new Hud(u);
  assert.equal(u.controls.some(c=>c.id==='wilderness-map'),area==='forest');assert.equal(u.controls.some(c=>c.id==='attack'),area==='forest');assert.equal(u.controls.find(c=>c.id==='wilderness-map')?.label,area==='forest'?'Map':undefined);const allNodes=n=>[n,...n.list.flatMap(allNodes)];assert.ok(!allNodes(u.root).some(n=>n.type==='text'&&['1','2','3'].includes(n.text)));
  for(const c of u.controls){assert.ok(c.y>u.h/2,c.id);assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h,c.id);assert.ok(!/jump/i.test(c.id));}
 }
});
test('title, farmer choice, help, confirmation and pause fit desktop/mobile with complete actions',async()=>{
 const {drawModal}=await import('../src/ui/MenuView.js');
 const pages=[['title','Simple Life','',['Play','Continue','Controls','Credits']],['choose','Your farmer','',['Play as Boy','Play as Girl','Back']],['dialog','Paused','',['Resume','Save','Controls','Return to title']],['dialog','Controls','WASD / arrows / move\nE / use   K / attack\nSpace / forest jump\n1-3 / tools   Q / crop\nB / bag   M / forest map\nEscape / pause\nTouch / double tap ground to jump',['Farming >','Close']],['dialog','A fresh start?',"Replace this browser's saved farm? Your current harvest and progress will be lost.",['Keep my farm','Start fresh']]];
 for(const [w,h]of sizes)for(const [kind,title,body,labels]of pages){const u=recorder(w,h);u.menu={kind,title,body,buttons:labels.map(s=>[s,()=>{}])};drawModal(u);assert.deepEqual(u.controls.map(c=>c.label),labels);for(const c of u.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h,title+` ${w}x${h}`);const b=u.menuBounds;assert.ok(b.y+b.h<=h,title+` ${w}x${h}`);}
});
test('themed button retains glyph/selected colour through hover, with bounded hits and disabled actions',async()=>{
 const {button,UI_COLORS}=await import('../src/ui/pixelWidgets.js');const {pixels}=await import('../src/ui/statusArt.js');const u=recorder();let calls=0;
 const c=button(u,u.root,'Bag',10,20,32,32,()=>calls++,{glyph:(g,x,y,color)=>pixels(g,'bag',x,y,color)}),hit=c.box.input.config;
 assert.equal(hit.hitAreaCallback(hit.hitArea,10,20),true);assert.equal(hit.hitAreaCallback(hit.hitArea,42,52),false);assert.equal(hit.hitAreaCallback(hit.hitArea,9,30),false);
 c.box.setFillStyle(UI_COLORS.selected);const before=structuredClone(c.box.commands);c.box.events.pointerover();c.box.events.pointerout();assert.deepEqual(c.box.commands,before);c.box.events.pointerdown({},0,0,{stopPropagation(){}});assert.equal(calls,1);
 const disabled=button(u,u.root,'Locked',10,60,32,32,()=>calls++,{disabled:true});assert.equal(disabled.box.input,undefined);assert.equal(disabled.box.events.pointerdown,undefined);
});

test('compact crop inspection remains visible beside the player and plot at 640 x 360',async()=>{
 const {Hud}=await import('../src/ui/Hud.js'),{usePlot}=await import('../src/systems/farming.js'),{FARM_PLOTS}=await import('../src/data/farms.js');const s=newState();s.area='farm';s.inventory.seed=1;usePlot(s,0);const plot=FARM_PLOTS[0];s.position={x:plot.x,y:plot.y+40};const u=recorder(640,360),a=appFor(s,u);a.scene.cameras={main:{zoom:1,worldView:{x:s.position.x-320,y:s.position.y-180,width:640,height:360}}};u.showFarmObjective=()=>{};u.showCityObjective=()=>{};const hud=new Hud(u);hud.update(s,{...plot,type:'plot',index:0,label:'Water Tomato'});const crop=hud.cropInfo.snapshot();assert.ok(crop);assert.ok(crop.x>=0&&crop.y>=128&&crop.x+crop.w<=640&&crop.y+crop.h<=300);assert.equal(crop.remaining,1);for(const t of [hud.cropInfo.timer,hud.cropInfo.condition,hud.cropInfo.am,hud.cropInfo.pm])assert.ok(t.x+t.width<=hud.cropInfo.w-4,t.text);
});

test('UI uses baked font colours that the pinned Canvas BitmapText renderer actually draws',async()=>{
 const {createRequire}=await import('node:module'),require=createRequire(import.meta.url),render=require('phaser/src/gameobjects/bitmaptext/static/BitmapTextCanvasRenderer.js'),Matrix=require('phaser/src/gameobjects/components/TransformMatrix.js'),Texture=require('phaser/src/textures/Texture.js'),parse=require('phaser/src/gameobjects/bitmaptext/ParseXMLBitmapFont.js');
 const {text,UI_COLORS}=await import('../src/ui/pixelWidgets.js'),{glyphs}=await import('./helpers/uiRecorder.js'),u=recorder();const chars=Object.fromEntries(Object.entries(glyphs).map(([c,g])=>[c.charCodeAt(0),{x:g.x,y:g.y,width:g.width,height:g.height,xOffset:g.xoffset,yOffset:g.yoffset,xAdvance:g.xadvance,kerning:{}}]));
 // Reproduce the real loader: parsing XML adds glyph frames and makes SPACE firstFrame.
 const {readFileSync}=await import('node:fs'),xmlSource=readFileSync('public/assets/pixel/font.xml','utf8'),xml={getElementsByTagName(tag){return [...xmlSource.matchAll(new RegExp('<'+tag+' ([^>]+)\\/>','g'))].map(m=>{const attrs=Object.fromEntries([...m[1].matchAll(/(\w+)="([^"]+)"/g)].map(p=>[p[1],p[2]]));return {getAttribute:key=>attrs[key]};});}};
 const loaded=Object.assign(Object.create(Texture.prototype),{key:'pixel',frames:{},firstFrame:'__BASE',frameTotal:0,source:[{image:{key:'pixel'},width:128,height:64,scaleMode:1}]});
 loaded.add('__BASE',0,0,0,128,64);const parsed=parse(xml,loaded.get('__BASE'),0,0,loaded);
 assert.equal(Object.keys(parsed.chars).length,95);assert.equal(loaded.firstFrame,' ');assert.equal(loaded.get(null).cutWidth,3);assert.equal(loaded.get('__BASE').cutWidth,128);
 u.cache.bitmapFont.get('pixel').data=parsed;const getFrame=u.textures.getFrame.bind(u.textures);u.textures.getFrame=(key,name)=>key==='pixel'?loaded.get(name):getFrame(key,name);
 for(const color of [UI_COLORS.ink,UI_COLORS.light,UI_COLORS.muted,UI_COLORS.gold,UI_COLORS.cream]){
  const node=text(u,u.root,0,0,'Map',8,color),entry=u.cache.bitmapFont.get(node.font),texture=u.textures.cache.get(entry.texture),frame=u.textures.getFrame(entry.texture),drawn=[];
  assert.deepEqual(texture.sourceRect,{x:0,y:0,w:128,h:64},'copy the whole font sheet, never SPACE');assert.equal(texture.w,128);assert.equal(texture.h,64);assert.equal(node.fontHasInk,true);assert.equal(texture.fontColor,color);assert.equal(texture.sourceImage.key,'pixel');assert.equal(texture.context.globalCompositeOperation,'source-over');assert.equal(texture.filter,1);const count=u.textures.cache.size;text(u,u.root,0,0,'Clock',8,color);assert.equal(u.textures.cache.size,count,'font colours are cached');
  const ctx={save(){},restore(){},translate(){},scale(){},setTransform(){},drawImage(image){drawn.push(image);}},camera={alpha:1,matrix:new Matrix(),scrollX:0,scrollY:0,roundPixels:true,addToRenderList(){}};
  const src={_text:'Map',fontData:{size:8,lineHeight:10,chars},_fontSize:8,_letterSpacing:0,_lineSpacing:0,_align:0,_bounds:{lines:{longest:18,lengths:[18]}},getTextBounds(){return {};},maxWidth:0,displayOriginX:0,displayOriginY:0,fromAtlas:false,texture:{frames:{__BASE:frame}},frame,x:0,y:0,rotation:0,scaleX:1,scaleY:1,scrollFactorX:1,scrollFactorY:1,blendMode:0,alpha:1,tint:0xffffff};
  render({currentContext:ctx,blendModes:['source-over']},src,camera);assert.equal(drawn.length,3);assert.ok(drawn.every(image=>image===texture&&image.fontColor===color),'Canvas must draw the coloured source, independent of tint');
 }
});

test('fractional gameplay minutes never leak decimals or overflow the 12-hour clock',()=>{
 for(const [minute,expected]of [[468.750645,'7:48 am'],[719.999,'11:59 am'],[720.01,'12:00 pm'],[1200.8,'8:00 pm'],[0.0001,'12:00 am']])assert.equal(displayClock(minute),expected);
 for(let m=0;m<1440;m+=.137)assert.match(displayClock(m),/^\d{1,2}:\d{2} [ap]m$/);
});

test('the clearly labelled Forest map opens from its actual hotbar action and shows current facing',async()=>{
 const {Hud}=await import('../src/ui/Hud.js');for(const [w,h]of sizes){const s=newState();s.area='forest';const u=recorder(w,h),a=appFor(s,u);a.wildernessMap=new WildernessMap(a);a.bagPanel=new BagPanel(a);new Hud(u);const action=u.controls.find(c=>c.id==='wilderness-map');assert.equal(action.label,'Map');action.action();assert.equal(a.paused,true);assert.equal(u.menu.kind,'wilderness');assert.ok([...u.textures.cache.values()].some(t=>t.pixels?.some((value,i)=>i%4===3&&value===255)));assert.ok(u.controls.some(c=>c.id==='wilderness-locate'));}
});
