import {ForestAmbience} from './audio/ForestAmbience.js';
import {testingCreditEnabled} from './systems/testingCredit.js';
import {useVegetation} from './systems/vegetation.js';
import {digGround,waterGround} from './systems/farmGround.js';
import {plotAt} from './systems/plots.js';
import {groundedPosition,cancelJump} from './systems/jump.js';
import {WildernessMap} from './ui/WildernessMap.js';
import {BagPanel} from './ui/BagPanel.js';
import {FORAGE_NODES,FOREST_GUIDANCE} from './data/forest.js';
import {collectForage,recoverStash,recoverTreasure} from './systems/forest.js';
import {collectStone} from './systems/resources.js';
import {attack} from './systems/combat.js';
import {defeat} from './systems/defeat.js';
import {isNight} from './systems/time.js';
import {FarmOffice} from './ui/FarmOffice.js';
import {ResourcePanel} from './ui/ResourcePanel.js';
import {ORDERS} from './data/settlement.js';
import {placeDecoration,reclaimDecoration} from './systems/settlement.js';
import {ROOM} from './data/interior.js';
import {waterPeriod} from './systems/watering.js';
import Phaser from 'phaser';
import './ui/styles.css';
import {WorldScene} from './scenes/WorldScene.js';
import {Interface} from './ui/interface.js';
import {LOCATIONS,syncInterior,TRAVEL_COOLDOWN} from './data/locations.js';
import {newState} from './systems/state.js';
import {SaveService} from './systems/save.js';
import {usePlot} from './systems/farming.js';
import {TradePanel} from './ui/TradePanel.js';
import {CROPS,CROP_IDS} from './data/crops.js';
import {claimRecoverySeed,recoveryEligible} from './systems/recovery.js';
import {collectStarterSeeds} from './systems/starter.js';
import {sleep,wakeTime,tick,clock} from './systems/time.js';
class Application {
  constructor(){
    this.testingCreditEnabled=testingCreditEnabled(location.href);
    syncInterior(innerWidth,innerHeight);this.state=null;this.paused=true;this.input={};this.elapsed=0;this.visited=new Set();let storage;
    try{storage=window.localStorage;}catch{storage={getItem(){throw Error();},setItem(){throw Error();}};}
    this.ambience=new ForestAmbience({storage});this.ambience.bind();window.addEventListener('pagehide',()=>this.ambience.silence());
    this.bagPanel=new BagPanel(this);this.wildernessMap=new WildernessMap(this);this.tradePanel=new TradePanel(this);this.farmOffice=new FarmOffice(this);this.resourcePanel=new ResourcePanel(this);this.saves=new SaveService(storage);this.scene=new WorldScene(this);this.ui=new Interface(this);
  }
  ready(){this.ui.title();}
  grantTestingCoins(){
    if(!this.testingCreditEnabled)return;
    const receipt=this.saves.grantTestingCoins();this.ui.title();
    this.ui.toast(receipt?(receipt.added?'Added '+receipt.added+' testing coins. ':'Testing coins already added. ')+'Saved balance / '+receipt.balance+'c.':this.saves.error);
  }
  start(state){if(!state)return;this.state=state;if(state.health<=0)defeat(state);this.scene.build();this.scene.travelReady=this.scene.time.now+TRAVEL_COOLDOWN;this.ui.play();this.save();}
  newGame(character){this.start(newState(character,crypto.getRandomValues(new Uint32Array(1))[0]));this.ui.toast('Crate / 3 seeds. Farm / south.');}
  sound(key){this.scene.game.events.emit('sound:request',{key,area:this.state?.area,day:this.state?.day});}
  cycleCrop(){if(this.paused||!this.state)return;this.state.selectedCrop=CROP_IDS[(CROP_IDS.indexOf(this.state.selectedCrop)+1)%CROP_IDS.length];this.state.selected='seed';this.save();this.ui.feedback(CROPS[this.state.selectedCrop].name+' seeds selected.');}
  select(tool){if(!this.state||this.paused)return;this.pendingAttack=null;this.state.selected=tool;this.save();}
  save(show=false){if(!this.state)return;this.state.roomSize={width:ROOM.width,height:ROOM.height};const ok=this.saves.write({...this.state,position:groundedPosition(this.state,this.scene.jumping)});if(show||(!ok&&!this.storageWarned))this.ui.toast(ok?'Your farm is saved.':this.saves.error);this.storageWarned=!ok;}
  transact(fn){const money=this.state.money;const message=fn(this.state);if(this.state.money!==money)this.scene.atmosphere.coins(this.state.money-money,this.state.position);this.scene.renderCrops();this.save();if(message)this.ui.toast(message);return message;}
  advance(delta){const window=waterPeriod(this.state),day=this.state.day,energy=this.state.energy;tick(this.state,delta);if(window!==waterPeriod(this.state)||day!==this.state.day)this.scene.renderCrops();if(energy>10&&this.state.energy<=10)this.ui.feedback('Low energy / rest at your bed');this.elapsed+=delta;if(this.elapsed>2500||day!==this.state.day){this.save();this.elapsed=0;}}
  use(pointed=null){
    if(this.scene.jumping?.active)return;
    if(this.paused||!this.state||this.transitioning)return;const c=pointed||this.scene.context();if(!c)return;this.scene.faceContext(c);
    if(c.type==='hunt'){this.attack(c.id);return;}
    if(c.type==='stone'){const before=this.state.inventory.stone;this.ui.feedback(collectStone(this.state,c.id));if(this.state.inventory.stone>before){this.scene.forestView.bits(c.x,c.y-12,0xc1bcac);this.sound('forest:collect');}this.save();return;}
    if(['chop','gatherGrass','placeGrass'].includes(c.type)){
      const now=this.scene.time.now;if(now<(this.nextGroundUse||0))return;this.nextGroundUse=now+450;
      const result=useVegetation(this.state,c);this.ui.feedback(result.message);
      if(result.ok){this.scene.refreshVegetation(result.felled);if(c.type==='chop'){this.scene.player.wateringCan.swing();this.scene.treeProgress.hit(result);}this.scene.atmosphere.vegetation(c.type,c.x,c.y);this.sound('farming:'+c.type);this.save();}return;
    }
    if(c.type==='dig'||c.type==='waterGround'||c.type==='plot'&&this.state.selected==='water'){
      const now=this.scene.time.now;if(now<(this.nextGroundUse||0))return;this.nextGroundUse=now+450;
      const result=c.type==='dig'?digGround(this.state,c):waterGround(this.state,c,c.type==='plot'?c.index:undefined);
      this.ui.feedback(result.message);if(result.ok){if(c.type==='dig'){this.scene.player.wateringCan.swing();this.scene.refreshVegetation();}this.scene.renderCrops();this.scene.atmosphere.farming(c.type==='dig'?'dig':'water',result.x,result.y);this.sound('farming:'+(c.type==='dig'?'dig':'water'));this.save();}return;
    }
    if(c.type==='forage'){const before=this.state.inventory[c.item];this.ui.feedback(collectForage(this.state,c.id));if(this.state.inventory[c.item]>before){this.scene.forestView.collect(FORAGE_NODES.find(n=>n.id===c.id));this.sound('forest:collect');}this.save();return;}
    if(c.type==='treasure'){this.transact(s=>recoverTreasure(s,c.id));return;}
    if(c.type==='stash'){this.transact(recoverStash);return;}
    if(c.type==='starter'){const claimed=this.state.starterSeedsClaimed;this.transact(collectStarterSeeds);if(!claimed&&this.state.starterSeedsClaimed){this.ui.notice=null;this.ui.drawNotice();this.ui.showFarmObjective();}return;}
    if(c.type==='refill'){this.scene.atmosphere.refill(this.state.position);this.ui.toast('Watering can full. Water is unlimited for now.');return;}
    if(c.type==='farmOffice'){this.farmOffice.open();return;}
    if(c.type==='settlement'){this.resourcePanel.open();return;}
    if(c.type==='cooking'){this.resourcePanel.cooking();return;}
    if(['placeDecoration','reclaimDecoration'].includes(c.type)){
      const now=this.scene.time.now;if(now<(this.nextGroundUse||0))return;this.nextGroundUse=now+450;
      const count=this.state.settlement.decorations.length,message=(c.type==='placeDecoration'?placeDecoration:reclaimDecoration)(this.state,c);
      if(this.state.settlement.decorations.length!==count){this.scene.build();this.save();}this.ui.feedback(message);return;
    }
    if(c.type==='field'){this.farmOffice.field(c.field);return;}
    if(c.type==='seed'||c.type==='sell'){this.tradePanel.open(c.type);return;}
    if(c.type==='aid'){this.ui.modal('CITY / SEED AID','A fresh start','No coins for seeds? With fewer than 10 coins and no seeds, produce or living crops, collect one free Tomato seed each day.',[['Collect seed',()=>{this.transact(claimRecoverySeed);this.ui.close();},!recoveryEligible(this.state)],['Close',()=>this.ui.close()]]);return;}
    if(c.type==='dialog'){this.ui.modal(LOCATIONS[this.state.area].name,c.title,c.body,[...(ORDERS.some(d=>d.resident===c.residentId)?[['Daily request',()=>this.resourcePanel.orders(c.residentId)]]:[]),['See you around',()=>this.ui.close()]]);return;}
    if(c.type==='hint'){this.ui.feedback(c.label);return;}
    if(c.type==='plot'){
      const before={...plotAt(this.state,c.index)},fruit=before.crop?this.state.inventory[CROPS[before.crop].produceKey]:0;
      const message=usePlot(this.state,c.index),after=plotAt(this.state,c.index);
      const action=!before.crop&&after.crop?'plant':before.crop&&this.state.inventory[CROPS[before.crop].produceKey]>fruit?'harvest':after.crop&&before.wateredDay!==after.wateredDay?'water':null;
      this.scene.renderCrops();this.save();this.ui.feedback(message);
      if(action==='harvest'&&!this.state.hasVisitedCity)this.ui.showCityObjective();
      if(action){this.scene.atmosphere.farming(action,c.x,c.y,before.crop||after.crop);this.scene.events.emit('farming:'+action,{index:c.index,crop:before.crop||after.crop});this.scene.game.events.emit('sound:request',{key:'farming:'+action});}return;
    }
    if(c.type==='travel'){this.travel(c);return;}
    if(c.type==='bed'){
      const wake=clock({minute:wakeTime(this.state)});
      this.ui.modal('HOME','Sleep?',`Wake at ${wake}. Energy restored.`,[
        ['Sleep until '+wake,()=>{this.transact(s=>{sleep(s);return 'Rested / '+clock(s);});this.scene.build();this.ui.close();}],
        ['Not yet',()=>this.ui.close()],
      ]);return;
    }
  }
  attack(targetId=null){
    if(this.scene.jumping?.active)return;
    if(this.paused||!this.state||this.transitioning||this.pendingAttack||this.scene.combat.now<this.scene.combat.nextAttack)return;
    if(this.state.selected!=='axe')return;const weapon='axe';
    const direction=this.scene.player.direction;
    this.pendingAttack={targetId,direction,weapon,remaining:120};
    if(weapon==='axe')this.scene.player.wateringCan.swing();
    this.scene.forestView.beginSwing(direction,weapon);
  }
  resolveAttack(delta){
    const pending=this.pendingAttack;if(!pending)return;
    pending.remaining-=Math.min(Math.max(delta,0),50);if(pending.remaining>0)return;
    this.pendingAttack=null;
    if(this.state.selected!==pending.weapon||this.scene.jumping?.active)return;
    const result=attack(this.state,this.scene.combat,pending.direction,pending.targetId);
    if(result.message)this.ui.feedback(result.message);
    if(result.ok){this.scene.forestView.attack(pending.direction,result);this.sound('combat:swing');this.save();}
  }

  forestGuidance(){
    if(this.state.area!=='forest'||this.paused)return;
    if(!this.state.forestTutorialComplete){this.forestTutorial(0);return;}
    if(isNight(this.state)&&!this.state.nightWarningSeen){this.state.nightWarningSeen=true;this.save();this.ui.toast('Wild animals are more active at night.');}
  }
  forestTutorial(index){
    this.ui.modal('WILD WOODS',String(index+1)+' / 3',FOREST_GUIDANCE[index],[['Continue',()=>{if(index<2)this.forestTutorial(index+1);else{this.state.forestTutorialComplete=true;this.save();this.ui.close();}}]]);
  }
  defeat(){
    if(this.transitioning)return;this.transitioning=true;this.paused=true;this.input={};
    cancelJump(this.state,this.scene.jumping);const first=!this.state.deathTutorialSeen,coins=defeat(this.state);this.save();
    const sprite=this.scene.player.sprite;sprite.stop();this.scene.tweens.add({targets:sprite,angle:90,alpha:0,duration:380});
    const cam=this.scene.cameras.main;this.scene.time.delayedCall(380,()=>cam.fadeOut(180,38,40,45));
    cam.once('camerafadeoutcomplete',()=>{
      this.scene.build();this.scene.travelReady=this.scene.time.now+TRAVEL_COOLDOWN;cam.fadeIn(180,38,40,45);this.transitioning=false;
      if(first){this.ui.modal('HOME / NEXT MORNING','Safe at home','Restored health and energy. '+(coins?'Your Stash Bag holds '+coins+' coins. ':'No coins were dropped. ')+'Recover it before another defeat: a second fall permanently replaces the old bag.',[['Continue',()=>{this.state.deathTutorialSeen=true;this.save();this.ui.close();}]]);}
      else{this.ui.close();this.ui.toast(coins?'Safe at home. Recover your Stash Bag / '+coins+' coins.':'Safe at home / rested.');}
    });
  }
  travel(c){
    if(this.transitioning)return;this.transitioning=true;this.paused=true;this.input={};
    const cam=this.scene.cameras.main;cam.fadeOut(140,38,40,45);
    cam.once('camerafadeoutcomplete',()=>{
      const firstCity=c.to==='city'&&!this.state.hasVisitedCity;this.state.area=c.to;if(c.to==='city')this.state.hasVisitedCity=true;if(c.to==='farm')this.state.hasVisitedFarm=true;this.state.position={...c.spawn};this.scene.targetPlot=null;this.scene.build();
      this.scene.player.direction=c.facing||'down';this.scene.player.pose(false);this.scene.travelReady=this.scene.time.now+TRAVEL_COOLDOWN;
      this.save();cam.fadeIn(140,38,40,45);this.transitioning=false;this.paused=false;this.sound('travel:enter');if(c.portal)this.ui.toast('Return gate / Forest entrance');if(firstCity)this.ui.toast('Welcome to Lantern Square. Clara sells seeds; Niko buys your harvest.');
    });
  }
  pause(){if(this.transitioning||!this.state)return;if(this.paused){this.ui.close();return;}this.save();this.ui.modal('SIMPLE LIFE','Paused','',[['Resume',()=>this.ui.close()],['Save',()=>this.save(true)],['Forest sound / '+(this.ambience.muted?'OFF':'ON'),()=>{this.ambience.toggle();this.pauseMenu();}],['Controls',()=>this.ui.help(()=>this.pauseMenu())],['Return to title',()=>{this.save();this.state=null;this.scene.build();this.ui.title();}]]);}
  pauseMenu(){this.paused=false;this.pause();}
}
const app=new Application();
new Phaser.Game({type:new URLSearchParams(location.search).get('renderer')==='webgl'?Phaser.WEBGL:Phaser.CANVAS,parent:'game',width:innerWidth,height:innerHeight,backgroundColor:'#263e38',pixelArt:true,antialias:false,roundPixels:true,scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%',autoCenter:Phaser.Scale.NO_CENTER},scene:[app.scene,app.ui],physics:{default:'arcade',arcade:{gravity:{x:0,y:0},debug:false}},audio:{noAudio:true},input:{activePointers:4,keyboard:{capture:[32,37,38,39,40]}}});
window.addEventListener('pagehide',()=>app.save());
window.addEventListener('blur',()=>{app.ui.resetMovement();if(app.scene.keys)Object.values(app.scene.keys).forEach(k=>k.reset());});
document.addEventListener('visibilitychange',()=>{if(document.hidden){app.ui.resetMovement();app.save();}});
// Read-only observability for automated canvas tests; no gameplay mutation hooks.
if(import.meta.env.DEV||new URLSearchParams(location.search).has('qa'))window.__simpleLife=Object.freeze({snapshot:()=>{
  const cam=app.scene.cameras.main;return {state:app.state?structuredClone(app.state):null,paused:app.paused,input:structuredClone(app.input),ambience:app.ambience.snapshot(),pendingAttack:app.pendingAttack?{...app.pendingAttack}:null,jump:app.scene.jumping?structuredClone(app.scene.jumping):null,grass:app.scene.grass?.snapshot()||null,canopies:(app.scene.canopies||[]).map(c=>({frame:c.frame??c.sprite.frame.name,texture:c.sprite.texture.key,x:c.x,y:c.y,alpha:c.sprite.alpha,baseX:c.baseX,width:c.width,height:c.height})),combat:app.scene.combat?structuredClone(app.scene.combat):null,travelReady:app.scene.travelReady,water:app.scene.atmosphere?.waterView?{wading:app.scene.atmosphere.waterView.wading,reflection:app.scene.atmosphere.waterView.reflection.visible,phase:app.scene.atmosphere.elapsed}:null,wildlife:app.scene.forestView?.animals?.map(a=>({id:a.definition.id,frame:a.sprite.frame.name,visible:a.sprite.visible,texture:a.sprite.texture.key,originY:a.sprite.originY,flipX:a.sprite.flipX,x:a.sprite.x,y:a.sprite.y,width:a.sprite.displayWidth,height:a.sprite.displayHeight,shadow:a.shadow.visible}))||[],woodland:app.scene.forestView?.woodland?.animals.map(a=>({species:a.species,frame:a.sprite.frame.name,visible:a.sprite.visible,x:a.p.x,y:a.p.y}))||[],forestNodes:app.scene.forestView?.nodes.map(n=>({id:n.node.id,visible:n.sprite.visible}))||[],menu:app.ui.menu?.kind||null,menuContent:app.ui.menu?{title:app.ui.menu.title,body:app.ui.menu.body}:null,trade:app.ui.menu?.kind==='trade'?{type:app.tradePanel.type,crop:app.tradePanel.ids[app.tradePanel.index],priceLabel:app.tradePanel.priceText?.text,quantity:app.tradePanel.quantity,details:app.tradePanel.details,textBounds:app.ui.root.list.filter(c=>c.type==='BitmapText'&&c.visible).map(c=>({text:c.text,...(({x,y,width,height})=>({x,y,w:width,h:height}))(c.getBounds())}))}:null,lighting:{alpha:app.scene.night?.alpha,color:app.scene.night?.fillColor},residents:app.scene.residents?.snapshot()||[],merchants:(app.scene.merchants||[]).map(n=>({kind:n.kind,visible:n.sprite.visible})),menuBounds:app.ui.menu?app.ui.menuBounds:null,roadSigns:(app.scene.roadSigns||[]).map(({board,text})=>({board:{...board},text:{x:text.x,y:text.y,w:text.displayWidth,h:text.displayHeight}})),farmSigns:(app.scene.farmSigns||[]).map(({board,text})=>({board:{...board},text:{x:text.x-text.displayWidth/2,y:text.y,w:text.displayWidth,h:text.displayHeight}})),controls:app.ui.controlSnapshot(),camera:cam?{x:cam.worldView.x,y:cam.worldView.y,width:cam.worldView.width,height:cam.worldView.height,zoom:cam.zoom}:null,heldTool:app.scene.player?{frame:app.scene.player.wateringCan.can.frame.name,originX:app.scene.player.wateringCan.can.originX,originY:app.scene.player.wateringCan.can.originY,rotation:app.scene.player.wateringCan.can.rotation,flip:app.scene.player.wateringCan.can.flipX,flipY:app.scene.player.wateringCan.can.flipY,depth:app.scene.player.wateringCan.can.depth,x:app.scene.player.wateringCan.can.x,y:app.scene.player.wateringCan.can.y,visible:app.scene.player.wateringCan.can.visible}:null,player:app.scene.player?{direction:app.scene.player.direction,frame:app.scene.player.sprite.frame.name,height:app.scene.player.sprite.displayHeight*cam.zoom}:null,context:app.scene.context(),prompt:app.ui.hud?.prompt.visible?{x:app.ui.hud.prompt.x*2,y:app.ui.hud.prompt.y*2,w:app.ui.hud.promptWidth*2,h:28}:null,room:{width:ROOM.width,height:ROOM.height,spawn:{...ROOM.spawn},bed:{...ROOM.bed},exit:{...ROOM.exit}},treeProgress:app.scene.treeProgress?.snapshot()||null,resourcePage:app.ui.menu?.kind==='resources'?app.ui.menu.page:null,cropInfo:app.ui.hud?.cropInfo.snapshot()||null,farmGuide:app.ui.hud?.farmGuide.snapshot()||null,collisionDebug:!!app.scene.collisionWorld?.debug};
}});
