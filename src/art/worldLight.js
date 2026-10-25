import {daylight} from '../systems/time.js';
import {SHOP_ROOMS} from '../data/cityShops.js';
// Settlement moonlight leaves at least 48% of the original scene visible.
// Forest retains its distance darkness and established local visibility bands.
export function worldLight(s){const light=daylight(s);return {...light,alpha:SHOP_ROOMS[s.area]?0:s.area==='forest'?light.alpha:Math.min(.52,light.alpha)};}
