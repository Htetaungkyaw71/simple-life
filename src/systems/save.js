import {ROOM} from '../data/interior.js';
import {completedWindow} from './watering.js';
import { CROPS } from '../data/crops.js';
import { SAVE_KEY, TOOLS } from '../config.js';
import { LOCATIONS, nearestSafe } from '../data/locations.js';
import { newState, emptyPlot } from './state.js';
const number = (v, fallback, min, max) => Number.isFinite(v) ? Math.max(min, Math.min(max, Math.floor(v))) : fallback;
export function validate(raw) {
  if (!raw || ![1,2,3].includes(raw.version) || !['boy','girl'].includes(raw.character)) return null;
  const s = newState(raw.character);
  s.area = Object.hasOwn(LOCATIONS, raw.area) ? raw.area : 'home';
  if(raw.version===1&&raw.area==='home'&&raw.position?.x>=240&&raw.position.x<=592&&raw.position.y>=144&&raw.position.y<496)s.area='interior';
  s.expansionUnlocked=raw.expansionUnlocked===true;
  s.starterSeedsClaimed=raw.starterSeedsClaimed===true;
  const oldRoom=raw.version<3?{width:1344,height:800}:raw.roomSize;
  const position=s.area==='interior'&&oldRoom?.width>0&&oldRoom?.height>0?{x:raw.position?.x*ROOM.width/oldRoom.width,y:raw.position?.y*ROOM.height/oldRoom.height}:raw.position;
  s.roomSize={width:ROOM.width,height:ROOM.height};
  s.position = raw.area==='city'?{...LOCATIONS.home.spawn}:nearestSafe(s.area,position);
  for (const [key,min,max] of [['day',1,99999],['minute',360,1439],['money',0,9999999],['health',0,100],['energy',0,100],['sold',0,999999]]) s[key] = number(raw[key],s[key],min,max);
  s.selected = TOOLS.includes(raw.selected) ? raw.selected : 'seed';
  for (const key of ['seed','tomato']) s.inventory[key] = number(raw.inventory?.[key],0,0,9999);
  s.plots = s.plots.map((_,i) => {
    const p = raw.plots?.[i];
    return p && Object.hasOwn(CROPS,p.crop) ? { crop: p.crop, growth: number(p.growth,0,0,CROPS[p.crop].growthDays), morning: p.morning === true, evening: p.evening === true, dryDays: number(p.missedWindows??p.dryDays,0,0,2), missedWindows: number(p.missedWindows??p.dryDays,0,0,2), lastEvaluatedWindow: raw.version<3?completedWindow(s):number(p.lastEvaluatedWindow,(s.day-1)*2-1,(s.day-1)*2-1,completedWindow(s)) } : emptyPlot();
  });
  return s;
}
export class SaveService {
  constructor(storage) { this.storage = storage; this.error = ''; }
  load() { try { const text = this.storage.getItem(SAVE_KEY); if (!text) return null; const state = validate(JSON.parse(text)); this.error = state ? '' : 'This save is incompatible. Start a new life to replace it.'; return state; } catch { this.error = 'Save could not be read. Start a new life, or enable browser storage.'; return null; } }
  write(state) { try { this.storage.setItem(SAVE_KEY, JSON.stringify(state)); this.error = ''; return true; } catch { this.error = 'Saving unavailable. Enable browser storage to keep your progress.'; return false; } }
}
