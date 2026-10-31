import {STORY_FLAGS,CHAPTERS,STORY_GUARD,STORY_CACHE,STORY_PROJECT} from '../data/story.js';
import {CONVERSATION_FLAGS} from '../data/dialogues.js';
import {allPlots} from './plots.js';
export const freshTutorial=()=>({started:false,moved:false,invited:false,complete:false});
export const freshStory=()=>({intro:'pending',tutorial:freshTutorial(),flags:[],conversations:[],keepsake:'hidden',completed:false,endingSeen:false,cuePlayed:false,activeSeconds:0,stats:{harvests:0,sales:0,boars:0,deaths:0},completion:null});
export function recordStory(s,event){
 if(!s.story)return false;const q=s.story;if(!STORY_FLAGS.includes(event)||q.flags.includes(event))return false;
 q.flags=STORY_FLAGS.filter(id=>q.flags.includes(id)||id===event);return true;
}
export function storyObjective(s){const q=s.story||freshStory();const chapter=CHAPTERS.findIndex(c=>c.steps.some(([id])=>!q.flags.includes(id)));const index=chapter<0?4:chapter,c=CHAPTERS[index],step=c.steps.find(([id])=>!q.flags.includes(id))||c.steps.at(-1);return {chapter:index,title:c.title,step:step[1],hint:step[2],done:c.steps.filter(([id])=>q.flags.includes(id)).length,total:c.steps.length};}
export function syncStory(s){
 if(!s.story)return;const q=s.story;
 if(s.hasVisitedCity||s.area==='city')recordStory(s,'city');if(s.area==='forest')recordStory(s,'forest');
 if(s.settlement.projects.includes(STORY_PROJECT)){recordStory(s,'help');recordStory(s,'board');}
 if(q.keepsake!=='hidden'){recordStory(s,'keepsake');if(['home','interior'].includes(s.area))recordStory(s,'home');}
}
export function restoreStory(raw,s){
 const q=freshStory(),old=raw.version>=17&&raw.story&&typeof raw.story==='object'?raw.story:null;
 const bounded=(v,max)=>Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):0;
 if(old&&(old.flags?.includes('help')||s.settlement.projects.includes(STORY_PROJECT)))recordStory({story:q},'board');
 if(old){q.intro=['seen','skipped'].includes(old.intro)?old.intro:'pending';q.flags=STORY_FLAGS.filter(id=>q.flags.includes(id)||Array.isArray(old.flags)&&old.flags.includes(id));q.conversations=CONVERSATION_FLAGS.filter(id=>Array.isArray(old.conversations)&&old.conversations.includes(id));q.keepsake=['carried','placed'].includes(old.keepsake)?old.keepsake:'hidden';q.activeSeconds=Number.isFinite(old.activeSeconds)?Math.max(0,Math.min(9999999,old.activeSeconds)):0;for(const id of Object.keys(q.stats))q.stats[id]=bounded(old.stats?.[id],999999);
  if(old.tutorial&&typeof old.tutorial==='object'){q.tutorial.started=old.tutorial.started===true;q.tutorial.moved=old.tutorial.moved===true;q.tutorial.invited=old.tutorial.invited===true;q.tutorial.complete=old.tutorial.complete===true;}else if(q.intro!=='pending')q.tutorial={started:true,moved:true,invited:true,complete:true};
  if(q.intro==='skipped'||q.intro==='seen'&&!q.tutorial.started)q.tutorial={started:true,moved:true,invited:true,complete:true};
  const all=q.keepsake==='placed'&&STORY_FLAGS.every(id=>q.flags.includes(id));q.completed=old.completed===true&&all;q.endingSeen=q.completed&&old.endingSeen===true;q.cuePlayed=q.completed&&old.cuePlayed===true;
  if(q.completed)q.completion={day:Math.max(1,bounded(old.completion?.day,s.day)),seconds:bounded(old.completion?.seconds,q.activeSeconds),...Object.fromEntries(Object.keys(q.stats).map(id=>[id,bounded(old.completion?.[id],999999)]))};
  if(!q.completed){q.flags=q.flags.filter(id=>!['placed','complete'].includes(id));if(q.keepsake==='placed')q.keepsake='carried';}
  if(q.keepsake==='hidden')q.flags=q.flags.filter(id=>!['keepsake','home'].includes(id));
 }else{
  q.intro='seen';if(s.starterSeedsClaimed)q.flags.push('starter');if(s.hasHarvestedFirstCrop)q.flags.push('plant','water','harvest');if(s.hasSoldProduce)q.flags.push('sell');if(s.inventory.wood>0)q.flags.push('wood');if(s.inventory.stone>0)q.flags.push('stone');
  if(allPlots(s).some(p=>p.crop))q.flags.push('plant');if(allPlots(s).some(p=>p.crop&&(p.wateredDay>0||p.growth>0)))q.flags.push('water');
  if(Object.values(s.vegetation||{}).some(v=>v.trees?.length))q.flags.push('wood');
  if(s.forest.collected.length)q.flags.push('fruit');if(s.area==='forest'||s.forest.explored.length>1)q.flags.push('forest');if(Object.values(s.forest.animals).some(a=>a.species==='boar'&&a.health===0))q.flags.push('boar');
  if(s.settlement.projects.includes(STORY_PROJECT))q.flags.push('wood','stone','board');
  q.tutorial={started:true,moved:true,invited:true,complete:true};
 }
 s.story=q;syncStory(s);q.flags=STORY_FLAGS.filter(id=>q.flags.includes(id));return q;
}
export function canCollectKeepsake(s){return s.area==='forest'&&s.story?.keepsake==='hidden'&&s.forest.animals[STORY_GUARD]?.health===0;}
export function awardKeepsake(s,id){if(id!==STORY_CACHE||!canCollectKeepsake(s))return false;s.story.keepsake='carried';recordStory(s,'keepsake');return true;}
export function keepsakeAvailable(s,id){return id===STORY_CACHE&&s.story?.keepsake==='hidden';}
export function tutorialStage(s){
 const q=s?.story,t=q?.tutorial;if(!q||!t||t.complete)return null;
 if(q.intro==='pending')return 'opening';if(!t.moved)return 'move';if(!s.starterSeedsClaimed)return 'seeds';
 if(!s.hasVisitedFarm&&s.area!=='farm')return 'farm';if(!q.flags.includes('plant'))return 'plant';if(!q.flags.includes('water'))return 'water';return 'invite';
}
export function tutorialPrompt(s,touch=false){
 const stage=tutorialStage(s),use=touch?'Star Use':'E or click';
 if(stage==='move')return touch?'Move / drag the circle':'Move / WASD or arrows';
 if(stage==='seeds')return use+' / claim 3 Tomato seeds';
 if(stage==='farm')return touch?'Move / follow FARM south':'WASD / follow FARM south';
 if(stage==='plant')return s.selected==='seed'?use+' / plant one Tomato':touch?'Tap Tomato seeds':'1 or click / Tomato seeds';
 if(stage==='water')return s.selected==='water'?use+' / water the Tomato':touch?'Tap Water':'2 or click / Water';
 return '';
}
export function recordTutorialMovement(s){const t=s?.story?.tutorial;if(tutorialStage(s)!=='move')return false;t.moved=true;return true;}
export function finishIntroduction(s,skipped=false){if(!s.story)return;s.story.intro=skipped?'skipped':'seen';s.story.tutorial.started=true;if(skipped)finishTutorial(s,true);}
export function finishTutorial(s,skipped=false){
 const q=s?.story;if(!q)return;q.intro=skipped?'skipped':q.intro==='pending'?'seen':q.intro;q.tutorial={started:true,moved:true,invited:true,complete:true};
}
export function completeStory(s){
 syncStory(s);const q=s.story;if(!q||q.completed||s.area!=='interior'||q.keepsake!=='carried'||!STORY_FLAGS.filter(id=>!['placed','complete'].includes(id)).every(id=>q.flags.includes(id)))return false;
 q.keepsake='placed';recordStory(s,'placed');recordStory(s,'complete');q.completed=true;q.completion={day:s.day,seconds:Math.floor(q.activeSeconds),...q.stats};return true;
}

export function storyMarker(s){const q=s.story;if(!q||q.completed||q.keepsake!=='hidden'||!CHAPTERS.slice(0,3).flatMap(c=>c.steps).every(([id])=>q.flags.includes(id)))return null;return {id:STORY_CACHE,label:'Grandfather\'s Keepsake'};}
