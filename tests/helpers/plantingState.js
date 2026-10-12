import {newState} from '../../src/systems/state.js';
// Existing farming regressions explicitly start with seeds equipped, and the Copper Can owned to exercise legacy expanded-farm fixtures. Fresh starter and upgrade tests use the real newState.
export function plantingState(...args){const s=newState(...args);s.selected='seed';s.ownsCopperCan=true;return s;}
