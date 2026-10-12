import {placementControls} from './PlacementControls.js';
import {mobileControls} from './MobileControls.js';
import {CROPS} from '../data/crops.js';
import {CropInfo} from './CropInfo.js';
import {FarmGuide} from './FarmGuide.js';
import {wateringLabel} from '../systems/watering.js';
import {panel,frame,text,button,UI_COLORS} from './pixelWidgets.js';
import {pixels} from './statusArt.js';
import {hudLayout,displayClock} from './layouts.js';
import {meterFrame,meterBadge,meterGlyph} from './vitalMeter.js';
export class Hud {
 constructor(ui){this.ui=ui;this.app=ui.app;this.root=ui.add.container();ui.root.add(this.root);this.signature=this.key();this.create();}
 key(){return (!!this.app.placement?.draft)+':'+this.app.state.area+':'+this.app.state.selectedCrop+':'+this.app.state.selectedDecoration+':'+(['shovel','axe','hand','grass','decorate'].includes(this.app.state.selected)?this.app.state.selected:'shovel');}
 create(){
  const u=this.ui,w=u.w,h=u.h,p=this.root,s=this.app.state,top=u.safe.top+6,left=u.safe.left+6,right=w-u.safe.right-6-(u.touch&&w>h&&h<150?36:0),scale=u.touch?.75:1;
  const healthWidth=Math.min(u.touch?120:140,w-96),barX=21,barW=healthWidth-21;
  const vitals=u.add.container(left,top).setScale(scale);p.add(vitals);
  const meters=u.add.graphics();vitals.add(meters);meterFrame(meters,barX,4,barW);meterFrame(meters,barX,36,barW);
  this.health=u.add.rectangle(barX+4,8,barW-8,9,0xce4438).setOrigin(0);this.energy=u.add.rectangle(barX+4,40,barW-8,9,0xe6b642).setOrigin(0);vitals.add([this.health,this.energy]);this.healthWidth=this.energyWidth=barW-8;
  this.healthShine=u.add.rectangle(barX+4,8,barW-8,2,0xee6950).setOrigin(0);this.energyShine=u.add.rectangle(barX+4,40,barW-8,2,0xffda68).setOrigin(0);vitals.add([this.healthShine,this.energyShine]);
  const badges=u.add.graphics();vitals.add(badges);meterBadge(badges,0,0);meterBadge(badges,0,32);
  const heart=u.add.graphics();vitals.add(heart);heart.setScale(2).setPosition(6,6);meterGlyph(heart,'heart',0xcf4939);
  const bolt=u.add.graphics();vitals.add(bolt);bolt.setScale(2).setPosition(6,38);meterGlyph(bolt,'bolt',0xffd45a);
  this.waterWindow=text(u,p,left,top+(u.touch?50:64),'',6,UI_COLORS.cream);
  const clockGroup=u.add.container(right,top).setScale(scale);p.add(clockGroup);
  panel(u,clockGroup,-76,0,76,37);this.clock=text(u,clockGroup,-38,7,'6:00 am',10).setOrigin(.5,0);this.day=text(u,clockGroup,-38,23,'Day 1',8,UI_COLORS.gold).setOrigin(.5,0);
  panel(u,clockGroup,-70,40,70,18,UI_COLORS.selected);this.money=text(u,clockGroup,-35,45,'60c',8).setOrigin(.5,0);
  if(this.app.placement?.draft){this.slots=[];this.placementSignature=this.app.placement.draft.direction+':'+this.app.placement.quote().message;placementControls(u,p);return;}
  const layout=hudLayout(u,s.area==='forest',s.selected==='axe',s.selected),{cell,x,y,gap}=layout;this.slots=[];
  for(const [i,id]of layout.ids.entries()){
    const sx=x+i*(cell+gap),tools={seed:CROPS[s.selectedCrop].seedIcon,water:'watering-can-item',harvest:'sickle',shovel:'shovel-item',axe:'axe-item',hand:'hand-item',grass:'grass-item',decorate:'stone-item'},glyphs={bag:'bag',map:'map',pause:'menu',customize:'customize'};
   const action=()=>id==='bag'?this.app.bagPanel.open('seeds'):id==='map'?this.app.wildernessMap.open():id==='pause'?this.app.pause():id==='customize'?this.app.customizationPanel.open():['shovel','axe','hand','grass','decorate'].includes(id)?this.app.bagPanel.open('gear',id):this.app.select(id,{toggle:true});
   const control=button(u,p,id==='map'?'Map':id,sx,y,cell,cell,action,{id:id==='bag'?'choose-seeds':id==='map'?'wilderness-map':['seed','water','harvest','shovel','axe','hand','grass','decorate'].includes(id)?'tool-'+id:id,iconName:tools[id]||null,glyph:glyphs[id]&&id!=='map'?(g,a,b,c)=>pixels(g,glyphs[id],a,b,c):null});
   if(['seed','water','harvest','shovel','axe','hand','grass','decorate'].includes(id)){this.slots.push({tool:id,slot:control,count:text(u,p,sx+cell-3,y+cell-8,'',6).setOrigin(1,0)});}
  }
  if(u.touch)this.mobile=mobileControls(u,p);
  this.promptY=y-19;this.prompt=u.add.container();p.add(this.prompt);this.promptPanel=panel(u,this.prompt,0,0,156,15);this.promptText=text(u,this.prompt,5,4,'',6,UI_COLORS.light,146);this.promptArrow=u.add.graphics();this.prompt.add(this.promptArrow);this.cropInfo=new CropInfo(this);this.farmGuide=new FarmGuide(this);
 }
 update(s,c){
  if(this.signature!==this.key()){this.ui.layout();return;}
  if(this.app.placement?.draft){const signature=this.app.placement.draft.direction+':'+this.app.placement.quote().message;if(signature!==this.placementSignature){this.ui.layout();return;}}else{this.cropInfo.update(s,c);this.farmGuide.update(s);}this.waterWindow.setVisible(!(this.cropInfo?.root.visible&&this.ui.touch&&this.ui.w>this.ui.h));this.waterWindow.setText(s.area==='farm'?wateringLabel(s):'');this.clock.setText(displayClock(s.minute));this.day.setText('Day '+s.day);this.money.setText(s.money+'c');
  const health=Math.max(0,Math.floor(this.healthWidth*s.health/100)),energy=Math.max(0,Math.floor(this.energyWidth*s.energy/100));
  this.health.setSize(health,9);this.energy.setSize(energy,9);this.healthShine.setSize(health,2);this.energyShine.setSize(energy,2);
  if(this.app.placement?.draft)return;
  this.mobile?.updateAction(c);
  for(const {tool,slot,count}of this.slots){slot.box.setFillStyle(s.selected===tool?UI_COLORS.selected:UI_COLORS.cream);slot.box.setStrokeStyle(s.selected===tool?2:1,UI_COLORS.edge);count.setText(tool==='seed'?String(s.inventory[CROPS[s.selectedCrop].seedKey]):'');}
  const feedback=this.ui.feedbackState?.until>this.ui.time.now?this.ui.feedbackState.text:null;
  this.prompt.setVisible(!!c||!!feedback);if(!c&&!feedback)return;
  let hint=(feedback||c.label).replace(' · ',' / ').replace('Step outside','Outside').replace('Take the lane','Travel').replace('Follow the lane','Travel').replace('Visit the ','').replace('Rest at the bed','Sleep');
  const farmDirection=hint==='FARM / SOUTH';if(farmDirection)hint='FARM';
  this.promptText.setText((feedback||c.type==='hint'?'':this.ui.touch?(['hunt','chop'].includes(c.type)?'Hit / ':'Use / '):'E / ')+hint);
  const pw=Math.min(156,Math.ceil(this.promptText.width)+10+(farmDirection?9:0));this.promptWidth=pw;this.promptPanel.clear();frame(this.promptPanel,0,0,pw,15);
  this.promptArrow.clear();if(farmDirection){this.promptArrow.fillStyle(UI_COLORS.light).fillRect(pw-10,3,2,6).fillRect(pw-12,7,6,2).fillRect(pw-10,9,2,2);}
  const cam=this.app.scene.cameras.main,px=(s.position.x-cam.worldView.x)*cam.zoom/2,py=(s.position.y-cam.worldView.y)*cam.zoom/2;
  const overlaps=Math.abs(px-this.ui.w/2)<pw/2+12&&py>this.promptY&&py-30<this.promptY+15;
  this.prompt.setPosition(Math.round(this.ui.w/2-pw/2),overlaps?Math.round(py-46):this.promptY);
  const crop=this.cropInfo.snapshot();if(crop&&this.ui.touch&&this.ui.w>this.ui.h&&this.ui.h<240)this.prompt.setPosition(crop.x/2<this.ui.w/2?this.ui.w-this.ui.safe.right-pw-6:this.ui.safe.left+6,this.promptY);
 }
}
