import {PEOPLE} from '../data/appearance.js';
import {MAPS} from '../data/mapLayouts.js';
import {waterAt} from '../data/water.js';
import {waterRipples,ripplePose} from './waterRipples.js';
// Camera-local native-pixel currents, clipped reflections and shallow-water ankles.
// Mask alpha matches image alpha because Phaser Canvas resets alpha while clipping.
export class WaterView {
 constructor(scene,area){this.scene=scene;this.map=MAPS[area];this.ripples=waterRipples(this.map);this.flow=scene.add.graphics().setDepth(0);this.wade=scene.add.graphics();this.phase=-1;this.reflectionMask=scene.add.graphics().setAlpha(.24).setVisible(false);this.reflection=scene.add.image(0,0,scene.app.state?.character||'girl',0).setOrigin(.5,0).setFlipY(true).setScale(2).setAlpha(.24).setDepth(.5).setVisible(false).setMask(this.reflectionMask.createGeometryMask());}
 update(time,moving,p){
  const camera=this.scene.cameras.main.worldView,phase=Math.floor(time/240)%6,key=[Math.floor(time/120),Math.floor(camera.x/32),Math.floor(camera.y/32),camera.width,camera.height].join(':');
  if(key!==this.key){
   this.key=key;const g=this.flow;g.clear();
   for(const r of this.ripples){
    if(r.x<camera.x-32||r.x>camera.right+32||r.y<camera.y-24||r.y>camera.bottom+24)continue;
    const pose=ripplePose(r,time);if(!pose)continue;const {x:xx,y:yy,width,alpha}=pose,half=Math.ceil(width/4)*2;
    if(![[xx-half,yy-2],[xx+half+2,yy+6]].every(([x,y])=>waterAt(this.map,{x,y})))continue;
    // Broken little reflection clusters rather than long horizontal strokes.
    g.fillStyle(0xa7bdb4,.44*alpha).fillRect(xx-half,yy,4,2).fillRect(xx-2,yy-2,6,2).fillRect(xx+6,yy+2,4,2);
    g.fillStyle(0x577877,.4*alpha).fillRect(xx+2,yy+4,6,2);
    if(r.seed%7===0)g.fillStyle(0xc2cec0,.58*alpha).fillRect(xx,yy,2,2).fillRect(xx+2,yy-2,2,2);
   }
  }
  const wet=!this.scene.jumping?.active&&waterAt(this.map,p),sprite=this.scene.player?.sprite;
  this.scene.player?.shadow?.setVisible(!wet);
  this.wade.clear().setVisible(wet);if(sprite){if(wet)sprite.setCrop(0,0,sprite.frame.width,sprite.frame.height-PEOPLE.wadeRows);else sprite.setCrop();}
  if(wet){const x=Math.round(p.x/2)*2,y=Math.round(p.y/2)*2,spread=moving?(phase%4)*2:2,g=this.wade;g.setDepth(p.y+1).fillStyle(0x6b908d,.85).fillRect(x-12,y-6,24,6).fillStyle(0xd8dac3,.7).fillRect(x-16-spread,y-6,10,2).fillRect(x+6+spread,y-6,10,2).fillRect(x-6,y-2+spread,12,2);}
  this.reflection.setVisible(wet);this.reflectionMask.clear();
  if(wet&&sprite){
   this.reflection.setTexture(sprite.texture.key,sprite.frame.name).setPosition(Math.round(p.x/2)*2+(phase%3-1)*2,Math.round(p.y/2)*2-2).setScale(sprite.scaleX,sprite.scaleY*.85);
   // Clip every reflected row to actual water; reeds, banks and bridges stay dry.
   this.reflectionMask.fillStyle(0xffffff);
   for(let row=2;row<(sprite?.displayHeight||80);row+=2){if((row+phase*2)%14===0)continue;const yy=Math.round(p.y/2)*2+row;
    for(let xx=Math.round(p.x/2)*2-24;xx<p.x+24;xx+=2)if(waterAt(this.map,{x:xx,y:yy}))this.reflectionMask.fillRect(xx,yy,2,2);
   }
  }
  this.wading=wet;
 }
}
