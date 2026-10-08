import Phaser from 'phaser';
import {Hud} from './Hud.js';
import {panel,text,icon,button,UI_COLORS} from './pixelWidgets.js';
export class Interface extends Phaser.Scene {
  constructor(app){super('UI');this.app=app;this.controls=[];this.menu=null;this.notice=null;}
  create(){
    this.app.ui=this;this.input.addPointer(3);this.scale.on('resize',()=>this.layout());
    this.input.on('pointerup',pointer=>{for(const c of this.controls)c.release?.(pointer);});this.input.on('gameout',()=>{this.app.input={};});
    this.input.keyboard.on('keydown',e=>{if(!this.menu||e.repeat)return;if(this.menu.kind==='trade'&&['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();this.app.tradePanel.move(e.code==='ArrowLeft'?-1:1);return;}if(this.menu.kind==='survival'&&['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();this.app.survivalPanel.move(e.code==='ArrowLeft'?-1:1);return;}if(this.menu.kind==='wilderness'&&['ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();this.app.wildernessMap.move(e.code==='ArrowLeft'?-1:1);return;}const choices=this.controls.filter(c=>!c.disabled);if(!choices.length)return;if(e.code==='ArrowDown'||e.code==='Tab'){e.preventDefault();this.focus=(this.focus+1)%choices.length;}else if(e.code==='ArrowUp')this.focus=(this.focus+choices.length-1)%choices.length;else if(e.code==='Enter')choices[this.focus%choices.length]?.action();this.highlight();});
    this.app.ready();
  }
  layout(){
    this.root?.destroy(true);this.controls=[];this.root=this.add.container().setScale(2);this.w=Math.floor(this.scale.width/2);this.h=Math.floor(this.scale.height/2);
    const css=getComputedStyle(document.querySelector('#app'));const inset=side=>Math.ceil((parseFloat(css.getPropertyValue('--safe-'+side))||0)/2);
    this.safe={top:inset('top'),bottom:inset('bottom'),left:inset('left'),right:inset('right')};this.touch=this.scale.width<1000||matchMedia('(pointer:coarse)').matches;
    if(this.menu){this.hud=null;this.drawMenu();}else if(this.app.state)this.hud=new Hud(this);
    this.noticeLayer=this.add.container().setDepth(50);this.root.add(this.noticeLayer);this.drawNotice();
  }
  modal(kicker,title,body,buttons,kind='dialog'){
    this.app.paused=true;this.app.input={};this.notice=null;this.menu={kicker,title,body,buttons,kind};this.focus=0;this.layout();
  }
  close(){if(this.menu?.kind==='trade')this.app.sound('shop:close');this.menu=null;this.app.paused=false;this.app.input={};Object.values(this.app.scene.keys).forEach(k=>k.reset());this.layout();}
  highlight(){const choices=this.controls.filter(c=>!c.disabled);choices.forEach((c,i)=>c.box.setStrokeStyle(i===this.focus?2:1,i===this.focus?UI_COLORS.gold:UI_COLORS.edge));}
  drawMenu(){
    if(['trade','survival','wilderness'].includes(this.menu.kind)){this.menu.draw();return;}
    const {kicker,title,body:fullBody,buttons,kind}=this.menu,w=this.w,h=this.h;
    const body=h<200&&kicker==='ART LICENCES'?'ToffeeCraft / personal-use sample.':h<200&&kicker==='FARMERS & FOREST'?'Channeechan / Eris Esra\nNative sprites / adapted jump':h<200&&kicker==='ART & CREDITS'?'LimeZu / CC BY 4.0 / adapted.':h<200&&kicker==='WILDLIFE & RUINS'?'Craftpix / PNG frames repacked.':h<200&&kicker==='FIELD NOTES'&&title==='Controls'?'Move: WASD / arrows\nUse: E / Attack: Space or K\nForest jump: J / Shift\nTools: 1 / 2 / 3 / Q\nMap: M / Pause: Escape\nTouch: pad and action buttons.':fullBody;
    const veil=this.add.rectangle(0,0,w,h,0x102b25,kind==='title'?.36:.78).setOrigin(0).setInteractive();this.root.add(veil);veil.on('pointerdown',(p,x,y,e)=>e.stopPropagation());
    const pw=Math.min(kind==='title'?270:290,w-this.safe.left-this.safe.right-16),x=Math.floor((w-pw)/2);
    const titleSize=kind==='title'?(h<240?16:24):12;
    const measure=text(this,this.root,0,0,body,8,UI_COLORS.muted,pw-24);const bh=body?measure.height:0;measure.destroy();
    const portraitHeight=kind==='choose'?(h<200?44:48):0;const titleMeasure=text(this,this.root,0,0,kind==='title'?'SIMPLE\nLIFE':title,titleSize,UI_COLORS.light,pw-20);const th=titleMeasure.height+10;titleMeasure.destroy();
    const bodyGap=10,buttonStep=h<200?24:25;
    const total=12+10+th+bh+(bh?bodyGap:0)+portraitHeight+buttons.length*buttonStep+10;
    const y=Math.max(this.safe.top+5,Math.floor((h-total)/2));
    this.menuBounds={x:x*2,y:y*2,w:pw*2,h:total*2};
    panel(this,this.root,x,y,pw,total,kind==='title'?0x263e38:0x263e38);
    text(this,this.root,w/2,y+10,kicker,7,UI_COLORS.gold).setOrigin(.5,0);
    text(this,this.root,w/2,y+24,kind==='title'?'SIMPLE\nLIFE':title,titleSize,UI_COLORS.light,pw-20).setOrigin(.5,0).setCenterAlign();
    let cy=y+24+th;
    if(kind==='choose'){
      for(const [i,char]of ['boy','girl'].entries()){const sx=w/2+(i?35:-35);const p=this.add.sprite(sx,cy+17,char,0).setScale(1);this.root.add(p);text(this,this.root,sx,cy+35,char,8).setOrigin(.5,0);}
      cy+=portraitHeight;
    }
    if(body){text(this,this.root,x+12,cy,body,8,UI_COLORS.muted,pw-24);cy+=bh+bodyGap;}
    buttons.forEach(([label,fn,disabled=false],i)=>button(this,this.root,label,x+12,cy+i*buttonStep,pw-24,21,fn,{disabled,id:label}));this.highlight();
  }
  title(){
    const save=this.app.saves.load();this.notice=null;
    this.modal('A TROPICAL FARMING ADVENTURE','Simple Life','',[
      ['New Game',()=>save?this.confirmNew():this.choose()],
      [save?'Continue / Day '+save.day:'Continue',()=>this.app.start(save),!save],
      ['How to Play',()=>this.help(()=>this.title())],
      ['Credits',()=>this.credits()],
    ],'title');
    if(this.app.saves.error)this.toast(this.app.saves.error);
  }
  credits(){this.modal('ART & CREDITS','Simple Life','Serene Village / LimeZu\nCC BY 4.0 / palette adapted.\nOriginal forest / Codex-assisted.',[['Asset source',()=>window.open('https://limezu.itch.io/serenevillagerevamped','_blank','noopener')],['More art credits',()=>this.suppliedCredits()],['Wildlife & ruins',()=>this.craftpixCredits()],['Back',()=>this.title()]]);}
  suppliedCredits(){this.modal('FARMERS & FOREST','Artist credits','Farmers / Channeechan\nTemplate / Eris Esra', [['Farmer source & terms',()=>window.open('https://channeechan.itch.io/cute-farmer-character','_blank','noopener')],['Original character template',()=>window.open('https://erisesra.itch.io/character-templates-pack','_blank','noopener')],['Forest & licences',()=>this.artLicence()]]);}
  artLicence(){this.modal('ART LICENCES','Forest sample','Forest sample / ToffeeCraft\nStandard Free / personal use', [['Forest source & terms',()=>window.open('https://toffeecraft.itch.io/forest-nature-pack','_blank','noopener')],['CC BY 4.0 licence',()=>window.open('https://creativecommons.org/licenses/by/4.0/','_blank','noopener')],['Back',()=>this.credits()]]);}
  craftpixCredits(){this.modal('WILDLIFE & RUINS','Craftpix','Hunt animals, ruins and\nplant sprites / Craftpix.\nFreebie licence / selected\nPNG frames repacked.',[['Craftpix assets',()=>window.open('https://craftpix.net/freebies/','_blank','noopener')],['Craftpix licence',()=>window.open('https://craftpix.net/file-licenses/','_blank','noopener')],['Back',()=>this.credits()]]);}
  confirmNew(){this.modal('NEW GAME','A fresh start?','Replace this browser\'s saved farm? Your current harvest and progress will be lost.',[['Keep my farm',()=>this.title()],['Start fresh',()=>this.choose()]]);}
  choose(){this.modal('CHOOSE YOUR FARMER','Make yourself at home','',[['Play as Boy',()=>this.app.newGame('boy')],['Play as Girl',()=>this.app.newGame('girl')],['Back',()=>this.title()]],'choose');}
  help(back,page=0){
    const body=page===0?'WASD / arrows: move\nE: use / Space or K: attack\nJ / Shift: jump in the forest\n1 / 2 / 3: choose a tool\nQ: change seed crop / BAG on touch\nM: wilderness map / Escape: pause\n\nTouch: pad, tools, USE / ATTACK / JUMP.\nWalk close to doors or plots.':'Collect 3 starter seeds by Home.\nPlant in the tilled field.\nWater 06-12 AND 16-22.\nSleep by day: wake at 20:00.\nWater PM, then sleep to 06:00.\nTime keeps moving at midnight.\nOne missed window wilts. Two kill.';
    this.modal('FIELD NOTES',page?'Your first harvest':'Controls',body,[[page?'Got it':'Next / Farming',()=>page?back():this.help(back,1)],...(!page?[['Close',back]]:[])]);
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
  update(){if(this.notice&&this.time.now>this.notice.until){this.notice=null;this.drawNotice();}if(this.app.state&&!this.menu)this.hud?.update(this.app.state,this.app.scene.context());if(this.noticeLayer)this.noticeLayer.setVisible(!this.hud?.cropInfo.root.visible||!!this.menu);}
  controlSnapshot(){return this.controls.map(({id,label,x,y,w,h,disabled})=>({id,label,x:x*2,y:y*2,w:w*2,h:h*2,disabled}));}
}
