import {farmObjective,farmWaypoint} from '../systems/navigation.js';
import {panel,text,UI_COLORS} from './pixelWidgets.js';
import {pixels,pixelArrow} from './statusArt.js';
export class FarmGuide {
 constructor(hud){
  this.ui=hud.ui;const u=this.ui;this.root=u.add.container();hud.root.add(this.root);
  this.objective=u.add.container(u.safe.left+6,u.safe.top+66);this.root.add(this.objective);
  this.box=panel(u,this.objective,0,0,Math.min(184,u.w-u.safe.left-u.safe.right-12),38,0x304a40);
  this.label=text(u,this.objective,19,6,'Take the starter seeds\nto the farm.',7);this.direction=text(u,this.objective,6,27,'Follow the FARM sign south.',6,UI_COLORS.gold);
  this.objectiveArt=u.add.graphics();this.objective.add(this.objectiveArt);pixels(this.objectiveArt,'leaf',6,7,UI_COLORS.gold);
  this.waypoint=u.add.container();this.root.add(this.waypoint);this.arrow=u.add.graphics();this.waypoint.add(this.arrow);this.farm=text(u,this.waypoint,0,10,'FARM',6,UI_COLORS.light).setOrigin(.5,0);
 }
 update(s){
  const u=this.ui,active=farmObjective(s)&&s.area==='home';
  if(active&&!u.objectiveStarted)u.showFarmObjective();
  const expanded=active&&u.time.now<u.objectiveUntil;
  this.objective.setVisible(active);this.box.setVisible(expanded);this.label.setVisible(expanded);this.direction.setVisible(expanded);
  const view=u.app.scene.cameras.main.worldView,way=farmWaypoint(s,view);this.way=way;this.waypoint.setVisible(!!way);if(!way)return;
  // Ray from player to the real transition, clipped to a safe gameplay rectangle.
  const cam=u.app.scene.cameras.main,px=(s.position.x-view.x)*cam.zoom/2,py=(s.position.y-view.y)*cam.zoom/2;
  const bounds={left:u.safe.left+12,right:u.w-u.safe.right-12,top:u.safe.top+66,bottom:u.h-u.safe.bottom-(u.touch&&u.w<u.h?146:u.touch?80:76)};
  const candidates=[];if(way.dx>0)candidates.push((bounds.right-px)/way.dx);if(way.dx<0)candidates.push((bounds.left-px)/way.dx);if(way.dy>0)candidates.push((bounds.bottom-py)/way.dy);if(way.dy<0)candidates.push((bounds.top-py)/way.dy);
  const t=Math.min(...candidates.filter(v=>v>=0));const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  this.waypoint.setPosition(Math.round(clamp(px+way.dx*t,bounds.left,bounds.right)),Math.round(clamp(py+way.dy*t,bounds.top,bounds.bottom)));
  this.arrow.clear();pixelArrow(this.arrow,way.direction,0,0,UI_COLORS.ink);pixelArrow(this.arrow,way.direction,-1,-1,UI_COLORS.gold);
 }
 snapshot(){return {objective:this.objective.visible,expanded:this.box.visible&&this.objective.visible,waypoint:this.waypoint.visible?{...this.way,x:this.waypoint.x*2,y:this.waypoint.y*2}:null};}
}
