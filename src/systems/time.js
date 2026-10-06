import { DAY_SECONDS } from '../config.js';
import { growOvernight } from './farming.js';
export function nextDay(s) { growOvernight(s); s.day++; s.minute = 360; s.energy = 100; s.area = 'interior'; s.position = { x: 370, y: 350 }; }
export function tick(s, delta) { s.minute += Math.min(delta,100) / 1000 * 1080 / DAY_SECONDS; if (s.minute >= 1440) { nextDay(s); return true; } return false; }
export function phase(s) { return s.minute < 720 ? 'Morning' : s.minute < 960 ? 'Afternoon' : s.minute < 1200 ? 'Evening' : 'Night'; }
export function clock(s) { const m = Math.floor(s.minute/10)*10; return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`; }
