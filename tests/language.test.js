import test from 'node:test';
import assert from 'node:assert/strict';
import {LanguageService,LANGUAGE_KEY,translate,MM} from '../src/i18n/language.js';
import {newState} from '../src/systems/state.js';
import {SaveService} from '../src/systems/save.js';
import {CHAPTERS,INTRO} from '../src/data/story.js';
import {CROPS,SALE_ITEMS} from '../src/data/crops.js';
import {START_PAGES} from '../src/ui/GettingStarted.js';
import {wrapMyanmar} from '../src/i18n/myanmarText.js';
test('language choices persist separately and never overwrite saved gameplay',()=>{const values=new Map(),storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)},save=new SaveService(storage),s=newState();save.write(s);const before=values.get('simple-life.save.v1'),l=new LanguageService(storage);assert.equal(l.current,'en');assert.ok(l.select('mm'));assert.equal(new LanguageService(storage).current,'mm');assert.equal(values.get(LANGUAGE_KEY),'mm');assert.equal(values.get('simple-life.save.v1'),before);assert.equal(l.select('my'),false);assert.ok(l.select('en'));assert.equal(values.get('simple-life.save.v1'),before);});
test('unavailable storage still permits either language in memory',()=>{const l=new LanguageService({getItem(){throw Error();},setItem(){throw Error();}});assert.ok(l.select('mm'));assert.equal(l.current,'mm');assert.equal(l.persisted,false);assert.ok(l.select('en'));});
test('core goals, all story chapters and item names have Unicode Myanmar copy',()=>{const strings=[...INTRO.flatMap(d=>[d.title,d.text]),...CHAPTERS.flatMap(c=>[c.title,...c.steps.flatMap(s=>s.slice(1))]),...Object.values(CROPS).flatMap(d=>[d.name,d.trait]),...Object.values(SALE_ITEMS).map(d=>d.name),...START_PAGES.flatMap(d=>[d.title,d.body,...d.touch?[d.touch]:[]])];for(const s of strings){const t=translate(s,'mm');assert.match(t,/[\u1000-\u109f]/u,s);assert.equal(translate(s,'en'),s);assert.ok(!/\b(Farm|Home|Journal|seeds|crop|water|Wood|Stone|Keepsake)\b/.test(t),s+' remains English');}assert.ok(Object.keys(MM).length>700);});
test('dynamic trade and crop labels preserve the actual amounts',()=>{for(const [s,t]of [['Buy 5 / 150c','ဝယ် 5 / 150c'],['Sell 20 / 420c','ရောင်း 20 / 420c'],['Day 8','နေ့ 8'],['Harvest / 3 watered days','ရိတ်ရန် / 3 ရက်'],['Bag 19','အိတ် 19'],['+12 seeds','မျိုးစေ့ +12']])assert.equal(translate(s,'mm'),t);});
test('Myanmar wrapping preserves complete Unicode text and hard newlines',()=>{const s='မျိုးစေ့ကို စိုက်ပါ။\nနေ့စဉ် ရေလောင်းပါ။',t=wrapMyanmar(s,18,l=>[...l].length);assert.equal(t.replaceAll(/\s/g,''),s.replaceAll(/\s/g,''));assert.ok(t.includes('\n'));assert.equal(wrapMyanmar(s,0,()=>1),s);});

test('standalone Seed Aid world caption translates and long Myanmar words fit',()=>{assert.equal(translate('SEED AID','mm'),'မျိုးစေ့အကူအညီ');const s='မျိုးစေ့အကူအညီ',wrapped=wrapMyanmar(s,5,line=>[...line].length);assert.equal(wrapped.replaceAll('\n',''),s);for(const line of wrapped.split('\n'))assert.ok([...line].length<=5);});
