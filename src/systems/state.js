import {freshAppearance} from '../data/appearance.js';
import {freshHome} from '../data/homes.js';
import {freshStory} from './story.js';
import {freshForest} from './forest.js';
import {INVENTORY_KEYS} from '../data/crops.js';
import {ROOM} from '../data/interior.js';
import {PLOTS_PER_FARM} from '../data/farms.js';
import {freshSettlement} from '../data/settlement.js';
export const emptyPlot = () => ({ crop: null, growth: 0, wateredDay: 0, missedDays: 0, lastEvaluatedDay: 0 });
export function newState(character = 'boy', marketSeed=1) {
  return { version: 19, appearance: freshAppearance(character), balanceRevision: 1, ownsCopperCan: false, foodCooldown: 0, home: freshHome(), story: freshStory(), settlement: freshSettlement(), selectedDecoration: 'bench', vegetation: {}, customBeds: [], dugPlots: [], wetGround: [], forest: freshForest(), forestTutorialComplete: false, nightWarningSeen: false, deathTutorialSeen: false, hasDied: false, stash: null, roomSize: {width:ROOM.width,height:ROOM.height}, character, area: 'home', position: { x: 480, y: 500 }, day: 1, minute: 360, money: 60, health: 100, energy: 100, fatigueMinutes: 0, selected: 'hand', marketSeed: marketSeed>>>0, selectedCrop: 'tomato', hasHarvestedFirstCrop: false, hasVisitedCity: false, hasBoughtSeeds: false, hasSoldProduce: false, lastRecoveryDay: 0, inventory: Object.fromEntries(INVENTORY_KEYS.map(key=>[key,0])), currentFarm: 0, farms: [{fields:[true,false,false,false]}], plots: Array.from({length:PLOTS_PER_FARM},emptyPlot), sold: 0, hasVisitedFarm: false, starterSeedsClaimed: false, expansionUnlocked: false };
}
