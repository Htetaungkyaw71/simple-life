export const CROPS = {
  tomato: { id: 'tomato', name: 'Tomato', seedPrice: 10, sellPrice: 18, growthDays: 3, harvestYield: 2, watering: ['morning', 'evening'], stages: ['seed', 'sprout', 'growing', 'mature'], regrow: false, unlock: null },
};
// First six indices retain the legacy 3x2 crop order when old saves expand.
const cells=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[3,0],[3,1],...Array.from({length:8},(_,i)=>[i%4,2+Math.floor(i/4)])];
export const PLOTS=cells.map(([col,row])=>({x:370+col*72,y:245+row*72}));
