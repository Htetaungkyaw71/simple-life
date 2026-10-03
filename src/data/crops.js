export const CROPS = {
  tomato: { id: 'tomato', name: 'Tomato', seedPrice: 10, sellPrice: 18, growthDays: 3, harvestYield: 2, watering: ['morning', 'evening'], stages: ['seed', 'sprout', 'growing', 'mature'], regrow: false, unlock: null },
};
export const PLOTS = Array.from({ length: 6 }, (_, i) => ({ x: 370 + (i % 3) * 84, y: 245 + Math.floor(i / 3) * 90 }));
