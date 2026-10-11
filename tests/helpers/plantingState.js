import {newState} from '../../src/systems/state.js';
// Existing farming regressions explicitly start with seeds equipped, as a player would select them.
export function plantingState(...args){const s=newState(...args);s.selected='seed';return s;}
