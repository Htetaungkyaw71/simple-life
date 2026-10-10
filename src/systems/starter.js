import {recordStory} from './story.js';
export function collectStarterSeeds(state){
 if(state.starterSeedsClaimed)return 'Starter seeds already collected.';
 if(state.inventory.seed>9996)return 'Make room for 3 seeds before collecting this crate.';
 state.inventory.seed+=3;state.starterSeedsClaimed=true;recordStory(state,'starter');
 return 'Received 3 tomato seeds.';
}
