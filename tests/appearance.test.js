import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {changeAppearance,styleQuote,styleServiceOpen} from '../src/systems/appearance.js';
import {appearanceFrame,STYLE_SERVICES,OUTFIT_IDS,HAIRCUT_IDS,ACCESSORY_IDS,freshAppearance,PEOPLE,GIRL_FARMER,BOY_FARMER,playerVisual} from '../src/data/appearance.js';
import {residentContext,residentsFor} from '../src/systems/residents.js';
import {AppearancePanel} from '../src/ui/AppearancePanel.js';
import {recorder} from './helpers/uiRecorder.js';
import {MM_APPEARANCE} from '../src/i18n/myanmarAppearance.js';
const visit=(s,category)=>Object.assign(s,{area:STYLE_SERVICES[category].area,minute:600,position:{...STYLE_SERVICES[category]}});
test('both starter looks use directional farmer rigs and survive old saves and wardrobe changes',()=>{
 for(const character of ['boy','girl']){
  const s=newState(character),visual=playerVisual(s.appearance,character);
  assert.equal(visual.texture,character);assert.equal(visual.rig,character==='boy'?BOY_FARMER:GIRL_FARMER);
  assert.equal(playerVisual(null,character).texture,character);
  s.money=311;s.inventory.tomato=8;const loaded=validate(JSON.parse(JSON.stringify(s)));
  assert.deepEqual(playerVisual(loaded.appearance,loaded.character),visual);assert.equal(loaded.money,311);assert.equal(loaded.inventory.tomato,8);
  visit(loaded,'clothes');changeAppearance(loaded,'clothes','copper');assert.equal(playerVisual(loaded.appearance,character).rig,visual.rig);assert.equal(playerVisual(loaded.appearance,character).texture,character);
  changeAppearance(loaded,'clothes',s.appearance.outfit);assert.deepEqual(playerVisual(loaded.appearance,character),visual);assert.equal(loaded.money,221);
 }
});
test('outfit purchase is atomic; owned clothes equip free outside town',()=>{
 const s=newState();s.money=89;visit(s,'clothes');const before=structuredClone(s);assert.equal(styleQuote(s,'clothes','copper').ok,false);changeAppearance(s,'clothes','copper');assert.deepEqual(s,before);
 s.money=90;changeAppearance(s,'clothes','copper');assert.equal(s.money,0);assert.equal(s.appearance.outfit,'copper');assert.equal(s.appearance.owned.filter(x=>x==='copper').length,1);
 changeAppearance(s,'clothes','copper');assert.equal(s.money,0);s.area='home';changeAppearance(s,'clothes','worker');changeAppearance(s,'clothes','copper');assert.equal(s.appearance.outfit,'copper');assert.equal(s.money,0);
});
test('haircuts charge once per actual change and reject closed/distant/wrong-area purchases',()=>{
 const s=newState();s.money=200;visit(s,'hair');changeAppearance(s,'hair','golden');assert.equal(s.money,140);changeAppearance(s,'hair','golden');assert.equal(s.money,140);changeAppearance(s,'hair','midnight');assert.equal(s.money,110);
 for(const patch of [{minute:419},{minute:1140},{area:'farm'},{position:{x:1500,y:1500}}]){visit(s,'hair');Object.assign(s,patch);const old=structuredClone(s);changeAppearance(s,'hair','chestnut');assert.deepEqual(s,old);}
 visit(s,'hair');for(const [kind,id]of [['invalid','golden'],['hair','__proto__'],['clothes','constructor']]){const old=structuredClone(s);changeAppearance(s,kind,id);assert.deepEqual(s,old);}
});
test('legacy saves acquire defaults; wardrobe normalization keeps coins/farm progress and legal owned styles',()=>{
 const old=newState('girl');old.version=18;delete old.appearance;old.money=311;old.inventory.tomato=8;
 const s=validate(old);assert.equal(s.money,311);assert.equal(s.inventory.tomato,8);assert.deepEqual(s.appearance,freshAppearance('girl'));
 s.appearance={outfit:'forest',hair:'golden',owned:['worker','forest','forest','constructor']};const reload=validate(s);assert.deepEqual(reload.appearance,{...freshAppearance('girl'),outfit:'forest',hair:'golden',owned:['worker','gardener','forest']});assert.deepEqual(validate(reload),reload);
 s.appearance={outfit:'plum',hair:'missing',owned:[]};assert.equal(validate(s).appearance.outfit,'gardener');assert.equal(validate(s).appearance.hair,'chestnut');
});
test('town stylists expose native contextual shops and keep existing curfew',()=>{
 const s=newState();visit(s,'clothes');const people=residentsFor(s.area,s);assert.equal(residentContext(people,s.position).category,'clothes');visit(s,'hair');assert.equal(residentContext(residentsFor(s.area,s),s.position).category,'hair');s.minute=1139;assert.equal(styleServiceOpen(s,'hair'),false);s.minute=1140;assert.equal(residentContext(residentsFor(s.area,s),s.position),null);
});
test('every outfit/hair combination maps to a complete source-backed animation rig',()=>{
 const png=readFileSync('public/assets/pixel/processed/appearance.png');assert.equal(png.readUInt32BE(16),960);assert.equal(png.readUInt32BE(20),960);
 const frames=JSON.parse(readFileSync('public/assets/pixel/processed/town.json')).frames;
 const indexes=new Set();for(const outfit of OUTFIT_IDS)for(const hair of HAIRCUT_IDS){const start=appearanceFrame({outfit,hair});assert.ok(start>=0&&start+PEOPLE.frames<=960);indexes.add(start);}assert.equal(indexes.size,20);
 for(let i=0;i<8;i++)for(const dir of ['down','up','left','right'])for(let f=0;f<=PEOPLE.walkFrames;f++){const r=frames[`town-person-${i}-${dir}-${f}`].frame;assert.equal(r.w,PEOPLE.width);assert.equal(r.h,PEOPLE.height);}
});
test('appearance previews and actions fit desktop and phone canvas panels',()=>{
 for(const [w,h]of [[1440,900],[1280,720],[1024,768],[844,390],[844,300],[667,280],[568,256],[390,844],[640,360],[360,640]]){
  const u=recorder(w,h),s=newState();s.money=200;visit(s,'clothes');const app={ui:u,state:s,input:{},paused:false,sound(){},transact(fn){fn(s);},scene:{build(){}}};u.app=app;const page=new AppearancePanel(app);
  for(const category of ['clothes','hair','accessories'])for(let i=0;i<(category==='clothes'?OUTFIT_IDS.length:category==='hair'?HAIRCUT_IDS.length:ACCESSORY_IDS.length);i++){page.open(category,i);const b=u.menuBounds;for(const c of u.controls){assert.ok(c.x*2>=b.x&&c.y*2>=b.y);assert.ok((c.x+c.w)*2<=b.x+b.w&&(c.y+c.h)*2<=b.y+b.h);for(const d of u.controls.filter(d=>d!==c)){const overlap=Math.min(c.x+c.w,d.x+d.w)-Math.max(c.x,d.x)>0&&Math.min(c.y+c.h,d.y+d.h)-Math.max(c.y,d.y)>0;assert.equal(overlap,false,`${w} ${h}: ${c.id}/${d.id}`);}}}
 }
 for(const key of ['Wardrobe','Extras','Turn','Remove','Buy & wear','Change colour','Straw hat','Canvas backpack','Worker outfit'])assert.ok(MM_APPEARANCE[key]);
});

test('every paid and free style keeps the chosen farmer body, face rig and animation clips',()=>{
 for(const character of ['boy','girl'])for(const outfit of OUTFIT_IDS)for(const hair of HAIRCUT_IDS){
  const v=playerVisual({outfit,hair},character);assert.equal(v.texture,character);assert.equal(v.offset,0);assert.equal(v.rig,character==='boy'?BOY_FARMER:GIRL_FARMER);
 }
});
test('retained accessories buy once, stack, unequip free and retire saved glasses',()=>{
 const s=newState('girl');s.money=200;visit(s,'clothes');
 assert.deepEqual(ACCESSORY_IDS,['straw','canvas']);assert.equal(styleQuote(s,'accessories','round').ok,false);
 for(const id of ACCESSORY_IDS)assert.equal(styleQuote(s,'accessories',id).ok,true);
 for(const id of ACCESSORY_IDS)changeAppearance(s,'accessories',id);
 assert.equal(s.money,70);assert.deepEqual(s.appearance.accessories,{hat:'straw',glasses:null,bag:'canvas'});
 s.area='home';const loaded=validate(JSON.parse(JSON.stringify(s)));assert.deepEqual(loaded.appearance,s.appearance);
 for(const id of ACCESSORY_IDS){changeAppearance(loaded,'accessories',id);changeAppearance(loaded,'accessories',id);}
 assert.equal(loaded.money,70);assert.deepEqual(loaded.appearance.accessories,s.appearance.accessories);assert.equal(loaded.character,'girl');
 const raw={...s,appearance:{...s.appearance,ownedAccessories:['straw','round','constructor'],accessories:{hat:'round',glasses:'round',bag:'canvas'}}};
 const safe=validate(raw);assert.deepEqual(safe.appearance.ownedAccessories,['straw']);assert.deepEqual(safe.appearance.accessories,{hat:null,glasses:null,bag:null});assert.equal(safe.money,70);
});
test('accessory purchases reject unavailable services, insufficient coins and forged IDs atomically',()=>{
 const s=newState();s.money=100;const before=structuredClone(s);changeAppearance(s,'accessories','straw');assert.deepEqual(s,before);
 visit(s,'clothes');s.money=54;const poor=structuredClone(s);changeAppearance(s,'accessories','straw');assert.deepEqual(s,poor);
 s.money=55;changeAppearance(s,'accessories','straw');assert.equal(s.money,0);assert.equal(s.appearance.accessories.hat,'straw');
 for(const id of ['constructor','__proto__','invalid']){const old=structuredClone(s);changeAppearance(s,'accessories',id);assert.deepEqual(s,old);}
 s.minute=1200;changeAppearance(s,'accessories','straw');assert.equal(s.appearance.accessories.hat,null);assert.equal(s.money,0);
});

test('Sol shows only hair; Nell shows clothes and extras; merchant scope survives navigation and purchases',()=>{
 for(const [w,h]of [[1280,720],[390,844],[640,360]]){
  const u=recorder(w,h),s=newState();s.money=500;visit(s,'hair');s.appearance.ownedAccessories=['straw'];s.appearance.accessories.hat='straw';
  const app={ui:u,state:s,input:{},paused:false,sound(){},transact(fn){fn(s);},scene:{build(){}}};u.app=app;const page=new AppearancePanel(app);
  page.openShop('hair');assert.deepEqual(u.controls.filter(c=>c.id.startsWith('style-tab-')).map(c=>c.id),['style-tab-hair']);
  u.controls.find(c=>c.id==='style-next').action();assert.equal(page.scope,'hair');assert.equal(page.category,'hair');page.apply('copper');assert.equal(page.scope,'hair');assert.equal(s.appearance.accessories.hat,'straw','preview does not unequip the actual hat');
  visit(s,'clothes');page.openShop('clothes');assert.deepEqual(u.controls.filter(c=>c.id.startsWith('style-tab-')).map(c=>c.id),['style-tab-clothes','style-tab-accessories']);
  u.controls.find(c=>c.id==='style-tab-accessories').action();assert.equal(page.scope,'clothes');assert.ok(!u.controls.some(c=>c.id==='style-tab-hair'));
  page.open('hair',0,'clothes');assert.equal(page.category,'clothes','cross-category requests cannot escape the merchant');
  page.open();assert.equal(page.scope,'wardrobe');assert.equal(u.controls.filter(c=>c.id.startsWith('style-tab-')).length,3);
 }
});
