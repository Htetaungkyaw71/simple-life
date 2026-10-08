// Offline actual UI draw commands; no browser, Phaser or live save is started.
import {mkdirSync,writeFileSync} from 'node:fs';
import {recorder,recording} from '../../tests/helpers/uiRecorder.js';
import {drawModal} from '../../src/ui/MenuView.js';
import {Hud} from '../../src/ui/Hud.js';
import {BagPanel} from '../../src/ui/BagPanel.js';
import {WildernessMap} from '../../src/ui/WildernessMap.js';
import {TradePanel} from '../../src/ui/TradePanel.js';
import {SurvivalPanel} from '../../src/ui/SurvivalPanel.js';
import {usePlot} from '../../src/systems/farming.js';
import {FARM_PLOTS} from '../../src/data/farms.js';
import {newState} from '../../src/systems/state.js';
import {REGIONS,FOREST_ENTRANCE} from '../../src/data/forest.js';
const dest='/tmp/simplelife-notebook-ui';mkdirSync(dest,{recursive:true});const noop=()=>{};
function setup(w,h){const u=recorder(w,h),s=newState();s.area='forest';s.position={...FOREST_ENTRANCE};s.forestTutorialComplete=true;s.inventory.wildBerry=4;s.inventory.mango=3;s.inventory.tomato=2;s.inventory.wildHide=2;s.energy=68;s.health=83;s.money=222;s.minute=468.750645;s.ownsClub=true;s.clubEquipped=true;s.forest.explored=REGIONS.slice(8).map(r=>r.id);
 const a={state:s,ui:u,input:{},paused:false,sound:noop,save:noop,select:noop,pause:noop,attack:noop,use:noop,scene:{player:{direction:'right'},cameras:{main:{worldView:{x:320,y:4528},zoom:1}},forestView:{energy:noop},keys:{}}};u.app=a;u.showFarmObjective=()=>{u.objectiveStarted=true;u.objectiveUntil=8000;};u.showCityObjective=()=>{u.cityStarted=true;u.cityUntil=8000;};a.bagPanel=new BagPanel(a);a.wildernessMap=new WildernessMap(a);a.tradePanel=new TradePanel(a);a.survivalPanel=new SurvivalPanel(a);return {u,a,s};}
for(const [w,h]of [[1280,720],[390,844],[640,360]])for(const mode of ['title','choose','pause','controls','bag','food','map','hud','shop','market','outfitter','crop','home','city']){
 const {u,a,s}=setup(w,h);
 if(mode==='title'||mode==='choose'||mode==='pause'||mode==='controls'){
  u.menu=mode==='title'?{kind:'title',title:'Simple Life',body:'',buttons:['Play','Continue','Controls','Credits'].map(v=>[v,noop])}:mode==='choose'?{kind:'choose',title:'Your farmer',body:'',buttons:['Play as Boy','Play as Girl','Back'].map(v=>[v,noop])}:mode==='controls'?{kind:'dialog',title:'Controls',body:'WASD / arrows / move\nE / use   K / attack\nSpace / forest jump\n1-3 / tools   Q / crop\nB / bag   M / forest map\nEscape / pause\nTouch / double tap ground to jump',buttons:['Farming >','Close'].map(v=>[v,noop])}:{kind:'dialog',title:'Paused',body:'',buttons:['Resume','Save','Controls','Return to title'].map(v=>[v,noop])};drawModal(u);
 }else if(mode==='bag'||mode==='food')a.bagPanel.open(mode==='food'?'food':'seeds');
 else if(mode==='map')a.wildernessMap.open();
 else if(['hud','crop','home','city'].includes(mode)){
  let context=null;if(mode==='home'||mode==='city'){s.area=mode;s.starterSeedsClaimed=true;a.scene.cameras.main.worldView={x:0,y:0,width:w,height:h};}
  if(mode==='crop'){s.area='farm';s.inventory.seed=3;usePlot(s,0);s.position={x:FARM_PLOTS[0].x,y:FARM_PLOTS[0].y+40};a.scene.cameras.main.worldView={x:s.position.x-w/2,y:s.position.y-h/2,width:w,height:h};context={...FARM_PLOTS[0],index:0,type:'plot',label:'Water Tomato'};}
  const hud=new Hud(u);hud.update(s,context);
 }else if(mode==='outfitter'){s.area='city';s.minute=480;s.ownsClub=false;s.clubEquipped=false;a.survivalPanel.open('outfitter');}
 else {s.area='city';s.minute=480;a.tradePanel.open(mode==='market'?'sell':'seed');}
 const file=dest+'/'+mode+'-'+w+'x'+h+'.json';writeFileSync(file,JSON.stringify(recording(u)));
}
console.log('42 offline UI command studies / no Phaser browser acceptance');
