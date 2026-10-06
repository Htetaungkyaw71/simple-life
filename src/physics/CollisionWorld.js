import {inBounds,houseClearance,LOCATIONS} from '../data/locations.js';
// Physics queries and pure save validation consume the same small solid masks.
export class CollisionWorld {
 constructor(scene,area){
  this.scene=scene;this.area=area;this.group=scene.physics.add.staticGroup();
  for(const [x,y,w,h]of LOCATIONS[area].obstacles){const zone=scene.add.zone(x,y,w,h).setOrigin(0);scene.physics.add.existing(zone,true);this.group.add(zone);}
  this.probe=scene.add.zone(0,0,24,12);scene.physics.add.existing(this.probe);this.probe.body.setAllowGravity(false);this.probe.body.moves=false;
  if(import.meta.env.DEV&&new URLSearchParams(location.search).has('collisions')){
   this.debug=scene.add.graphics().setDepth(4000);this.debug.lineStyle(1,0xff5d96,.9);
   for(const [x,y,w,h]of LOCATIONS[area].obstacles)this.debug.strokeRect(x,y,w,h);
  }
 }
 canMove(x,y){if(!inBounds(this.area,x,y)||!houseClearance(this.area,x,y))return false;this.probe.body.reset(x,y-6);return !this.scene.physics.overlap(this.probe,this.group);}
 destroy(){this.probe.destroy();this.group.clear(true,true);this.group.destroy();this.debug?.destroy();}
}
