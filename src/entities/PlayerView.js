import {movementFacing} from '../systems/movement.js';
import {HeldWateringCan} from './HeldWateringCan.js';
import {groundShadow,SHADOW_DEPTH} from '../art/GroundShadow.js';
import {appearanceIndex,PEOPLE} from '../data/appearance.js';
const DIRECTIONS=['down','up','left','right'];
export class PlayerView {
  constructor(scene,character){
    const index=appearanceIndex(scene.app.state?.appearance),texture=scene.app.state?.appearance?'appearance':character,offset=texture==='appearance'?index*PEOPLE.frames:0;
    this.frameOffset=offset;this.texture=texture;
    this.scene=scene;
    this.sprite=scene.add.sprite(0,0,texture,offset).setOrigin(.5,PEOPLE.originY).setScale(PEOPLE.scale);this.anchor=scene.add.zone(0,0,1,1);this.shadow=groundShadow(scene,0,0,28,8);this.direction='down';this.character=texture==='appearance'?`avatar-${index}`:character;
    this.wateringCan=new HeldWateringCan(scene);
    for(const [row,dir]of DIRECTIONS.entries()){
      const walk=`${this.character}-${dir}`,idle=`${this.character}-${dir}-idle`;
      if(!scene.anims.exists(walk))scene.anims.create({key:walk,frames:Array.from({length:PEOPLE.runFrames},(_,n)=>({key:texture,frame:offset+row*PEOPLE.columns+PEOPLE.runStart+n})),frameRate:12,repeat:-1});
      if(!scene.anims.exists(idle))scene.anims.create({key:idle,frames:Array.from({length:PEOPLE.idleFrames[row]},(_,n)=>({key:texture,frame:offset+row*PEOPLE.columns+n})),frameRate:8,repeat:-1});
    }
  }
  face(dx,dy){if(Math.abs(dx)+Math.abs(dy)<1)return;this.direction=movementFacing(dx,dy,this.direction);this.pose(false);}
  pose(moving){this.sprite.play(`${this.character}-${this.direction}${moving?'':'-idle'}`,true);}
  update(position,dx,dy,jump={height:0,frame:null},intent={x:dx,y:dy}){if((intent.x||intent.y)&&!this.scene.app.pendingAttack&&!(this.scene.app.state?.selected==='axe'&&this.wateringCan.remaining>0))this.direction=movementFacing(intent.x,intent.y,this.direction);if(jump.frame!==null)this.sprite.stop().setFrame((this.frameOffset||0)+DIRECTIONS.indexOf(this.direction)*PEOPLE.columns+PEOPLE.jumpStart+jump.frame-6);else this.pose(!!(dx||dy));this.anchor.setPosition(Math.round(position.x),Math.round(position.y));this.shadow.setPosition(this.anchor.x,this.anchor.y-3).setDepth(SHADOW_DEPTH).setAlpha(jump.height>0?.13:.22).setVisible(!this.scene.atmosphere?.waterView?.wading||jump.frame!==null);this.sprite.setPosition(this.anchor.x,this.anchor.y-jump.height).setDepth(Math.round(position.y));this.wateringCan.update(this.anchor,this.direction,PEOPLE.toolScale,jump.height,!!(dx||dy),(Number(this.sprite.frame.name)-(this.frameOffset||0))%PEOPLE.columns);
    if(this.scene.app.state?.selected==='axe'&&this.wateringCan.remaining>0){
      const t=1-this.wateringCan.remaining/420,lean=t>.26&&t<.65?2:0;
      const shift=['right','down'].includes(this.direction)?lean:-lean;
      this.sprite.setX(this.anchor.x+shift);this.wateringCan.can.setX(this.wateringCan.can.x+shift);
      if(t<.26)this.sprite.stop().setFrame((this.frameOffset||0)+DIRECTIONS.indexOf(this.direction)*PEOPLE.columns+PEOPLE.jumpStart);
    }}
}
