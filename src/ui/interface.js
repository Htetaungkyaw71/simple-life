import {translate} from '../i18n/language.js';
import {drawLanguageMenu,drawGettingStarted} from './GettingStarted.js';
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
    this.input.keyboard.on('keydown',e=>{if(!this.menu||e.repeat)return;if(this.menu.kind==='audio'&&['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();const c=this.controls.filter(c=>!c.disabled)[this.focus%this.controls.filter(c=>!c.disabled).length],id=c?.id?.match(/^audio-(master|music|ambience|effects)/)?.[1];if(id){this.app.audio.setVolume(id,Math.round((this.app.audio.preferences[id]+(e.code==='ArrowLeft'?-.25:.25))*4)/4);this.app.sound('ui:confirm');const f=this.focus;this.layout();this.focus=f;this.highlight();}return;}if(this.menu.kind==='bag'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)){e.preventDefault();this.app.bagPanel.move({ArrowLeft:-1,ArrowRight:1,ArrowUp:-(this.app.bagPanel.columns||4),ArrowDown:this.app.bagPanel.columns||4}[e.code]);return;}if(this.menu.kind==='trade'&&['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();this.app.tradePanel.move(e.code==='ArrowLeft'?-1:1);return;}if(this.menu.kind==='wilderness'&&['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();this.app.wildernessMap.move(e.code==='ArrowLeft'?-1:1);return;}const choices=this.controls.filter(c=>!c.disabled);if(!choices.length)return;if(e.code==='ArrowDown'||e.code==='Tab'){e.preventDefault();this.focus=(this.focus+1)%choices.length;}else if(e.code==='ArrowUp')this.focus=(this.focus+choices.length-1)%choices.length;else if(e.code==='Enter')choices[this.focus%choices.length]?.action();this.app.sound('ui:move');this.highlight();});
    this.app.ready();
  }
  resetMovement(){for(const c of this.controls)c.reset?.();this.app.input={};}
  layout(){
    this.resetMovement();
    if(this.viewportWidth!==undefined&&(this.viewportWidth!==this.scale.width||this.viewportHeight!==this.scale.height))this.input.resetPointers();
    this.viewportWidth=this.scale.width;this.viewportHeight=this.scale.height;
    this.root?.destroy(true);this.controls=[];this.root=this.add.container().setScale(2);this.w=Math.floor(this.scale.width/2);this.h=Math.floor(this.scale.height/2);
    const css=getComputedStyle(document.querySelector('#app'));const inset=side=>Math.ceil((parseFloat(css.getPropertyValue('--safe-'+side))||0)/2);
    this.safe={top:inset('top'),bottom:inset('bottom'),left:inset('left'),right:inset('right')};this.mobileInput=matchMedia('(pointer:coarse)').matches;this.touch=this.scale.width<1000||this.mobileInput;
    if(this.menu){this.hud=null;this.drawMenu();}else if(this.app.state)this.hud=new Hud(this);
    this.noticeLayer=this.add.container().setDepth(50);this.root.add(this.noticeLayer);this.drawNotice();
  }
  modal(kicker,title,body,buttons,kind='dialog'){
    if(this.app.placement?.draft)this.app.placement.cancel();
    this.app.sound('ui:open');this.app.paused=true;this.app.input={};this.notice=null;this.menu={kicker,title,body,buttons,kind};this.focus=0;this.layout();
  }
  close(){if(this.menu)this.app.sound('ui:close');this.menu=null;this.app.paused=false;this.app.input={};Object.values(this.app.scene.keys).forEach(k=>k.reset());this.layout();}
  highlight(){const choices=this.controls.filter(c=>!c.disabled);choices.forEach((c,i)=>c.box.setStrokeStyle(i===this.focus?2:1,i===this.focus?UI_COLORS.gold:UI_COLORS.edge));}
  drawMenu(){if(['language','getting-started','trade','wilderness','bag','resources','appearance','audio','intro','journal','completion'].includes(this.menu.kind)){this.menu.draw?.();return;}drawModal(this);}
  languageMenu(back){this.modal('','Language','',[],'language');if(this.app.myanmarFontReady===false)this.app.language.current='en';this.menu.draw=()=>drawLanguageMenu(this,language=>{this.app.language.select(language);document.documentElement.lang=language==='mm'?'my':'en';if(this.app.state)this.app.scene.build();back();});this.menu.escape=()=>{};this.layout();}
  gettingStarted(page=0,back=()=>this.close()){this.modal('','How to play','',[],'getting-started');this.menu.draw=()=>drawGettingStarted(this,page,p=>this.gettingStarted(p,back),back);this.menu.escape=back;this.layout();}
  title(){
    const save=this.app.saves.load();this.creditsBack=undefined;this.notice=null;
    this.modal('A TROPICAL FARMING ADVENTURE','Simple Life',this.app.testingCreditEnabled?'PLAYTEST / +100,000c gift':'',[
      ['Play',()=>save?this.confirmNew():this.choose()],
      ['Continue',()=>this.app.start(save),!save],
      ['Controls',()=>this.gettingStarted(0,()=>this.title())],
      ['Language',()=>this.languageMenu(()=>this.title())],
      ['Credits',()=>this.credits(this.creditsBack)],
      ...(this.app.testingCreditEnabled&&!import.meta.env.VITE_PLAYTEST?[['Add 100,000 test coins',()=>this.app.grantTestingCoins(),!save||save.testingCoinGrant===TESTING_COIN_GRANT]]:[]),
    ],'title');
    if(this.app.saves.error)this.toast(this.app.saves.error);
  }
  credits(back=()=>this.title()){this.creditsBack=back;this.modal('ART & CREDITS','Simple Life','Serene Village / LimeZu\nCC BY 4.0 / houses adapted.\nOriginal forest / Codex-assisted.',[['Village',()=>window.open('https://limezu.itch.io/serenevillagerevamped','_blank','noopener')],['Residents',()=>this.residentCredits()],['More art',()=>this.suppliedCredits()],['Wildlife',()=>this.craftpixCredits()],['Audio',()=>this.audioCredits()],['Back',()=>this.creditsBack()]]);}
  audioCredits(){this.modal('AUDIO CREDITS','Cozy sounds','Farm SFX & Nature / Spaceyyy\nFormerly Bramble & Byte\nTitle music / HuntSounds\nRooster / alys / public domain',[['Farm & Nature sources',()=>this.audioSources()],['Rooster source',()=>window.open('https://commons.wikimedia.org/wiki/File:Medium_rooster_crowing.ogg','_blank','noopener')],['Music source',()=>window.open('https://huntsounds.itch.io/cosy-sfx-volume-1','_blank','noopener')],['Back',()=>this.credits(this.creditsBack)]]);}
  audioSources(){this.modal('AUDIO CREDITS','Farm & Nature','Spaceyyy / formerly Bramble & Byte\nLocal audio edits / Codex',[['Farm SFX source',()=>window.open('https://aquumgifts.itch.io/cozy-farm-sfx','_blank','noopener')],['Nature source',()=>window.open('https://aquumgifts.itch.io/cozy-nature-ambience','_blank','noopener')],['Back',()=>this.audioCredits()]]);}
  residentCredits(){this.modal('TOWN RESIDENTS','Character art','Original people / Szadi art.\n3 Direction NPC Characters\nIncluded game-use licence.',[['Character pack',()=>window.open('https://szadiart.itch.io/3-direction-npc-characters','_blank','noopener')],['Character licence',()=>window.open('https://szadiart.itch.io/3-direction-npc-characters','_blank','noopener')],['Back',()=>this.credits(this.creditsBack)]]);}
  suppliedCredits(){this.modal('ART SOURCES','Artist credits','Farmer / user-generated PixelLab\nOther people / Szadi art.\nScenery / documented licensed packs',[['Farmer art',()=>this.farmerCredits()],['Residents',()=>this.residentCredits()],['Fonts',()=>this.fontCredits()],['Forest & licences',()=>this.artLicence()],['Back',()=>this.credits(this.creditsBack)]]);}
  farmerCredits(){this.modal('CHARACTER ART','Farmer art','Farmer / user-generated PixelLab\nOriginal exported pixels.\nLocal packing / Codex-assisted.',[['PixelLab terms',()=>window.open('https://www.pixellab.ai/termsofservice','_blank','noopener')],['Back',()=>this.suppliedCredits()]]);}
  fontCredits(){this.modal('FONT CREDITS','Thaleah & m5x7','Thaleah / Rick Hoppmann (Tiny Worlds)\nCC BY 4.0 / converted to bitmap.\nm5x7 / Daniel Linssen / CC0.\nNative pixels, local colour variants.',[['Thaleah source',()=>window.open('https://tinyworlds.itch.io/free-pixel-font-thaleah','_blank','noopener')],['m5x7 source',()=>window.open('https://managore.itch.io/m5x7','_blank','noopener')],['CC BY 4.0 licence',()=>window.open('https://creativecommons.org/licenses/by/4.0/','_blank','noopener')],['Myanmar font',()=>this.myanmarFontCredits()],['Back',()=>this.credits(this.creditsBack)]]);}
  myanmarFontCredits(){this.modal('FONT CREDITS','Noto Sans Myanmar UI','The Noto Project Authors / Google\nSIL Open Font License 1.1\nLocal Unicode font / original TTF.',[['Font source',()=>window.open('https://github.com/notofonts/noto-fonts/tree/main/hinted/ttf/NotoSansMyanmarUI','_blank','noopener')],['OFL licence',()=>window.open('https://openfontlicense.org/open-font-license-official-text/','_blank','noopener')],['Back',()=>this.fontCredits()]]);}
  artLicence(){this.modal('ART LICENCES','Original scenery','Original scenery & ending cue\nSimple Life / Codex-assisted\nOther audio / Audio credits', [['CC BY 4.0 licence',()=>window.open('https://creativecommons.org/licenses/by/4.0/','_blank','noopener')],['Audio',()=>this.audioCredits()],['Back',()=>this.credits(this.creditsBack)]]);}
  craftpixCredits(){this.modal('WILDLIFE & RUINS','Craftpix','Hunt animals, ruins and\nplant sprites / Craftpix.\nFreebie licence / selected\nPNG frames repacked.',[['Craftpix assets',()=>window.open('https://craftpix.net/freebies/','_blank','noopener')],['Character licence',()=>window.open('https://szadiart.itch.io/3-direction-npc-characters','_blank','noopener')],['Back',()=>this.credits(this.creditsBack)]]);}
  confirmNew(){this.modal('NEW GAME','A fresh start?','Replace this browser\'s saved farm? Your current harvest and progress will be lost.',[['Keep my farm',()=>this.title()],['Start fresh',()=>this.choose()]]);}
  choose(){this.modal('CHOOSE YOUR FARMER','Your farmer','',[['Play as Boy',()=>this.app.newGame('boy')],['Play as Girl',()=>this.app.newGame('girl')],['Back',()=>this.title()]],'choose');}
  help(back,page=0){
    const body=page===0?'WASD / arrows / move\nE / use   K / attack\nSpace / outdoor jump\n1-7 / tools   Q / crop\nB / bag   M / forest map\nEscape / pause\nTouch / circle to move\nArrow / Jump   Star / Use or Hit\nWalk closer, then press Use':page===2?'Place / preview before confirming\nTap or drag / adjust position\nArrows / small adjustments\nR or Turn / change direction\nE or Add / confirm\nEscape or Cancel / keep item\nTap a piece / Remove or Readjust': 'Crate / 3 starter seeds\n4 shovel / 5 axe / 6 put away / 7 grass\nWater once daily / any time\nHarvest after 3-6 watered days\nBed / restore energy\nMiss 3 days / recover with water\nMiss 4 days / dead';
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
  textSnapshot(){const result=[];const walk=(n,sx=1,sy=1)=>{if(!n.visible)return;sx*=n.scaleX;sy*=n.scaleY;if(n.type==='BitmapText'||n.uiText){const b=n.getBounds();result.push({text:n.text,font:n.font,size:n.fontSize,native:n.fontData.size,scaleX:sx,scaleY:sy,lineSpacing:n.lineSpacing,source:n.sourceText||n.text,x:b.x,y:b.y,w:b.width,h:b.height});}for(const c of n.list||[])walk(c,sx,sy);};if(this.root)walk(this.root);return result;}
  controlSnapshot(){return this.controls.map(({id,label,x,y,w,h,disabled})=>({id,label,x:x*2,y:y*2,w:w*2,h:h*2,disabled}));}
}
