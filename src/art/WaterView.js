import {MAPS} from '../data/mapLayouts.js';
import {waterAt} from '../data/water.js';
// Camera-local native-pixel currents, and a shallow-water line over the ankles.
export class WaterView {
 constructor(scene,area){this.scene=scene;this.map=MAPS[area];this.flow=scene.add.graphics().setDepth(0);this.wade=scene.add.graphics();this.phase=-1;}
 update(time,moving,p){
  const camera=this.scene.cameras.main.worldView,phase=Math.floor(time/160)%4,key=[phase,Math.floor(camera.x/32),Math.floor(camera.y/32),camera.width,camera.height].join(':');
  if(key!==this.key){
   this.key=key;const g=this.flow;g.clear();
   for(let y=Math.floor(camera.y/64)*64-64;y<camera.bottom+64;y+=64)for(let x=Math.floor(camera.x/48)*48-48;x<camera.right+48;x+=48){
    const xx=x+((Math.abs(x*7+y*3)%29)&~1),yy=y+(Math.abs(x+y)%13)*2+phase*2;
    if(waterAt(this.map,{x:xx-8,y:yy})&&waterAt(this.map,{x:xx+18,y:yy})){g.fillStyle(0xa6e0db,.65).fillRect(xx,yy,12,2).fillRect(xx-4,yy+2,4,2);g.fillStyle(0x67bac8,.75).fillRect(xx+10,yy+24,8,2);}
   }
  }
  const wet=!this.scene.jumping?.active&&waterAt(this.map,p),sprite=this.scene.player?.sprite;
  this.wade.clear().setVisible(wet);if(sprite){if(wet)sprite.setCrop(0,0,24,28);else sprite.setCrop();}
  if(wet){const x=Math.round(p.x/2)*2,y=Math.round(p.y/2)*2,spread=moving?phase*2:2,g=this.wade;g.setDepth(p.y+1).fillStyle(0x68becb,.8).fillRect(x-12,y-6,24,6).fillStyle(0xd0e9db,.8).fillRect(x-16-spread,y-6,10,2).fillRect(x+6+spread,y-6,10,2).fillRect(x-6,y-2+spread,12,2);}
  this.wading=wet;
 }
}
