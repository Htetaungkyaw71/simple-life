import {allPlots} from './plots.js';
import {missed} from './watering.js';
import {CROPS} from '../data/crops.js';
export function recoveryEligible(s){return s.lastRecoveryDay!==s.day&&s.money<10&&Object.values(CROPS).every(d=>!s.inventory[d.seedKey]&&!s.inventory[d.produceKey])&&!allPlots(s).some(p=>p.crop&&missed(p)<4);}
export function claimRecoverySeed(s){if(!recoveryEligible(s))return 'Aid is for farmers with no seeds, produce or living crops and fewer than 10 coins. One seed each day.';s.inventory.seed++;s.lastRecoveryDay=s.day;return 'One free Tomato seed. Water it twice each day to start again.';}
