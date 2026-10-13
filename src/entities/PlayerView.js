import {movementFacing} from '../systems/movement.js';
import {HeldWateringCan} from './HeldWateringCan.js';
import {groundShadow,SHADOW_DEPTH} from '../art/GroundShadow.js';
const DIRECTIONS=['down','up','left','right'];
export class PlayerView {
  constructor(scene,character){
    this.scene=scene;
    this.sprite=scene.add.sprite(0,0,character,0).setOrigin(.5,.94).setScale(2);this.anchor=scene.add.zone(0,0,1,1);this.shadow=groundShadow(scene,0,0,28,8);this.direction='down';this.character=character;
    this.wateringCan=new HeldWateringCan(scene);
    for(const [row,dir]of DIRECTIONS.entries()){
      const walk=`${character}-${dir}`,idle=`${character}-${dir}-idle`;
      if(!scene.anims.exists(walk))scene.anims.create({key:walk,frames:[1,2,3,4].map(n=>({key:character,frame:row*9+n})),frameRate:8,repeat:-1});
      if(!scene.anims.exists(idle))scene.anims.create({key:idle,frames:[{key:character,frame:row*9,duration:2200},{key:character,frame:row*9+5,duration:130}],frameRate:1,repeat:-1});
    }
  }
  face(dx,dy){if(Math.abs(dx)+Math.abs(dy)<1)return;this.direction=movementFacing(dx,dy,this.direction);this.pose(false);}
  pose(moving){this.sprite.play(`${this.character}-${this.direction}${moving?'':'-idle'}`,true);}
  update(position,dx,dy,jump={height:0,frame:null},intent={x:dx,y:dy}){if((intent.x||intent.y)&&!this.scene.app.pendingAttack&&!(this.scene.app.state?.selected==='axe'&&this.wateringCan.remaining>0))this.direction=movementFacing(intent.x,intent.y,this.direction);if(jump.frame!==null)this.sprite.stop().setFrame(DIRECTIONS.indexOf(this.direction)*9+jump.frame);else this.pose(!!(dx||dy));this.anchor.setPosition(Math.round(position.x),Math.round(position.y));this.shadow.setPosition(this.anchor.x,this.anchor.y-3).setDepth(SHADOW_DEPTH).setAlpha(jump.height>0?.13:.22).setVisible(!this.scene.atmosphere?.waterView?.wading||jump.frame!==null);this.sprite.setPosition(this.anchor.x,this.anchor.y-jump.height).setDepth(Math.round(position.y));this.wateringCan.update(this.anchor,this.direction,this.sprite.scaleX,jump.height,!!(dx||dy));
    if(this.scene.app.state?.selected==='axe'&&this.wateringCan.remaining>0){
      const t=1-this.wateringCan.remaining/420,lean=t>.26&&t<.65?2:0;
      const shift=['right','down'].includes(this.direction)?lean:-lean;
      this.sprite.setX(this.anchor.x+shift);this.wateringCan.can.setX(this.wateringCan.can.x+shift);
      if(t<.26)this.sprite.stop().setFrame(DIRECTIONS.indexOf(this.direction)*9+6);
    }}
}
