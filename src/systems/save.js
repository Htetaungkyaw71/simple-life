import {VEGETATION} from '../data/vegetation.js';
import {testingCredit,TESTING_COIN_GRANT} from './testingCredit.js';
import {grassGround,MAX_PLACED_GRASS} from './vegetation.js';
import {openGround,MAX_CUSTOM_BEDS,MAX_WET_PATCHES,WET_DURATION} from './farmGround.js';
import {FARM_PLOTS} from '../data/farms.js';
import {ANIMAL_SPAWNS,SPECIES} from '../data/wildlife.js';
import {FORAGE_NODES,LEGACY_FOREST_OFFSET,TREASURES,REGIONS} from '../data/forest.js';
import {inTerritory,freshAnimal,safeStash} from './forest.js';
import {SAVE_FARM_LIMIT,PLOTS_PER_FARM} from '../data/farms.js';
import {newFarm,plotOwned} from './expansion.js';
import {inferFarmVisit} from './navigation.js';
import {ROOM} from '../data/interior.js';
import { CROPS,INVENTORY_KEYS } from '../data/crops.js';
import { SAVE_KEY, TOOLS } from '../config.js';
import {FATIGUE_MINUTES} from '../data/energy.js';
import { LOCATIONS, nearestSafe, walkable } from '../data/locations.js';
import { newState, emptyPlot } from './state.js';
import {WOODLAND_WILDLIFE,WOODLAND_SPECIES} from '../data/woodlandWildlife.js';
import {forestStones} from '../data/forestResources.js';
const number = (v, fallback, min, max) => Number.isFinite(v) ? Math.max(min, Math.min(max, Math.floor(v))) : fallback;
export function validate(raw) {
  if (!raw || ![1,2,3,4,5,6,7,8,9,10,11,12,13].includes(raw.version) || !['boy','girl'].includes(raw.character)) return null;
  const s = newState(raw.character);
  if(raw.testingCoinGrant===TESTING_COIN_GRANT)s.testingCoinGrant=TESTING_COIN_GRANT;
  s.area = Object.hasOwn(LOCATIONS, raw.area) ? raw.area : 'home';
  if(raw.version===1&&raw.area==='home'&&raw.position?.x>=240&&raw.position.x<=592&&raw.position.y>=144&&raw.position.y<496)s.area='interior';
  if(raw.version>=5&&Array.isArray(raw.farms)&&raw.farms.length){
    s.farms=raw.farms.slice(0,SAVE_FARM_LIMIT).map(f=>({fields:[true,...[1,2,3].map(i=>f?.fields?.[i]===true)]}));
  }else s.farms=[newFarm()];
  s.currentFarm=number(raw.version>=5?raw.currentFarm:0,0,0,s.farms.length-1);
  if(raw.version>=11&&raw.vegetation&&typeof raw.vegetation==='object')for(const area of ['home','city','forest','farm'])for(const farm of area==='farm'?s.farms.map((_,i)=>i):[0]){
    const key=area==='farm'?'farm:'+farm:area,v=raw.vegetation[key];if(!v||typeof v!=='object')continue;
    const known=VEGETATION[area].byId,ids=(value,tree)=>[...new Set(Array.isArray(value)?value.slice(0,known.size):[])].filter(id=>typeof id==='string'&&known.has(id)&&id.startsWith('tree:')===tree);
    s.vegetation[key]={trees:ids(v.trees,true),grass:ids(v.grass,false),placed:[]};
  }
  s.plots=Array.from({length:s.farms.length*PLOTS_PER_FARM},emptyPlot);
  s.expansionUnlocked=raw.expansionUnlocked===true;
  s.starterSeedsClaimed=raw.starterSeedsClaimed===true;
  const oldRoom=raw.version<3?{width:1344,height:800}:raw.roomSize;
  const position=s.area==='interior'&&oldRoom?.width>0&&oldRoom?.height>0?{x:raw.position?.x*ROOM.width/oldRoom.width,y:raw.position?.y*ROOM.height/oldRoom.height}:raw.position;
  s.roomSize={width:ROOM.width,height:ROOM.height};
  const forestPosition=p=>raw.version<9&&p?{x:p.x,y:p.y+LEGACY_FOREST_OFFSET}:p;
  s.position = nearestSafe(s.area,s.area==='forest'?forestPosition(position):position,s);
  s.marketSeed=number(raw.marketSeed,1,0,4294967295);
  s.selectedCrop=Object.hasOwn(CROPS,raw.selectedCrop)?raw.selectedCrop:'tomato';
  s.hasVisitedCity=raw.hasVisitedCity===true||raw.area==='city';
  s.hasHarvestedFirstCrop=raw.hasHarvestedFirstCrop===true||raw.sold>0||Object.keys(CROPS).some(id=>raw.inventory?.[id]>0);
  s.hasBoughtSeeds=raw.hasBoughtSeeds===true;
  s.hasSoldProduce=raw.hasSoldProduce===true||raw.sold>0;
  s.lastRecoveryDay=number(raw.lastRecoveryDay,0,0,99999);
  for (const [key,min,max] of [['day',1,99999],['minute',0,1439],['money',0,9999999],['health',0,100],['energy',0,100],['sold',0,999999]]) s[key] = number(raw[key],s[key],min,max);
  s.fatigueMinutes=Number.isFinite(raw.fatigueMinutes)?Math.max(0,Math.min(FATIGUE_MINUTES-.000001,raw.fatigueMinutes)):0;
  s.selected = TOOLS.includes(raw.selected) ? raw.selected : 'seed';
  for (const key of INVENTORY_KEYS) s.inventory[key] = number(raw.inventory?.[key],0,0,9999);
  if(raw.version>=10){
    s.dugPlots=[...new Set(Array.isArray(raw.dugPlots)?raw.dugPlots:[])].filter(i=>Number.isInteger(i)&&i>=0&&i<s.plots.length&&openGround('farm',FARM_PLOTS[i%PLOTS_PER_FARM].x,FARM_PLOTS[i%PLOTS_PER_FARM].y,true,{...s,currentFarm:Math.floor(i/PLOTS_PER_FARM)}));
    for(const b of (Array.isArray(raw.customBeds)?raw.customBeds:[]).slice(0,MAX_CUSTOM_BEDS)){
      if(!Number.isInteger(b?.farm)||!s.farms[b.farm]||!Number.isInteger(b.x)||!Number.isInteger(b.y)||![8,24,40].includes(b.x%48)||![8,24].includes(b.y%48)||!openGround('farm',b.x,b.y,true,{...s,currentFarm:b.farm}))continue;
      if(FARM_PLOTS.some(p=>Math.abs(p.x-b.x)<48&&Math.abs(p.y-b.y)<48)||s.customBeds.some(p=>p.farm===b.farm&&Math.abs(p.x-b.x)<48&&Math.abs(p.y-b.y)<48))continue;
      s.customBeds.push({farm:b.farm,x:b.x,y:b.y,plot:b.plot});
    }
    const seen=new Set();
    for(const p of (Array.isArray(raw.wetGround)?raw.wetGround:[]).slice(-MAX_WET_PATCHES)){
      if(!p||!Number.isInteger(p.x)||!Number.isInteger(p.y)||!openGround(p.area,p.x,p.y,false,{...s,currentFarm:p.farm})||!Number.isFinite(p.remaining)||p.remaining<=0||!Number.isInteger(p.farm)||!s.farms[p.farm])continue;
      const key=p.area+':'+p.farm+':'+p.x+':'+p.y;if(seen.has(key))continue;seen.add(key);
      s.wetGround.push({area:p.area,farm:p.farm,x:p.x,y:p.y,remaining:Math.min(WET_DURATION,p.remaining)});
    }
  }
  const restorePlot=p=>{
    if(!p||!Object.hasOwn(CROPS,p.crop))return emptyPlot();
    const legacy=raw.version<13,oldMisses=number(p.missedWindows??p.dryDays,0,0,2);
    const plot={crop:p.crop,growth:number(p.growth,0,0,CROPS[p.crop].growthDays),
      wateredDay:legacy?(p.morning===true||p.evening===true?s.day:0):number(p.wateredDay,0,0,s.day),
      missedDays:legacy?(oldMisses>=2?4:p.morning===true||p.evening===true?0:oldMisses):number(p.missedDays,0,0,4),
      lastEvaluatedDay:legacy?s.day-1:number(p.lastEvaluatedDay,s.day-1,0,s.day-1)};
    if(Number.isFinite(p.plantedDay))plot.plantedDay=number(p.plantedDay,1,1,s.day);
    if(Number.isFinite(p.plantedMinute))plot.plantedMinute=number(p.plantedMinute,360,0,1439);
    if(!legacy&&Number.isFinite(p.recoveredDay))plot.recoveredDay=number(p.recoveredDay,0,0,s.day);
    return plot;
  };
  s.plots=s.plots.map((_,i)=>plotOwned(s,i)?restorePlot(raw.plots?.[i]):emptyPlot());
  s.customBeds.forEach(b=>{b.plot=restorePlot(b.plot);});
  for(const [key,v]of Object.entries(s.vegetation)){
    const [area,farm]=key.split(':'),view={...s,area,currentFarm:area==='farm'?Number(farm):0};
    for(const p of (Array.isArray(raw.vegetation[key]?.placed)?raw.vegetation[key].placed:[]).slice(0,MAX_PLACED_GRASS)){
      if(!p||!Number.isInteger(p.x)||!Number.isInteger(p.y)||p.x%8||p.y%8||!grassGround(view,p)||v.placed.some(n=>Math.hypot(n.x-p.x,n.y-p.y)<28)||VEGETATION[area].grass.some(n=>!v.grass.includes(n.id)&&Math.hypot(n.x-p.x,n.y-p.y)<28))continue;
      v.placed.push({id:`placed:${p.x}:${p.y}`,x:p.x,y:p.y,variant:Math.abs(p.x+p.y)%3});
    }
  }
  s.hasVisitedFarm=inferFarmVisit(raw,s);
  for(const key of ['forestTutorialComplete','nightWarningSeen','deathTutorialSeen','hasDied'])s[key]=raw[key]===true;
  // Return the retired item's purchase value once; schema 13 carries no club flags.
  if(raw.version<13&&raw.ownsClub===true)s.money=Math.min(9999999,s.money+45);
  s.forest.forageDay=number(raw.forest?.forageDay,s.day,1,s.day);
  s.forest.collected=FORAGE_NODES.filter(n=>raw.forest?.collected?.includes?.(n.id)).map(n=>n.id);
  if(s.forest.forageDay<s.day){s.forest.forageDay=s.day;s.forest.collected=[];}
  for(const a of ANIMAL_SPAWNS){
    const old=raw.version<9?(a.id==='boar-original'?raw.forest?.boar:null):raw.forest?.animals?.[a.id];
    if(!old)continue;
    const restored=s.forest.animals[a.id],definition=SPECIES[a.species];
    restored.health=number(old.health,definition.health,0,definition.health);
    restored.defeatedDay=number(old.defeatedDay,s.day,0,s.day);
    const p=nearestSafe('forest',raw.version<9?forestPosition(old.position):old.position,s);
    restored.position=inTerritory(p,a.territory)&&walkable('forest',p.x,p.y,definition.body,false,s)?p:{...a.home};
    if(!restored.health&&restored.defeatedDay<s.day)s.forest.animals[a.id]=freshAnimal(a);
  }
  s.forest.boar=s.forest.animals['boar-original'];
  if(raw.version>=12){
    const known=forestStones();s.forest.stones=[...new Set(Array.isArray(raw.forest?.stones)?raw.forest.stones.slice(0,known.length):[])].filter(id=>known.some(n=>n.id===id));
    if(raw.forest?.forageDay<s.day)s.forest.stones=[];
    for(const a of WOODLAND_WILDLIFE){
      const old=raw.forest?.woodland?.[a.id],restored=s.forest.woodland[a.id];if(!old)continue;
      restored.health=number(old.health,WOODLAND_SPECIES[a.species].health,0,WOODLAND_SPECIES[a.species].health);
      restored.defeatedDay=number(old.defeatedDay,s.day,0,s.day);
      if(Math.hypot(old.position?.x-a.x,old.position?.y-a.y)<=180&&walkable('forest',old.position.x,old.position.y,8,false,s))restored.position={x:old.position.x,y:old.position.y};
      if(!restored.health&&restored.defeatedDay<s.day){restored.health=WOODLAND_SPECIES[a.species].health;restored.defeatedDay=0;}
    }
  }
  s.forest.explored=REGIONS.filter(r=>r.id==='entrance'||Array.isArray(raw.forest?.explored)&&raw.forest.explored.includes(r.id)).map(r=>r.id);
  s.forest.treasures=TREASURES.filter(t=>Array.isArray(raw.forest?.treasures)&&raw.forest.treasures.includes(t.id)).map(t=>t.id);
  const coins=number(raw.stash?.coins,0,0,9999999);
  if(raw.stash?.area==='forest'&&coins>0)s.stash={...safeStash(forestPosition(raw.stash),s),coins};
  return s;
}
export class SaveService {
  constructor(storage) { this.storage = storage; this.error = ''; }
  load() { try { const text = this.storage.getItem(SAVE_KEY); if (!text) return null; const state = validate(JSON.parse(text)); this.error = state ? '' : 'This save is incompatible. Start a new life to replace it.'; return state; } catch { this.error = 'Save could not be read. Start a new life, or enable browser storage.'; return null; } }
  write(state) { try { this.storage.setItem(SAVE_KEY, JSON.stringify(state)); this.error = ''; return true; } catch { this.error = 'Saving unavailable. Enable browser storage to keep your progress.'; return false; } }
  grantTestingCoins(){
    try{
      const raw=JSON.parse(this.storage.getItem(SAVE_KEY));
      if(!raw||!validate(raw)||!Number.isInteger(raw.money)||raw.money<0||raw.money>9999999){this.error='Continue or start a game before adding testing coins.';return null;}
      const result=testingCredit(raw);
      if(result.state!==raw&&!this.write(result.state))return null;
      return {added:result.added,balance:result.state.money};
    }catch{this.error='Testing coins could not be saved. Enable browser storage.';return null;}
  }
}
