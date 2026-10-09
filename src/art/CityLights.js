import {MAPS} from '../data/mapLayouts.js';
// Restrained pixel light pools belong to town lamps only; no blurred effect.
export class CityLights{
 constructor(scene,area){this.scene=scene;this.lamps=area==='city'?MAPS.city.props.filter(p=>p.name==='city-lamp'):[];this.g=this.lamps.length?scene.add.graphics().setDepth(10001):null;}
 update(light){if(!this.g)return;const strength=Math.max(0,(light.alpha-.32)/.46);this.g.clear();if(!strength)return;for(const p of this.lamps){const x=p.x+20,y=p.y+84;this.g.fillStyle(0xeab878,.035*strength).fillRect(x-42,y-20,84,36).fillRect(x-30,y-26,60,48);this.g.fillStyle(0xf4cf8c,.045*strength).fillRect(x-26,y-12,52,22);this.g.fillStyle(0xf8da93,.9*strength).fillRect(p.x+16,p.y+16,8,10);}}
}
