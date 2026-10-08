import {CROPS} from '../data/crops.js';
import {CropInfo} from './CropInfo.js';
import {FarmGuide} from './FarmGuide.js';
import {wateringLabel} from '../systems/watering.js';
import {panel,frame,text,button,UI_COLORS} from './pixelWidgets.js';
import {pixels,pixelArrow} from './statusArt.js';
import {hudLayout,displayClock,facingIndex} from './layouts.js';
export class Hud {
 constructor(ui){this.ui=ui;this.app=ui.app;this.root=ui.add.container();ui.root.add(this.root);this.signature=this.key();this.create();}
 key(){return this.app.state.area+':'+this.app.state.clubEquipped+':'+this.app.state.selectedCrop+':'+(['shovel','axe','hand','grass'].includes(this.app.state.selected)?this.app.state.selected:'shovel');}
 create(){
  const u=this.ui,w=u.w,h=u.h,p=this.root,s=this.app.state,top=u.safe.top+6,left=u.safe.left+6,right=w-u.safe.right-6;
  const healthWidth=Math.min(140,w-96),barX=left+21,barW=healthWidth-21;
  panel(u,p,barX,top+4,barW,18);this.health=u.add.rectangle(barX+4,top+8,barW-8,9,0xd4513e).setOrigin(0);p.add(this.health);this.healthWidth=barW-8;
  panel(u,p,left,top,28,28,UI_COLORS.panel,'badge');const heart=u.add.graphics();p.add(heart);heart.setScale(2).setPosition(left+6,top+6);pixels(heart,'heart',0,0,0xcf4939);
  panel(u,p,barX,top+26,barW,10);const leaf=u.add.graphics();p.add(leaf);pixels(leaf,'leaf',left+11,top+29,UI_COLORS.gold);this.energy=u.add.rectangle(barX+3,top+29,barW-6,4,0xc5993e).setOrigin(0);p.add(this.energy);this.energyWidth=barW-6;
  this.waterWindow=text(u,p,left,top+38,'',6,UI_COLORS.cream);
  panel(u,p,right-76,top,76,37);this.clock=text(u,p,right-38,top+7,'6:00 am',10).setOrigin(.5,0);this.day=text(u,p,right-38,top+23,'Day 1',8,UI_COLORS.gold).setOrigin(.5,0);
  panel(u,p,right-70,top+40,70,18,UI_COLORS.selected);this.money=text(u,p,right-35,top+45,'60c',8).setOrigin(.5,0);
  const layout=hudLayout(u,s.area==='forest',s.clubEquipped,s.selected),{cell,x,y,gap}=layout;this.slots=[];
  for(const [i,id]of layout.ids.entries()){
   const sx=x+i*(cell+gap),tools={seed:CROPS[s.selectedCrop].seedIcon,water:'watering-can-item',harvest:'sickle',shovel:'shovel-item',axe:'axe-item',hand:'hand-item',grass:'grass-item',attack:'wooden-club-item'},glyphs={bag:'bag',map:'map',pause:'menu'};
   const action=()=>id==='bag'?this.app.bagPanel.open('seeds'):id==='map'?this.app.wildernessMap.open():id==='pause'?this.app.pause():id==='attack'?this.app.attack():['shovel','axe','hand','grass'].includes(id)?this.app.bagPanel.open('gear'):this.app.select(id);
   const control=button(u,p,id==='map'?'Map':id,sx,y,cell,cell,action,{id:id==='bag'?'choose-seeds':id==='map'?'wilderness-map':['seed','water','harvest','shovel','axe','hand','grass'].includes(id)?'tool-'+id:id,iconName:tools[id]||null,glyph:glyphs[id]&&id!=='map'?(g,a,b,c)=>pixels(g,glyphs[id],a,b,c):null});
   if(['seed','water','harvest','shovel','axe','hand','grass'].includes(id)){this.slots.push({tool:id,slot:control,count:text(u,p,sx+cell-3,y+cell-8,'',6).setOrigin(1,0)});}
  }
  if(u.touch){
   const portrait=w<h,dx=left+3,dy=h-u.safe.bottom-(portrait?73:49),size=22;
   for(const [dir,label,col,row]of [['up','^',1,0],['left','<',0,1],['down','v',1,1],['right','>',2,1]]){
    const b=button(u,p,label,dx+col*24,dy+row*24,size,size,pointer=>{this.app.input[dir]=true;b.box.setAlpha(1);b.pointer=pointer.id;},{id:'move-'+dir,glyph:(g,a,b,c)=>pixelArrow(g,facingIndex[dir],a+4,b+4,c)});
    const release=pointer=>{if(b.pointer===pointer.id){this.app.input[dir]=false;b.pointer=null;b.box.setAlpha(.7);}};b.release=release;b.box.setAlpha(.7);b.box.on('pointerup',release);b.box.on('pointerout',release);
   }
   button(u,p,'USE',right-34,h-u.safe.bottom-(portrait?61:35),34,32,()=>this.app.use(),{id:'use'});
  }
  this.promptY=y-19;this.prompt=u.add.container();p.add(this.prompt);this.promptPanel=panel(u,this.prompt,0,0,156,15);this.promptText=text(u,this.prompt,5,4,'',6,UI_COLORS.light,146);this.promptArrow=u.add.graphics();this.prompt.add(this.promptArrow);this.cropInfo=new CropInfo(this);this.farmGuide=new FarmGuide(this);
 }
 update(s,c){
  if(this.signature!==this.key()){this.ui.layout();return;}
  this.cropInfo.update(s,c);this.farmGuide.update(s);this.waterWindow.setText(s.area==='farm'?wateringLabel(s):'');this.clock.setText(displayClock(s.minute));this.day.setText('Day '+s.day);this.money.setText(s.money+'c');
  this.health.setSize(Math.max(0,Math.floor(this.healthWidth*s.health/100)),9);this.energy.setSize(Math.max(0,Math.floor(this.energyWidth*s.energy/100)),4);
  for(const {tool,slot,count}of this.slots){slot.box.setFillStyle(s.selected===tool?UI_COLORS.selected:UI_COLORS.cream);slot.box.setStrokeStyle(s.selected===tool?2:1,UI_COLORS.edge);count.setText(tool==='seed'?String(s.inventory[CROPS[s.selectedCrop].seedKey]):'');}
  const feedback=this.ui.feedbackState?.until>this.ui.time.now?this.ui.feedbackState.text:null;
  this.prompt.setVisible(!!c||!!feedback);if(!c&&!feedback)return;
  let hint=(feedback||c.label).replace(' · ',' / ').replace('Step outside','Outside').replace('Take the lane','Travel').replace('Follow the lane','Travel').replace('Visit the ','').replace('Rest at the bed','Sleep');
  const farmDirection=hint==='FARM / SOUTH';if(farmDirection)hint='FARM';
  this.promptText.setText((feedback||c.type==='hint'?'':this.ui.touch?'USE / ':'E / ')+hint);
  const pw=Math.min(156,Math.ceil(this.promptText.width)+10+(farmDirection?9:0));this.promptWidth=pw;this.promptPanel.clear();frame(this.promptPanel,0,0,pw,15);
  this.promptArrow.clear();if(farmDirection){this.promptArrow.fillStyle(UI_COLORS.light).fillRect(pw-10,3,2,6).fillRect(pw-12,7,6,2).fillRect(pw-10,9,2,2);}
  const cam=this.app.scene.cameras.main,px=(s.position.x-cam.worldView.x)*cam.zoom/2,py=(s.position.y-cam.worldView.y)*cam.zoom/2;
  const overlaps=Math.abs(px-this.ui.w/2)<pw/2+12&&py>this.promptY&&py-30<this.promptY+15;
  this.prompt.setPosition(Math.round(this.ui.w/2-pw/2),overlaps?Math.round(py-46):this.promptY);
  const crop=this.cropInfo.snapshot();if(crop&&this.ui.touch&&this.ui.w>this.ui.h&&this.ui.h<240)this.prompt.setPosition(crop.x/2<this.ui.w/2?this.ui.w-this.ui.safe.right-pw-6:this.ui.safe.left+6,this.promptY);
 }
}
