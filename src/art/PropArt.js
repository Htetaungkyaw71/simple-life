import {propFrame,propScale,propTexture} from '../data/propArt.js';
// Logical prop scale is shared by the world, project previews and UI icons.
export function propImage(scene,name,x,y,scale=2,depth=0){
 const frame=propFrame(name),atlas=propTexture(name)|| (scene.textures.get('town').has(frame)?'town':'world');
 return scene.add.image(Math.round(x),Math.round(y),atlas,frame).setOrigin(0).setScale(propScale(name,scale)).setDepth(depth);
}
