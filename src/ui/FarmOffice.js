import {COPPER_CAN,copperQuote,buyCopperCan} from '../systems/wateringCan.js';
import {CROPS} from '../data/crops.js';
import {buySeed,sellProduce} from '../systems/economy.js';
import {marketPrice} from '../systems/market.js';
import {inputGate} from '../systems/inputGate.js';
import {MAX_FARMS} from '../data/farms.js';
import {buyFarm,visitFarm,nextFarmPrice,canExpandFarm} from '../systems/expansion.js';

// Menus live in the existing paused Phaser UI scene, with small, bounded pages.
export class FarmOffice {
 constructor(app){this.app=app;this.gate=inputGate();}
 get s(){return this.app.state;}
 modal(title,body,buttons){this.app.ui.modal('FARM '+(this.s.currentFarm+1),title,body,buttons);}
 open(){this.modal('Farm board',`Coins: ${this.s.money}`,[
  ['Seeds and harvest',()=>this.trade()],['Dig planting beds',()=>this.land()],
  ['Copper Watering Can',()=>this.upgrade()],['Buy / visit farms',()=>this.farms()],['Back to farming',()=>this.app.ui.close()],
 ]);}
 upgrade(){const q=copperQuote(this.s);this.modal('Copper Watering Can',this.s.ownsCopperCan?'Owned / select Water.\n3 aligned beds ahead / 2 energy.\nGold preview shows affected beds.':'After Commons seating.\n180c / 6 Wood / 4 Stone.\n3 aligned beds / 2 energy.',[[q.ok?'Buy / 180c':q.reason,()=>{if(!this.gate.accept(this.app.ui.time.now))return;this.app.transact(buyCopperCan);this.upgrade();},!q.ok],['Back',()=>this.open()]]);}
 trade(){const price=marketPrice(this.s,'tomato').price;this.modal('Seeds and harvest',`Coins: ${this.s.money} / Seeds: ${this.s.inventory.seed}\nTomatoes: ${this.s.inventory.tomato} / Today: ${price}c each`,[
  [`Buy 1 seed / ${CROPS.tomato.seedPrice} coins`,()=>this.transaction(buySeed),this.s.money<CROPS.tomato.seedPrice||this.s.inventory.seed>=9999],
  [`Sell all / ${this.s.inventory.tomato*price} coins`,()=>this.transaction(sellProduce),!this.s.inventory.tomato||this.s.money+this.s.inventory.tomato*price>9999999],
  ['Back',()=>this.open()],
 ]);}
 transaction(fn){if(this.app.transitioning||!this.gate.accept(this.app.ui.time.now))return;this.app.transact(fn);this.trade();}
 land(){this.modal('Free planting beds','Shovel / dig clear grass.\nSeeds / plant. Water / once a day.',[
  ['Select Shovel',()=>{this.s.selected='shovel';this.app.save();this.app.ui.close();}],['Back',()=>this.open()],
 ]);}
 field(){this.land();}
 farms(){const s=this.s,price=nextFarmPrice(s);this.modal(`Farm ${s.currentFarm+1} / ${s.farms.length}`,`Coins: ${s.money} / Maximum ${MAX_FARMS} farms\n${s.ownsCopperCan?'Copper Can owned':'Copper Can required to expand'}`,[
  [canExpandFarm(s)?`Buy farm ${s.farms.length+1} / ${price}c`:'Farm collection full',()=>this.purchase(),!canExpandFarm(s)||s.money<price||!s.ownsCopperCan],
  ['Previous farm',()=>this.visit(s.currentFarm-1),s.currentFarm===0],['Next farm',()=>this.visit(s.currentFarm+1),s.currentFarm===s.farms.length-1],['Back',()=>this.open()],
 ]);}
 purchase(){if(this.app.transitioning||!this.gate.accept(this.app.ui.time.now))return;const count=this.s.farms.length;this.app.transact(buyFarm);if(this.s.farms.length!==count)this.app.scene.build();this.farms();}
 visit(index){if(visitFarm(this.s,index)){this.app.scene.build();this.app.save();}this.farms();}
}
