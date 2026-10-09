import {CityLights} from '../art/CityLights.js';
import {ResidentView} from '../art/ResidentView.js';
import {refreshVegetationVisuals} from '../art/VegetationView.js';
import {VEGETATION} from '../data/vegetation.js';
import {groundPoint} from '../systems/farmGround.js';
import {drawWetGround} from '../art/FarmView.js';
import {KEY_ACTIONS,keyboardAction,touchJumpTap} from '../data/controls.js';
import {GrassView} from '../art/GrassView.js';
import {jumpRuntime,beginJump,stepJump,jumpPose,cancelJump} from '../systems/jump.js';
import {forestRegion} from '../data/forest.js';
import {ForestView,forestNight} from '../art/ForestView.js';
import {combatRuntime,stepCombat} from '../systems/combat.js';
import {daylight} from '../systems/time.js';
import {ROOM} from '../data/interior.js';
import {LOCATIONS} from '../data/locations.js';
import {shopOpen} from '../systems/market.js';
import {readyEdgeTravel,syncInterior,nearestSafe} from '../data/locations.js';
import Phaser from 'phaser';
import { CollisionWorld } from '../physics/CollisionWorld.js';
import { contextFor } from '../systems/context.js';
import { MAP_SIZE,MAPS } from '../data/mapLayouts.js';
import { displayZoom } from './displayScale.js';
import { Atmosphere } from '../art/Atmosphere.js';
import { WORLD } from '../config.js';

import {FARM_PLOTS,PLOTS_PER_FARM} from '../data/farms.js';
import {visiblePlots} from '../systems/expansion.js';
import { drawWorld,drawPlots } from '../art/worldArt.js';
import { PlayerView } from '../entities/PlayerView.js';
export class WorldScene extends Phaser.Scene {
  constructor(app){super('World');this.app=app;this.plotPositions=[];}
  preload(){
    const base=import.meta.env.BASE_URL+'assets/pixel/';
    this.load.atlas('world',base+'world.png',base+'world.json');
    this.load.atlas('town',base+'processed/town.png',base+'processed/town.json');
    for(const char of ['boy','girl'])this.load.spritesheet(char,base+'processed/'+char+'.png',{frameWidth:24,frameHeight:32});
    this.load.bitmapFont('pixel',base+'font.png',base+'font.xml');
    const text=this.add.text(20,20,'Loading Simple Life...',{fontFamily:'monospace',fontSize:'16px',color:'#e1d7ad'});
    this.load.on('complete',()=>text.destroy());
  }
  create(){
    for(const name of ['world','town','boy','girl','pixel'])this.textures.get(name).setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,ESC,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,Q,K,M,J,SHIFT,B');
    for(const key of Object.keys(KEY_ACTIONS))this.keys[key].on('down',(_,event)=>{const action=keyboardAction(key,this.app.state?.area,{paused:this.app.paused,repeat:event?.repeat,transitioning:this.app.transitioning});if(action==='jump')this.jump();else if(action==='attack')this.app.attack();else if(action==='map')this.app.wildernessMap.open();else if(action==='bag')this.app.bagPanel.open('seeds');});
    this.keys.Q.on('down',()=>this.app.cycleCrop());
    this.keys.ESC.on('down',()=>this.app.pause());
    this.keys.E.on('down',()=>this.app.use());
    for(const [key,tool]of [['ONE','seed'],['TWO','water'],['THREE','harvest'],['FOUR','shovel'],['FIVE','axe'],['SIX','hand'],['SEVEN','grass']])this.keys[key].on('down',()=>{if(!this.app.paused)this.app.select(tool);});
    this.scale.on('resize',()=>this.resize());this.build();this.scene.launch('UI');
    this.input.on('pointerdown',p=>{
      const a=this.app;if(a.paused||!a.state||a.transitioning)return;
      const world=this.cameras.main.getWorldPoint(p.x,p.y),context=this.touchContext(world);
      if(context){this.lastGroundTap=null;a.use(context);return;}
      if(a.state.area==='forest'&&p.wasTouch&&['seed','harvest'].includes(a.state.selected)){const tap=touchJumpTap(this.lastGroundTap,p,this.time.now);this.lastGroundTap=tap.tap;if(tap.jump)this.jump();return;}
      if(['axe','hand','grass'].includes(a.state?.selected)){let target=world;
        if(a.state.selected==='axe')for(const [id,sprites]of this.vegetationVisuals){const n=VEGETATION[a.state.area].byId.get(id),sprite=sprites.at(-1);if(id.startsWith('tree:')&&Math.hypot(n.x-a.state.position.x,n.y-a.state.position.y)<72&&sprite.getBounds().contains(world.x,world.y)){target=n;break;}}
        this.targetGround=target;this.targetPlot=null;a.use();return;}
      if(['water','shovel'].includes(a.state?.selected)){
        const point=groundPoint(a.state,world);if(Math.hypot(point.x-a.state.position.x,point.y-a.state.position.y)>=72){a.ui.toast('Walk closer');return;}
        this.targetGround=point;this.targetPlot=null;a.use();return;
      }
      if(a.state?.area!=='farm')return;
      const bed=visiblePlots(a.state).find(v=>Math.abs(v.x-world.x)<24&&Math.abs(v.y-world.y)<24);
      if(!bed)return;if(Math.hypot(bed.x-a.state.position.x,bed.y-a.state.position.y)>=60){a.ui.toast('Walk closer');return;}
      this.targetPlot=bed.index;this.targetGround=null;a.use();
    });
  }
  resize(){
    const cam=this.cameras.main;cam.setZoom(displayZoom(this.scale.width,this.scale.height));const size=MAPS[this.app.state?.area||'farm'].size||MAP_SIZE;cam.setBounds(-Math.max(0,(this.scale.width-size.width)/2),-Math.max(0,(this.scale.height-size.height)/2),Math.max(size.width,this.scale.width),Math.max(size.height,this.scale.height));cam.roundPixels=true;
    if(this.app.state?.area==='interior'){
      const old={w:ROOM.width,h:ROOM.height},p=this.app.state.position;
      if(syncInterior(this.scale.width,this.scale.height)){
        this.app.state.position=nearestSafe('interior',{x:p.x*ROOM.width/old.w,y:p.y*ROOM.height/old.h});this.build();return;
      }
      cam.setZoom(2);const vw=this.scale.width/2,vh=this.scale.height/2;
      cam.setBounds(-Math.max(8,(vw-ROOM.width)/2),-Math.max(24,(vh-ROOM.height)/2),Math.max(vw,ROOM.width+16),Math.max(vh,ROOM.height+48));
      if(this.scale.width>=1000&&this.scale.height>=600){cam.stopFollow();cam.centerOn(ROOM.width/2,ROOM.height/2);return;}
    }
    if(this.player){cam.startFollow(this.player.anchor,true,1,1);cam.centerOn(this.player.anchor.x,this.player.anchor.y);}
    else cam.centerOn(448,290);
  }
  build(){
    this.collisionWorld?.destroy();this.collisionWorld=null;this.cameras.main.stopFollow();this.tweens.killAll();this.children.removeAll(true);this.player=null;
    const s=this.app.state;this.targetPlot=null;this.targetGround=null;this.plotPositions=visiblePlots(s||{farms:[{fields:[true,false,false,false]}]});drawWorld(this,s?.area||'farm');this.plots=this.add.group();this.wetPatches=this.add.group();this.wetSignature='';this.renderCrops();
    if(s){this.collisionWorld=new CollisionWorld(this,s.area);this.player=new PlayerView(this,s.character);this.player.update(s.position,0,0);}
    this.plotOutline=this.add.graphics().setDepth(1800);
    this.marker=this.add.image(0,0,'world','marker').setScale(2).setDepth(10001).setVisible(false);
    this.lastGroundTap=null;this.jumping=jumpRuntime();this.grass=new GrassView(this,MAPS[s?.area||'farm']);
    this.combat=combatRuntime();this.forestView=new ForestView(this);
    this.residents=new ResidentView(this,s?.area||'farm');
    this.atmosphere=new Atmosphere(this,s?.area||'farm');
    const light=daylight(s||{minute:720});this.night=s?.area==='forest'?this.add.graphics().setDepth(10000):this.add.rectangle(-MAP_SIZE.width,-MAP_SIZE.height,MAP_SIZE.width*3,MAP_SIZE.height*3,light.color,1).setOrigin(0).setAlpha(light.alpha).setDepth(10000);
    this.cityLights=new CityLights(this,s?.area||'farm');this.cityLights.update(light);
    if(s)this.atmosphere.update(0,false,s.position);
    this.resize();
  }
  refreshVegetation(chopped=false){
    refreshVegetationVisuals(this);
    if(chopped&&this.app.state.area!=='forest'){this.collisionWorld.destroy();this.collisionWorld=new CollisionWorld(this,this.app.state.area);}
  }
  renderCrops(){if(this.app.state?.area==='farm'||!this.app.state){this.plotPositions=visiblePlots(this.app.state||{farms:[{fields:[true,false,false,false]}]});drawPlots(this,this.app.state?.plots,this.plots);}this.renderWetGround();}
  renderWetGround(){const s=this.app.state;if(!s)return;const signature=(s.wetGround||[]).filter(p=>p.area===s.area&&(s.area!=='farm'||p.farm===(s.currentFarm||0))).map(p=>p.x+','+p.y).join(';');if(signature!==this.wetSignature){this.wetSignature=signature;drawWetGround(this,this.wetPatches);if(s.area==='farm')drawPlots(this,s.plots,this.plots);}}
  touchContext(world){
    const s=this.app.state;
    for(const n of this.residents.people){if(!n.visible||!n.sprite.getBounds().contains(world.x,world.y))continue;
      if(Math.hypot(n.position.x-s.position.x,n.position.y-s.position.y)>=72)return {...n.position,type:'hint',label:'Walk closer'};
      if(n.kind){const c=LOCATIONS[s.area].interactions.find(c=>c.type===n.kind);if(c.approach){const [x,y,w,h]=c.approach;if(s.position.x<x||s.position.x>x+w||s.position.y<y||s.position.y>y+h)return {...n.position,type:'hint',label:'Walk closer'};}return n.mode==='work'&&shopOpen(s,n.kind)?c:{...n.position,type:'hint',label:'Shop closed'};}
      return {...n.position,type:'dialog',label:'Talk to '+n.name,title:n.name,body:n.body};
    }
    const c=this.context();if(c&&!['plot','dig','waterGround','chop','gatherGrass','placeGrass'].includes(c.type)&&Math.hypot(world.x-c.x,world.y-c.y)<(c.type==='travel'?96:64))return c;
    return null;
  }
  context(){if(!this.app.state)return null;const c=contextFor(this.app.state,this.targetPlot,this.player?.direction,this.targetGround);if(['seed','sell','outfitter'].includes(c?.type)&&!this.residents?.available(c.type))return {...c,type:'hint',label:'Shop closed'};return c||this.residents?.context(this.app.state.position);}
  faceContext(c){this.player?.face(c.x-this.app.state.position.x,c.y-this.app.state.position.y);this.atmosphere.feedback(c.x,c.y);}
  jump(){
    const a=this.app;if(!a.state||a.paused||a.transitioning||document.hidden)return;
    const x=(this.keys.D.isDown||this.keys.RIGHT.isDown||a.input.right?1:0)-(this.keys.A.isDown||this.keys.LEFT.isDown||a.input.left?1:0);
    const y=(this.keys.S.isDown||this.keys.DOWN.isDown||a.input.down?1:0)-(this.keys.W.isDown||this.keys.UP.isDown||a.input.up?1:0);
    const facing={down:{x:0,y:1},up:{x:0,y:-1},left:{x:-1,y:0},right:{x:1,y:0}};
    beginJump(a.state,this.jumping,x||y?{x,y}:facing[this.player.direction]);
  }
  update(_,delta){
    const a=this.app,s=a.state;if(!s||a.transitioning)return;let dx=0,dy=0;
    if(!a.paused&&!document.hidden){
      const x=(this.keys.D.isDown||this.keys.RIGHT.isDown||a.input.right?1:0)-(this.keys.A.isDown||this.keys.LEFT.isDown||a.input.left?1:0);
      const y=(this.keys.S.isDown||this.keys.DOWN.isDown||a.input.down?1:0)-(this.keys.W.isDown||this.keys.UP.isDown||a.input.up?1:0);
      const len=Math.hypot(x,y)||1,step=WORLD.speed*(s.area==='interior'?.5:1)*Math.min(delta,50)/1000;const nx=s.position.x+x/len*step,ny=s.position.y+y/len*step;
      const wasJumping=!!this.jumping.active,old={...s.position};stepJump(s,this.jumping,delta);
      if(wasJumping){dx=s.position.x-old.x;dy=s.position.y-old.y;}
      else {if(this.collisionWorld.canMove(nx,s.position.y)&&this.residents.canMove(s.position,{x:nx,y:s.position.y})){dx=nx-s.position.x;s.position.x=nx;}if(this.collisionWorld.canMove(s.position.x,ny)&&this.residents.canMove(s.position,{x:s.position.x,y:ny})){dy=ny-s.position.y;s.position.y=ny;}}if(dx||dy){this.targetPlot=null;this.targetGround=null;}a.advance(delta);const edge=readyEdgeTravel(s,this.time.now,this.travelReady||0);if(edge&&!this.jumping.active){a.travel(edge);return;}
    }
    if(!a.paused&&!document.hidden){const result=stepCombat(s,this.combat,delta);if(result.hurt){cancelJump(s,this.jumping);this.forestView.hurt();a.ui.feedback('Ouch / -'+result.damage+' health');a.sound('combat:hurt');a.save();}if(result.dead){a.defeat();return;}a.forestGuidance();if(s.area==='forest'){const region=forestRegion(s.position);if(!s.forest.explored.includes(region.id)){s.forest.explored.push(region.id);a.save();a.ui.toast(region.name+' / danger '+region.danger+'/5. Open MAP for trails.');}}}
    this.player?.update(s.position,dx,dy,jumpPose(this.jumping));
    if(!a.paused){this.grass.update(Math.min(delta,50),s.position,!!this.jumping.active);}
    if(!a.paused)this.forestView.update(Math.min(delta,50),this.combat);
    if(!a.paused)this.residents.update(Math.min(delta,50),s.position);
    if(!a.paused)this.atmosphere.update(this.time.now,!!(dx||dy),s.position,Math.min(delta,50));
    const light=daylight(s);if(s.area==='forest')forestNight(this.night,s,light);else this.night.setFillStyle(light.color).setAlpha(light.alpha);
    this.cityLights.update(light);
    this.renderWetGround();const c=this.context();this.plotOutline.clear();if(['plot','dig','waterGround'].includes(c?.type)&&!a.paused){this.plotOutline.lineStyle(2,0xffe9a7,.85);for(const [sx,sy]of [[-1,-1],[1,-1],[-1,1],[1,1]]){const x=c.x+sx*23,y=c.y+sy*23;this.plotOutline.lineBetween(x,y,x-sx*12,y);this.plotOutline.lineBetween(x,y,x,y-sy*12);}}this.marker.setVisible(!!c&&!['plot','dig','waterGround'].includes(c.type)&&!a.paused);if(c)this.marker.setPosition(c.x,c.y-52-Math.floor(Math.sin(this.time.now/240)*2)*2);
  }
}
