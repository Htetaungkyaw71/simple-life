import Phaser from 'phaser';
import { WORLD } from '../config.js';
import { LOCATIONS, walkable } from '../data/locations.js';
import { PLOTS } from '../data/crops.js';
import { drawWorld, makeCharacter } from '../art/worldArt.js';
export class WorldScene extends Phaser.Scene {
  constructor(controller) { super('World'); this.app=controller; }
  create() { this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,ESC,ONE,TWO,THREE'); // Key-down events preserve even taps shorter than one animation frame.
    this.keys.ESC.on('down',()=>this.app.pause());
    for(const key of ['E','SPACE'])this.keys[key].on('down',()=>this.app.use());
    for(const [key,tool] of [['ONE','seed'],['TWO','water'],['THREE','harvest']])this.keys[key].on('down',()=>{if(!this.app.paused)this.app.select(tool);});
    this.build(); this.app.ready(); }
  build() {
    this.children.removeAll(true);
    const s=this.app.state; drawWorld(this,s?.area||'farm');
    this.cropArt=this.add.graphics();this.cropLabels=[];
    this.marker=this.add.graphics();
    this.player=makeCharacter(this,s?.character||'boy');this.player.setVisible(!!s);
    this.night=this.add.rectangle(480,270,960,540,0x18394d,0).setDepth(100);
    this.input.off('pointerdown');
    this.input.on('pointerdown',p=> { if(this.app.paused || this.app.state?.area!=='farm')return; const i=PLOTS.findIndex(v=>Math.hypot(v.x-p.worldX,v.y-p.worldY)<37);if(i>=0){if(Math.hypot(PLOTS[i].x-this.app.state.position.x,PLOTS[i].y-this.app.state.position.y)>=65){this.app.ui.toast('Walk closer to that plot first.');return;}this.targetPlot=i;this.app.use();} });
    this.renderCrops();
  }
  renderCrops() {
    this.cropArt.clear();this.cropLabels.forEach(t=>t.destroy());this.cropLabels=[];
    if(this.app.state?.area!=='farm' && this.app.state)return;
    const g=this.cropArt;
    PLOTS.forEach((pos,i)=>{
      const p=this.app.state?.plots[i];g.fillStyle(p?.morning||p?.evening?0x684c38:0x947049);g.fillRoundedRect(pos.x-33,pos.y-28,66,56,5);
      g.lineStyle(2,0xb18a58);g.strokeRoundedRect(pos.x-33,pos.y-28,66,56,5);
      for(let j=0;j<3;j++){g.lineStyle(2,0x78563c);g.lineBetween(pos.x-23,pos.y-14+j*14,pos.x+23,pos.y-14+j*14);}
      if(p?.crop){
        const dead=p.dryDays>=2;g.fillStyle(dead?0x76614a:p.dryDays?0xa79a59:0x457c52);g.fillRect(pos.x-3,pos.y-12-p.growth*5,6,29+p.growth*5);
        for(let j=0;j<2+p.growth;j++){g.fillEllipse(pos.x+(j%2?9:-9),pos.y+5-j*7,21,11);}
        if(p.growth===3){for(const [dx,dy]of [[-13,0],[12,-9],[0,10]]){g.fillStyle(0xe87950);g.fillCircle(pos.x+dx,pos.y+dy,8);g.fillStyle(0xf0ad68);g.fillCircle(pos.x+dx-2,pos.y+dy-3,2);}}
        const text=dead?'CLEAR':p.growth===3?'READY':`${p.growth}/3  ${p.morning?'●':'○'}${p.evening?'●':'○'}`;
        this.cropLabels.push(this.add.text(pos.x,pos.y+31,text,{fontFamily:'monospace',fontSize:12,color:'#fff1ca',backgroundColor:'#48654d',padding:{x:3,y:2}}).setOrigin(.5));
      }
    });
  }
  context() {
    const s=this.app.state;if(!s)return null;
    const dist=v=>Math.hypot(v.x-s.position.x,v.y-s.position.y);
    const interactions=LOCATIONS[s.area].interactions.filter(v=>dist(v)<72).sort((a,b)=>dist(a)-dist(b));
    if(interactions.length)return interactions[0];
    if(s.area==='farm') {
      let i=this.targetPlot;
      if(i==null||dist(PLOTS[i])>65)i=PLOTS.map((v,index)=>({index,d:dist(v)})).sort((a,b)=>a.d-b.d)[0].index;
      if(dist(PLOTS[i])<65)return {type:'plot',index:i,...PLOTS[i],label: `Plot ${i+1} · ${s.selected==='seed'?'Plant seed':s.selected==='water'?'Water crop':'Harvest crop'}`};
    }
    return null;
  }
  update(_,delta) {
    const a=this.app,s=a.state;if(!s)return;
    
    if(!a.paused&&!document.hidden){
      let x=(this.keys.D.isDown||this.keys.RIGHT.isDown||a.input.right?1:0)-(this.keys.A.isDown||this.keys.LEFT.isDown||a.input.left?1:0);
      let y=(this.keys.S.isDown||this.keys.DOWN.isDown||a.input.down?1:0)-(this.keys.W.isDown||this.keys.UP.isDown||a.input.up?1:0);
      const len=Math.hypot(x,y)||1,step=WORLD.speed*Math.min(delta,50)/1000;
      const nx=s.position.x+x/len*step,ny=s.position.y+y/len*step;
      if(walkable(s.area,nx,s.position.y))s.position.x=nx;
      if(walkable(s.area,s.position.x,ny))s.position.y=ny;
      a.advance(delta);
    }
    this.player.setPosition(s.position.x,s.position.y).setDepth(50);
    this.night.setAlpha(s.minute>=1200?.38:s.minute>=960?.15:s.minute<720?.02:0);
    this.marker.clear();const c=this.context();if(c){this.marker.lineStyle(3,0xffe7a0,.9);this.marker.strokeEllipse(c.x,c.y+8,c.type==='plot'?74:46,24);}
    a.ui.update(s,c);
  }
}
