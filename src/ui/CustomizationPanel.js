import {HOMES,HOME_IDS} from '../data/homes.js';
import {DECORATIONS} from '../data/settlement.js';
import {buyHouse,houseQuote,buyDecoration,decorQuote,customizationAvailable,decorationAllowed} from '../systems/customization.js';
import {homePreview} from '../art/HomeArt.js';
import {decorationThumb} from './resourcePreviews.js';
import {text} from './pixelWidgets.js';
import {inputGate} from '../systems/inputGate.js';
export class CustomizationPanel {
 constructor(app){this.app=app;this.gate=inputGate();}
 get s(){return this.app.state;}
 show(page){this.app.resourcePanel.show(page);}
 open(){const a=this.app,here=customizationAvailable(this.s);this.show({kicker:'Make it your own',title:'Home & garden',note:here?'Craft with materials or buy with coins. Pieces stay in Bag.':'Visit Home or Farm to customize.',home:[
  {label:'Craft / materials',id:'customize-craft',preview:decorationThumb('bench'),action:()=>this.app.resourcePanel.decorations()},
  {label:'House designs',id:'customize-houses',preview:homePreview(this.s.home.design),action:()=>this.houses()},
  {label:'Trees & garden',id:'customize-garden',preview:decorationThumb('blossom'),action:()=>this.decorations('garden')},
  {label:'Room furniture',id:'customize-furniture',preview:decorationThumb('bookcase'),action:()=>this.decorations('furniture')},
 ]});}
 houses(index=0,inside=false){const ids=[...HOME_IDS,'starter'],id=ids[index],d=HOMES[id],q=houseQuote(this.s,id),current=this.s.home.design===id;
  this.show({kicker:'House designs / '+(index+1)+' of 9',title:d.name,customPreview:homePreview(id,inside),description:d.detail,materials:[{name:q.owned?'Owned / free':'Coins',need:q.price,have:this.s.money,icon:'coin'}],note:!['home','interior'].includes(this.s.area)?'Visit Home to buy or change your house.':current?'Your current Home. Door and bed stay in place.':q.owned?'Owned. Switch to this design for free.':'Includes exterior, decor and a furnished interior.',status:current?'Current Home':q.owned?'Owned':'Price: '+d.price+'c',tabs:this.tabs(ids,index,k=>({starter:'Old',rose:'Rose',orchard:'Lodge',coastal:'Villa',bamboo:'Tea',brick:'Brick',glass:'Glass',alpine:'Moon',manor:'Manor'})[k],k=>homePreview(k),i=>this.houses(i,inside),'house-'),actions:[
   [current?'Selected':q.owned?'Use design':'Buy',()=>q.owned?this.applyHouse(id,index,inside):this.confirmHouse(id,index,inside),!q.ok||current],
   [inside?'Outside':'Inside',()=>this.houses(index,!inside)],['Back',()=>this.open()],
  ]});
 }
 tabs(ids,index,caption,preview,open,prefix){const base=Math.floor(index/4)*4,next=base+4>=ids.length?0:base+4;return [...ids.slice(base,base+4).map((id,i)=>({label:id,caption:caption(id),id:prefix+id,preview:preview(id),selected:base+i===index,action:()=>open(base+i)})),...(ids.length>4?[{label:'More',caption:'More',id:prefix+'page',preview:(u,p,cx,cy)=>text(u,p,cx,cy-4,'>',9).setOrigin(.5,0),action:()=>open(next)}]:[])];}
 confirmHouse(id,index,inside){const a=this.app,d=HOMES[id];a.ui.modal('YOUR HOME','Buy '+d.name,'Price / '+d.price.toLocaleString('en-US')+' coins\nIncludes furnished interior.\nOwned designs can be switched for free.',[
  ['Confirm purchase',()=>this.applyHouse(id,index,inside)],['Back',()=>this.houses(index,inside)],
 ]);}
 applyHouse(id,index,inside){const a=this.app;if(a.transitioning||!this.gate.accept(a.ui.time.now))return;const before=this.s.money;a.transact(s=>buyHouse(s,id));if(this.s.money<before)a.sound('shop:buy');a.scene.build();this.houses(index,inside);}
 decorations(category='garden',index=0){const ids=Object.keys(DECORATIONS).filter(id=>!DECORATIONS[id].cost&&!!DECORATIONS[id].outdoors===(category==='garden')),id=ids[index],d=DECORATIONS[id],q=decorQuote(this.s,id),count=this.s.inventory[d.item],place=decorationAllowed(this.s.area,id);
  this.show({kicker:category==='garden'?'Trees & garden':'Furniture & room decor',title:d.name,preview:id,description:d.description||'Place, turn and move this piece whenever you like.',materials:[{name:'Coins',need:d.price,have:this.s.money,icon:'coin'}],note:!customizationAvailable(this.s)?'Visit Home or Farm to buy pieces.':!place?'Outdoor piece / place outside at Home or Farm.':'In Bag: '+count+'. Tap placed decor to move or remove.',status:'Owned: '+count,tabs:this.tabs(ids,index,k=>({bookcase:'Books',birdbath:'Bath',blossom:'Bloom',flowers:'Flora',hedge:'Hedge',planter:'Plant',lantern:'Lamp',table:'Table',barrel:'Barrel',bench:'Bench',path:'Path',fence:'Fence',oak:'Oak',palm:'Palm',rug:'Rug',vase:'Vase'})[k],decorationThumb,i=>this.decorations(category,i),'shop-decor-'),actions:[
   ['Buy one',()=>this.purchaseDecor(id,category,index),!q.ok],['Place',()=>this.app.placement.begin(id),!count||!place],['Back',()=>this.open()],
  ]});
 }
 purchaseDecor(id,category,index){const a=this.app;if(a.transitioning||!this.gate.accept(a.ui.time.now))return;const before=this.s.money;a.transact(s=>buyDecoration(s,id));if(this.s.money<before)a.sound('shop:buy');this.decorations(category,index);}
}
