import test from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {OPENING_DIALOGUE,RESIDENT_DIALOGUES} from '../src/data/dialogues.js';
import {SILAS_STORY} from '../src/data/connections.js';
import {dialogueFor,recordConversationFlags,conversationObjective} from '../src/systems/conversations.js';
import {ConversationPanel} from '../src/ui/ConversationPanel.js';
import {recorder} from './helpers/uiRecorder.js';
import {translate} from '../src/i18n/language.js';

test('Teo records one durable clue and Silas resolves its objective without rewards',()=>{
 const s=newState(),money=s.money,inventory=structuredClone(s.inventory);
 let selected=dialogueFor(s,'city-teo');assert.equal(selected.branch,'first');
 assert.equal(selected.dialogue.nodes.start.text,'You’re the farmer from the old house, right? Walter says your grandfather used to light the road before Lantern Night.');
 assert.deepEqual(selected.dialogue.nodes.start.choices.map(c=>c.label),['My grandfather?','Lantern Night?']);
 recordConversationFlags(s,'met:city-teo','clue:teo-lantern');
 assert.match(conversationObjective(s).text,/Speak to Silas/);s.area='city';s.minute=SILAS_STORY.evening[0];s.position={...SILAS_STORY.eastLamp};
 selected=dialogueFor(s,'city-silas');assert.equal(selected.branch,'clue');recordConversationFlags(s,'met:city-silas','clue:silas-lamp');
 assert.equal(conversationObjective(s),null);assert.equal(s.money,money);assert.deepEqual(s.inventory,inventory);
 const loaded=validate(structuredClone(s));assert.ok(loaded.story.conversations.includes('clue:teo-lantern'));assert.ok(loaded.story.conversations.includes('clue:silas-lamp'));
});

test('every current resident has first and repeat data, and all conversation copy translates to Myanmar',()=>{
 assert.deepEqual(Object.keys(RESIDENT_DIALOGUES).sort(),['city-bruno','city-elena','city-luca','city-nell','city-silas','city-sol','city-teo','city-walter','clara','niko']);
 const dialogues=[OPENING_DIALOGUE,...Object.values(RESIDENT_DIALOGUES).flatMap(d=>Object.entries(d).filter(([,v])=>v?.nodes).map(([,v])=>v))];
 for(const dialogue of dialogues)for(const page of Object.values(dialogue.nodes))for(const value of [page.text,page.closeLabel,...(page.choices||[]).map(c=>c.label)].filter(Boolean))assert.match(translate(value,'mm'),/[\u1000-\u109f]/u,value);
});

test('bottom portrait conversations fit desktop, portrait and short landscape with visible world above',()=>{
 for(const [w,h]of [[1280,720],[390,844],[844,390],[640,360],[360,640]]){
  const u=recorder(w,h),s=newState(),a={state:s,ui:u,input:{},paused:false,language:{current:'en'},sound(){},save(){},scene:{keys:{}},tradePanel:{open(){}},appearancePanel:{openShop(){}},resourcePanel:{orders(){}}};u.app=a;
  const panel=new ConversationPanel(a);panel.present(OPENING_DIALOGUE);
  assert.equal(u.menu.kind,'conversation');assert.ok(u.menuBounds.y>0,'world remains visible');
  for(const c of u.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h,`${w}x${h} ${c.id}`);
  const portraits=u.root.list.filter(n=>n.type==='image');assert.equal(portraits.length,1);assert.ok(portraits.every(p=>p.crop),'the speaking upper-body portrait uses the registry crop');
 }
});
