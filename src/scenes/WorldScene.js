import Phaser from 'phaser';
import { MAP_SIZE } from '../data/mapLayouts.js';
import { displayZoom } from './displayScale.js';
import { Atmosphere } from '../art/Atmosphere.js';
import { WORLD } from '../config.js';
import { LOCATIONS, walkable } from '../data/locations.js';
import { PLOTS } from '../data/crops.js';
import { drawWorld,drawPlots } from '../art/worldArt.js';
import { PlayerView } from '../entities/PlayerView.js';
export class WorldScene extends Phaser.Scene {
  constructor(app){super('World');this.app=app;this.plotPositions=PLOTS;}
  preload(){
    const base=import.meta.env.BASE_URL+'assets/pixel/';
    this.load.atlas('world',base+'world.png',base+'world.json');
    this.load.atlas('town',base+'processed/town.png',base+'processed/town.json');
    for(const char of ['boy','girl'])this.load.spritesheet(char,base+'processed/'+char+'.png',{frameWidth:16,frameHeight:24});
    this.load.bitmapFont('pixel',base+'font.png',base+'font.xml');
    const text=this.add.text(20,20,'Loading Simple Life...',{fontFamily:'monospace',fontSize:'16px',color:'#e1d7ad'});
    this.load.on('complete',()=>text.destroy());
  }
  create(){
    for(const name of ['world','town','boy','girl','pixel'])this.textures.get(name).setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.keys=this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE,ESC,ONE,TWO,THREE');
    this.keys.ESC.on('down',()=>this.app.pause());
    for(const key of ['E','SPACE'])this.keys[key].on('down',()=>this.app.use());
    for(const [key,tool]of [['ONE','seed'],['TWO','water'],['THREE','harvest']])this.keys[key].on('down',()=>{if(!this.app.paused)this.app.select(tool);});
    this.scale.on('resize',()=>this.resize());this.build();this.scene.launch('UI');
    this.input.on('pointerdown',p=>{
      const a=this.app;if(a.paused||a.state?.area!=='farm')return;
      const world=this.cameras.main.getWorldPoint(p.x,p.y);const index=PLOTS.findIndex(v=>Math.hypot(v.x-world.x,v.y-world.y)<32);
      if(index<0)return;if(Math.hypot(PLOTS[index].x-a.state.position.x,PLOTS[index].y-a.state.position.y)>=65){a.ui.toast('Walk closer to that plot.');return;}
      this.targetPlot=index;a.use();
    });
  }
  resize(){
    const cam=this.cameras.main;cam.setZoom(displayZoom(this.scale.width,this.scale.height));cam.setBounds(0,0,MAP_SIZE.width,MAP_SIZE.height);cam.roundPixels=true;
    if(this.player){cam.startFollow(this.player.sprite,true,1,1);cam.centerOn(this.player.sprite.x,this.player.sprite.y);}
    else cam.centerOn(448,290);
  }
  build(){
    this.cameras.main.stopFollow();this.tweens.killAll();this.children.removeAll(true);this.player=null;
    const s=this.app.state;drawWorld(this,s?.area||'farm');this.plots=this.add.group();this.renderCrops();
    if(s){this.player=new PlayerView(this,s.character);this.player.update(s.position,0,0);}
    this.marker=this.add.image(0,0,'world','marker').setScale(2).setDepth(1900).setVisible(false);
    this.atmosphere=new Atmosphere(this,s?.area||'farm');
    this.night=this.add.rectangle(0,0,MAP_SIZE.width,MAP_SIZE.height,0x162e3c,0).setOrigin(0).setDepth(3000);
    this.resize();
  }
  renderCrops(){if(this.app.state?.area==='farm'||!this.app.state)drawPlots(this,this.app.state?.plots,this.plots);}
  context(){
    const s=this.app.state;if(!s)return null;const dist=v=>Math.hypot(v.x-s.position.x,v.y-s.position.y);
    const interactions=LOCATIONS[s.area].interactions.filter(v=>dist(v)<72).sort((a,b)=>dist(a)-dist(b));
    if(interactions.length)return interactions[0];
    if(s.area==='farm'){
      let i=this.targetPlot;if(i==null||dist(PLOTS[i])>65)i=PLOTS.map((v,index)=>({index,d:dist(v)})).sort((a,b)=>a.d-b.d)[0].index;
      if(dist(PLOTS[i])<65)return {type:'plot',index:i,...PLOTS[i],label:`${s.selected==='seed'?'Plant seed':s.selected==='water'?'Water crop':'Harvest crop'}`};
    }return null;
  }
  faceContext(c){this.player?.face(c.x-this.app.state.position.x,c.y-this.app.state.position.y);this.atmosphere.feedback(c.x,c.y);}
  update(_,delta){
    const a=this.app,s=a.state;if(!s)return;let dx=0,dy=0;
    if(!a.paused&&!document.hidden){
      const x=(this.keys.D.isDown||this.keys.RIGHT.isDown||a.input.right?1:0)-(this.keys.A.isDown||this.keys.LEFT.isDown||a.input.left?1:0);
      const y=(this.keys.S.isDown||this.keys.DOWN.isDown||a.input.down?1:0)-(this.keys.W.isDown||this.keys.UP.isDown||a.input.up?1:0);
      const len=Math.hypot(x,y)||1,step=WORLD.speed*Math.min(delta,50)/1000;const nx=s.position.x+x/len*step,ny=s.position.y+y/len*step;
      if(walkable(s.area,nx,s.position.y)){dx=nx-s.position.x;s.position.x=nx;}if(walkable(s.area,s.position.x,ny)){dy=ny-s.position.y;s.position.y=ny;}a.advance(delta);
    }
    this.player?.update(s.position,dx,dy);
    if(!a.paused)this.atmosphere.update(this.time.now,!!(dx||dy),s.position);
    this.night.setAlpha(s.minute>=1200?.38:s.minute>=960?.16:0);
    const c=this.context();this.marker.setVisible(!!c&&!a.paused);if(c)this.marker.setPosition(c.x,c.y-52-Math.floor(Math.sin(this.time.now/240)*2)*2);
  }
}
