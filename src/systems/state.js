import {ROOM} from '../data/interior.js';
import { PLOTS } from '../data/crops.js';
export const emptyPlot = () => ({ crop: null, growth: 0, morning: false, evening: false, dryDays: 0, missedWindows: 0, lastEvaluatedWindow: -1 });
export function newState(character = 'boy') {
  return { version: 3, roomSize: {width:ROOM.width,height:ROOM.height}, character, area: 'home', position: { x: 480, y: 500 }, day: 1, minute: 360, money: 60, health: 100, energy: 100, selected: 'seed', inventory: { seed: 0, tomato: 0 }, plots: PLOTS.map(emptyPlot), sold: 0, starterSeedsClaimed: false, expansionUnlocked: false };
}
