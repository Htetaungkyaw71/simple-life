import {REGIONS,forestRegion,TREASURES,FOREST_SIZE,FOREST_MAP} from '../data/forest.js';
import {riverRow} from '../data/water.js';
import {SPECIES} from '../data/wildlife.js';
import {panel,text,button,UI_COLORS} from './pixelWidgets.js';
export class WildernessMap {
 constructor(app){this.app=app;this.index=16;}
 open(){if(this.app.transitioning||!this.app.state)return;this.index=REGIONS.indexOf(forestRegion(this.app.state.position));this.show();}
 show(){const u=this.app.ui;u.notice=null;this.app.paused=true;this.app.input={};u.menu={kind:'wilderness',draw:()=>this.draw(u)};u.focus=0;u.layout();u.highlight();}
 move(step){this.index=(this.index+step+REGIONS.length)%REGIONS.length;this.show();}
 draw(u){
  const pw=Math.min(360,u.w-12),ph=Math.min(u.w<300?306:252,u.h-12),x=Math.floor((u.w-pw)/2),y=Math.floor((u.h-ph)/2),compact=ph<240;
  u.menuBounds={x:x*2,y:y*2,w:pw*2,h:ph*2};
  const veil=u.add.rectangle(0,0,u.w,u.h,0x102025,.5).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());
  panel(u,u.root,x,y,pw,ph);text(u,u.root,x+10,y+12,'WILD WOODS / '+this.app.state.forest.explored.length+'/'+REGIONS.length,8,UI_COLORS.gold);
  button(u,u.root,'X',x+pw-30,y+6,22,22,()=>u.close(),{id:'wilderness-close'});
  const side=Math.min(pw-20,compact?ph-65:pw>=300?174:150),mapHeight=side*FOREST_SIZE.height/FOREST_SIZE.width,mx=x+10,my=y+34,g=u.add.graphics();u.root.add(g);
  const colors={wood:0x919d63,jungle:0x86955b,marsh:0x84955f,savanna:0x969e66,stone:0x8c9663,snow:0xbcd2cc,pine:0x81905b,bamboo:0x8d9b60,highland:0x8c9965};
  for(const [i,r]of REGIONS.entries()){
   const rx=mx+r.x/FOREST_SIZE.width*side,ry=my+r.y/FOREST_SIZE.height*mapHeight,w=r.w/FOREST_SIZE.width*side,h=r.h/FOREST_SIZE.height*mapHeight,visited=this.app.state.forest.explored.includes(r.id);
   g.fillStyle(visited?colors[r.biome]:0x354a46).fillRect(rx+1,ry+1,w-2,h-2);g.lineStyle(i===this.index?2:1,i===this.index?0xffedcc:0x657553).strokeRect(rx+1,ry+1,w-2,h-2);
   const zone=u.add.rectangle(rx,ry,w,h,0,0).setOrigin(0).setInteractive();u.root.add(zone);zone.on('pointerdown',()=>{this.index=i;this.show();});
   if(visited)text(u,u.root,rx+4,ry+4,String(r.danger),7,UI_COLORS.light);
  }
  g.fillStyle(0x617d74);for(const river of FOREST_MAP.rivers)for(let yy=river.y;yy<river.y+river.h;yy+=64){const [left,,rw]=riverRow(river,yy);g.fillRect(mx+left/FOREST_SIZE.width*side,my+yy/FOREST_SIZE.height*mapHeight,Math.max(1,rw/FOREST_SIZE.width*side),Math.max(1,64/FOREST_SIZE.height*mapHeight));}
  if(this.app.state.area==='forest'){const p=this.app.state.position;g.fillStyle(0xffe1a0).fillRect(mx+p.x/FOREST_SIZE.width*side-2,my+p.y/FOREST_SIZE.height*mapHeight-2,4,4);}
  const horizontal=compact||pw>=300;
  const r=REGIONS[this.index],visited=this.app.state.forest.explored.includes(r.id),tx=horizontal?mx+side+12:x+10,ty=horizontal?my:my+mapHeight+8,width=horizontal?pw-side-30:pw-20;
  text(u,u.root,tx,ty,r.name,8,UI_COLORS.gold,width);
  text(u,u.root,tx,ty+23,'Danger '+r.danger+'/5 / '+(visited?'Explored':'Unexplored'),6,UI_COLORS.muted,width);
  text(u,u.root,tx,ty+43,visited?(r.species==='boar'?SPECIES.boar.name+' / '+SPECIES.boar.health+' hits / '+SPECIES.boar.damage+' damage':'Quiet woodland wildlife'):'Explore grassy passages.',7,UI_COLORS.light,width);
  const treasure=TREASURES.find(t=>t.region===r.id);
  text(u,u.root,tx,ty+66,visited?(treasure?this.app.state.forest.treasures.includes(treasure.id)?'Ancient cache recovered.':treasure.clue:'Fruit groves and quiet trails.'):'Dark regions hide landmarks and fruit.',6,UI_COLORS.muted,width);
  const by=y+ph-27;
  button(u,u.root,'<',x+10,by,24,20,()=>this.move(-1),{id:'wilderness-prev'});
  text(u,u.root,x+40,by+6,'HOME / southwest Homewood',6,UI_COLORS.muted,pw-80);
  button(u,u.root,'>',x+pw-34,by,24,20,()=>this.move(1),{id:'wilderness-next'});
 }
}
