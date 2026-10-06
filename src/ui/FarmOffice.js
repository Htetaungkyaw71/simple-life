import {CROPS} from '../data/crops.js';
import {FIELDS,MAX_FARMS} from '../data/farms.js';
import {buyField,buyFarm,visitFarm,ownedField,nextFarmPrice,canExpandFarm} from '../systems/expansion.js';
import {buySeed,sellProduce} from '../systems/economy.js';

// Menus live in the existing paused Phaser UI scene, with small, bounded pages.
export class FarmOffice {
 constructor(app){this.app=app;}
 get s(){return this.app.state;}
 modal(title,body,buttons){this.app.ui.modal('FARM '+(this.s.currentFarm+1),title,body,buttons);}
 open(){this.modal('Farm board',`Coins: ${this.s.money}`,[
  ['Seeds and harvest',()=>this.trade()],['Buy planting land',()=>this.land()],
  ['Visit / buy farms',()=>this.farms()],['Back to farming',()=>this.app.ui.close()],
 ]);}
 trade(){this.modal('Seeds and harvest',`Coins: ${this.s.money} / Seeds: ${this.s.inventory.seed}\nTomatoes: ${this.s.inventory.tomato}`,[
  [`Buy 1 seed / ${CROPS.tomato.seedPrice} coins`,()=>{this.app.transact(buySeed);this.trade();},this.s.money<CROPS.tomato.seedPrice||this.s.inventory.seed>=9999],
  [`Sell all / ${this.s.inventory.tomato*CROPS.tomato.sellPrice} coins`,()=>{this.app.transact(sellProduce);this.trade();},!this.s.inventory.tomato],
  ['Back',()=>this.open()],
 ]);}
 land(){this.modal('Planting land',`Coins: ${this.s.money} / Each field: 16 cells`,[
  ...[1,2,3].map(field=>[ownedField(this.s,field)?`Field ${field+1} / owned`:`Field ${field+1} / ${FIELDS[field].price} coins`,()=>this.field(field),ownedField(this.s,field)]),
  ['Back',()=>this.open()],
 ]);}
 field(field){const f=FIELDS[field];this.modal(`Buy field ${field+1}?`,`Same 4 x 4 design as your first field.\nPrice: ${f.price} / Coins: ${this.s.money}`,[
  [ownedField(this.s,field)?'Already owned':`Buy / ${f.price} coins`,()=>{this.app.transact(s=>buyField(s,field));this.app.scene.build();this.app.ui.close();},ownedField(this.s,field)||this.s.money<f.price],
  ['Not now',()=>this.app.ui.close()],
 ]);}
 farms(){const s=this.s,price=nextFarmPrice(s),ready=canExpandFarm(s);this.modal(`Farm ${s.currentFarm+1} / ${s.farms.length}`,s.farms.length>=MAX_FARMS?'Farm collection full.':ready?`New farm: ${price} / Coins: ${s.money}`:'Unlock all 4 fields on your newest farm.',[
  ['Previous farm',()=>this.visit(s.currentFarm-1),s.currentFarm===0],
  ['Next farm',()=>this.visit(s.currentFarm+1),s.currentFarm===s.farms.length-1],
  [`Buy farm / ${price} coins`,()=>this.confirmFarm(),!ready||s.money<price],
  ['Back',()=>this.open()],
 ]);}
 confirmFarm(){const price=nextFarmPrice(this.s);this.modal('Buy another farm?',`Price: ${price} / Coins: ${this.s.money}\n4 matching fields. First one unlocked.`,[
  ['Buy farm',()=>{this.app.transact(buyFarm);this.app.scene.build();this.farms();}],['Not now',()=>this.farms()],
 ]);}
 visit(index){if(visitFarm(this.s,index)){this.app.scene.build();this.app.save();}this.farms();}
}
