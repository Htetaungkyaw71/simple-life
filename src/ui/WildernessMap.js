import {REGIONS,forestRegion,TREASURES,FOREST_SIZE,FOREST_MAP} from '../data/forest.js';
import {forestMapPixels,mapPoint} from './forestMapArt.js';
import {facingIndex,mapLayout} from './layouts.js';
import {pixels,pixelArrow} from './statusArt.js';
import {panel,text,button,UI_COLORS} from './pixelWidgets.js';
export class WildernessMap {
 constructor(app){this.app=app;this.index=16;this.details=false;}
 open(){if(this.app.transitioning||this.app.paused||this.app.state?.area!=='forest')return;this.index=REGIONS.indexOf(forestRegion(this.app.state.position));this.details=false;this.show();}
 show(){const u=this.app.ui;u.notice=null;this.app.paused=true;this.app.input={};u.menu={kind:'wilderness',draw:()=>this.draw(u)};u.focus=0;u.layout();u.highlight();}
 move(step){this.index=(this.index+step+REGIONS.length)%REGIONS.length;this.show();}
 draw(u){
  const {x,y,w:pw,h:ph,mw,mh}=mapLayout(u),side=28;
  u.menuBounds={x:x*2,y:y*2,w:pw*2,h:ph*2};
  const veil=u.add.rectangle(0,0,u.w,u.h,0x29382c,.64).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());panel(u,u.root,x,y,pw,ph,UI_COLORS.paper,'wood');
  text(u,u.root,x+12,y+10,'Forest',12,UI_COLORS.wood);text(u,u.root,x+pw-side-50,y+14,this.app.state.forest.explored.length+'/40',7,UI_COLORS.muted);
  const rect={x:x+12,y:y+32,w:mw,h:mh},key='forest-notebook-'+mw+'-'+mh,known=this.app.state.forest.explored.join('|');
  const texture=u.textures.exists(key)?u.textures.get(key):u.textures.createCanvas(key,mw,mh);texture.setFilter(1); // Phaser NEAREST, matching the native UI pixels.
  if(texture.notebookKnown!==known){const data=texture.context.createImageData(mw,mh);data.data.set(forestMapPixels(FOREST_MAP,this.app.state.forest.explored,mw,mh));texture.context.putImageData(data,0,0);texture.notebookKnown=known;texture.refresh();}
  u.root.add(u.add.image(rect.x,rect.y,key).setOrigin(0));const g=u.add.graphics();u.root.add(g);g.lineStyle(2,UI_COLORS.wood).strokeRect(rect.x-1,rect.y-1,mw+2,mh+2);
  for(const [i,r]of REGIONS.entries()){
   const a=mapPoint({x:r.x,y:r.y},rect,FOREST_SIZE),b=mapPoint({x:r.x+r.w,y:r.y+r.h},rect,FOREST_SIZE);
   const zone=u.add.rectangle(a.x,a.y,b.x-a.x,b.y-a.y,0,0).setOrigin(0).setInteractive();u.root.add(zone);zone.on('pointerdown',()=>{this.index=i;this.show();});
   if(i===this.index)g.lineStyle(1,0xb78447).strokeRect(a.x+1,a.y+1,b.x-a.x-2,b.y-a.y-2);
  }
  const player=mapPoint(this.app.state.position,rect,FOREST_SIZE),facing=this.app.scene.player?.direction||'down';
  pixelArrow(g,facingIndex[facing],player.x+1,player.y+1,UI_COLORS.ink);pixelArrow(g,facingIndex[facing],player.x,player.y,0xfff5cc);
  text(u,u.root,rect.x+mw-9,rect.y+5,'N',6,UI_COLORS.wood);pixelArrow(g,6,rect.x+mw-8,rect.y+17,UI_COLORS.wood);
  const bx=x+pw-30;button(u,u.root,'X',bx,y+7,22,22,()=>u.close(),{id:'wilderness-close'});
  button(u,u.root,'Here',bx,y+37,22,22,()=>{this.index=REGIONS.indexOf(forestRegion(this.app.state.position));this.show();},{id:'wilderness-locate',glyph:(g,a,b,c)=>pixelArrow(g,facingIndex[facing],a+4,b+4,c)});
  button(u,u.root,'?',bx,y+65,22,22,()=>{this.details=!this.details;this.show();},{id:'wilderness-info'});
  const r=REGIONS[this.index],visited=this.app.state.forest.explored.includes(r.id),fy=y+ph-30;
  button(u,u.root,'<',x+12,fy,22,22,()=>this.move(-1),{id:'wilderness-prev'});button(u,u.root,'>',x+pw-34,fy,22,22,()=>this.move(1),{id:'wilderness-next'});
  text(u,u.root,x+pw/2,fy+4,visited?r.name:'Unexplored',8,UI_COLORS.light,pw-88).setOrigin(.5,0);
  if(this.details){const t=TREASURES.find(t=>t.region===r.id);panel(u,u.root,rect.x+5,rect.y+mh-32,mw-10,27);text(u,u.root,rect.x+10,rect.y+mh-26,visited?(t?this.app.state.forest.treasures.includes(t.id)?'Cache recovered':t.clue:r.danger?'Boars / 3 hits / 15 damage':'Fruit and quiet wildlife'):'Explore to reveal this area',6,UI_COLORS.muted,mw-20);}
 }
}
