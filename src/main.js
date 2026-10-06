import Phaser from 'phaser';
import './ui/styles.css';
import {WorldScene} from './scenes/WorldScene.js';
import {Interface} from './ui/interface.js';
import {LOCATIONS} from './data/locations.js';
import {newState} from './systems/state.js';
import {SaveService} from './systems/save.js';
import {usePlot} from './systems/farming.js';
import {buySeed,sellProduce} from './systems/economy.js';
import {collectStarterSeeds} from './systems/starter.js';
import {nextDay,tick} from './systems/time.js';
class Application {
  constructor(){
    this.state=null;this.paused=true;this.input={};this.elapsed=0;this.visited=new Set();let storage;
    try{storage=window.localStorage;}catch{storage={getItem(){throw Error();},setItem(){throw Error();}};}
    this.saves=new SaveService(storage);this.scene=new WorldScene(this);this.ui=new Interface(this);
  }
  ready(){this.ui.title();}
  start(state){if(!state)return;this.state=state;this.scene.build();this.ui.play();this.save();}
  newGame(character){this.start(newState(character));this.ui.toast('Collect 3 seeds from the crate beside the house. The east gate leads to the active field.');}
  select(tool){if(!this.state||this.paused)return;this.state.selected=tool;this.save();}
  save(show=false){if(!this.state)return;const ok=this.saves.write(this.state);if(show||(!ok&&!this.storageWarned))this.ui.toast(ok?'Your farm is saved.':this.saves.error);this.storageWarned=!ok;}
  transact(fn){const money=this.state.money;const message=fn(this.state);if(this.state.money!==money)this.scene.atmosphere.coins(this.state.money-money,this.state.position);this.scene.renderCrops();this.save();if(message)this.ui.toast(message);return message;}
  advance(delta){if(tick(this.state,delta)){this.scene.build();this.save();this.ui.toast('A new dawn. You returned home and rested.');}this.elapsed+=delta;if(this.elapsed>2500){this.save();this.elapsed=0;}}
  use(){
    if(this.paused||!this.state)return;const c=this.scene.context();if(!c)return;this.scene.faceContext(c);
    if(c.type==='starter'){this.transact(collectStarterSeeds);return;}
    if(c.type==='refill'){this.scene.atmosphere.refill(this.state.position);this.ui.toast('Watering can full. Water is unlimited for now.');return;}
    if(c.type==='dialog'){this.ui.modal(LOCATIONS[this.state.area].name,c.title,c.body,[['See you around',()=>this.ui.close()]]);return;}
    if(c.type==='plot'){this.transact(s=>usePlot(s,c.index));return;}
    if(c.type==='travel'){this.state.area=c.to;this.state.position={...c.spawn};this.scene.targetPlot=null;this.scene.build();this.save();this.ui.toast(LOCATIONS[c.to].name+' / '+LOCATIONS[c.to].subtitle);this.visited.add(c.to);return;}
    if(c.type==='bed'){
      this.ui.modal('HOME','Rest a while','Sleep restores energy and grows watered crops. Rest skips to 16:00 for evening watering.',[
        ['Sleep / next day',()=>{this.transact(s=>{nextDay(s);return 'Good morning. Full energy, a fresh day.';});this.scene.build();this.ui.close();}],
        ...(this.state.minute<960?[['Rest until evening',()=>{this.state.minute=960;this.save();this.ui.close();this.ui.toast('16:00 / Evening watering time.');}]]:[]),['Not yet',()=>this.ui.close()],
      ]);return;
    }this.market(c.type);
  }
  market(type){
    const s=this.state,selling=type==='sell';
    this.ui.modal(selling?'CITY / PRODUCE MARKET':'CITY / SEED SHOP',selling?'Fresh from the farm':'Tomato seeds',selling?`Sell tomatoes for 18 coins each.\n\nYour harvest: ${s.inventory.tomato}\nYour coins: ${s.money}`:`10 coins / seed\n3 growing days / 2 tomatoes\nWater morning and evening.\n\nYour coins: ${s.money}   Seeds: ${s.inventory.seed}`,[
      [selling?`Sell ${s.inventory.tomato} / ${s.inventory.tomato*18} coins`:'Buy 1 seed / 10 coins',()=>{const message=this.transact(selling?sellProduce:buySeed);this.market(type);this.ui.toast(message);}],['Back to the lane',()=>this.ui.close()],
    ]);
  }
  pause(){if(!this.state)return;if(this.paused){this.ui.close();return;}this.save();this.ui.modal('SIMPLE LIFE','Paused','Take your time. Your farm can wait.',[['Resume',()=>this.ui.close()],['Save',()=>this.save(true)],['Controls',()=>this.ui.help(()=>this.pauseMenu())],['Return to title',()=>{this.save();this.state=null;this.scene.build();this.ui.title();}]]);}
  pauseMenu(){this.paused=false;this.pause();}
}
const app=new Application();
new Phaser.Game({type:Phaser.CANVAS,parent:'game',width:innerWidth,height:innerHeight,backgroundColor:'#263e38',pixelArt:true,antialias:false,roundPixels:true,scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%',autoCenter:Phaser.Scale.NO_CENTER},scene:[app.scene,app.ui],physics:{default:'arcade',arcade:{gravity:{x:0,y:0},debug:false}},audio:{noAudio:true},input:{activePointers:4,keyboard:{capture:[32,37,38,39,40]}}});
window.addEventListener('pagehide',()=>app.save());
window.addEventListener('blur',()=>{app.input={};if(app.scene.keys)Object.values(app.scene.keys).forEach(k=>k.reset());});
document.addEventListener('visibilitychange',()=>{if(document.hidden){app.input={};app.save();}});
// Read-only observability for automated canvas tests; no gameplay mutation hooks.
if(import.meta.env.DEV||new URLSearchParams(location.search).has('qa'))window.__simpleLife=Object.freeze({snapshot:()=>{
  const cam=app.scene.cameras.main;return {state:app.state?structuredClone(app.state):null,paused:app.paused,menu:app.ui.menu?.kind||null,controls:app.ui.controlSnapshot(),camera:cam?{x:cam.worldView.x,y:cam.worldView.y,width:cam.worldView.width,height:cam.worldView.height,zoom:cam.zoom}:null,player:app.scene.player?{direction:app.scene.player.direction,frame:app.scene.player.sprite.frame.name,height:app.scene.player.sprite.displayHeight*cam.zoom}:null,context:app.scene.context(),collisionDebug:!!app.scene.collisionWorld?.debug};
}});
