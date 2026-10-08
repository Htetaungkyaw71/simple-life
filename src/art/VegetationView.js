import {removed} from '../data/vegetation.js';
export function refreshVegetationVisuals(scene){
 for(const [id,sprites]of scene.vegetationVisuals)if(removed(scene.app.state,id)){for(const sprite of sprites)sprite.destroy();scene.vegetationVisuals.delete(id);}
 scene.canopies=scene.canopies.filter(c=>c.sprite.active);scene.grass.refresh();
}
