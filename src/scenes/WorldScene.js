import {PEOPLE,GIRL_FARMER,BOY_FARMER} from '../data/appearance.js';
import {wateringPreview} from '../systems/wateringCan.js';
import {simulationActive} from '../systems/time.js';
import {placedDecorationAt} from '../systems/settlement.js';
import {resizeRoomDecor} from '../systems/roomDecor.js';
import {PlacementView} from '../art/PlacementView.js';
import {TreeProgressView} from '../art/TreeProgressView.js';
import {screenAttackAllowed} from '../systems/screenAttack.js';
import {movementVector} from '../systems/movement.js';
import {CityLights} from '../art/CityLights.js';
import {ResidentView} from '../art/ResidentView.js';
import {refreshVegetationVisuals} from '../art/VegetationView.js';
import {TREE_REACH} from '../systems/vegetation.js';
import {VEGETATION} from '../data/vegetation.js';
import {groundPoint} from '../systems/farmGround.js';
import {drawWetGround} from '../art/FarmView.js';
import {KEY_ACTIONS,keyboardAction} from '../data/controls.js';
import {GrassView} from '../art/GrassView.js';
import {jumpRuntime,beginJump,stepJump,jumpPose,cancelJump} from '../systems/jump.js';
import {forestRegion} from '../data/forest.js';
import {ForestView,forestNight} from '../art/ForestView.js';
import {combatRuntime,stepCombat} from '../systems/combat.js';
import {worldLight} from '../art/worldLight.js';
import {drawHomeKeepsake} from '../art/HomeKeepsake.js';
import {daylight} from '../systems/time.js';
import {ROOM} from '../data/interior.js';
import {LOCATIONS} from '../data/locations.js';
import {SHOP_ROOMS} from '../data/cityShops.js';
import {isIndoorArea} from '../data/areas.js';
import {shopOpen} from '../systems/market.js';
import {readyEdgeTravel,syncInterior,nearestSafe} from '../data/locations.js';
import Phaser from 'phaser';
import { CollisionWorld } from '../physics/CollisionWorld.js';
import { contextFor } from '../systems/context.js';
import { MAP_SIZE,MAPS } from '../data/mapLayouts.js';
import { displayZoom } from './displayScale.js';
import {forestPortalTravel} from '../data/forestLandmarks.js';
import {ForestPortalView} from '../art/ForestPortalView.js';
import { Atmosphere } from '../art/Atmosphere.js';
import { WORLD } from '../config.js';

import {FARM_PLOTS,PLOTS_PER_FARM} from '../data/farms.js';
import {visiblePlots} from '../systems/expansion.js';
import { drawWorld,drawPlots } from '../art/worldArt.js';
import { PlayerView } from '../entities/PlayerView.js';
import {controlAtPoint} from '../ui/focus.js';
import {updateLoadingScreen} from '../ui/loadingScreen.js';
export class WorldScene extends Phaser.Scene {
  constructor(app){super('World');this.app=app;this.plotPositions=[];}
  preload(){
    const base=import.meta.env.BASE_URL+'assets/pixel/';
    this.load.atlas('world',base+'world.png',base+'world.json');
    this.load.atlas('town',base+'processed/town.png',base+'processed/town.json');
    this.load.atlas('cityBuildings',base+'processed/city-buildings.png',base+'processed/city-buildings.json');
    this.load.atlas('homeInterior',base+'processed/home-interior.png',base+'processed/home-interior.json');
    this.load.atlas('pixelSnapper',base+'processed/pixel-snapper-assets.png',base+'processed/pixel-snapper-assets.json');
    this.load.image('grassGroundA',base+'processed/grass-ground-a.png');
    this.load.image('grassGroundB',base+'processed/grass-ground-b.png');
    this.load.image('grassGroundC',base+'processed/grass-ground-c.png');
    this.load.image('welcomeMysticalRiver',base+'processed/welcome-mystical-river.png');
    this.load.spritesheet('grassClumps',base+'processed/grass-clumps.png',{frameWidth:48,frameHeight:48,endFrame:2});
    this.load.spritesheet('fountainIsland',base+'processed/fountain-island.png',{frameWidth:207,frameHeight:214,endFrame:7});
    for(const char of ['boy','girl','appearance']){const rig=char==='appearance'?PEOPLE:char==='boy'?BOY_FARMER:GIRL_FARMER;this.load.spritesheet(char,base+'processed/'+char+'.png',{frameWidth:rig.width,frameHeight:rig.height});}
    this.load.bitmapFont('pixel',base+'font.png',base+'font.xml');
    for(const name of ['thaleah','m5x7'])this.load.bitmapFont(name,base+'fonts/'+name+'.png',base+'fonts/'+name+'.xml');
    this.load.on('progress',value=>updateLoadingScreen(.08+value*.88));
    this.load.once('complete',()=>updateLoadingScreen(.98,'Opening the front door…'));
  }
  create(){
    for(const name of ['world','town','cityBuildings','homeInterior','pixelSnapper','fountainIsland','grassGroundA','grassGroundB','grassGroundC','welcomeMysticalRiver','grassClumps','boy','girl','appearance','pixel','thaleah','m5x7'])this.textures.get(name).setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,ESC,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,Q,K,M,J,SHIFT,B,R');
    for(const key of Object.keys(KEY_ACTIONS))this.keys[key].on('down',(_,event)=>{const action=keyboardAction(key,this.app.state?.area,{paused:this.app.paused,repeat:event?.repeat,transitioning:this.app.transitioning});if(action==='jump')this.jump();else if(action==='attack')this.app.attack();else if(action==='map')this.app.wildernessMap.open();else if(action==='bag')this.app.bagPanel.open('seeds');});
    this.keys.Q.on('down',()=>this.app.cycleCrop());
    this.keys.ESC.on('down',()=>!this.app.paused&&this.app.placement.draft?this.app.placement.cancel():this.app.pause());
    this.keys.R.on('down',()=>{if(!this.app.paused)this.app.placement.turn();});
    for(const [key,dx,dy]of [['UP',0,-1],['DOWN',0,1],['LEFT',-1,0],['RIGHT',1,0]])this.keys[key].on('down',()=>{if(!this.app.paused)this.app.placement.nudge(dx,dy);});
    this.keys.E.on('down',()=>this.app.use());
    for(const [key,tool]of [['ONE','seed'],['TWO','water'],['THREE','harvest'],['FOUR','shovel'],['FIVE','axe'],['SIX','hand'],['SEVEN','grass']])this.keys[key].on('down',()=>{if(!this.app.paused)this.app.select(tool);});
    this.scale.on('resize',()=>this.resize());this.build();this.scene.launch('UI');
    this.input.on('pointerdown',p=>{
      const a=this.app;if(a.paused||!a.state||a.transitioning)return;
      if(controlAtPoint(a.ui?.controls||[],p.x,p.y))return;
      const world=this.cameras.main.getWorldPoint(p.x,p.y);if(a.placement.draft){a.placement.move(world);this.placementPointer=p.id;return;}
      // Decoration selection opens choices on mouse and touch; it never removes a piece.
      const piece=placedDecorationAt(a.state,world);if(piece){a.placement.inspect(piece);return;}
      // Other mobile gameplay uses the contextual action button.
      if(!screenAttackAllowed(p.wasTouch||a.ui.mobileInput))return;const context=this.touchContext(world);
      if(context){a.use(context);return;}
      if(a.state.selected==='axe'){
        // A tapped trunk still harvests wood; other world taps swing toward the pointer.
        for(const [id,sprites]of this.vegetationVisuals){const n=VEGETATION[a.state.area].byId.get(id),sprite=sprites.at(-1);
          if(id.startsWith('tree:')&&Math.hypot(n.x-a.state.position.x,n.y-a.state.position.y)<TREE_REACH&&sprite.getBounds().contains(world.x,world.y)){
            this.targetGround=n;this.targetPlot=null;a.use({...n,type:'chop'});return;
          }
        }
        this.targetGround=null;this.targetPlot=null;this.player.face(world.x-a.state.position.x,world.y-a.state.position.y);a.attack();return;
      }
      if(['hand','grass','decorate'].includes(a.state.selected)){this.targetGround=world;this.targetPlot=null;a.use();return;}
      if(['water','shovel'].includes(a.state?.selected)){
        const point=groundPoint(a.state,world);if(Math.hypot(point.x-a.state.position.x,point.y-a.state.position.y)>=72){a.ui.toast('Walk closer');return;}
        this.targetGround=point;this.targetPlot=null;a.use();return;
      }
      if(a.state?.area!=='farm')return;
      const bed=visiblePlots(a.state).find(v=>Math.abs(v.x-world.x)<24&&Math.abs(v.y-world.y)<24);
      if(!bed)return;if(Math.hypot(bed.x-a.state.position.x,bed.y-a.state.position.y)>=60){a.ui.toast('Walk closer');return;}
      this.targetPlot=bed.index;this.targetGround=null;a.use();
    });
    this.input.on('pointermove',p=>{if(!this.app.paused&&this.app.placement.draft&&p.id===this.placementPointer&&p.isDown)this.app.placement.move(this.cameras.main.getWorldPoint(p.x,p.y));});
    this.input.on('pointerup',()=>{this.placementPointer=null;});
  }
  resize(){
    const cam=this.cameras.main,coarse=matchMedia('(pointer:coarse)').matches;cam.setZoom(displayZoom(this.scale.width,this.scale.height,coarse));const size=MAPS[this.app.state?.area||'farm'].size||MAP_SIZE;cam.setBounds(-Math.max(0,(this.scale.width-size.width)/2),-Math.max(0,(this.scale.height-size.height)/2),Math.max(size.width,this.scale.width),Math.max(size.height,this.scale.height));cam.roundPixels=true;
    if(this.app.state?.area==='interior'){
      const old={w:ROOM.width,h:ROOM.height},p=this.app.state.position;
      if(syncInterior(this.scale.width,this.scale.height)){
        // Room resizing can replace the original piece. End its transient preview first.
        if(this.app.placement.original){this.app.placement.draft=null;this.app.placement.original=null;}
        const packed=resizeRoomDecor(this.app.state,{width:old.w,height:old.h});this.app.state.position=nearestSafe('interior',{x:p.x*ROOM.width/old.w,y:p.y*ROOM.height/old.h},this.app.state);this.build();this.app.save();if(packed)this.app.ui.toast(packed+' room pieces packed in Bag / Gear');return;
      }
      const zoom=this.app.ui.touch?1:displayZoom(this.scale.width,this.scale.height,coarse);cam.setZoom(zoom);const vw=this.scale.width/zoom,vh=this.scale.height/zoom;
      cam.setBounds(-Math.max(8,(vw-ROOM.width)/2),-Math.max(24,(vh-ROOM.height)/2),Math.max(vw,ROOM.width+16),Math.max(vh,ROOM.height+48));
      if(this.scale.width>=1000&&this.scale.height>=600){cam.stopFollow();cam.centerOn(ROOM.width/2,ROOM.height/2);return;}
    }
    const shop=SHOP_ROOMS[this.app.state?.area];if(shop){const zoom=this.app.ui.touch?1:displayZoom(this.scale.width,this.scale.height,coarse),vw=this.scale.width/zoom,vh=this.scale.height/zoom;cam.setZoom(zoom);cam.setBounds(-Math.max(8,(vw-shop.width)/2),-Math.max(24,(vh-shop.height)/2),Math.max(vw,shop.width+16),Math.max(vh,shop.height+48));if(this.scale.width>=1000&&this.scale.height>=600){cam.stopFollow();cam.centerOn(shop.width/2,shop.height/2);return;}}
    if(this.player){cam.startFollow(this.player.anchor,true,1,1);cam.centerOn(this.player.anchor.x,this.player.anchor.y);}
    else cam.centerOn(448,290);
  }
  build(){
    this.app.pendingAttack=null;this.collisionWorld?.destroy();this.collisionWorld=null;this.cameras.main.stopFollow();this.tweens.killAll();this.children.removeAll(true);this.player=null;this.impactStop=0;
    const s=this.app.state;this.targetPlot=null;this.targetGround=null;this.plotPositions=visiblePlots(s||{farms:[{fields:[true,false,false,false]}]});drawWorld(this,s?.area||'farm');this.plots=this.add.group();this.wetPatches=this.add.group();this.wetSignature='';this.renderCrops();this.portal=s?.area==='forest'?new ForestPortalView(this):null;
    if(s){this.collisionWorld=new CollisionWorld(this,s.area);this.player=new PlayerView(this,s.character);this.player.update(s.position,0,0);}
    this.plotOutline=this.add.graphics().setDepth(1800);
    this.marker=this.add.image(0,0,'world','marker').setScale(2).setDepth(10001).setVisible(false);
    this.treeProgress=new TreeProgressView(this);this.placementView=new PlacementView(this);
    this.lastGroundTap=null;this.jumping=jumpRuntime();this.grass=new GrassView(this,MAPS[s?.area||'farm']);
    this.combat=combatRuntime();this.forestView=new ForestView(this);
    this.residents=new ResidentView(this,s?.area||'farm');
    this.atmosphere=new Atmosphere(this,s?.area||'farm');
    drawHomeKeepsake(this,s);const light=worldLight(s||{area:'home',minute:720});this.night=s?.area==='forest'?this.add.graphics().setDepth(10000):this.add.rectangle(-MAP_SIZE.width,-MAP_SIZE.height,MAP_SIZE.width*3,MAP_SIZE.height*3,light.color,1).setOrigin(0).setAlpha(light.alpha).setDepth(10000);
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
    if(s.area==='forest'&&s.selected==='axe')for(const n of [...this.forestView.animals,...this.forestView.woodland.animals]){
      if(!n.sprite.visible||!n.sprite.getBounds().contains(world.x,world.y))continue;
      const id=n.definition?.id||n.id,animal=s.forest.animals[id]||s.forest.woodland[id];
      return Math.hypot(animal.position.x-s.position.x,animal.position.y-s.position.y)<80?{type:'hunt',id,...animal.position}:{...animal.position,type:'hint',label:'Walk closer'};
    }
    for(const n of this.residents.people){if(!n.visible||!n.sprite.getBounds().contains(world.x,world.y))continue;
      if(Math.hypot(n.position.x-s.position.x,n.position.y-s.position.y)>=72)return {...n.position,type:'hint',label:'Walk closer'};
      if(n.service)return Math.hypot(n.position.x-s.position.x,n.position.y-s.position.y)<58&&n.mode==='work'&&s.minute>=420&&s.minute<1140?{...n.position,type:'appearanceShop',category:n.service,label:n.service==='clothes'?'Clothes / Nell':'Stylist / Sol'}:{...n.position,type:'hint',label:'Walk closer'};
      if(n.kind){const c=LOCATIONS[s.area].interactions.find(c=>c.type===n.kind);if(c.approach){const [x,y,w,h]=c.approach;if(s.position.x<x||s.position.x>x+w||s.position.y<y||s.position.y>y+h)return {...n.position,type:'hint',label:'Walk closer'};}return n.mode==='work'&&shopOpen(s,n.kind)?c:{...n.position,type:'hint',label:'Shop closed'};}
      return {...n.position,type:'dialog',residentId:n.id,label:'Talk to '+n.name,title:n.name,body:n.body};
    }
    const c=this.context();if(c&&!['plot','dig','restoreGround','waterGround','chop','gatherGrass','placeGrass','placeDecoration','reclaimDecoration','hunt'].includes(c.type)&&Math.hypot(world.x-c.x,world.y-c.y)<(c.type==='travel'?96:64))return c;
    return null;
  }
  context(){if(!this.app.state)return null;const resident=this.residents?.context(this.app.state.position);if(resident?.type==='appearanceShop')return resident;const c=contextFor(this.app.state,this.targetPlot,this.player?.direction,this.targetGround);if(['seed','sell'].includes(c?.type)&&!this.residents?.available(c.type))return {...c,type:'hint',label:'Shop closed'};return c||resident;}
  faceContext(c){this.player?.face(c.x-this.app.state.position.x,c.y-this.app.state.position.y);this.atmosphere.feedback(c.x,c.y);}
  jump(){
    const a=this.app;if(!a.state||a.paused||a.transitioning||a.placement.draft||document.hidden)return;
    const {x,y}=movementVector(this.keys,a.input);
    const facing={down:{x:0,y:1},up:{x:0,y:-1},left:{x:-1,y:0},right:{x:1,y:0}};
    beginJump(a.state,this.jumping,x||y?{x,y}:facing[this.player.direction]);
  }
  update(_,delta){
    const a=this.app,s=a.state;a.audio.update(s,!a.paused&&!document.hidden&&!a.transitioning,delta,{paused:a.paused});if(!s||a.transitioning)return;if(this.impactStop>0&&!a.paused){this.impactStop=Math.max(0,this.impactStop-Math.min(delta,50));return;}let dx=0,dy=0,intent={x:0,y:0};
    if(simulationActive({paused:a.paused,hidden:document.hidden,transitioning:a.transitioning})){
      a.placement.update();const {x,y}=a.placement.draft?{x:0,y:0}:movementVector(this.keys,a.input);intent={x,y};
      const step=WORLD.speed*(isIndoorArea(s.area)?.5:1)*Math.min(delta,50)/1000;const nx=s.position.x+x*step,ny=s.position.y+y*step;
      const wasJumping=!!this.jumping.active,old={...s.position};stepJump(s,this.jumping,delta);
      if(wasJumping){dx=s.position.x-old.x;dy=s.position.y-old.y;}
      else {if(this.collisionWorld.canMove(nx,s.position.y)&&this.residents.canMove(s.position,{x:nx,y:s.position.y})){dx=nx-s.position.x;s.position.x=nx;}if(this.collisionWorld.canMove(s.position.x,ny)&&this.residents.canMove(s.position,{x:s.position.x,y:ny})){dy=ny-s.position.y;s.position.y=ny;}}if(dx||dy){this.targetPlot=null;this.targetGround=null;}a.advance(delta);const edge=forestPortalTravel(s,this.time.now,this.travelReady||0)||readyEdgeTravel(s,this.time.now,this.travelReady||0);if(edge&&!this.jumping.active){a.travel(edge);return;}
    }
    if(!a.paused&&!document.hidden){a.resolveAttack(delta);const result=stepCombat(s,this.combat,delta);if(result.warning)a.sound('animal:warning');if(result.hurt){cancelJump(s,this.jumping);this.forestView.hurt();a.ui.feedback('Ouch / -'+result.damage+' health');a.sound('combat:hurt');a.save();}if(result.dead){a.defeat();return;}a.forestGuidance();if(s.area==='forest'){const region=forestRegion(s.position);if(!s.forest.explored.includes(region.id)){s.forest.explored.push(region.id);a.save();a.ui.toast(region.name+' / danger '+region.danger+'/5. Open MAP for trails.');}}}
    this.portal?.update(this.time.now);
    this.player?.update(s.position,dx,dy,jumpPose(this.jumping),intent);
    if(!a.paused){this.grass.update(Math.min(delta,50),s.position,!!this.jumping.active);}
    if(!a.paused)this.forestView.update(Math.min(delta,50),this.combat);
    if(!a.paused&&!document.hidden)this.residents.update(Math.min(delta,50),s.position);
    if(!a.paused)this.atmosphere.update(this.time.now,!!(dx||dy),s.position,Math.min(delta,50));
    const light=worldLight(s);if(s.area==='forest')forestNight(this.night,s,light);else this.night.setFillStyle(light.color).setAlpha(light.alpha);
    this.cityLights.update(light);
    this.renderWetGround();const c=this.context();this.treeProgress.update(c);this.placementView.update();this.plotOutline.clear();if(['plot','dig','restoreGround','waterGround','placeDecoration'].includes(c?.type)&&!a.paused&&!a.placement.draft){const preview=s.selected==='water'&&s.ownsCopperCan?wateringPreview(s,c,this.player.direction):[c];for(const tile of preview){this.plotOutline.lineStyle(2,tile.eligible===false?0x88916c:0xffe9a7,.85);for(const [sx,sy]of [[-1,-1],[1,-1],[-1,1],[1,1]]){const x=tile.x+sx*23,y=tile.y+sy*23;this.plotOutline.lineBetween(x,y,x-sx*12,y);this.plotOutline.lineBetween(x,y,x,y-sy*12);}}}this.marker.setVisible(!a.placement.draft&&!!c&&!['plot','dig','restoreGround','waterGround','placeDecoration'].includes(c.type)&&!a.paused);if(c)this.marker.setPosition(c.x,c.y-52-Math.floor(Math.sin(this.time.now/240)*2)*2);
  }
}
