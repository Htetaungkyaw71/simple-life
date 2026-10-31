import test from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {SILAS_STORY} from '../src/data/connections.js';
import {FESTIVAL_SITE} from '../src/data/lastLantern.js';
import {FOREST_PORTAL} from '../src/data/forestLandmarks.js';
import {personalStoryDialogue,applyPersonalOutcome} from '../src/systems/personalStories.js';
import {applyNarrativeOutcome} from '../src/systems/narrative.js';
import {beginLanternNight,canBeginLanternNight,finaleDialogue,lanternNightContext,mainStoryObjective,recordForestLandmarkVisit,syncLastLantern} from '../src/systems/lastLantern.js';
import {lifePathRank,recordLifePath} from '../src/systems/lifePaths.js';
import {resolveResidentSchedule} from '../src/systems/residentSchedules.js';
import {StoryPanel} from '../src/ui/StoryPanel.js';
import {recorder} from './helpers/uiRecorder.js';

function connectedState(){
 const state=newState();state.story.intro='seen';state.story.conversations=['clue:teo-lantern','clue:silas-lamp'];
 for(const record of Object.values(state.connections)){record.met=true;record.points=20;record.level=4;}
 state.connections['city-silas'].completedConversationIds.push(SILAS_STORY.events.clue);
 state.area='city';state.minute=720;syncLastLantern(state);return state;
}
function finishPersonalStories(state){
 assert.equal(personalStoryDialogue(state,'clara').branch,'clara-seed-1');
 applyPersonalOutcome(state,'clara',{event:'clara-seed-1',remember:{key:'seedMeaning',value:'trust'}});
 state.day=2;assert.equal(personalStoryDialogue(state,'clara').branch,'clara-seed-2');applyPersonalOutcome(state,'clara',{event:'clara-seed-2',support:'flowers'});
 assert.equal(personalStoryDialogue(state,'niko').branch,'niko-table-1');applyPersonalOutcome(state,'niko',{event:'niko-table-1'});
 state.day=3;assert.equal(personalStoryDialogue(state,'niko').branch,'niko-table-2');applyPersonalOutcome(state,'niko',{event:'niko-table-2',remember:{key:'reconciliation',value:'table'},support:'food'});
 state.area='clothing';assert.equal(personalStoryDialogue(state,'city-nell').branch,'nell-cloth-1');applyPersonalOutcome(state,'city-nell',{event:'nell-cloth-1',remember:{key:'creativeCourage',value:'work-speaks'}});
 state.day=4;assert.equal(personalStoryDialogue(state,'city-nell').branch,'nell-cloth-2');applyPersonalOutcome(state,'city-nell',{event:'nell-cloth-2',remember:{key:'bannerMeaning',value:'change'},support:'banner'});
 state.area='city';state.minute=780;assert.equal(personalStoryDialogue(state,'city-walter').branch,'walter-truth-1');applyPersonalOutcome(state,'city-walter',{event:'walter-truth-1'});
 state.area='forest';state.position={x:FOREST_PORTAL.x,y:FOREST_PORTAL.y};assert.equal(recordForestLandmarkVisit(state),true);
 state.day=5;state.area='city';state.minute=780;state.position={x:960,y:648};assert.equal(personalStoryDialogue(state,'city-walter').branch,'walter-truth-2');applyPersonalOutcome(state,'city-walter',{event:'walter-truth-2',remember:{key:'truthResponse',value:'private'},support:'truth'});
 state.minute=1100;state.position={...SILAS_STORY.eastLamp};assert.equal(personalStoryDialogue(state,'city-silas').branch,'silas-festival-support');applyPersonalOutcome(state,'city-silas',{support:'lantern'});
}

test('four central personal arcs remember choices, never replay, and unlock Lantern Night without maximum Connection',()=>{
 const state=connectedState();finishPersonalStories(state);
 assert.equal(personalStoryDialogue(state,'clara'),null);assert.equal(personalStoryDialogue(state,'niko'),null);assert.equal(personalStoryDialogue(state,'city-nell'),null);assert.equal(personalStoryDialogue(state,'city-walter'),null);
 assert.equal(state.narrative.personal.clara.choices.seedMeaning,'trust');assert.equal(state.narrative.personal.niko.choices.reconciliation,'table');assert.equal(state.narrative.personal.nell.choices.bannerMeaning,'change');assert.equal(state.narrative.personal.walter.choices.truthResponse,'private');
 state.day=8;state.minute=735;assert.equal(resolveResidentSchedule(state,'niko').activity.meeting,'bruno-niko-reconciled');assert.equal(resolveResidentSchedule(state,'city-bruno').activity.meeting,'bruno-niko-reconciled');
 assert.equal(canBeginLanternNight(state),true);assert.equal(state.narrative.main.completed.includes('preparations'),true);
 const loaded=validate(structuredClone(state));assert.equal(loaded.narrative.personal.nell.choices.bannerMeaning,'change');assert.equal(canBeginLanternNight(loaded),true);
});

test('Lantern Night records one ending, preserves variation statistics, and leaves normal play available',()=>{
 const state=connectedState();finishPersonalStories(state);state.position={x:FESTIVAL_SITE.x,y:FESTIVAL_SITE.y};
 assert.equal(lanternNightContext(state).type,'lanternNight');assert.equal(beginLanternNight(state),true);
 const dialogue=finaleDialogue(state),ending=dialogue.nodes.meaning.choices.find(row=>row.narrative.finalChoice==='welcome');
 assert.equal(applyNarrativeOutcome(state,'player',ending.narrative).completed,true);assert.equal(state.narrative.finale.choice,'welcome');assert.match(state.narrative.finale.completion.meaning,/welcomes anyone/);assert.equal(state.narrative.finale.completion.personalEvents,8);
 assert.equal(mainStoryObjective(state).step,'The Last Lantern is complete');
 assert.equal(lanternNightContext(state),null);assert.equal(beginLanternNight(state),false);assert.equal(applyNarrativeOutcome(state,'player',ending.narrative).completed,false);
 state.inventory.tomato=7;state.money=432;const loaded=validate(structuredClone(state));assert.equal(loaded.narrative.finale.status,'complete');assert.equal(loaded.narrative.finale.choice,'welcome');assert.equal(loaded.inventory.tomato,7);assert.equal(loaded.money,432);assert.equal(loaded.area,'city');
});

test('schema 20 migration keeps the established world and credits practical Life Path evidence',()=>{
 const raw=connectedState();raw.version=20;delete raw.narrative;raw.money=987;raw.inventory.tomato=4;raw.hasSoldProduce=true;raw.story.stats.harvests=3;raw.plots[0]={crop:'tomato',growth:2,wateredDay:1,missedDays:0,lastEvaluatedDay:0,plantedDay:1,plantedMinute:400};
 const state=validate(raw);assert.equal(state.version,21);assert.equal(state.money,987);assert.equal(state.inventory.tomato,4);assert.equal(state.plots[0].crop,'tomato');assert.ok(state.narrative.main.completed.includes('opening'));assert.ok(state.narrative.main.completed.includes('silas'));assert.ok(lifePathRank(state,'grower').score>0);assert.ok(lifePathRank(state,'neighbour').score>0);
 assert.deepEqual(validate(structuredClone(state)),state);
});

test('Life Path actions cap repeated evidence and five indicators fit the existing Journal sizes',()=>{
 const state=connectedState();for(let i=0;i<40;i++)recordLifePath(state,'explorer','forage');recordLifePath(state,'explorer','landmark','waterfall');recordLifePath(state,'explorer','landmark','waterfall');recordLifePath(state,'explorer','habitat','riverlands');assert.equal(state.narrative.paths.explorer.actions.landmark.keys.length,1);assert.equal(lifePathRank(state,'explorer').rank,3);
 for(const [w,h] of [[1280,720],[844,390],[390,844],[360,640]]){
  const ui=recorder(w,h),app={state,ui,paused:false,input:{},save(){},sound(){},pauseMenu(){},scene:{}};ui.app=app;ui.layout=()=>{ui.root=ui.add.container();ui.controls=[];ui.menu.draw();};const panel=new StoryPanel(app);panel.lifePaths(1);
  assert.equal(ui.root.list.filter(node=>node.type==='graphics').length>=1,true);for(const control of ui.controls)assert.ok(control.x>=0&&control.y>=0&&control.x+control.w<=w/2&&control.y+control.h<=h/2,`${w}x${h} ${control.id}`);
 }
});
