import {movementFacing} from '../systems/movement.js';
import {HeldWateringCan} from './HeldWateringCan.js';
import {groundShadow,SHADOW_DEPTH} from '../art/GroundShadow.js';
import {playerVisual} from '../data/appearance.js';
import {farmerTexture} from '../art/farmerTexture.js';
import {FARMER_HANDS} from '../data/farmerHands.js';
import {GIRL_HANDS} from '../data/girlHands.js';
import {BOY_HANDS,BOY_CARRY_ANGLES} from '../data/revisedFarmer.js';
import {GIRL_V2_HANDS,GIRL_CARRY_ANGLES} from '../data/revisedGirl.js';
import {characterFrame} from '../systems/characterAnimation.js';
const DIRECTIONS=['down','up','left','right'];
export class PlayerView {
  constructor(scene,character){
    const {texture:baseTexture,offset,rig,key}=playerVisual(scene.app.state?.appearance,character);
    const texture=farmerTexture(scene,scene.app.state?.appearance,character);
    this.frameOffset=offset;this.texture=texture;this.rig=rig;
    this.carryProfile=rig.clips?{hands:baseTexture==='girl'?GIRL_V2_HANDS:BOY_HANDS,angles:baseTexture==='girl'?GIRL_CARRY_ANGLES:BOY_CARRY_ANGLES}:null;
    this.scene=scene;
    this.sprite=scene.add.sprite(0,0,texture,offset).setOrigin(.5,rig.originY).setScale(rig.scale);this.anchor=scene.add.zone(0,0,1,1);this.shadow=groundShadow(scene,0,0,28,8);this.direction='down';this.character=key;
    this.wateringCan=new HeldWateringCan(scene,rig.clips?Object.fromEntries(DIRECTIONS.map(dir=>[dir,this.carryProfile.hands[dir].idle])):texture==='boy'?FARMER_HANDS:texture==='girl'?GIRL_HANDS:null);
    this.motionElapsed=0;this.lastMotionTime=scene.time.now;
    if(rig.clips)return;
    for(const [row,dir]of DIRECTIONS.entries()){
      const walk=`${this.character}-${dir}`,idle=`${this.character}-${dir}-idle`;
      if(!scene.anims.exists(walk))scene.anims.create({key:walk,frames:Array.from({length:rig.runFrames},(_,n)=>({key:texture,frame:offset+row*rig.columns+rig.runStart+n})),frameRate:rig.moveFrameRate,repeat:-1});
      if(!scene.anims.exists(idle))scene.anims.create({key:idle,frames:Array.from({length:rig.idleFrames[row]},(_,n)=>({key:texture,frame:offset+row*rig.columns+n})),frameRate:rig.idleFrameRate,repeat:-1});
    }
  }
  face(dx,dy){if(Math.abs(dx)+Math.abs(dy)<1)return;this.direction=movementFacing(dx,dy,this.direction);this.pose(false);}
  pose(moving){
    if(this.rig.clips){
      const mode=moving?'running':'idle',key=mode+'-'+this.direction;
      if(key!==this.motionKey){this.motionKey=key;this.motionElapsed=0;}
      this.sprite.stop().setFrame(characterFrame(this.rig,mode,this.direction,this.motionElapsed).frame);return;
    }
    this.sprite.play(`${this.character}-${this.direction}${moving?'':'-idle'}`,true);
  }
  startAction(name){
    if(!this.rig.clips?.[name])return false;
    this.action={name,direction:this.direction,tool:this.scene.app.state.selected,elapsed:0};
    this.motionKey=null;this.wateringCan.remaining=0;
    this.wateringCan.can.setVisible(false);this.wateringCan.hand.setVisible(false);
    this.wateringCan.grip?.setVisible(false);
    this.sprite.stop().setFrame(characterFrame(this.rig,name,this.direction).frame);return true;
  }
  actionNozzle(){
    if(this.action?.name!=='watering')return null;
    const [x,y]={down:[20,-22],up:[20,-40],left:[-32,-26],right:[32,-26]}[this.action.direction];
    return {x:this.anchor.x+Math.round(x*this.rig.scale/2),y:this.anchor.y+Math.round(y*this.rig.scale/2)};
  }
  update(position,dx,dy,jump={height:0,frame:null},intent={x:dx,y:dy}){
    const rig=this.rig,moving=!!(dx||dy);
    if(rig.clips){
      const now=this.scene.time.now,delta=Math.max(0,Math.min(50,now-this.lastMotionTime));this.lastMotionTime=now;
      const active=!this.scene.app.paused&&!this.scene.app.transitioning&&!document.hidden;
      if(this.action&&(this.action.tool!==this.scene.app.state.selected||jump.frame!==null||moving&&this.action.name!=='attack'))this.action=null;
      if(active){this.motionElapsed+=delta;if(this.action)this.action.elapsed+=delta;}
      if(this.action&&characterFrame(rig,this.action.name,this.action.direction,this.action.elapsed).complete)this.action=null;
    }
    if((intent.x||intent.y)&&!this.action&&!this.scene.app.pendingAttack&&!(this.scene.app.state?.selected==='axe'&&this.wateringCan.remaining>0))this.direction=movementFacing(intent.x,intent.y,this.direction);
    if(jump.frame!==null){const frame=rig.clips?.jumping?characterFrame(rig,'jumping',this.direction,jump.elapsed||0).frame:(this.frameOffset||0)+DIRECTIONS.indexOf(this.direction)*rig.columns+rig.jumpStart+jump.frame-6;this.sprite.stop().setFrame(frame);}
    else if(this.action)this.sprite.stop().setFrame(characterFrame(rig,this.action.name,this.action.direction,this.action.elapsed).frame);
    else this.pose(moving);
    this.anchor.setPosition(Math.round(position.x),Math.round(position.y));this.shadow.setPosition(this.anchor.x,this.anchor.y-3).setDepth(SHADOW_DEPTH).setAlpha(jump.height>0?.13:.22).setVisible(!this.scene.atmosphere?.waterView?.wading||jump.frame!==null);this.sprite.setPosition(this.anchor.x,this.anchor.y-jump.height).setDepth(Math.round(position.y));
    const carryMode=jump.frame!==null?'jumping':moving?'running':'idle';
    if(rig.clips)this.wateringCan.sourceHands=Object.fromEntries(DIRECTIONS.map(dir=>[dir,(this.carryProfile?.hands||BOY_HANDS)[dir][carryMode]]));
    this.wateringCan.update(this.anchor,this.direction,rig.toolScale,jump.height,moving,(Number(this.sprite.frame.name)-(this.frameOffset||0))%rig.columns,!!this.action,rig.clips?carryMode:null);
    if(!rig.clips&&this.scene.app.state?.selected==='axe'&&this.wateringCan.remaining>0){
      const t=1-this.wateringCan.remaining/420,lean=t>.26&&t<.65?2:0;
      const shift=['right','down'].includes(this.direction)?lean:-lean;
      this.sprite.setX(this.anchor.x+shift);this.wateringCan.can.setX(this.wateringCan.can.x+shift);
      if(t<.26)this.sprite.stop().setFrame((this.frameOffset||0)+DIRECTIONS.indexOf(this.direction)*rig.columns+rig.jumpStart);
    }}
}
