import {LanguageService} from './i18n/language.js';
import {loadMyanmarFont} from './i18n/myanmarText.js';
import {waterWithCan} from './systems/wateringCan.js';
import {residentReaction} from './systems/residents.js';
import {CustomizationPanel} from './ui/CustomizationPanel.js';
import {AudioManager} from './audio/AudioManager.js';
import {StoryPanel} from './ui/StoryPanel.js';
import {drawAudioPanel} from './ui/AudioPanel.js';
import {recordStory,syncStory} from './systems/story.js';
import {testingCreditEnabled,testingCredit} from './systems/testingCredit.js';
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
import {PlacementController} from './ui/PlacementController.js';
import {ResourcePanel} from './ui/ResourcePanel.js';
import {ORDERS} from './data/settlement.js';
import {areaDecorations} from './systems/settlementGeometry.js';
import {placeDecoration} from './systems/settlement.js';
import {ROOM} from './data/interior.js';
import {waterPeriod} from './systems/watering.js';
import Phaser from 'phaser';
import {toolSelection} from './systems/toolSelection.js';
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
    this.language=new LanguageService(storage);this.audio=new AudioManager({storage});this.ambience=this.audio;this.audio.bind();this.storyPanel=new StoryPanel(this);
    this.bagPanel=new BagPanel(this);this.wildernessMap=new WildernessMap(this);this.tradePanel=new TradePanel(this);this.farmOffice=new FarmOffice(this);this.resourcePanel=new ResourcePanel(this);this.customizationPanel=new CustomizationPanel(this);this.placement=new PlacementController(this);this.saves=new SaveService(storage);this.scene=new WorldScene(this);this.ui=new Interface(this);
  }
  ready(){this.ui.languageMenu(()=>this.ui.title());}
  grantTestingCoins(){
    if(!this.testingCreditEnabled)return;
    const receipt=this.saves.grantTestingCoins(this.testingCreditEnabled);this.ui.title();
    this.ui.toast(receipt?(receipt.added?'Added '+receipt.added+' testing coins. ':'Testing coins already added. ')+'Saved balance / '+receipt.balance+'c.':this.saves.error);
  }
  start(state){if(!state)return;if(this.testingCreditEnabled)state=testingCredit(state,this.testingCreditEnabled).state;this.audio.startWorld(state);this.placement.draft=null;this.placement.original=null;this.state=state;if(state.health<=0)defeat(state);this.scene.build();this.scene.travelReady=this.scene.time.now+TRAVEL_COOLDOWN;this.ui.play();this.journalSeen=state.story.flags.length;syncStory(state);this.save();if(state.story.completed&&!state.story.endingSeen)this.storyPanel.completion();else if(state.story.intro==='pending')this.storyPanel.intro();}
  newGame(character){this.start(newState(character,crypto.getRandomValues(new Uint32Array(1))[0]));}
  sound(key){this.audio.effect(key);this.scene.game.events.emit('sound:request',{key,area:this.state?.area,day:this.state?.day});}
  cycleCrop(){if(this.paused||!this.state)return;if(this.placement.draft)this.placement.cancel();this.sound('ui:move');this.state.selectedCrop=CROP_IDS[(CROP_IDS.indexOf(this.state.selectedCrop)+1)%CROP_IDS.length];this.state.selected='seed';this.save();this.ui.feedback(CROPS[this.state.selectedCrop].name+' seeds selected.');}
  select(tool,{toggle=false}={}){if(!this.state||this.paused)return;this.sound('ui:move');this.pendingAttack=null;if(this.placement.draft)this.placement.cancel();this.state.selected=toolSelection(toggle?this.state.selected:'hand',tool);this.save();}
  save(show=false){if(!this.state)return;syncStory(this.state);this.state.roomSize={width:ROOM.width,height:ROOM.height};const ok=this.saves.write({...this.state,position:groundedPosition(this.state,this.scene.jumping)});if(show||(!ok&&!this.storageWarned))this.ui.toast(ok?'Your farm is saved.':this.saves.error);this.storageWarned=!ok;}
  transact(fn){const money=this.state.money,before=JSON.stringify(this.state);const message=fn(this.state);if(JSON.stringify(this.state)===before)this.sound('ui:disabled');if(this.state.money!==money){this.scene.atmosphere.coins(this.state.money-money,this.state.position);if(this.state.money>money)this.sound('coin:reward');}this.scene.renderCrops();this.save();if(message)this.ui.toast(message);return message;}
  advance(delta){const window=waterPeriod(this.state),day=this.state.day,energy=this.state.energy;tick(this.state,delta);if(this.state.story&&!this.state.story.completed)this.state.story.activeSeconds+=Math.max(0,Math.min(delta,100))/1000;if(window!==waterPeriod(this.state)||day!==this.state.day){this.scene.renderCrops();if(day!==this.state.day&&this.state.plots.some(p=>p.crop&&p.growth>=CROPS[p.crop].growthDays))this.sound('farming:growth');}if(energy>10&&this.state.energy<=10)this.ui.feedback('Low energy / rest at your bed');this.elapsed+=delta;if(this.elapsed>2500||day!==this.state.day){this.save();this.elapsed=0;}}
  use(pointed=null){
    if(this.scene.jumping?.active)return;
    if(this.paused||!this.state||this.transitioning)return;if(this.placement.draft){this.placement.confirm();return;}const c=pointed||this.scene.context();if(!c)return;if(this.state.selected!=='water')this.scene.faceContext(c);else if(!this.state.ownsCopperCan)this.scene.player.face(c.x-this.state.position.x,c.y-this.state.position.y);
    if(c.type==='keepsakePlace'){this.storyPanel.place();return;}
    if(c.type==='hunt'){this.attack(c.id);return;}
    if(c.type==='stone'){const before=this.state.inventory.stone;this.ui.feedback(collectStone(this.state,c.id));if(this.state.inventory.stone>before){this.scene.forestView.bits(c.x,c.y-12,0xc1bcac);this.sound('stone:collect');}this.save();return;}
    if(['chop','gatherGrass','placeGrass'].includes(c.type)){
      const now=this.scene.time.now;if(now<(this.nextGroundUse||0))return;this.nextGroundUse=now+450;
      const result=useVegetation(this.state,c);this.ui.feedback(result.message);if(!result.ok)this.sound('ui:disabled');
      if(result.ok){if(c.type==='chop')this.scene.treeProgress.hit(result);this.scene.refreshVegetation(result.felled);if(c.type==='chop'){this.scene.player.wateringCan.swing();this.sound('combat:swing');this.scene.impactStop=45;}this.scene.atmosphere.vegetation(c.type,c.x,c.y);this.sound(c.type==='chop'?(result.felled?'tree:fall':'tree:hit'):'farming:'+c.type);if(result.felled)this.sound('wood:pickup');this.save();}return;
    }
    if(c.type==='dig'||c.type==='waterGround'||c.type==='plot'&&this.state.selected==='water'){
      const now=this.scene.time.now;if(now<(this.nextGroundUse||0))return;this.nextGroundUse=now+450;
      const result=c.type==='dig'?digGround(this.state,c):c.type==='plot'&&this.state.ownsCopperCan?waterWithCan(this.state,c,this.scene.player.direction):waterGround(this.state,c,c.type==='plot'?c.index:undefined);
      this.ui.feedback(result.message);if(!result.ok&&c.type==='dig')this.sound('ui:disabled');if(result.ok){if(c.type==='dig'){this.scene.player.wateringCan.swing();this.scene.refreshVegetation();}this.scene.renderCrops();for(const tile of result.tiles||[result])this.scene.atmosphere.farming(c.type==='dig'?'dig':'water',tile.x,tile.y);this.sound('farming:'+(c.type==='dig'?'dig':'water'));this.save();}return;
    }
    if(c.type==='forage'){const before=this.state.inventory[c.item];this.ui.feedback(collectForage(this.state,c.id));if(this.state.inventory[c.item]>before){this.scene.forestView.collect(FORAGE_NODES.find(n=>n.id===c.id));this.sound('forest:collect');}this.save();return;}
    if(c.type==='treasure'){const before=this.state.story.keepsake,count=this.state.forest.treasures.length;this.transact(s=>recoverTreasure(s,c.id));if(this.state.story.keepsake!==before)this.sound('keepsake:collect');else if(count!==this.state.forest.treasures.length)this.sound('cache:open');return;}
    if(c.type==='stash'){const before=this.state.stash;this.transact(recoverStash);if(before&&!this.state.stash)this.sound('stash:recover');return;}
    if(c.type==='starter'){const claimed=this.state.starterSeedsClaimed;this.transact(collectStarterSeeds);if(!claimed&&this.state.starterSeedsClaimed){this.sound('item:pickup');this.ui.notice=null;this.ui.drawNotice();this.ui.showFarmObjective();}return;}
    if(c.type==='refill'){this.scene.atmosphere.refill(this.state.position);this.ui.toast('Watering can full. Water is unlimited for now.');return;}
    if(c.type==='farmOffice'){this.farmOffice.open();return;}
    if(c.type==='settlement'){this.resourcePanel.open();return;}
    if(c.type==='cooking'){this.sound('stove:open');this.resourcePanel.cooking();return;}
    if(c.type==='reclaimDecoration'){const piece=areaDecorations(this.state).find(d=>d.x===c.x&&d.y===c.y);if(piece)this.placement.inspect(piece);return;}
    if(c.type==='placeDecoration'){
      const now=this.scene.time.now;if(now<(this.nextGroundUse||0))return;this.nextGroundUse=now+450;
      const count=this.state.settlement.decorations.length,message=placeDecoration(this.state,c);
      if(this.state.settlement.decorations.length!==count){this.scene.build();this.sound('furniture:place');this.save();}this.ui.feedback(message);return;
    }
    if(c.type==='field'){this.farmOffice.field(c.field);return;}
    if(c.type==='seed'||c.type==='sell'){this.tradePanel.open(c.type);return;}
    if(c.type==='aid'){this.ui.modal('CITY / SEED AID','A fresh start','No coins for seeds? With fewer than 10 coins and no seeds, produce or living crops, collect one free Tomato seed each day.',[['Collect seed',()=>{this.transact(claimRecoverySeed);this.ui.close();},!recoveryEligible(this.state)],['Close',()=>this.ui.close()]]);return;}
    if(c.type==='dialog'){if(c.residentId&&this.state.area==='city'){recordStory(this.state,'resident');this.save();}this.ui.modal(LOCATIONS[this.state.area].name,c.title,c.residentId?residentReaction(this.state,c.body):c.body,[...(ORDERS.some(d=>d.resident===c.residentId)?[['Daily request',()=>this.resourcePanel.orders(c.residentId)]]:[]),['See you around',()=>this.ui.close()]]);return;}
    if(c.type==='hint'){this.ui.feedback(c.label);return;}
    if(c.type==='plot'){
      const before={...plotAt(this.state,c.index)},fruit=before.crop?this.state.inventory[CROPS[before.crop].produceKey]:0;
      const message=usePlot(this.state,c.index),after=plotAt(this.state,c.index);
      const action=!before.crop&&after.crop?'plant':before.crop&&this.state.inventory[CROPS[before.crop].produceKey]>fruit?'harvest':after.crop&&before.wateredDay!==after.wateredDay?'water':null;
      this.scene.renderCrops();this.save();this.ui.feedback(message);
      if(!action)this.sound(before.crop&&!after.crop?'farming:clear':'ui:disabled');
      if(action==='harvest'&&!this.state.hasVisitedCity)this.ui.showCityObjective();
      if(action){this.scene.atmosphere.farming(action,c.x,c.y,before.crop||after.crop);this.scene.events.emit('farming:'+action,{index:c.index,crop:before.crop||after.crop});this.sound('farming:'+action);}return;
    }
    if(c.type==='travel'){this.travel(c);return;}
    if(c.type==='bed'){this.sound('bed:open');
      const wake=clock({minute:wakeTime(this.state)});
      this.ui.modal('HOME','Sleep?',`Wake at ${wake}. Energy restored.`,[
        ['Sleep until '+wake,()=>{this.sound('sleep:begin');this.transact(s=>{sleep(s);return 'Rested / '+clock(s);});this.scene.build();this.ui.close();this.sound(this.state.minute<720?'morning:wake':'evening:wake');}],
        ['Not yet',()=>this.ui.close()],
      ]);return;
    }
  }
  attack(targetId=null){
    if(this.scene.jumping?.active)return;
    if(this.paused||!this.state||this.transitioning||this.pendingAttack||this.scene.combat.now<this.scene.combat.nextAttack)return;
    if(this.state.selected!=='axe')return;const weapon='axe';
    const direction=this.scene.player.direction;
    this.sound('combat:swing');this.pendingAttack={targetId,direction,weapon,remaining:120};
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
    if(result.ok){this.scene.forestView.attack(pending.direction,result);if(result.hit){this.scene.impactStop=55;this.sound(result.defeated?'animal:defeat':'combat:hit');}this.save();}
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
    cancelJump(this.state,this.scene.jumping);const first=!this.state.deathTutorialSeen,coins=defeat(this.state);this.sound('stash:drop');this.save();
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
      this.save();cam.fadeIn(140,38,40,45);this.transitioning=false;this.paused=false;if(c.portal)this.ui.toast('Return gate / Forest entrance');if(firstCity)this.ui.toast('Welcome to Lantern Square. Clara sells seeds; Niko buys your harvest.');
    });
  }
  pause(){if(this.transitioning||!this.state)return;if(this.paused){this.sound('ui:cancel');if(this.ui.menu?.escape)this.ui.menu.escape();else this.ui.close();return;}this.save();this.ui.modal('SIMPLE LIFE','Paused','',[
    ['Resume',()=>this.ui.close()],['Save',()=>this.save(true)],['Audio / '+(this.audio.muted?'MUTED':'ON'),()=>this.audioSettings()],['JOURNAL',()=>this.storyPanel.journal()],['Controls',()=>this.ui.help(()=>this.pauseMenu())],['Language',()=>this.ui.languageMenu(()=>this.pauseMenu())],['Return to title',()=>{this.save();this.audio.stopWorld();this.state=null;this.scene.build();this.ui.title();}],
  ]);}
  audioSettings(){this.ui.modal('SIMPLE LIFE','Audio','',[],'audio');this.ui.menu.draw=()=>drawAudioPanel(this.ui);this.ui.menu.escape=()=>this.pauseMenu();this.ui.layout();}
  pauseMenu(){this.paused=false;this.pause();}
}
function boot(fontReady){
const app=new Application();app.myanmarFontReady=fontReady;
const game=new Phaser.Game({type:new URLSearchParams(location.search).get('renderer')==='webgl'?Phaser.WEBGL:Phaser.CANVAS,parent:'game',width:innerWidth,height:innerHeight,backgroundColor:'#263e38',pixelArt:true,antialias:false,antialiasGL:false,roundPixels:true,scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%',autoCenter:Phaser.Scale.NO_CENTER},scene:[app.scene,app.ui],physics:{default:'arcade',arcade:{gravity:{x:0,y:0},debug:false}},audio:{noAudio:true},input:{activePointers:4,keyboard:{capture:[32,37,38,39,40]}}});
game.events.once('ready',()=>{
  // Phaser 3.90 captures touchcancel without checking cancelable. A rotation's
  // non-cancelable event still needs processing, without preventDefault warnings.
  const touch=game.input.touch;
  if(!touch?.target)return;
  const original=touch.onTouchCancel;
  touch.target.removeEventListener('touchcancel',original);
  touch.onTouchCancel=event=>{const capture=touch.capture;touch.capture=capture&&event.cancelable;try{original(event);}finally{touch.capture=capture;}app.ui.resetMovement();};
  touch.target.addEventListener('touchcancel',touch.onTouchCancel,{passive:false});
});
// Mobile resize events can arrive before the parent has its new layout. Observe
// the actual fullscreen host so canvas, cameras and UI use the same dimensions.
const host=document.getElementById('game');let resizeFrame=0;
const fitCanvas=()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{
  if(!game.isBooted)return;const width=host.clientWidth,height=host.clientHeight;
  if(width<=0||height<=0)return;
  const rect=game.canvas.getBoundingClientRect(),bounds=game.scale.canvasBounds;
  const moved=rect.left+scrollX!==bounds.x||rect.top+scrollY!==bounds.y||rect.width!==bounds.width||rect.height!==bounds.height;
  if(game.scale.width!==width||game.scale.height!==height){game.scale.getParentBounds();game.scale.resize(width,height);}
  else if(moved){game.scale.getParentBounds();game.scale.refresh();}
});};
// Rotation can cancel touches before Phaser receives their release. Reclaim the
// pointer slots and refresh the hit-test bounds again after the browser settles.
let settleTimer=0;
const rotateCanvas=()=>{app.ui.resetMovement();app.ui.input?.resetPointers();fitCanvas();clearTimeout(settleTimer);settleTimer=setTimeout(fitCanvas,250);};
const resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(fitCanvas):null;resizeObserver?.observe(host);
window.addEventListener('resize',fitCanvas);
window.addEventListener('orientationchange',rotateCanvas);
screen.orientation?.addEventListener('change',rotateCanvas);
window.visualViewport?.addEventListener('resize',fitCanvas);
window.visualViewport?.addEventListener('scroll',fitCanvas);
game.events.once('destroy',()=>{resizeObserver?.disconnect();cancelAnimationFrame(resizeFrame);clearTimeout(settleTimer);window.removeEventListener('resize',fitCanvas);window.removeEventListener('orientationchange',rotateCanvas);screen.orientation?.removeEventListener('change',rotateCanvas);window.visualViewport?.removeEventListener('resize',fitCanvas);window.visualViewport?.removeEventListener('scroll',fitCanvas);});
window.addEventListener('pagehide',()=>app.save());
window.addEventListener('blur',()=>{app.ui.resetMovement();if(app.scene.keys)Object.values(app.scene.keys).forEach(k=>k.reset());});
document.addEventListener('visibilitychange',()=>{if(document.hidden){app.ui.resetMovement();app.save();}});
// Read-only observability for automated canvas tests; no gameplay mutation hooks.
if(import.meta.env.DEV||new URLSearchParams(location.search).has('qa'))window.__simpleLife=Object.freeze({snapshot:()=>{
  const cam=app.scene.cameras.main;return {language:app.language.current,languagePersisted:app.language.persisted,testingGiftEnabled:app.testingCreditEnabled,state:app.state?structuredClone(app.state):null,paused:app.paused,input:structuredClone(app.input),audio:app.audio.snapshot(),ambience:app.audio.snapshot(),pendingAttack:app.pendingAttack?{...app.pendingAttack}:null,jump:app.scene.jumping?structuredClone(app.scene.jumping):null,grass:app.scene.grass?.snapshot()||null,groundPlants:[...(app.scene.vegetationVisuals||[])].filter(([id])=>id.startsWith('grass:')).map(([id,sprites])=>({id,visible:sprites.at(-1)?.visible===true})),canopies:(app.scene.canopies||[]).map(c=>({frame:c.frame??c.sprite.frame.name,texture:c.sprite.texture.key,x:c.x,y:c.y,alpha:c.sprite.alpha,baseX:c.baseX,width:c.width,height:c.height})),combat:app.scene.combat?structuredClone(app.scene.combat):null,travelReady:app.scene.travelReady,water:app.scene.atmosphere?.waterView?{wading:app.scene.atmosphere.waterView.wading,reflection:app.scene.atmosphere.waterView.reflection.visible,phase:app.scene.atmosphere.elapsed}:null,wildlife:app.scene.forestView?.animals?.map(a=>({id:a.definition.id,frame:a.sprite.frame.name,visible:a.sprite.visible,texture:a.sprite.texture.key,originY:a.sprite.originY,flipX:a.sprite.flipX,x:a.sprite.x,y:a.sprite.y,width:a.sprite.displayWidth,height:a.sprite.displayHeight,shadow:a.shadow.visible}))||[],woodland:app.scene.forestView?.woodland?.animals.map(a=>({species:a.species,frame:a.sprite.frame.name,visible:a.sprite.visible,x:a.p.x,y:a.p.y}))||[],forestNodes:app.scene.forestView?.nodes.map(n=>({id:n.node.id,visible:n.sprite.visible}))||[],menu:app.ui.menu?.kind||null,menuContent:app.ui.menu?{title:app.ui.menu.title,body:app.ui.menu.body}:null,trade:app.ui.menu?.kind==='trade'?{type:app.tradePanel.type,crop:app.tradePanel.ids[app.tradePanel.index],priceLabel:app.tradePanel.priceText?.text,quantity:app.tradePanel.quantity,details:app.tradePanel.details,textBounds:app.ui.root.list.filter(c=>(c.type==='BitmapText'||c.uiText)&&c.visible).map(c=>({text:c.text,...(({x,y,width,height})=>({x,y,w:width,h:height}))(c.getBounds())}))}:null,lighting:{alpha:app.scene.night?.alpha,color:app.scene.night?.fillColor},residents:app.scene.residents?.snapshot()||[],merchants:(app.scene.merchants||[]).map(n=>({kind:n.kind,visible:n.sprite.visible})),menuBounds:app.ui.menu?app.ui.menuBounds:null,worldTexts:app.scene.children.list.filter(t=>t.type==='BitmapText'||t.uiText).map(t=>({source:t.sourceText||t.text,text:t.text,font:t.font,size:t.fontSize,visible:t.visible,x:t.x,y:t.y,w:t.displayWidth,h:t.displayHeight})),animalNames:!!app.scene.forestView?.animals?.some(a=>a.name)||!!app.scene.forestView?.woodland?.animals.some(a=>a.label),roadSigns:(app.scene.roadSigns||[]).map(({board,text,direction,arrow,postX})=>({board:{...board},direction,arrow,postX,text:{x:text.x,y:text.y,w:text.displayWidth,h:text.displayHeight}})),farmSigns:(app.scene.farmSigns||[]).map(({board,text,direction,arrow,postX})=>({board:{...board},direction,arrow,postX,text:{x:text.x-text.displayWidth*text.originX,y:text.y,w:text.displayWidth,h:text.displayHeight}})),controls:app.ui.controlSnapshot(),texts:app.ui.textSnapshot(),camera:cam?{x:cam.worldView.x,y:cam.worldView.y,width:cam.worldView.width,height:cam.worldView.height,zoom:cam.zoom}:null,heldTool:app.scene.player?{frame:app.scene.player.wateringCan.can.frame.name,originX:app.scene.player.wateringCan.can.originX,originY:app.scene.player.wateringCan.can.originY,rotation:app.scene.player.wateringCan.can.rotation,flip:app.scene.player.wateringCan.can.flipX,flipY:app.scene.player.wateringCan.can.flipY,depth:app.scene.player.wateringCan.can.depth,x:app.scene.player.wateringCan.can.x,y:app.scene.player.wateringCan.can.y,visible:app.scene.player.wateringCan.can.visible}:null,player:app.scene.player?{direction:app.scene.player.direction,frame:app.scene.player.sprite.frame.name,height:app.scene.player.sprite.displayHeight*cam.zoom}:null,context:app.scene.context(),prompt:app.ui.hud?.prompt?.visible?{x:app.ui.hud.prompt.x*2,y:app.ui.hud.prompt.y*2,w:app.ui.hud.promptWidth*2,h:28}:null,room:{width:ROOM.width,height:ROOM.height,spawn:{...ROOM.spawn},bed:{...ROOM.bed},exit:{...ROOM.exit}},placement:app.placement.snapshot(),treeProgress:app.scene.treeProgress?.snapshot()||null,resourcePage:app.ui.menu?.kind==='resources'?app.ui.menu.page:null,cropInfo:app.ui.hud?.cropInfo?.snapshot()||null,farmGuide:app.ui.hud?.farmGuide?.snapshot()||null,collisionDebug:!!app.scene.collisionWorld?.debug};
}});

}
loadMyanmarFont().then(boot);
