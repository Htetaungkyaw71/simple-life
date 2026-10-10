import {placementDraft,adjustPlacement,turnPlacement,placementQuote} from '../systems/placement.js';
import {placeDecoration} from '../systems/settlement.js';
import {inputGate} from '../systems/inputGate.js';
export class PlacementController {
 constructor(app){this.app=app;this.draft=null;this.gate=inputGate();}
 begin(type){const a=this.app;a.state.selected='decorate';a.state.selectedDecoration=type;this.draft=placementDraft(a.state,a.scene.player?.direction);a.ui.close();a.save();}
 move(point){if(this.draft)this.draft=adjustPlacement(this.draft,point);}
 nudge(dx,dy){if(this.draft)this.move({x:this.draft.x+dx*8,y:this.draft.y+dy*8});}
 turn(){if(this.draft){this.draft=turnPlacement(this.draft);this.app.sound?.('furniture:rotate');}}
 quote(){return placementQuote(this.app.state,this.draft);}
 confirm(){const a=this.app;if(!this.draft||a.paused||a.transitioning||a.scene.jumping?.active||!this.gate.accept(a.ui.time.now))return;const q=this.quote();if(!q.ok){a.ui.feedback(q.message);a.sound?.('furniture:invalid');return;}const message=placeDecoration(a.state,this.draft);a.sound?.('furniture:place');this.draft=null;a.state.selected='hand';a.scene.build();a.save();a.ui.layout();a.ui.feedback(message);}
 cancel(){if(!this.draft)return;this.app.sound?.('ui:cancel');this.draft=null;this.app.state.selected='hand';this.app.save();this.app.ui.layout();}
 update(){const a=this.app;if(this.draft&&(a.state?.area!=='farm'||a.state.selected!=='decorate'||a.state.selectedDecoration!==this.draft.type||a.state.currentFarm!==this.draft.farm))this.draft=null;if(!this.draft&&!a.paused&&a.state?.selected==='decorate')this.draft=placementDraft(a.state,a.scene.player?.direction);}
 snapshot(){return this.draft?{...this.draft,...this.quote()}:null;}
}
