import {openGround,MAX_CUSTOM_BEDS,MAX_WET_PATCHES,WET_DURATION} from './farmGround.js';
import {FARM_PLOTS} from '../data/farms.js';
import {ANIMAL_SPAWNS,SPECIES} from '../data/wildlife.js';
import {FORAGE_NODES,LEGACY_FOREST_OFFSET,TREASURES,REGIONS} from '../data/forest.js';
import {inTerritory,freshAnimal,safeStash} from './forest.js';
import {MAX_FARMS,PLOTS_PER_FARM} from '../data/farms.js';
import {newFarm,plotOwned} from './expansion.js';
import {inferFarmVisit} from './navigation.js';
import {ROOM} from '../data/interior.js';
import {completedWindow} from './watering.js';
import { CROPS,INVENTORY_KEYS } from '../data/crops.js';
import { SAVE_KEY, TOOLS } from '../config.js';
import {FATIGUE_MINUTES} from '../data/energy.js';
import { LOCATIONS, nearestSafe, walkable } from '../data/locations.js';
import { newState, emptyPlot } from './state.js';
const number = (v, fallback, min, max) => Number.isFinite(v) ? Math.max(min, Math.min(max, Math.floor(v))) : fallback;
export function validate(raw) {
  if (!raw || ![1,2,3,4,5,6,7,8,9,10].includes(raw.version) || !['boy','girl'].includes(raw.character)) return null;
  const s = newState(raw.character);
  s.area = Object.hasOwn(LOCATIONS, raw.area) ? raw.area : 'home';
  if(raw.version===1&&raw.area==='home'&&raw.position?.x>=240&&raw.position.x<=592&&raw.position.y>=144&&raw.position.y<496)s.area='interior';
  if(raw.version>=5&&Array.isArray(raw.farms)&&raw.farms.length){
    s.farms=raw.farms.slice(0,MAX_FARMS).map(f=>({fields:[true,...[1,2,3].map(i=>f?.fields?.[i]===true)]}));
  }else s.farms=[newFarm()];
  s.currentFarm=number(raw.version>=5?raw.currentFarm:0,0,0,s.farms.length-1);
  s.plots=Array.from({length:s.farms.length*PLOTS_PER_FARM},emptyPlot);
  s.expansionUnlocked=raw.expansionUnlocked===true;
  s.starterSeedsClaimed=raw.starterSeedsClaimed===true;
  const oldRoom=raw.version<3?{width:1344,height:800}:raw.roomSize;
  const position=s.area==='interior'&&oldRoom?.width>0&&oldRoom?.height>0?{x:raw.position?.x*ROOM.width/oldRoom.width,y:raw.position?.y*ROOM.height/oldRoom.height}:raw.position;
  s.roomSize={width:ROOM.width,height:ROOM.height};
  const forestPosition=p=>raw.version<9&&p?{x:p.x,y:p.y+LEGACY_FOREST_OFFSET}:p;
  s.position = nearestSafe(s.area,s.area==='forest'?forestPosition(position):position);
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
    s.dugPlots=[...new Set(Array.isArray(raw.dugPlots)?raw.dugPlots:[])].filter(i=>Number.isInteger(i)&&i>=0&&i<s.plots.length&&openGround('farm',FARM_PLOTS[i%PLOTS_PER_FARM].x,FARM_PLOTS[i%PLOTS_PER_FARM].y,true));
    for(const b of (Array.isArray(raw.customBeds)?raw.customBeds:[]).slice(0,MAX_CUSTOM_BEDS)){
      if(!Number.isInteger(b?.farm)||!s.farms[b.farm]||!Number.isInteger(b.x)||!Number.isInteger(b.y)||![8,24,40].includes(b.x%48)||![8,24].includes(b.y%48)||!openGround('farm',b.x,b.y,true))continue;
      if(FARM_PLOTS.some(p=>Math.abs(p.x-b.x)<48&&Math.abs(p.y-b.y)<48)||s.customBeds.some(p=>p.farm===b.farm&&Math.abs(p.x-b.x)<48&&Math.abs(p.y-b.y)<48))continue;
      s.customBeds.push({farm:b.farm,x:b.x,y:b.y,plot:b.plot});
    }
    const seen=new Set();
    for(const p of (Array.isArray(raw.wetGround)?raw.wetGround:[]).slice(-MAX_WET_PATCHES)){
      if(!p||!Number.isInteger(p.x)||!Number.isInteger(p.y)||!openGround(p.area,p.x,p.y)||!Number.isFinite(p.remaining)||p.remaining<=0||!Number.isInteger(p.farm)||!s.farms[p.farm])continue;
      const key=p.area+':'+p.farm+':'+p.x+':'+p.y;if(seen.has(key))continue;seen.add(key);
      s.wetGround.push({area:p.area,farm:p.farm,x:p.x,y:p.y,remaining:Math.min(WET_DURATION,p.remaining)});
    }
  }
  const restorePlot=p=>{
    if(!p||!Object.hasOwn(CROPS,p.crop))return emptyPlot();
    const plot={crop:p.crop,growth:number(p.growth,0,0,CROPS[p.crop].growthDays),morning:p.morning===true,evening:p.evening===true,dryDays:number(p.missedWindows??p.dryDays,0,0,2),missedWindows:number(p.missedWindows??p.dryDays,0,0,2),lastEvaluatedWindow:raw.version<3?completedWindow(s):number(p.lastEvaluatedWindow,(s.day-1)*2-1,(s.day-1)*2-1,completedWindow(s))};
    if(Number.isFinite(p.plantedDay))plot.plantedDay=number(p.plantedDay,1,1,s.day);
    if(Number.isFinite(p.plantedMinute))plot.plantedMinute=number(p.plantedMinute,360,0,1439);
    if(Number.isFinite(p.recoveredWindow))plot.recoveredWindow=number(p.recoveredWindow,-1,-1,(s.day-1)*2+1);
    return plot;
  };
  s.plots=s.plots.map((_,i)=>plotOwned(s,i)?restorePlot(raw.plots?.[i]):emptyPlot());
  s.customBeds.forEach(b=>{b.plot=restorePlot(b.plot);});
  s.hasVisitedFarm=inferFarmVisit(raw,s);
  for(const key of ['forestTutorialComplete','nightWarningSeen','deathTutorialSeen','hasDied','ownsClub'])s[key]=raw[key]===true;
  s.clubEquipped=s.ownsClub&&raw.clubEquipped!==false;
  s.forest.forageDay=number(raw.forest?.forageDay,s.day,1,s.day);
  s.forest.collected=FORAGE_NODES.filter(n=>raw.forest?.collected?.includes?.(n.id)).map(n=>n.id);
  if(s.forest.forageDay<s.day){s.forest.forageDay=s.day;s.forest.collected=[];}
  for(const a of ANIMAL_SPAWNS){
    const old=raw.version<9?(a.id==='boar-original'?raw.forest?.boar:null):raw.forest?.animals?.[a.id];
    if(!old)continue;
    const restored=s.forest.animals[a.id],definition=SPECIES[a.species];
    restored.health=number(old.health,definition.health,0,definition.health);
    restored.defeatedDay=number(old.defeatedDay,s.day,0,s.day);
    const p=nearestSafe('forest',raw.version<9?forestPosition(old.position):old.position);
    restored.position=inTerritory(p,a.territory)&&walkable('forest',p.x,p.y,definition.body)?p:{...a.home};
    if(!restored.health&&restored.defeatedDay<s.day)s.forest.animals[a.id]=freshAnimal(a);
  }
  s.forest.boar=s.forest.animals['boar-original'];
  s.forest.explored=REGIONS.filter(r=>r.id==='entrance'||Array.isArray(raw.forest?.explored)&&raw.forest.explored.includes(r.id)).map(r=>r.id);
  s.forest.treasures=TREASURES.filter(t=>Array.isArray(raw.forest?.treasures)&&raw.forest.treasures.includes(t.id)).map(t=>t.id);
  const coins=number(raw.stash?.coins,0,0,9999999);
  if(raw.stash?.area==='forest'&&coins>0)s.stash={...safeStash(forestPosition(raw.stash)),coins};
  return s;
}
export class SaveService {
  constructor(storage) { this.storage = storage; this.error = ''; }
  load() { try { const text = this.storage.getItem(SAVE_KEY); if (!text) return null; const state = validate(JSON.parse(text)); this.error = state ? '' : 'This save is incompatible. Start a new life to replace it.'; return state; } catch { this.error = 'Save could not be read. Start a new life, or enable browser storage.'; return null; } }
  write(state) { try { this.storage.setItem(SAVE_KEY, JSON.stringify(state)); this.error = ''; return true; } catch { this.error = 'Saving unavailable. Enable browser storage to keep your progress.'; return false; } }
}
