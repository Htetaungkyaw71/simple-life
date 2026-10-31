import {farmObjective,farmWaypoint,cityObjective,cityWaypoint} from '../systems/navigation.js';
import {storyObjective,tutorialPrompt,tutorialStage} from '../systems/story.js';
import {conversationObjective} from '../systems/conversations.js';
import {panel,frame as importFrame,text,UI_COLORS} from './pixelWidgets.js';
import {pixels,pixelArrow} from './statusArt.js';
export class FarmGuide {
 constructor(hud){
  this.ui=hud.ui;const u=this.ui;this.root=u.add.container();hud.root.add(this.root);
  const guideWidth=Math.min(u.touch?166:184,u.w-u.safe.left-u.safe.right-12);this.guideWidth=guideWidth;
  this.objective=u.add.container((u.standalone&&u.w>u.h?6:u.safe.left)+(u.touch?10:6),u.safe.top+(u.touch&&u.w>u.h?52:80));this.root.add(this.objective);
  this.box=panel(u,this.objective,0,0,guideWidth,24,UI_COLORS.panel);
  this.mobileTextOnly=u.touch;
  this.label=text(u,this.objective,19,6,'Starter seeds / Farm south',u.touch?6:7,u.touch?UI_COLORS.cream:UI_COLORS.light,guideWidth-24,false,u.touch?'compact':'body');
  if(this.mobileTextOnly)this.label.setScale(.6).setMaxWidth((u.w-u.safe.left-u.safe.right-20)/.6);
  this.direction=text(u,this.objective,6,27,'',6,UI_COLORS.gold);
  this.objectiveArt=u.add.graphics();this.objective.add(this.objectiveArt);pixels(this.objectiveArt,'leaf',6,7,UI_COLORS.gold);
  this.waypoint=u.add.container();this.root.add(this.waypoint);this.arrow=u.add.graphics();this.waypoint.add(this.arrow);this.farm=text(u,this.waypoint,0,10,'FARM',6,UI_COLORS.cream).setOrigin(.5,0);
  // Tool selection can rebuild the HUD. Keep both guide branches hidden until
  // their first positioned update so the constructor cannot render one frame
  // of default text below the status meters.
  this.objective.setVisible(false);this.waypoint.setVisible(false);
 }
 update(s){
  const u=this.ui,stage=tutorialStage(s),learning=['move','seeds','farm','plant','water'].includes(stage),clue=conversationObjective(s),city=(clue||cityObjective(s))&&['home','farm'].includes(s.area),farm=stage==='farm'||farmObjective(s)&&s.area==='home',active=!!clue||city||farm,journal=u.touch&&!s.story?.completed&&!u.hud?.cropInfo?.root.visible?storyObjective(s):null;
  const task=tutorialPrompt(s,u.touch);
  this.label.setText(learning?task:clue?clue.text:city?(s.hasHarvestedFirstCrop?'Harvest / City Market':'Silas / City east'):journal?journal.step:'Starter seeds / Farm south');this.direction.setText('');this.farm.setText(city?'CITY':'FARM');
  if(city&&!u.cityStarted)u.showCityObjective();
  if(active&&!city&&!u.objectiveStarted)u.showFarmObjective();
  // Selecting or putting away a toolbar item temporarily suppresses world
  // context. Do not mistake that transient blank context for room to expand
  // the first-farm guide below the status meters.
  const toolToggleActive=u.time.now<(u.app.promptSuppressUntil||0);
  const journalText=!!journal&&!learning,expanded=(learning&&u.h>=150&&!u.hud?.cropInfo?.root.visible&&!toolToggleActive)||active&&u.time.now<(city?u.cityUntil:u.objectiveUntil)||journalText,textOnly=this.mobileTextOnly;
  this.objective.setVisible(!u.notice&&(active||learning&&u.h>=150||journalText));
  if(expanded&&!textOnly){this.box.clear();importFrame(this.box,0,0,this.guideWidth,Math.max(24,this.label.height+12));}
  this.box.setVisible(expanded&&!textOnly);this.objectiveArt.setVisible(expanded&&!textOnly);this.label.setPosition(textOnly?0:19,textOnly?0:6).setVisible(expanded);this.direction.setVisible(expanded&&!textOnly);
  const view=u.app.scene.cameras.main.worldView,way=city?cityWaypoint(s,view):farm?farmWaypoint(s,view):null;this.way=way;this.waypoint.setVisible(!!way);if(!way)return;
  // Ray from player to the real transition, clipped to a safe gameplay rectangle.
  const cam=u.app.scene.cameras.main,px=(s.position.x-view.x)*cam.zoom/2,py=(s.position.y-view.y)*cam.zoom/2;
  const bounds={left:u.safe.left+12,right:u.w-u.safe.right-12,top:u.safe.top+(expanded?112:80),bottom:u.h-u.safe.bottom-(u.touch&&u.w<u.h?116:u.touch?64:76)};
  const candidates=[];if(way.dx>0)candidates.push((bounds.right-px)/way.dx);if(way.dx<0)candidates.push((bounds.left-px)/way.dx);if(way.dy>0)candidates.push((bounds.bottom-py)/way.dy);if(way.dy<0)candidates.push((bounds.top-py)/way.dy);
  const t=Math.min(...candidates.filter(v=>v>=0));const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  this.waypoint.setPosition(Math.round(clamp(px+way.dx*t,bounds.left,bounds.right)),Math.round(clamp(py+way.dy*t,bounds.top,bounds.bottom)));
  this.arrow.clear();pixelArrow(this.arrow,way.direction,0,0,UI_COLORS.ink);pixelArrow(this.arrow,way.direction,-1,-1,UI_COLORS.gold);
 }
 snapshot(){return {objective:this.objective.visible,expanded:this.box.visible&&this.objective.visible,waypoint:this.waypoint.visible?{...this.way,x:this.waypoint.x*2,y:this.waypoint.y*2}:null};}
}
