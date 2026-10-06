import {panel,text,icon,button,UI_COLORS} from './pixelWidgets.js';
import {clock,phase} from '../systems/time.js';
import {LOCATIONS} from '../data/locations.js';
export class Hud {
  constructor(ui){this.ui=ui;this.scene=ui;this.app=ui.app;this.root=ui.add.container(0,0);ui.root.add(this.root);this.create();}
  create(){
    const u=this.ui,w=u.w,h=u.h,p=this.root;const top=u.safe.top+6,left=u.safe.left+6,right=w-u.safe.right-6;
    panel(u,p,left,top,88,43);this.day=text(u,p,left+7,top+4,'DAY 1',8);this.clock=text(u,p,left+7,top+15,'06:00',8,UI_COLORS.gold);
    icon(u,p,'sun',left+68,top+3,.75);icon(u,p,'heart',left+5,top+26,.75);icon(u,p,'energy',left+46,top+26,.75);
    this.health=u.add.rectangle(left+19,top+30,23,4,0xc75e41).setOrigin(0);p.add(this.health);this.energy=u.add.rectangle(left+60,top+30,21,4,0xd7af55).setOrigin(0);p.add(this.energy);
    this.healthValue=text(u,p,left+19,top+36,'100',6,UI_COLORS.muted);this.energyValue=text(u,p,left+60,top+36,'100',6,UI_COLORS.muted);
    panel(u,p,right-60,top,60,21);icon(u,p,'coin',right-57,top+3,.75);this.money=text(u,p,right-40,top+6,'60',8);
    button(u,p,'Pause',right-23,top+25,23,22,()=>this.app.pause(),{id:'pause',iconName:'pause'});
    this.area=text(u,p,right-61,top+28,'HOME',7,UI_COLORS.muted);
    const touch=u.touch;const portrait=w<h;const by=h-u.safe.bottom-(touch&&portrait?116:43),bw=28,bgap=3,start=Math.floor(w/2-(3*bw+2*bgap)/2);
    this.slots=[];
    for(const [i,tool,name]of [[0,'seed','seed'],[1,'water','can'],[2,'harvest','sickle']]){
      const x=start+i*(bw+bgap);const slot=button(u,p,tool,x,by,bw,28,()=>this.app.select(tool),{id:'tool-'+tool,iconName:name});
      this.slots.push({tool,slot,count:text(u,p,x+24,by+20,'',7).setOrigin(1,0)});text(u,p,x+4,by+3,String(i+1),6,UI_COLORS.muted);
    }
    this.selected=text(u,p,w/2,by-12,'SEED',7,UI_COLORS.light).setOrigin(.5,0);
    if(touch){
      const dx=left+3,dy=h-u.safe.bottom-73,size=22,gap=2;
      for(const [dir,label,col,row]of [['up','UP',1,0],['left','<',0,1],['down','DN',1,1],['right','>',2,1]]){
        const b=button(u,p,label,dx+col*(size+gap),dy+row*(size+gap),size,size,pointer=>{this.app.input[dir]=true;b.box.setAlpha(1);b.pointer=pointer.id;},{id:'move-'+dir});
        const release=pointer=>{if(b.pointer===pointer.id){this.app.input[dir]=false;b.pointer=null;b.box.setAlpha(.48);}};b.box.setAlpha(.48);b.box.on('pointerup',release);b.box.on('pointerout',release);
      }
      button(u,p,'USE',right-34,h-u.safe.bottom-61,34,32,()=>this.app.use(),{id:'use'});
    }
    this.prompt=u.add.container();p.add(this.prompt);this.promptPanel=panel(u,this.prompt,0,0,120,29);this.promptText=text(u,this.prompt,6,5,'',7,UI_COLORS.light,108);
  }
  update(s,c){
    this.day.setText('DAY '+s.day);this.clock.setText(clock(s)+' '+phase(s).slice(0,3));this.money.setText(String(s.money));this.area.setText(LOCATIONS[s.area].name);
    this.health.setSize(23*s.health/100,4);this.energy.setSize(21*s.energy/100,4);this.healthValue.setText(String(s.health));this.energyValue.setText(String(s.energy));
    for(const {tool,slot,count}of this.slots){slot.box.setFillStyle(s.selected===tool?0x826a43:0x344b40);slot.box.setStrokeStyle(s.selected===tool?2:1,s.selected===tool?0xd7af55:0x657553);count.setText(tool==='seed'?String(s.inventory.seed):tool==='harvest'?String(s.inventory.tomato):'');}
    this.selected.setText(s.selected==='seed'?'TOMATO SEED':s.selected==='water'?'WATERING CAN':'HARVEST TOOL');
    this.prompt.setVisible(!!c);if(!c)return;
    const cam=this.app.scene.cameras.main;const sx=(s.position.x-cam.worldView.x)*cam.zoom/2,sy=(s.position.y-cam.worldView.y)*cam.zoom/2;
    const above=sy-24*cam.zoom-34;const py=above<65&&this.ui.h<230?sy+9:Math.max(this.ui.safe.top+62,above);
    this.prompt.setPosition(Math.round(Math.max(6,Math.min(this.ui.w-126,sx-60))),Math.round(Math.min(this.ui.h-60,py)));
    let hint=c.label.replace(' · ',' / ').replace('Step outside','Outside').replace('Take the lane','Travel').replace('Follow the lane','Travel').replace('Visit the ','').replace('Rest at the bed','Rest / Sleep');
    if(c.type==='plot'){const plot=s.plots[c.index];hint=c.label;hint+=plot.growth===3?'\n3/3 days - Ripe':plot.crop?`\n${plot.growth}/3 days - ${plot.morning?'AM OK':'AM --'} ${plot.evening?'PM OK':'PM --'}`:'\nEmpty farm plot';}
    this.promptText.setText((this.ui.touch?'USE: ':'E: ')+hint);
  }
}
