import { CROPS } from '../data/crops.js';
import { emptyPlot } from './state.js';
export const waterPeriod = s => s.minute < 960 ? 'morning' : 'evening';
export function usePlot(s, index) {
  const p = s.plots[index];
  if (!p) return 'Choose a farm plot.';
  if (p.dryDays >= 2) { s.plots[index] = emptyPlot(); return 'Old crop cleared. A fresh start.'; }
  const def = CROPS[p.crop || 'tomato'];
  if (s.selected === 'seed') {
    if (p.crop) return 'Something is already growing here.';
    if (!s.inventory.seed) return 'Buy tomato seeds at the city seed shop.';
    if (s.energy < 5) return 'Too tired to plant. Sleep at home.';
    s.energy -= 5; s.inventory.seed--; p.crop = 'tomato'; return 'Tomato planted. Water before and after 16:00.';
  }
  if (!p.crop) return 'This plot is empty. Select a seed to plant.';
  if (s.selected === 'water') {
    if (p.growth >= def.growthDays) return 'Ready to pick! Select Harvest.';
    const period = waterPeriod(s);
    if (p[period]) return `Already watered this ${period}.`;
    if (s.energy < 3) return 'Too tired to water. Sleep at home.';
    s.energy -= 3; p[period] = true; return `${period === 'morning' ? 'Morning' : 'Evening'} watering done. ${p.morning && p.evening ? 'Ready for a night of growth!' : 'One more watering period to go.'}`;
  }
  if (p.growth < def.growthDays) return `Growing: ${p.growth}/${def.growthDays} days. Water morning & evening.`;
  if (s.energy < 4) return 'Too tired to harvest. Sleep at home.';
  if (s.inventory.tomato > 9999 - def.harvestYield) return 'Produce bag full. Sell in the city first.';
  s.energy -= 4; s.inventory.tomato += def.harvestYield; s.plots[index] = emptyPlot();
  return `Picked ${def.harvestYield} tomatoes! Sell them at the city produce market.`;
}
export function growOvernight(s) {
  for (const p of s.plots) {
    if (!p.crop || p.dryDays >= 2 || p.growth >= CROPS[p.crop].growthDays) continue;
    if (p.morning && p.evening) p.growth++;
    p.dryDays = !p.morning && !p.evening ? p.dryDays+1 : 0;
    p.morning = false; p.evening = false;
  }
}
