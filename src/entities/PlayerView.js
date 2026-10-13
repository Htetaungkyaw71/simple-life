import {movementFacing} from '../systems/movement.js';
import {HeldWateringCan} from './HeldWateringCan.js';
import {groundShadow,SHADOW_DEPTH} from '../art/GroundShadow.js';
import {playerVisual} from '../data/appearance.js';
import {FARMER_HANDS} from '../data/farmerHands.js';
const DIRECTIONS=['down','up','left','right'];
export class PlayerView {
  constructor(scene,character){
    const {texture,offset,rig,key}=playerVisual(scene.app.state?.appearance,character);
    this.frameOffset=offset;this.texture=texture;this.rig=rig;
    this.scene=scene;
    this.sprite=scene.add.sprite(0,0,texture,offset).setOrigin(.5,rig.originY).setScale(rig.scale);this.anchor=scene.add.zone(0,0,1,1);this.shadow=groundShadow(scene,0,0,28,8);this.direction='down';this.character=key;
    this.wateringCan=new HeldWateringCan(scene,texture==='boy'?FARMER_HANDS:null);
    for(const [row,dir]of DIRECTIONS.entries()){
      const walk=`${this.character}-${dir}`,idle=`${this.character}-${dir}-idle`;
      if(!scene.anims.exists(walk))scene.anims.create({key:walk,frames:Array.from({length:rig.runFrames},(_,n)=>({key:texture,frame:offset+row*rig.columns+rig.runStart+n})),frameRate:rig.moveFrameRate,repeat:-1});
      if(!scene.anims.exists(idle))scene.anims.create({key:idle,frames:Array.from({length:rig.idleFrames[row]},(_,n)=>({key:texture,frame:offset+row*rig.columns+n})),frameRate:rig.idleFrameRate,repeat:-1});
    }
  }
  face(dx,dy){if(Math.abs(dx)+Math.abs(dy)<1)return;this.direction=movementFacing(dx,dy,this.direction);this.pose(false);}
  pose(moving){this.sprite.play(`${this.character}-${this.direction}${moving?'':'-idle'}`,true);}
  update(position,dx,dy,jump={height:0,frame:null},intent={x:dx,y:dy}){const rig=this.rig;if((intent.x||intent.y)&&!this.scene.app.pendingAttack&&!(this.scene.app.state?.selected==='axe'&&this.wateringCan.remaining>0))this.direction=movementFacing(intent.x,intent.y,this.direction);if(jump.frame!==null)this.sprite.stop().setFrame((this.frameOffset||0)+DIRECTIONS.indexOf(this.direction)*rig.columns+rig.jumpStart+jump.frame-6);else this.pose(!!(dx||dy));this.anchor.setPosition(Math.round(position.x),Math.round(position.y));this.shadow.setPosition(this.anchor.x,this.anchor.y-3).setDepth(SHADOW_DEPTH).setAlpha(jump.height>0?.13:.22).setVisible(!this.scene.atmosphere?.waterView?.wading||jump.frame!==null);this.sprite.setPosition(this.anchor.x,this.anchor.y-jump.height).setDepth(Math.round(position.y));this.wateringCan.update(this.anchor,this.direction,rig.toolScale,jump.height,!!(dx||dy),(Number(this.sprite.frame.name)-(this.frameOffset||0))%rig.columns);
    if(this.scene.app.state?.selected==='axe'&&this.wateringCan.remaining>0){
      const t=1-this.wateringCan.remaining/420,lean=t>.26&&t<.65?2:0;
      const shift=['right','down'].includes(this.direction)?lean:-lean;
      this.sprite.setX(this.anchor.x+shift);this.wateringCan.can.setX(this.wateringCan.can.x+shift);
      if(t<.26)this.sprite.stop().setFrame((this.frameOffset||0)+DIRECTIONS.indexOf(this.direction)*rig.columns+rig.jumpStart);
    }}
}
