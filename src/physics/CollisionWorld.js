import {MAPS} from '../data/mapLayouts.js';
import {inBounds,houseClearance,LOCATIONS,walkable} from '../data/locations.js';
// Physics queries and pure save validation consume the same small solid masks.
export class CollisionWorld {
 constructor(scene,area){
  this.scene=scene;this.area=area;this.group=scene.physics.add.staticGroup();
  for(const [x,y,w,h]of (area==='forest'?[]:LOCATIONS[area].obstacles)){const zone=scene.add.zone(x,y,w,h).setOrigin(0);scene.physics.add.existing(zone,true);this.group.add(zone);}
  this.halfHeight=area==='interior'?3:6;this.probe=scene.add.zone(0,0,this.halfHeight*4,this.halfHeight*2);scene.physics.add.existing(this.probe);this.probe.body.setAllowGravity(false);this.probe.body.moves=false;
  if(import.meta.env.DEV&&new URLSearchParams(location.search).has('collisions')){
   this.debug=scene.add.graphics().setDepth(area==='forest'?10003:4000);this.debug.lineStyle(1,0xff5d96,.9);
   for(const [x,y,w,h]of LOCATIONS[area].obstacles)this.debug.strokeRect(x,y,w,h);
   for(const l of MAPS[area].ledges||[])this.debug.strokeRect(l.x,l.y,l.w,l.h);
  }
 }
 canMove(x,y){if(this.area==='forest')return walkable('forest',x,y);if(!inBounds(this.area,x,y)||!houseClearance(this.area,x,y))return false;this.probe.body.reset(x,y-this.halfHeight);return !this.scene.physics.overlap(this.probe,this.group);}
 destroy(){this.probe.destroy();this.group.clear(true,true);this.group.destroy();this.debug?.destroy();}
}
