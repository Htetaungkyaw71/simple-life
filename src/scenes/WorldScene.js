import {ForestView,forestNight} from '../art/ForestView.js';
import {combatRuntime,stepCombat} from '../systems/combat.js';
import {daylight} from '../systems/time.js';
import {ROOM} from '../data/interior.js';
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
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,ESC,ONE,TWO,THREE,Q,K');
    this.keys.Q.on('down',()=>this.app.cycleCrop());
    this.keys.ESC.on('down',()=>this.app.pause());
    this.keys.E.on('down',()=>this.app.use());for(const key of ['SPACE','K'])this.keys[key].on('down',()=>this.app.attack());
    for(const [key,tool]of [['ONE','seed'],['TWO','water'],['THREE','harvest']])this.keys[key].on('down',()=>{if(!this.app.paused)this.app.select(tool);});
    this.scale.on('resize',()=>this.resize());this.build();this.scene.launch('UI');
    this.input.on('pointerdown',p=>{
      const a=this.app;if(a.paused||a.state?.area!=='farm')return;
      const world=this.cameras.main.getWorldPoint(p.x,p.y);const index=FARM_PLOTS.findIndex(v=>Math.abs(v.x-world.x)<24&&Math.abs(v.y-world.y)<24);
      if(index<0)return;if(Math.hypot(FARM_PLOTS[index].x-a.state.position.x,FARM_PLOTS[index].y-a.state.position.y)>=60){a.ui.toast('Walk closer to that plot.');return;}
      this.targetPlot=(a.state.currentFarm||0)*PLOTS_PER_FARM+index;a.use();
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
    if(this.player){cam.startFollow(this.player.sprite,true,1,1);cam.centerOn(this.player.sprite.x,this.player.sprite.y);}
    else cam.centerOn(448,290);
  }
  build(){
    this.collisionWorld?.destroy();this.collisionWorld=null;this.cameras.main.stopFollow();this.tweens.killAll();this.children.removeAll(true);this.player=null;
    const s=this.app.state;this.targetPlot=null;this.plotPositions=visiblePlots(s||{farms:[{fields:[true,false,false,false]}]});drawWorld(this,s?.area||'farm');this.plots=this.add.group();this.renderCrops();
    if(s){this.collisionWorld=new CollisionWorld(this,s.area);this.player=new PlayerView(this,s.character);this.player.update(s.position,0,0);}
    this.plotOutline=this.add.graphics().setDepth(1800);
    this.marker=this.add.image(0,0,'world','marker').setScale(2).setDepth(1900).setVisible(false);
    this.combat=combatRuntime();this.forestView=new ForestView(this);
    this.atmosphere=new Atmosphere(this,s?.area||'farm');
    const light=daylight(s||{minute:720});this.night=s?.area==='forest'?this.add.graphics().setDepth(3000):this.add.rectangle(-MAP_SIZE.width,-MAP_SIZE.height,MAP_SIZE.width*3,MAP_SIZE.height*3,light.color,1).setOrigin(0).setAlpha(light.alpha).setDepth(3000);
    if(s)this.atmosphere.update(0,false,s.position);
    this.resize();
  }
  renderCrops(){if(this.app.state?.area==='farm'||!this.app.state)drawPlots(this,this.app.state?.plots,this.plots);}
  context(){return contextFor(this.app.state,this.targetPlot,this.player?.direction);}
  faceContext(c){this.player?.face(c.x-this.app.state.position.x,c.y-this.app.state.position.y);this.atmosphere.feedback(c.x,c.y);}
  update(_,delta){
    const a=this.app,s=a.state;if(!s||a.transitioning)return;let dx=0,dy=0;
    if(!a.paused&&!document.hidden){
      const x=(this.keys.D.isDown||this.keys.RIGHT.isDown||a.input.right?1:0)-(this.keys.A.isDown||this.keys.LEFT.isDown||a.input.left?1:0);
      const y=(this.keys.S.isDown||this.keys.DOWN.isDown||a.input.down?1:0)-(this.keys.W.isDown||this.keys.UP.isDown||a.input.up?1:0);
      const len=Math.hypot(x,y)||1,step=WORLD.speed*(s.area==='interior'?.5:1)*Math.min(delta,50)/1000;const nx=s.position.x+x/len*step,ny=s.position.y+y/len*step;
      if(this.collisionWorld.canMove(nx,s.position.y)){dx=nx-s.position.x;s.position.x=nx;}if(this.collisionWorld.canMove(s.position.x,ny)){dy=ny-s.position.y;s.position.y=ny;}if(dx||dy)this.targetPlot=null;a.advance(delta);const edge=readyEdgeTravel(s,this.time.now,this.travelReady||0);if(edge){a.travel(edge);return;}
    }
    if(!a.paused&&!document.hidden){const result=stepCombat(s,this.combat,delta);if(result.hurt){this.forestView.hurt();a.ui.feedback('Ouch / -15 health');a.sound('combat:hurt');a.save();}if(result.dead){a.defeat();return;}a.forestGuidance();}
    this.player?.update(s.position,dx,dy);
    if(!a.paused)this.forestView.update(Math.min(delta,50),this.combat);
    if(!a.paused)this.atmosphere.update(this.time.now,!!(dx||dy),s.position);
    const light=daylight(s);if(s.area==='forest')forestNight(this.night,s,light);else this.night.setFillStyle(light.color).setAlpha(light.alpha);
    const c=this.context();this.plotOutline.clear();if(c?.type==='plot'&&!a.paused){this.plotOutline.lineStyle(2,0xffe9a7,.85);for(const [sx,sy]of [[-1,-1],[1,-1],[-1,1],[1,1]]){const x=c.x+sx*23,y=c.y+sy*23;this.plotOutline.lineBetween(x,y,x-sx*12,y);this.plotOutline.lineBetween(x,y,x,y-sy*12);}}this.marker.setVisible(!!c&&c.type!=='plot'&&!a.paused);if(c)this.marker.setPosition(c.x,c.y-52-Math.floor(Math.sin(this.time.now/240)*2)*2);
  }
}
