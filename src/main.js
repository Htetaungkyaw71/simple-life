import {FarmOffice} from './ui/FarmOffice.js';
import {ROOM} from './data/interior.js';
import {waterPeriod} from './systems/watering.js';
import Phaser from 'phaser';
import './ui/styles.css';
import {WorldScene} from './scenes/WorldScene.js';
import {Interface} from './ui/interface.js';
import {LOCATIONS,syncInterior} from './data/locations.js';
import {newState} from './systems/state.js';
import {SaveService} from './systems/save.js';
import {usePlot} from './systems/farming.js';
import {buySeed,sellProduce} from './systems/economy.js';
import {collectStarterSeeds} from './systems/starter.js';
import {nextDay,tick,restUntilEvening} from './systems/time.js';
class Application {
  constructor(){
    syncInterior(innerWidth,innerHeight);this.state=null;this.paused=true;this.input={};this.elapsed=0;this.visited=new Set();let storage;
    try{storage=window.localStorage;}catch{storage={getItem(){throw Error();},setItem(){throw Error();}};}
    this.farmOffice=new FarmOffice(this);this.saves=new SaveService(storage);this.scene=new WorldScene(this);this.ui=new Interface(this);
  }
  ready(){this.ui.title();}
  start(state){if(!state)return;this.state=state;this.scene.build();this.scene.travelReady=this.scene.time.now+700;this.ui.play();this.save();}
  newGame(character){this.start(newState(character));this.ui.toast('Collect 3 seeds from the crate beside the house. Follow the south path to the farm.');}
  select(tool){if(!this.state||this.paused)return;this.state.selected=tool;this.save();}
  save(show=false){if(!this.state)return;this.state.roomSize={width:ROOM.width,height:ROOM.height};const ok=this.saves.write(this.state);if(show||(!ok&&!this.storageWarned))this.ui.toast(ok?'Your farm is saved.':this.saves.error);this.storageWarned=!ok;}
  transact(fn){const money=this.state.money;const message=fn(this.state);if(this.state.money!==money)this.scene.atmosphere.coins(this.state.money-money,this.state.position);this.scene.renderCrops();this.save();if(message)this.ui.toast(message);return message;}
  advance(delta){const window=waterPeriod(this.state);const before=this.state.minute;tick(this.state,delta);if(before<1439&&this.state.minute===1439)this.ui.toast('It is late. Return home and use the bed when you want to sleep.');if(window!==waterPeriod(this.state))this.scene.renderCrops();this.elapsed+=delta;if(this.elapsed>2500){this.save();this.elapsed=0;}}
  use(){
    if(this.paused||!this.state)return;const c=this.scene.context();if(!c)return;this.scene.faceContext(c);
    if(c.type==='starter'){const claimed=this.state.starterSeedsClaimed;this.transact(collectStarterSeeds);if(!claimed&&this.state.starterSeedsClaimed){this.ui.notice=null;this.ui.drawNotice();this.ui.showFarmObjective();}return;}
    if(c.type==='refill'){this.scene.atmosphere.refill(this.state.position);this.ui.toast('Watering can full. Water is unlimited for now.');return;}
    if(c.type==='farmOffice'){this.farmOffice.open();return;}
    if(c.type==='field'){this.farmOffice.field(c.field);return;}
    if(c.type==='dialog'){this.ui.modal(LOCATIONS[this.state.area].name,c.title,c.body,[['See you around',()=>this.ui.close()]]);return;}
    if(c.type==='hint'){this.ui.feedback(c.label);return;}
    if(c.type==='plot'){
      const before={...this.state.plots[c.index]},fruit=this.state.inventory.tomato;
      const message=usePlot(this.state,c.index),after=this.state.plots[c.index];
      const action=!before.crop&&after.crop?'plant':this.state.inventory.tomato>fruit?'harvest':(!before.morning&&after.morning)||(!before.evening&&after.evening)?'water':null;
      this.scene.renderCrops();this.save();this.ui.feedback(message);
      if(action){this.scene.atmosphere.farming(action,c.x,c.y);this.scene.events.emit('farming:'+action,{index:c.index,crop:'tomato'});this.scene.game.events.emit('sound:request',{key:'farming:'+action});}return;
    }
    if(c.type==='travel'){this.travel(c);return;}
    if(c.type==='bed'){
      this.ui.modal('HOME','Rest a while','Sleep restores energy and grows watered crops. Rest skips to 16:00 for evening watering.',[
        ['Sleep / next day',()=>{this.transact(s=>{nextDay(s);return 'Good morning. Full energy, a fresh day.';});this.scene.build();this.ui.close();}],
        ...(this.state.minute<960?[['Rest until evening',()=>{restUntilEvening(this.state);this.scene.renderCrops();this.save();this.ui.close();this.ui.toast('16:00 / Evening watering time.');}]]:[]),['Not yet',()=>this.ui.close()],
      ]);return;
    }this.market(c.type);
  }
  travel(c){
    if(this.transitioning)return;this.transitioning=true;this.paused=true;this.input={};
    const cam=this.scene.cameras.main;cam.fadeOut(140,38,40,45);
    cam.once('camerafadeoutcomplete',()=>{
      this.state.area=c.to;if(c.to==='farm')this.state.hasVisitedFarm=true;this.state.position={...c.spawn};this.scene.targetPlot=null;this.scene.build();
      this.scene.player.direction=c.facing||'down';this.scene.player.pose(false);this.scene.travelReady=this.scene.time.now+700;
      this.save();cam.fadeIn(140,38,40,45);this.transitioning=false;this.paused=false;
    });
  }
  market(type){
    const s=this.state,selling=type==='sell';
    this.ui.modal(selling?'CITY / PRODUCE MARKET':'CITY / SEED SHOP',selling?'Fresh from the farm':'Tomato seeds',selling?`Sell tomatoes for 18 coins each.\n\nYour harvest: ${s.inventory.tomato}\nYour coins: ${s.money}`:`10 coins / seed\n3 growing days / 2 tomatoes\nWater morning and evening.\n\nYour coins: ${s.money}   Seeds: ${s.inventory.seed}`,[
      [selling?`Sell ${s.inventory.tomato} / ${s.inventory.tomato*18} coins`:'Buy 1 seed / 10 coins',()=>{const message=this.transact(selling?sellProduce:buySeed);this.market(type);this.ui.toast(message);}],['Back to the lane',()=>this.ui.close()],
    ]);
  }
  pause(){if(this.transitioning||!this.state)return;if(this.paused){this.ui.close();return;}this.save();this.ui.modal('SIMPLE LIFE','Paused','Take your time. Your farm can wait.',[['Resume',()=>this.ui.close()],['Save',()=>this.save(true)],['Controls',()=>this.ui.help(()=>this.pauseMenu())],['Return to title',()=>{this.save();this.state=null;this.scene.build();this.ui.title();}]]);}
  pauseMenu(){this.paused=false;this.pause();}
}
const app=new Application();
new Phaser.Game({type:Phaser.CANVAS,parent:'game',width:innerWidth,height:innerHeight,backgroundColor:'#263e38',pixelArt:true,antialias:false,roundPixels:true,scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%',autoCenter:Phaser.Scale.NO_CENTER},scene:[app.scene,app.ui],physics:{default:'arcade',arcade:{gravity:{x:0,y:0},debug:false}},audio:{noAudio:true},input:{activePointers:4,keyboard:{capture:[32,37,38,39,40]}}});
window.addEventListener('pagehide',()=>app.save());
window.addEventListener('blur',()=>{app.input={};if(app.scene.keys)Object.values(app.scene.keys).forEach(k=>k.reset());});
document.addEventListener('visibilitychange',()=>{if(document.hidden){app.input={};app.save();}});
// Read-only observability for automated canvas tests; no gameplay mutation hooks.
if(import.meta.env.DEV||new URLSearchParams(location.search).has('qa'))window.__simpleLife=Object.freeze({snapshot:()=>{
  const cam=app.scene.cameras.main;return {state:app.state?structuredClone(app.state):null,paused:app.paused,menu:app.ui.menu?.kind||null,menuBounds:app.ui.menu?app.ui.menuBounds:null,farmSigns:(app.scene.farmSigns||[]).map(({board,text})=>({board:{...board},text:{x:text.x-text.displayWidth/2,y:text.y,w:text.displayWidth,h:text.displayHeight}})),controls:app.ui.controlSnapshot(),camera:cam?{x:cam.worldView.x,y:cam.worldView.y,width:cam.worldView.width,height:cam.worldView.height,zoom:cam.zoom}:null,player:app.scene.player?{direction:app.scene.player.direction,frame:app.scene.player.sprite.frame.name,height:app.scene.player.sprite.displayHeight*cam.zoom}:null,context:app.scene.context(),prompt:app.ui.hud?.prompt.visible?{x:app.ui.hud.prompt.x*2,y:app.ui.hud.prompt.y*2,w:app.ui.hud.promptWidth*2,h:28}:null,room:{width:ROOM.width,height:ROOM.height,spawn:{...ROOM.spawn},bed:{...ROOM.bed},exit:{...ROOM.exit}},cropInfo:app.ui.hud?.cropInfo.snapshot()||null,farmGuide:app.ui.hud?.farmGuide.snapshot()||null,collisionDebug:!!app.scene.collisionWorld?.debug};
}});
