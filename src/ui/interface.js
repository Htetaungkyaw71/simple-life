import {storyObjective} from '../systems/story.js';
import Phaser from 'phaser';
import {TESTING_COIN_GRANT} from '../systems/testingCredit.js';
import {drawModal} from './MenuView.js';
import {Hud} from './Hud.js';
import {panel,text,icon,button,UI_COLORS} from './pixelWidgets.js';
export class Interface extends Phaser.Scene {
  constructor(app){super('UI');this.app=app;this.controls=[];this.menu=null;this.notice=null;}
  create(){
    this.app.ui=this;this.input.addPointer(3);this.scale.on('resize',()=>this.layout());
    const release=pointer=>{for(const c of this.controls)c.release?.(pointer);};this.input.on('pointerup',release);this.input.on('pointerupoutside',release);this.input.on('pointermove',pointer=>{for(const c of this.controls)c.move?.(pointer);});this.input.on('gameout',()=>this.resetMovement());
    this.input.keyboard.on('keydown',e=>{if(!this.menu||e.repeat)return;if(this.menu.kind==='audio'&&['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();const c=this.controls.filter(c=>!c.disabled)[this.focus%this.controls.filter(c=>!c.disabled).length],id=c?.id?.match(/^audio-(master|music|ambience|effects)/)?.[1];if(id){this.app.audio.setVolume(id,Math.round((this.app.audio.preferences[id]+(e.code==='ArrowLeft'?-.25:.25))*4)/4);this.app.sound('ui:confirm');const f=this.focus;this.layout();this.focus=f;this.highlight();}return;}if(this.menu.kind==='bag'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)){e.preventDefault();this.app.bagPanel.move({ArrowLeft:-1,ArrowRight:1,ArrowUp:-4,ArrowDown:4}[e.code]);return;}if(this.menu.kind==='trade'&&['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();this.app.tradePanel.move(e.code==='ArrowLeft'?-1:1);return;}if(this.menu.kind==='wilderness'&&['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();this.app.wildernessMap.move(e.code==='ArrowLeft'?-1:1);return;}const choices=this.controls.filter(c=>!c.disabled);if(!choices.length)return;if(e.code==='ArrowDown'||e.code==='Tab'){e.preventDefault();this.focus=(this.focus+1)%choices.length;}else if(e.code==='ArrowUp')this.focus=(this.focus+choices.length-1)%choices.length;else if(e.code==='Enter')choices[this.focus%choices.length]?.action();this.app.sound('ui:move');this.highlight();});
    this.app.ready();
  }
  resetMovement(){for(const c of this.controls)c.reset?.();this.app.input={};}
  layout(){
    this.resetMovement();
    this.root?.destroy(true);this.controls=[];this.root=this.add.container().setScale(2);this.w=Math.floor(this.scale.width/2);this.h=Math.floor(this.scale.height/2);
    const css=getComputedStyle(document.querySelector('#app'));const inset=side=>Math.ceil((parseFloat(css.getPropertyValue('--safe-'+side))||0)/2);
    this.safe={top:inset('top'),bottom:inset('bottom'),left:inset('left'),right:inset('right')};this.touch=this.scale.width<1000||matchMedia('(pointer:coarse)').matches;
    if(this.menu){this.hud=null;this.drawMenu();}else if(this.app.state)this.hud=new Hud(this);
    this.noticeLayer=this.add.container().setDepth(50);this.root.add(this.noticeLayer);this.drawNotice();
  }
  modal(kicker,title,body,buttons,kind='dialog'){
    this.app.sound('ui:open');this.app.paused=true;this.app.input={};this.notice=null;this.menu={kicker,title,body,buttons,kind};this.focus=0;this.layout();
  }
  close(){if(this.menu)this.app.sound('ui:close');this.menu=null;this.app.paused=false;this.app.input={};Object.values(this.app.scene.keys).forEach(k=>k.reset());this.layout();}
  highlight(){const choices=this.controls.filter(c=>!c.disabled);choices.forEach((c,i)=>c.box.setStrokeStyle(i===this.focus?2:1,i===this.focus?UI_COLORS.gold:UI_COLORS.edge));}
  drawMenu(){if(['trade','wilderness','bag','resources','audio','intro','journal','completion'].includes(this.menu.kind)){this.menu.draw?.();return;}drawModal(this);}
  title(){
    const save=this.app.saves.load();this.creditsBack=undefined;this.notice=null;
    this.modal('A TROPICAL FARMING ADVENTURE','Simple Life','',[
      ['Play',()=>save?this.confirmNew():this.choose()],
      ['Continue',()=>this.app.start(save),!save],
      ['Controls',()=>this.help(()=>this.title())],
      ['Credits',()=>this.credits(this.creditsBack)],
      ...(this.app.testingCreditEnabled?[['Add 100,000 test coins',()=>this.app.grantTestingCoins(),!save||save.testingCoinGrant===TESTING_COIN_GRANT]]:[]),
    ],'title');
    if(this.app.saves.error)this.toast(this.app.saves.error);
  }
  credits(back=()=>this.title()){this.creditsBack=back;this.modal('ART & CREDITS','Simple Life','Serene Village / LimeZu\nCC BY 4.0 / houses adapted.\nOriginal forest & music / Codex.',[['Asset source',()=>window.open('https://limezu.itch.io/serenevillagerevamped','_blank','noopener')],['Town residents',()=>this.residentCredits()],['More art credits',()=>this.suppliedCredits()],['Wildlife & ruins',()=>this.craftpixCredits()],['Back',()=>this.creditsBack()]]);}
  residentCredits(){this.modal('TOWN RESIDENTS','Channeechan','Farmer bodies / Channeechan\nTemplate / Eris Esra\nHair and clothes adapted.\nLegacy atlas cells / Pipoya.',[['Farmer source & terms',()=>window.open('https://channeechan.itch.io/cute-farmer-character','_blank','noopener')],['Legacy source & terms',()=>window.open('https://pipoya.itch.io/pipoya-free-rpg-character-sprites-32x32','_blank','noopener')],['Back',()=>this.credits(this.creditsBack)]]);}
  suppliedCredits(){this.modal('FARMERS & FOREST','Artist credits','Farmers / Channeechan\nTemplate / Eris Esra', [['Farmer source & terms',()=>window.open('https://channeechan.itch.io/cute-farmer-character','_blank','noopener')],['Original character template',()=>window.open('https://erisesra.itch.io/character-templates-pack','_blank','noopener')],['Forest & licences',()=>this.artLicence()]]);}
  artLicence(){this.modal('ART LICENCES','Original art & audio','Original scenery & six scores\nSimple Life / Codex-assisted\nNo external audio recordings', [['CC BY 4.0 licence',()=>window.open('https://creativecommons.org/licenses/by/4.0/','_blank','noopener')],['Back',()=>this.credits(this.creditsBack)]]);}
  craftpixCredits(){this.modal('WILDLIFE & RUINS','Craftpix','Hunt animals, ruins and\nplant sprites / Craftpix.\nFreebie licence / selected\nPNG frames repacked.',[['Craftpix assets',()=>window.open('https://craftpix.net/freebies/','_blank','noopener')],['Craftpix licence',()=>window.open('https://craftpix.net/file-licenses/','_blank','noopener')],['Back',()=>this.credits(this.creditsBack)]]);}
  confirmNew(){this.modal('NEW GAME','A fresh start?','Replace this browser\'s saved farm? Your current harvest and progress will be lost.',[['Keep my farm',()=>this.title()],['Start fresh',()=>this.choose()]]);}
  choose(){this.modal('CHOOSE YOUR FARMER','Your farmer','',[['Play as Boy',()=>this.app.newGame('boy')],['Play as Girl',()=>this.app.newGame('girl')],['Back',()=>this.title()]],'choose');}
  help(back,page=0){
    const body=page===0?'WASD / arrows / move\nE / use   K / attack\nSpace / outdoor jump\n1-7 / tools   Q / crop\nB / bag   M / forest map\nEscape / pause\nTouch / circle to move\nJump / leap   Attack / swing\nTap people or ground / use':page===2?'Place / preview before confirming\nTap or drag / adjust position\nArrows / small adjustments\nR or Turn / change direction\nE or Place / confirm\nEscape or Cancel / keep item\nHand / pack into Bag': 'Crate / 3 starter seeds\n4 shovel / 5 axe / 6 hand / 7 grass\nWater once daily / any time\nHarvest after 3-6 watered days\nBed / restore energy\nMiss 3 days / recover with water\nMiss 4 days / dead';
    this.modal('FIELD NOTES',page===2?'Farm furniture':page?'Your first harvest':'Controls',body,[[page===2?'Got it':page?'Placing >':'Farming >',()=>page===2?back():this.help(back,page+1)],...(page<2?[['Close',back]]:[])]);
  }
  showCityObjective(){this.cityStarted=true;this.cityUntil=this.time.now+7000;}
  showFarmObjective(){this.objectiveStarted=true;this.objectiveUntil=this.time.now+7000;}
  play(){this.objectiveStarted=false;this.cityStarted=false;this.close();}
  feedback(value){this.feedbackState={text:value,until:this.time.now+1800};}
  toast(value){this.notice={text:value.replace(/[·→]/g,'/'),until:this.time.now+6000};this.drawNotice();}
  drawNotice(){
    if(!this.noticeLayer)return;this.noticeLayer.removeAll(true);if(!this.notice)return;
    const w=Math.min(240,this.w-16);const t=text(this,this.noticeLayer,8,6,this.notice.text,7,UI_COLORS.light,w-30);const height=t.height+12;
    const bg=panel(this,this.noticeLayer,0,0,w,height);this.noticeLayer.sendToBack(bg);
    const close=text(this,this.noticeLayer,w-15,5,'X',8,UI_COLORS.gold).setInteractive({useHandCursor:true});close.on('pointerdown',(p,x,y,e)=>{e.stopPropagation();this.notice=null;this.drawNotice();});
    this.noticeLayer.setPosition(Math.floor((this.w-w)/2),this.menu?this.safe.top+5:Math.max(68,this.h-(this.touch&&this.w<this.h?155:90)-height));
  }
  update(){if(this.app.state&&!this.menu&&this.app.state.story.flags.length>(this.app.journalSeen??0)){this.app.journalSeen=this.app.state.story.flags.length;this.app.sound('journal:update');this.toast('Journal updated / '+storyObjective(this.app.state).step);}if(this.notice&&this.time.now>this.notice.until){this.notice=null;this.drawNotice();}if(this.app.state&&!this.menu)this.hud?.update(this.app.state,this.app.scene.context());if(this.noticeLayer)this.noticeLayer.setVisible(!this.hud?.cropInfo?.root.visible||!!this.menu);}
  controlSnapshot(){return this.controls.map(({id,label,x,y,w,h,disabled})=>({id,label,x:x*2,y:y*2,w:w*2,h:h*2,disabled}));}
}
