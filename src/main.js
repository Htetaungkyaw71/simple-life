import Phaser from 'phaser';
import './ui/styles.css';
import { WORLD } from './config.js';
import { WorldScene } from './scenes/WorldScene.js';
import { Interface } from './ui/interface.js';
import { newState } from './systems/state.js';
import { SaveService } from './systems/save.js';
import { usePlot } from './systems/farming.js';
import { buySeed, sellProduce } from './systems/economy.js';
import { nextDay, tick } from './systems/time.js';
class Application {
  constructor(){this.state=null;this.paused=true;this.input={};this.elapsed=0;let storage;try{storage=window.localStorage;}catch{storage={getItem(){throw Error();},setItem(){throw Error();}};}this.saves=new SaveService(storage);this.ui=new Interface(this);this.scene=new WorldScene(this);}
  ready(){this.ui.title();}
  start(state){this.state=state;this.scene.build();this.ui.play();this.save();}
  newGame(character){this.start(newState(character));this.ui.toast('Welcome home. Follow the path through your farm to the city.');}
  select(tool){this.state.selected=tool;this.save();document.activeElement?.blur();}
  save(show=false){if(!this.state)return;const ok=this.saves.write(this.state);const el=document.querySelector('#save-status');if(el)el.textContent=ok?'Progress saved locally':'Saving unavailable';if(show||!ok)this.ui.toast(ok?'Your little life is saved.':this.saves.error);}
  transact(fn){const message=fn(this.state);this.scene.renderCrops();this.save();if(message)this.ui.toast(message);}
  advance(delta){if(tick(this.state,delta)){this.scene.build();this.save();this.ui.toast('A new dawn. You returned home and rested.');}this.elapsed+=delta;if(this.elapsed>2500){this.save();this.elapsed=0;}}
  use(){if(this.paused||!this.state)return;const c=this.scene.context();if(!c)return;document.activeElement?.blur();
    if(c.type==='plot'){this.transact(s=>usePlot(s,c.index));return;}
    if(c.type==='travel'){this.state.area=c.to;this.state.position={...c.spawn};this.scene.targetPlot=null;this.scene.build();this.save();return;}
    if(c.type==='bed'){this.ui.modal('HOME SWEET HOME','Rest a while',`<p>Sleep restores all energy and begins the next day.<br>Tomatoes grow after both daily waterings.</p><p>Rest until evening skips to 16:00 without advancing growth.</p>`,[['Sleep → next day',()=>{this.transact(s=>{nextDay(s);return 'Good morning. A fresh day and full energy.';});this.scene.build();this.ui.close();}],...(this.state.minute<960?[['Rest until evening',()=>{this.state.minute=960;this.save();this.ui.close();this.ui.toast('16:00 · Time for evening watering.');},'secondary']]:[]),['Not yet',()=>this.ui.close(),'text-button']]);return;}
    this.market(c.type);
  }
  market(type){const s=this.state;const selling=type==='sell';this.ui.modal(selling?'CITY · PRODUCE MARKET':'CITY · SEED SHOP',selling?'Good things, grown by you.':'Every harvest starts here.',`<div class="shop-item"><span class="tomato-icon">✿</span><div><strong>${selling?'Fresh tomatoes':'Tomato seeds'}</strong><p>${selling?'18 coins each · Sell your whole harvest':'10 coins each · 3 growing days · 2 tomatoes'}</p></div></div><p>You have <b>${s.money} coins</b>, ${s.inventory.seed} seeds and ${s.inventory.tomato} tomatoes.</p><p>${selling?'Your first harvest is just the beginning.':'Water morning and evening. Sleep between growing days.'}</p>`,[[selling?`Sell ${s.inventory.tomato} tomatoes · ${s.inventory.tomato*18} coins`:'Buy 1 seed · 10 coins',()=>{this.transact(selling?sellProduce:buySeed);this.market(type);} ],['Back to the lane',()=>this.ui.close(),'secondary']]);}
  pause(){if(!this.state)return;if(this.paused){this.ui.close();return;}this.save();this.ui.modal('TAKE YOUR TIME','A moment of quiet','<p>Your farm is paused. Your progress is saved on this browser.</p>',[['Keep playing',()=>this.ui.close()],['Field notes',()=>this.ui.help(()=>this.ui.close()),'secondary'],['Save & title',()=>{this.save();this.state=null;this.scene.build();this.ui.title();},'text-button']]);}
}
const app=new Application();
new Phaser.Game({type:Phaser.CANVAS,parent:'game',width:WORLD.width,height:WORLD.height,backgroundColor:'#8fab72',pixelArt:true,antialias:false,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[app.scene],audio:{noAudio:true},input:{keyboard:{capture:[32,37,38,39,40]}}});
window.addEventListener('pagehide',()=>app.save());
window.addEventListener('blur',()=>{app.input={};if(app.scene.keys)Object.values(app.scene.keys).forEach(k=>k.reset());});
document.addEventListener('visibilitychange',()=>{if(document.hidden){app.input={};app.save();}});
