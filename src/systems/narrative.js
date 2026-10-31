import {freshLifePaths,restoreLifePaths} from './lifePaths.js';
import {applyPersonalOutcome,freshPersonalStories,restorePersonalStories} from './personalStories.js';
import {completeLanternNight,syncLastLantern} from './lastLantern.js';
import {FINAL_MEANINGS} from '../data/lastLantern.js';
import {LIFE_PATH_ORDER} from '../data/lifePaths.js';

export const freshNarrative=()=>({personal:freshPersonalStories(),paths:freshLifePaths(),preparations:{lantern:false},main:{completed:[],landmarkVisited:false},finale:{status:'locked',choice:null,summarySeen:false,completion:null}});

export function restoreNarrative(raw,state){
 const narrative=freshNarrative(),source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 narrative.personal=restorePersonalStories(source.personal);
 narrative.preparations.lantern=source.preparations?.lantern===true;
 narrative.main.landmarkVisited=source.main?.landmarkVisited===true;
 if(source.finale?.status==='complete'&&['remember','welcome','together'].includes(source.finale.choice)){
  const saved=source.finale.completion&&typeof source.finale.completion==='object'?source.finale.completion:{},choice=source.finale.choice;
  const integer=(value,fallback=0,max=99999)=>Number.isFinite(value)?Math.max(0,Math.min(max,Math.floor(value))):fallback;
  narrative.finale={status:'complete',choice,summarySeen:source.finale.summarySeen===true,completion:{
   day:integer(saved.day,state.day),meaning:FINAL_MEANINGS[choice].summary,
   highestPath:LIFE_PATH_ORDER.includes(saved.highestPath)?saved.highestPath:'neighbour',highestRank:integer(saved.highestRank,1,5)||1,
   connections:integer(saved.connections),keptInvitations:integer(saved.keptInvitations,0,10),personalEvents:integer(saved.personalEvents,0,8),
  }};
 }
 state.narrative=narrative;narrative.paths=restoreLifePaths(source.paths,state);syncLastLantern(state);return narrative;
}
export function applyNarrativeOutcome(state,residentId,outcome={}){
 if(outcome.finalChoice){const completed=completeLanternNight(state,outcome.finalChoice);return {completed,effect:'festival-lights'};}
 return applyPersonalOutcome(state,residentId,outcome);
}
export function narrativeProgressCount(state){return (state.narrative?.main?.completed?.length||0)+Object.values(state.narrative?.personal||{}).reduce((sum,record)=>sum+(record.events?.length||0),0)+(state.narrative?.finale?.status==='complete'?1:0);}
