import {forestRegion} from '../data/forest.js';
import {CROPS} from '../data/crops.js';
import {CropInfo} from './CropInfo.js';
import {FarmGuide} from './FarmGuide.js';
import {wateringLabel} from '../systems/watering.js';
import {panel,text,icon,button,UI_COLORS} from './pixelWidgets.js';
import {pixels} from './statusArt.js';
import {clock,isNight} from '../systems/time.js';
import {LOCATIONS} from '../data/locations.js';
export class Hud {
  constructor(ui){this.ui=ui;this.scene=ui;this.app=ui.app;this.root=ui.add.container(0,0);ui.root.add(this.root);this.create();}
  create(){
    const u=this.ui,w=u.w,h=u.h,p=this.root;const top=u.safe.top+6,left=u.safe.left+6,right=w-u.safe.right-6;
    panel(u,p,left,top,88,43);this.day=text(u,p,left+7,top+4,'DAY 1',8);this.clock=text(u,p,left+7,top+15,'06:00',8,UI_COLORS.gold);
    this.sky=u.add.graphics();p.add(this.sky);this.skyPosition={x:left+71,y:top+5};icon(u,p,'heart',left+5,top+26,.75);icon(u,p,'energy',left+46,top+26,.75);
    this.health=u.add.rectangle(left+19,top+30,23,4,0xc75e41).setOrigin(0);p.add(this.health);this.energy=u.add.rectangle(left+60,top+30,21,4,0xd7af55).setOrigin(0);p.add(this.energy);
    this.healthValue=text(u,p,left+19,top+36,'100',6,UI_COLORS.muted);this.energyValue=text(u,p,left+60,top+36,'100',6,UI_COLORS.muted);
    panel(u,p,left,top+45,88,12);this.waterWindow=text(u,p,left+5,top+48,'WATER AM 06-12',6,UI_COLORS.light);
    panel(u,p,right-60,top,60,21);icon(u,p,'coin',right-57,top+3,.75);this.money=text(u,p,right-40,top+6,'60',8);
    button(u,p,'Pause',right-23,top+25,23,22,()=>this.app.pause(),{id:'pause',iconName:'pause'});
    this.mapButton=button(u,p,'MAP',left,top+61,42,21,()=>this.app.wildernessMap.open(),{id:'wilderness-map'});
    this.region=text(u,p,w/2,top+5,'',6,UI_COLORS.gold,Math.max(40,w-180)).setOrigin(.5,0);
    this.area=text(u,p,right-61,top+28,'HOME',7,UI_COLORS.muted);
    const touch=u.touch;const portrait=w<h;const by=h-u.safe.bottom-(touch&&portrait?116:43),bw=28,bgap=3,start=Math.floor(w/2-(3*bw+2*bgap)/2);
    this.slots=[];
    for(const [i,tool,name]of [[0,'seed','seed'],[1,'water','can'],[2,'harvest','sickle']]){
      const x=start+i*(bw+bgap);const slot=button(u,p,tool,x,by,bw,28,()=>this.app.select(tool),{id:'tool-'+tool,iconName:name});
      this.slots.push({tool,slot,count:text(u,p,x+24,by+20,'',7).setOrigin(1,0)});text(u,p,x+4,by+3,String(i+1),6,UI_COLORS.muted);
    }
    button(u,p,'BAG',start+93,by+3,24,22,()=>this.app.tradePanel.open('plant'),{id:'choose-seeds'});
    this.selected=text(u,p,w/2,touch&&!portrait&&h<240?h-u.safe.bottom-10:by-12,'SEED',7,UI_COLORS.light).setOrigin(.5,0);
    if(touch){
      const dx=left+3,dy=h-u.safe.bottom-(portrait?73:49),size=22,gap=2;
      for(const [dir,label,col,row]of [['up','UP',1,0],['left','<',0,1],['down','DN',1,1],['right','>',2,1]]){
        const b=button(u,p,label,dx+col*(size+gap),dy+row*(size+gap),size,size,pointer=>{this.app.input[dir]=true;b.box.setAlpha(1);b.pointer=pointer.id;},{id:'move-'+dir});
        const release=pointer=>{if(b.pointer===pointer.id){this.app.input[dir]=false;b.pointer=null;b.box.setAlpha(.48);}};b.release=release;b.box.setAlpha(.48);b.box.on('pointerup',release);b.box.on('pointerout',release);
      }
      button(u,p,'USE',right-34,h-u.safe.bottom-(portrait?61:35),34,32,()=>this.app.use(),{id:'use'});
    }
    this.attackButton=button(u,p,'ATTACK',right-58,h-u.safe.bottom-(touch&&portrait?98:touch?72:76),58,28,()=>this.app.attack(),{id:'attack'});
    this.promptY=by-25;this.prompt=u.add.container();p.add(this.prompt);this.promptPanel=panel(u,this.prompt,0,0,156,14);this.promptText=text(u,this.prompt,5,3,'',6,UI_COLORS.light,146);this.promptArrow=u.add.graphics();this.prompt.add(this.promptArrow);this.cropInfo=new CropInfo(this);this.farmGuide=new FarmGuide(this);
  }
  update(s,c){
    const forest=s.area==='forest';this.mapButton.box.setVisible(forest);this.mapButton.text.setVisible(forest);this.mapButton.box.input.enabled=forest;this.region.setText(forest?forestRegion(s.position).name:'').setVisible(forest&&this.ui.w>=320);
    this.attackButton.box.setVisible(s.clubEquipped);this.attackButton.box.input.enabled=s.clubEquipped;
    // The text belongs to the same canvas container; hide it with its button.
    this.attackButton.text?.setVisible(s.clubEquipped);
    this.cropInfo.update(s,c);this.farmGuide.update(s);this.waterWindow.setText(wateringLabel(s));this.day.setText('DAY '+s.day);this.clock.setText(clock(s));this.sky.clear();pixels(this.sky,isNight(s)?'moon':'sun',this.skyPosition.x,this.skyPosition.y,isNight(s)?0xb9cadd:UI_COLORS.gold);this.money.setText(String(s.money));this.area.setText(s.area==='farm'?'FARM '+(s.currentFarm+1):LOCATIONS[s.area].name);
    this.health.setSize(23*s.health/100,4);this.energy.setSize(21*s.energy/100,4);this.healthValue.setText(String(s.health));this.energyValue.setText(String(s.energy));
    for(const {tool,slot,count}of this.slots){slot.box.setFillStyle(s.selected===tool?0x826a43:0x344b40);slot.box.setStrokeStyle(s.selected===tool?2:1,s.selected===tool?0xd7af55:0x657553);count.setText(tool==='seed'?String(s.inventory[CROPS[s.selectedCrop].seedKey]):tool==='harvest'?String(s.inventory.tomato):'');}
    this.selected.setText(s.selected==='seed'?CROPS[s.selectedCrop].name.toUpperCase()+' SEED':s.selected==='water'?'WATERING CAN':'HARVEST TOOL');
    const feedback=this.ui.feedbackState?.until>this.ui.time.now?this.ui.feedbackState.text:null;
    this.prompt.setVisible(!!c||!!feedback);if(!c&&!feedback)return;
    let hint=(feedback||c.label).replace(' · ',' / ').replace('Step outside','Outside').replace('Take the lane','Travel').replace('Follow the lane','Travel').replace('Visit the ','').replace('Rest at the bed','Rest / Sleep');
    const farmDirection=hint==='FARM / SOUTH';if(farmDirection)hint='FARM';
    this.promptText.setText((feedback||c.type==='hint'?'':this.ui.touch?'USE: ':'E: ')+hint);
    const pw=Math.min(156,Math.ceil(this.promptText.width)+10+(farmDirection?9:0));this.promptWidth=pw;
    this.promptPanel.clear().fillStyle(UI_COLORS.ink,.95).fillRect(0,0,pw,14).fillStyle(UI_COLORS.edge).fillRect(1,1,pw-2,12).fillStyle(UI_COLORS.panel,.96).fillRect(2,2,pw-4,10);
    this.promptArrow.clear();if(farmDirection){this.promptArrow.fillStyle(UI_COLORS.light);this.promptArrow.fillRect(pw-10,3,2,6);this.promptArrow.fillRect(pw-12,7,6,2);this.promptArrow.fillRect(pw-10,9,2,2);}
    const cam=this.app.scene.cameras.main,px=(s.position.x-cam.worldView.x)*cam.zoom/2,py=(s.position.y-cam.worldView.y)*cam.zoom/2;
    const overlaps=Math.abs(px-this.ui.w/2)<pw/2+12&&py>this.promptY&&py-30<this.promptY+14;
    this.prompt.setPosition(Math.round(this.ui.w/2-pw/2),overlaps?Math.round(py-46):this.promptY);
    const crop=this.cropInfo.snapshot();if(crop&&this.ui.touch&&this.ui.w>this.ui.h&&this.ui.h<240){this.prompt.setPosition(crop.x/2<this.ui.w/2?this.ui.w-this.ui.safe.right-pw-6:this.ui.safe.left+6,this.promptY);}
  }
}
