import {TOOLS} from '../config.js';
// Empty hands are the invisible default; selecting an equipped tool puts it away.
export function toolSelection(selected,tool){return TOOLS.includes(tool)&&tool!=='hand'&&tool!==selected?tool:'hand';}
