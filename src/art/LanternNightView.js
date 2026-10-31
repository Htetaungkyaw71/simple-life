import {BANNER_COLOURS,FESTIVAL_SITE} from '../data/lastLantern.js';

export class LanternNightView{
 constructor(scene){
  this.scene=scene;const state=scene.app.state,status=state?.narrative?.finale?.status;
  this.visible=state?.area==='city'&&['ready','complete'].includes(status);
  if(!this.visible)return;
  const bannerChoice=state.narrative.personal.nell.choices.bannerMeaning||'together',banner=BANNER_COLOURS[bannerChoice]||BANNER_COLOURS.together;
  this.g=scene.add.graphics().setDepth(9960);
  const {x,y}=FESTIVAL_SITE;
  this.g.lineStyle(2,0x6d4734,1).lineBetween(x-190,y-152,x+210,y-152);
  for(let i=0;i<8;i++){const lx=x-168+i*52,ly=y-150+(i%2)*5;this.g.fillStyle(banner.trim,.95).fillRect(lx-5,ly,10,11).fillStyle(0xf6dea2,.9).fillRect(lx-3,ly+2,6,6);}
  this.g.fillStyle(0x6d4734,1).fillRect(x-76,y-126,4,54).fillRect(x+72,y-126,4,54);
  this.g.fillStyle(banner.cloth,1).fillRect(x-72,y-124,144,43).fillStyle(banner.trim,1).fillRect(x-68,y-120,136,4).fillRect(x-68,y-88,136,4);
  for(let i=0;i<3;i++)this.g.fillStyle(banner.trim,.9).fillTriangle(x-48+i*48,y-112,x-34+i*48,y-92,x-20+i*48,y-112);
  this.g.fillStyle(0x8f623d,1).fillRect(x+112,y-58,108,12).fillRect(x+122,y-46,8,32).fillRect(x+202,y-46,8,32);
  this.g.fillStyle(0xe8d49b,1).fillRect(x+122,y-64,18,6).fillRect(x+148,y-66,22,8).fillRect(x+180,y-63,16,5);
  this.flowers=[[-126,-45],[-102,-54],[-82,-42]].map(([dx,dy],index)=>scene.add.image(x+dx,y+dy,'town','cedar-flowers').setScale(1).setDepth(9961+index));
  this.glow=scene.add.graphics().setDepth(9959);
  this.update(scene.time.now);
 }
 update(time){if(!this.visible||!this.glow)return;const {x,y}=FESTIVAL_SITE,pulse=.06+Math.sin(time/420)*.015;this.glow.clear().fillStyle(0xf4c979,pulse).fillCircle(x,y-112,220).fillStyle(0xffdda0,pulse*.8).fillCircle(x+166,y-50,76);}
}
