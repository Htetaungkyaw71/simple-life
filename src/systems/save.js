import { CROPS } from '../data/crops.js';
import { SAVE_KEY, TOOLS } from '../config.js';
import { LOCATIONS, walkable } from '../data/locations.js';
import { newState, emptyPlot } from './state.js';
const number = (v, fallback, min, max) => Number.isFinite(v) ? Math.max(min, Math.min(max, Math.floor(v))) : fallback;
export function validate(raw) {
  if (!raw || raw.version !== 1 || !['boy','girl'].includes(raw.character)) return null;
  const s = newState(raw.character);
  s.area = Object.hasOwn(LOCATIONS, raw.area) ? raw.area : 'home';
  s.position = walkable(s.area, raw.position?.x, raw.position?.y) ? { x: raw.position.x, y: raw.position.y } : { ...LOCATIONS[s.area].spawn };
  for (const [key,min,max] of [['day',1,99999],['minute',360,1439],['money',0,9999999],['health',0,100],['energy',0,100],['sold',0,999999]]) s[key] = number(raw[key],s[key],min,max);
  s.selected = TOOLS.includes(raw.selected) ? raw.selected : 'seed';
  for (const key of ['seed','tomato']) s.inventory[key] = number(raw.inventory?.[key],0,0,9999);
  s.plots = s.plots.map((_,i) => {
    const p = raw.plots?.[i];
    return p && Object.hasOwn(CROPS,p.crop) ? { crop: p.crop, growth: number(p.growth,0,0,CROPS[p.crop].growthDays), morning: p.morning === true, evening: p.evening === true, dryDays: number(p.dryDays,0,0,2) } : emptyPlot();
  });
  return s;
}
export class SaveService {
  constructor(storage) { this.storage = storage; this.error = ''; }
  load() { try { const text = this.storage.getItem(SAVE_KEY); if (!text) return null; const state = validate(JSON.parse(text)); this.error = state ? '' : 'This save is incompatible. Start a new life to replace it.'; return state; } catch { this.error = 'Save could not be read. Start a new life, or enable browser storage.'; return null; } }
  write(state) { try { this.storage.setItem(SAVE_KEY, JSON.stringify(state)); this.error = ''; return true; } catch { this.error = 'Saving unavailable. Enable browser storage to keep your progress.'; return false; } }
}
