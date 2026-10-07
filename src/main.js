import {SurvivalPanel} from './ui/SurvivalPanel.js';
import {FORAGE_NODES,FOREST_GUIDANCE} from './data/forest.js';
import {collectForage,recoverStash} from './systems/forest.js';
import {attack} from './systems/combat.js';
import {defeat} from './systems/defeat.js';
import {isNight} from './systems/time.js';
import {FarmOffice} from './ui/FarmOffice.js';
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
    syncInterior(innerWidth,innerHeight);this.state=null;this.paused=true;this.input={};this.elapsed=0;this.visited=new Set();let storage;
    try{storage=window.localStorage;}catch{storage={getItem(){throw Error();},setItem(){throw Error();}};}
    this.survivalPanel=new SurvivalPanel(this);this.tradePanel=new TradePanel(this);this.farmOffice=new FarmOffice(this);this.saves=new SaveService(storage);this.scene=new WorldScene(this);this.ui=new Interface(this);
  }
  ready(){this.ui.title();}
  start(state){if(!state)return;this.state=state;if(state.health<=0)defeat(state);this.scene.build();this.scene.travelReady=this.scene.time.now+TRAVEL_COOLDOWN;this.ui.play();this.save();}
  newGame(character){this.start(newState(character,crypto.getRandomValues(new Uint32Array(1))[0]));this.ui.toast('Collect 3 seeds from the crate beside the house. Follow the south path to the farm.');}
  sound(key){this.scene.game.events.emit('sound:request',{key,area:this.state?.area,day:this.state?.day});}
  cycleCrop(){if(this.paused||!this.state)return;this.state.selectedCrop=CROP_IDS[(CROP_IDS.indexOf(this.state.selectedCrop)+1)%CROP_IDS.length];this.state.selected='seed';this.save();this.ui.feedback(CROPS[this.state.selectedCrop].name+' seeds selected.');}
  select(tool){if(!this.state||this.paused)return;this.state.selected=tool;this.save();}
  save(show=false){if(!this.state)return;this.state.roomSize={width:ROOM.width,height:ROOM.height};const ok=this.saves.write(this.state);if(show||(!ok&&!this.storageWarned))this.ui.toast(ok?'Your farm is saved.':this.saves.error);this.storageWarned=!ok;}
  transact(fn){const money=this.state.money;const message=fn(this.state);if(this.state.money!==money)this.scene.atmosphere.coins(this.state.money-money,this.state.position);this.scene.renderCrops();this.save();if(message)this.ui.toast(message);return message;}
  advance(delta){const window=waterPeriod(this.state),day=this.state.day,energy=this.state.energy;tick(this.state,delta);if(window!==waterPeriod(this.state)||day!==this.state.day)this.scene.renderCrops();if(energy>10&&this.state.energy<=10)this.ui.feedback('Low energy / rest at your bed');this.elapsed+=delta;if(this.elapsed>2500||day!==this.state.day){this.save();this.elapsed=0;}}
  use(){
    if(this.paused||!this.state)return;const c=this.scene.context();if(!c)return;this.scene.faceContext(c);
    if(c.type==='forage'){const before=this.state.inventory[c.item];this.ui.feedback(collectForage(this.state,c.id));if(this.state.inventory[c.item]>before){this.scene.forestView.collect(FORAGE_NODES.find(n=>n.id===c.id));this.sound('forest:collect');}this.save();return;}
    if(c.type==='stash'){this.transact(recoverStash);return;}
    if(c.type==='outfitter'){this.survivalPanel.open('outfitter');return;}
    if(c.type==='starter'){const claimed=this.state.starterSeedsClaimed;this.transact(collectStarterSeeds);if(!claimed&&this.state.starterSeedsClaimed){this.ui.notice=null;this.ui.drawNotice();this.ui.showFarmObjective();}return;}
    if(c.type==='refill'){this.scene.atmosphere.refill(this.state.position);this.ui.toast('Watering can full. Water is unlimited for now.');return;}
    if(c.type==='farmOffice'){this.farmOffice.open();return;}
    if(c.type==='field'){this.farmOffice.field(c.field);return;}
    if(c.type==='seed'||c.type==='sell'){this.tradePanel.open(c.type);return;}
    if(c.type==='aid'){this.ui.modal('CITY / SEED AID','A fresh start','No coins for seeds? With fewer than 10 coins and no seeds, produce or living crops, collect one free Tomato seed each day.',[['Collect seed',()=>{this.transact(claimRecoverySeed);this.ui.close();},!recoveryEligible(this.state)],['Close',()=>this.ui.close()]]);return;}
    if(c.type==='dialog'){this.ui.modal(LOCATIONS[this.state.area].name,c.title,c.body,[['See you around',()=>this.ui.close()]]);return;}
    if(c.type==='hint'){this.ui.feedback(c.label);return;}
    if(c.type==='plot'){
      const before={...this.state.plots[c.index]},fruit=before.crop?this.state.inventory[CROPS[before.crop].produceKey]:0;
      const message=usePlot(this.state,c.index),after=this.state.plots[c.index];
      const action=!before.crop&&after.crop?'plant':before.crop&&this.state.inventory[CROPS[before.crop].produceKey]>fruit?'harvest':(!before.morning&&after.morning)||(!before.evening&&after.evening)?'water':null;
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
  attack(){
    if(this.paused||!this.state)return;const result=attack(this.state,this.scene.combat,this.scene.player.direction);
    if(result.message)this.ui.feedback(result.message);
    if(result.ok){this.scene.forestView.attack(this.scene.player.direction,result);this.sound('combat:swing');this.save();}
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
    const first=!this.state.deathTutorialSeen,coins=defeat(this.state);this.save();
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
      this.save();cam.fadeIn(140,38,40,45);this.transitioning=false;this.paused=false;this.sound('travel:enter');if(firstCity)this.ui.toast('Welcome to Lantern Square. Clara sells seeds; Niko buys your harvest.');
    });
  }
  pause(){if(this.transitioning||!this.state)return;if(this.paused){this.ui.close();return;}this.save();this.ui.modal('SIMPLE LIFE','Paused','Take your time. Your farm can wait.',[['Resume',()=>this.ui.close()],['Save',()=>this.save(true)],['Controls',()=>this.ui.help(()=>this.pauseMenu())],['Return to title',()=>{this.save();this.state=null;this.scene.build();this.ui.title();}]]);}
  pauseMenu(){this.paused=false;this.pause();}
}
const app=new Application();
new Phaser.Game({type:new URLSearchParams(location.search).get('renderer')==='webgl'?Phaser.WEBGL:Phaser.CANVAS,parent:'game',width:innerWidth,height:innerHeight,backgroundColor:'#263e38',pixelArt:true,antialias:false,roundPixels:true,scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%',autoCenter:Phaser.Scale.NO_CENTER},scene:[app.scene,app.ui],physics:{default:'arcade',arcade:{gravity:{x:0,y:0},debug:false}},audio:{noAudio:true},input:{activePointers:4,keyboard:{capture:[32,37,38,39,40]}}});
window.addEventListener('pagehide',()=>app.save());
window.addEventListener('blur',()=>{app.input={};if(app.scene.keys)Object.values(app.scene.keys).forEach(k=>k.reset());});
document.addEventListener('visibilitychange',()=>{if(document.hidden){app.input={};app.save();}});
// Read-only observability for automated canvas tests; no gameplay mutation hooks.
if(import.meta.env.DEV||new URLSearchParams(location.search).has('qa'))window.__simpleLife=Object.freeze({snapshot:()=>{
  const cam=app.scene.cameras.main;return {state:app.state?structuredClone(app.state):null,paused:app.paused,combat:app.scene.combat?structuredClone(app.scene.combat):null,travelReady:app.scene.travelReady,forestNodes:app.scene.forestView?.nodes.map(n=>({id:n.node.id,visible:n.sprite.visible}))||[],menu:app.ui.menu?.kind||null,trade:app.ui.menu?.kind==='trade'?{type:app.tradePanel.type,crop:app.tradePanel.ids[app.tradePanel.index],priceLabel:app.tradePanel.priceText?.text,quantity:app.tradePanel.quantity,details:app.tradePanel.details,textBounds:app.ui.root.list.filter(c=>c.type==='BitmapText'&&c.visible).map(c=>({text:c.text,...(({x,y,width,height})=>({x,y,w:width,h:height}))(c.getBounds())}))}:null,lighting:{alpha:app.scene.night?.alpha,color:app.scene.night?.fillColor},merchants:(app.scene.merchants||[]).map(n=>({kind:n.kind,visible:n.sprite.visible})),menuBounds:app.ui.menu?app.ui.menuBounds:null,roadSigns:(app.scene.roadSigns||[]).map(({board,text})=>({board:{...board},text:{x:text.x,y:text.y,w:text.displayWidth,h:text.displayHeight}})),farmSigns:(app.scene.farmSigns||[]).map(({board,text})=>({board:{...board},text:{x:text.x-text.displayWidth/2,y:text.y,w:text.displayWidth,h:text.displayHeight}})),controls:app.ui.controlSnapshot(),camera:cam?{x:cam.worldView.x,y:cam.worldView.y,width:cam.worldView.width,height:cam.worldView.height,zoom:cam.zoom}:null,player:app.scene.player?{direction:app.scene.player.direction,frame:app.scene.player.sprite.frame.name,height:app.scene.player.sprite.displayHeight*cam.zoom}:null,context:app.scene.context(),prompt:app.ui.hud?.prompt.visible?{x:app.ui.hud.prompt.x*2,y:app.ui.hud.prompt.y*2,w:app.ui.hud.promptWidth*2,h:28}:null,room:{width:ROOM.width,height:ROOM.height,spawn:{...ROOM.spawn},bed:{...ROOM.bed},exit:{...ROOM.exit}},cropInfo:app.ui.hud?.cropInfo.snapshot()||null,farmGuide:app.ui.hud?.farmGuide.snapshot()||null,collisionDebug:!!app.scene.collisionWorld?.debug};
}});
