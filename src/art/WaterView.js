import {MAPS} from '../data/mapLayouts.js';
import {waterAt} from '../data/water.js';
import {groundHash} from './groundSurface.js';
// Camera-local native-pixel currents, and a shallow-water line over the ankles.
export class WaterView {
 constructor(scene,area){this.scene=scene;this.map=MAPS[area];this.flow=scene.add.graphics().setDepth(0);this.wade=scene.add.graphics();this.phase=-1;}
 update(time,moving,p){
  const camera=this.scene.cameras.main.worldView,phase=Math.floor(time/240)%6,key=[phase,Math.floor(camera.x/32),Math.floor(camera.y/32),camera.width,camera.height].join(':');
  if(key!==this.key){
   this.key=key;const g=this.flow;g.clear();
   for(let y=Math.floor(camera.y/48)*48-48;y<camera.bottom+48;y+=48)for(let x=Math.floor(camera.x/44)*44-44;x<camera.right+44;x+=44){
    const seed=groundHash(x,y,351),xx=x+(seed%13)*2,yy=y+((seed>>>5)%13)*2+phase*2;
    const wet=(a,b)=>waterAt(this.map,{x:a,y:b});
    if(wet(xx-8,yy-4)&&wet(xx+20,yy+10)){
     g.fillStyle(0x8aaba0,.19).fillRect(xx-4,yy,14,2).fillRect(xx+4,yy+2,16,2).fillRect(xx+2,yy+4,8,2);
     g.fillStyle(0x344d51,.16).fillRect(xx-8,yy+6,18,4).fillRect(xx+10,yy+4,8,2);
     if(seed%11===0){g.fillStyle(0xcad8c4,.55).fillRect(xx,yy-2,6,2).fillRect(xx-2,yy,4,2).fillRect(xx+6,yy+2,4,2);}
    }
   }
  }
  const wet=!this.scene.jumping?.active&&waterAt(this.map,p),sprite=this.scene.player?.sprite;
  this.wade.clear().setVisible(wet);if(sprite){if(wet)sprite.setCrop(0,0,24,28);else sprite.setCrop();}
  if(wet){const x=Math.round(p.x/2)*2,y=Math.round(p.y/2)*2,spread=moving?(phase%4)*2:2,g=this.wade;g.setDepth(p.y+1).fillStyle(0x6b908d,.85).fillRect(x-12,y-6,24,6).fillStyle(0xd8dac3,.7).fillRect(x-16-spread,y-6,10,2).fillRect(x+6+spread,y-6,10,2).fillRect(x-6,y-2+spread,12,2);}
  this.wading=wet;
 }
}
