import {evaluateWatering} from './watering.js';
import {ROOM} from '../data/interior.js';
import { DAY_SECONDS } from '../config.js';
import { growOvernight } from './farming.js';
export function nextDay(s) { growOvernight(s); s.day++; s.minute = 360; s.energy = 100; s.area = 'interior'; s.position = { x: ROOM.bed.x, y: ROOM.bed.y+16 }; }
// Late night waits for the player to choose Sleep at the bed. No automatic day rollover.
export function tick(s, delta) { s.minute = Math.min(1439,s.minute + Math.min(delta,100) / 1000 * 1080 / DAY_SECONDS); evaluateWatering(s); }
export function phase(s) { return s.minute < 720 ? 'Morning' : s.minute < 960 ? 'Afternoon' : s.minute < 1200 ? 'Evening' : 'Night'; }
export function clock(s) { const m = Math.floor(s.minute/10)*10; return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`; }

export function restUntilEvening(s){s.minute=960;evaluateWatering(s);}
