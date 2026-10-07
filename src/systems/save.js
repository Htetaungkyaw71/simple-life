import {FORAGE_NODES} from '../data/forest.js';
import {inTerritory,freshBoar,safeStash} from './forest.js';
import {MAX_FARMS,PLOTS_PER_FARM} from '../data/farms.js';
import {newFarm,plotOwned} from './expansion.js';
import {inferFarmVisit} from './navigation.js';
import {ROOM} from '../data/interior.js';
import {completedWindow} from './watering.js';
import { CROPS,INVENTORY_KEYS } from '../data/crops.js';
import { SAVE_KEY, TOOLS } from '../config.js';
import { LOCATIONS, nearestSafe, walkable } from '../data/locations.js';
import { newState, emptyPlot } from './state.js';
const number = (v, fallback, min, max) => Number.isFinite(v) ? Math.max(min, Math.min(max, Math.floor(v))) : fallback;
export function validate(raw) {
  if (!raw || ![1,2,3,4,5,6,7,8].includes(raw.version) || !['boy','girl'].includes(raw.character)) return null;
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
  s.position = nearestSafe(s.area,position);
  s.marketSeed=number(raw.marketSeed,1,0,4294967295);
  s.selectedCrop=Object.hasOwn(CROPS,raw.selectedCrop)?raw.selectedCrop:'tomato';
  s.hasVisitedCity=raw.hasVisitedCity===true||raw.area==='city';
  s.hasHarvestedFirstCrop=raw.hasHarvestedFirstCrop===true||raw.sold>0||Object.keys(CROPS).some(id=>raw.inventory?.[id]>0);
  s.hasBoughtSeeds=raw.hasBoughtSeeds===true;
  s.hasSoldProduce=raw.hasSoldProduce===true||raw.sold>0;
  s.lastRecoveryDay=number(raw.lastRecoveryDay,0,0,99999);
  for (const [key,min,max] of [['day',1,99999],['minute',0,1439],['money',0,9999999],['health',0,100],['energy',0,100],['sold',0,999999]]) s[key] = number(raw[key],s[key],min,max);
  s.fatigueMinutes=Number.isFinite(raw.fatigueMinutes)?Math.max(0,Math.min(29.999999,raw.fatigueMinutes)):0;
  s.selected = TOOLS.includes(raw.selected) ? raw.selected : 'seed';
  for (const key of INVENTORY_KEYS) s.inventory[key] = number(raw.inventory?.[key],0,0,9999);
  s.plots = s.plots.map((_,i) => {
    const p = raw.plots?.[i];
    return plotOwned(s,i) && p && Object.hasOwn(CROPS,p.crop) ? { crop: p.crop, growth: number(p.growth,0,0,CROPS[p.crop].growthDays), morning: p.morning === true, evening: p.evening === true, dryDays: number(p.missedWindows??p.dryDays,0,0,2), missedWindows: number(p.missedWindows??p.dryDays,0,0,2), lastEvaluatedWindow: raw.version<3?completedWindow(s):number(p.lastEvaluatedWindow,(s.day-1)*2-1,(s.day-1)*2-1,completedWindow(s)) } : emptyPlot();
  });
  s.hasVisitedFarm=inferFarmVisit(raw,s);
  s.plots.forEach((p,i)=>{if(!p.crop)return;const old=raw.plots[i];
    if(Number.isFinite(old.plantedDay))p.plantedDay=number(old.plantedDay,1,1,s.day);
    if(Number.isFinite(old.plantedMinute))p.plantedMinute=number(old.plantedMinute,360,0,1439);
    if(Number.isFinite(old.recoveredWindow))p.recoveredWindow=number(old.recoveredWindow,-1,-1,(s.day-1)*2+1);
  });
  for(const key of ['forestTutorialComplete','nightWarningSeen','deathTutorialSeen','hasDied','ownsClub'])s[key]=raw[key]===true;
  s.clubEquipped=s.ownsClub&&raw.clubEquipped!==false;
  s.forest.forageDay=number(raw.forest?.forageDay,s.day,1,s.day);
  s.forest.collected=FORAGE_NODES.filter(n=>raw.forest?.collected?.includes?.(n.id)).map(n=>n.id);
  if(s.forest.forageDay<s.day){s.forest.forageDay=s.day;s.forest.collected=[];}
  const boar=raw.forest?.boar;
  if(boar){
    s.forest.boar.health=number(boar.health,3,0,3);
    s.forest.boar.defeatedDay=number(boar.defeatedDay,s.day,0,s.day);
    const p=nearestSafe('forest',boar.position);
    s.forest.boar.position=inTerritory(p)&&walkable('forest',p.x,p.y,16)?p:freshBoar().position;
    if(!s.forest.boar.health&&s.forest.boar.defeatedDay<s.day)s.forest.boar=freshBoar();
  }
  const coins=number(raw.stash?.coins,0,0,9999999);
  if(raw.stash?.area==='forest'&&coins>0)s.stash={...safeStash(raw.stash),coins};
  return s;
}
export class SaveService {
  constructor(storage) { this.storage = storage; this.error = ''; }
  load() { try { const text = this.storage.getItem(SAVE_KEY); if (!text) return null; const state = validate(JSON.parse(text)); this.error = state ? '' : 'This save is incompatible. Start a new life to replace it.'; return state; } catch { this.error = 'Save could not be read. Start a new life, or enable browser storage.'; return null; } }
  write(state) { try { this.storage.setItem(SAVE_KEY, JSON.stringify(state)); this.error = ''; return true; } catch { this.error = 'Saving unavailable. Enable browser storage to keep your progress.'; return false; } }
}
