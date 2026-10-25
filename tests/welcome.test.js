import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {drawWelcome,welcomeLayout,welcomeMotion,welcomeWaterBounds,WELCOME_TITLE_STYLE} from '../src/ui/WelcomeView.js';
import {LanguageService,LANGUAGE_KEY} from '../src/i18n/language.js';
import {recorder} from './helpers/uiRecorder.js';
const sizes=[[2072,1546],[1440,900],[1280,720],[1024,768],[844,390],[390,844],[640,360],[360,640],[667,280],[568,256]];
const menu=()=>({kind:'title',body:'',buttons:[['Play',()=>{}],['Continue',()=>{},true],['Controls',()=>{}],['Credits',()=>{}]]});
function welcome(width=1280,height=720,language='en'){
 const u=recorder(width,height),values=new Map([['simple-life.save.v1','existing farm bytes'],[LANGUAGE_KEY,language]]);
 u.app={language:new LanguageService({getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)}),sound(){},myanmarFontReady:true};u.menu=menu();u.title=()=>{u.titleView.destroy();u.root=u.add.container();u.controls=[];drawWelcome(u);};drawWelcome(u);return {u,values};
}
test('welcome actions and inline languages fit ten viewports with separated fixed touch targets',()=>{
 for(const [width,height]of sizes)for(const lang of ['en','mm']){
  const {u}=welcome(width,height,lang);assert.deepEqual(u.controls.map(c=>c.id),['Play','Continue','Controls','Credits','welcome-language-en','welcome-language-mm']);
  for(const c of u.controls){assert.ok(c.w>=22&&c.h>=22);assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h,JSON.stringify({width,height,c:c.id}));}
  for(let i=0;i<u.controls.length;i++)for(let j=i+1;j<u.controls.length;j++){const a=u.controls[i],b=u.controls[j];assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,'overlap '+a.id+' '+b.id);}
  assert.equal(u.titleView.snapshot().characters,0);assert.ok(!u.root.list.some(n=>n.texture==='boy'||n.texture==='girl'));
 }
});
test('title alone has a complete dark pixel outline and deeper shadow',()=>{
 const {u}=welcome(),layers=u.root.list.filter(n=>n.sourceText==='SIMPLE\nLIFE'),subtitle=u.root.list.filter(n=>n.sourceText==='A TROPICAL FARMING ADVENTURE');
 assert.equal(layers.length,10);assert.equal(layers.filter(n=>n.fontColor===WELCOME_TITLE_STYLE.face).length,1);assert.equal(layers.filter(n=>n.fontColor===WELCOME_TITLE_STYLE.outline).length,8);assert.equal(layers.filter(n=>n.fontColor===WELCOME_TITLE_STYLE.shadow).length,1);assert.equal(subtitle.length,1);
 const face=layers.find(n=>n.fontColor===WELCOME_TITLE_STYLE.face),outline=layers.filter(n=>n.fontColor===WELCOME_TITLE_STYLE.outline);assert.deepEqual(new Set(outline.map(n=>`${n.x-face.x},${n.y-face.y}`)),new Set(['-1,-1','0,-1','1,-1','-1,0','1,0','-1,1','0,1','1,1']));
});
test('inline language changes stay on the welcome screen, persist, and leave saved gameplay byte-exact',()=>{
 const {u,values}=welcome();const before=values.get('simple-life.save.v1');
 u.controls.find(c=>c.id==='welcome-language-mm').action();assert.equal(u.menu.kind,'title');assert.equal(u.app.language.current,'mm');assert.equal(values.get(LANGUAGE_KEY),'mm');assert.equal(values.get('simple-life.save.v1'),before);
 u.controls.find(c=>c.id==='welcome-language-en').action();assert.equal(u.app.language.current,'en');assert.equal(values.get('simple-life.save.v1'),before);
 u.app.myanmarFontReady=false;u.title();const mm=u.controls.find(c=>c.id==='welcome-language-mm');assert.equal(mm.disabled,true);mm.action();assert.equal(u.app.language.current,'en');
});
test('shoreline wavelets and air animation advance without shifting buttons or generating textures',()=>{
 const {u}=welcome(),v=u.titleView,initial=v.snapshot(),targets=u.controls.map(c=>[c.x,c.y,c.w,c.h]),count=u.textures.cache.size;
 assert.equal(initial.composition,'front-facing-river');assert.equal(initial.backdrop,'welcomeMysticalRiver');assert.equal(initial.waterStyle,'shoreline-wavelets');assert.ok(u.root.list.some(n=>n.type==='image'&&n.texture==='welcomeMysticalRiver'));
 for(let i=0;i<90;i++)v.update(i*16,16);assert.ok(v.snapshot().waterFrame>initial.waterFrame);assert.equal(v.snapshot().birds,3);assert.equal(u.textures.cache.size,count);assert.deepEqual(u.controls.map(c=>[c.x,c.y,c.w,c.h]),targets);assert.ok(v.buttons.every(c=>c.box.alpha===1));
 const waterBefore=structuredClone(v.water.commands),airBefore=structuredClone(v.air.commands);for(let i=0;i<6;i++)v.update(2000+i*50,50);assert.notDeepEqual(v.water.commands,waterBefore);assert.notDeepEqual(v.air.commands,airBefore);assert.equal(v.snapshot().characters,0);
});
test('welcome water motion stays inside the conservative source-space river channel',()=>{
 for(let y=708;y<=941;y+=7){const [left,right]=welcomeWaterBounds(y);assert.ok(left>=0&&right<=1672&&right-left>=400);}
 for(const [width,height]of sizes){const {u}=welcome(width,height),v=u.titleView,scale=Math.max(u.w/1672,u.h/941),left=(u.w-1672*scale)/2,top=(u.h-941*scale)/2;v.update(1000,50);
  for(const c of v.water.commands){const sy=(c.y-top)/scale,[shoreLeft,shoreRight]=welcomeWaterBounds(sy),sx=(c.x-left)/scale,sw=c.w/scale;assert.ok(sy>=708&&sy<=941);assert.ok(sx>=shoreLeft-5&&sx+sw<=shoreRight+5,JSON.stringify({width,height,sy,sx,sw,shoreLeft,shoreRight}));}
 }
});
test('welcome respects reduced motion and keeps all menu controls fully visible',()=>{
 const old=globalThis.matchMedia;globalThis.matchMedia=()=>({matches:true});try{const {u}=welcome(),v=u.titleView,before=v.snapshot();v.update(10000,50);assert.equal(v.snapshot().waterFrame,before.waterFrame);assert.deepEqual(v.snapshot().canopies,before.canopies);assert.ok(v.buttons.every(c=>c.box.alpha===1));}finally{globalThis.matchMedia=old;}
});
test('animation time is bounded after a suspended tab and startup skips the standalone language modal',()=>{
 const {u}=welcome();u.titleView.update(100000,100000);assert.equal(u.titleView.elapsed,.05);for(let i=0;i<8;i++){u.title();assert.equal(u.titleView.crowns.length,0);assert.equal([...u.textures.cache.keys()].filter(k=>k.startsWith('welcome-')).length,0);}
 const source=readFileSync('src/main.js','utf8'),ready=source.match(/ready\(\)\{([^\n]+)\}/)[1];assert.ok(ready.includes('this.ui.title()'));assert.ok(!ready.includes('languageMenu'));
 const stopped=u.titleView;stopped.destroy();const elapsed=stopped.elapsed;stopped.update(200000,50);assert.equal(stopped.elapsed,elapsed);
 assert.notDeepEqual(welcomeMotion(0,1),welcomeMotion(2,1));assert.equal(welcomeLayout(320,180).columns,2);
});
