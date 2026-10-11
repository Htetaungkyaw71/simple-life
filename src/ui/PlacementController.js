import {placementDraft,adjustPlacement,turnPlacement,placementQuote} from '../systems/placement.js';
import {placeDecoration,readjustDecoration,reclaimDecoration} from '../systems/settlement.js';
import {areaDecorations} from '../systems/settlementGeometry.js';
import {DECORATIONS} from '../data/settlement.js';
import {inputGate} from '../systems/inputGate.js';
export class PlacementController {
 constructor(app){this.app=app;this.draft=null;this.original=null;this.gate=inputGate();}
 begin(type){const a=this.app;if(this.draft)this.cancel();this.original=null;a.state.selected='decorate';a.state.selectedDecoration=type;this.draft=placementDraft(a.state,a.scene.player?.direction);a.ui.close();a.save();}
 inspect(piece){const a=this.app;if(a.paused||a.transitioning||a.scene.jumping?.active||!areaDecorations(a.state).includes(piece))return;
  a.ui.modal('DECORATION',DECORATIONS[piece.type].name,'Remove keeps this piece in Bag.\nReadjust moves it without extra cost.',[
   ['Remove',()=>this.remove(piece),a.state.inventory[DECORATIONS[piece.type].item]>=9999],
   ['Readjust',()=>this.readjust(piece)],['Cancel',()=>a.ui.close()],
  ]);
 }
 remove(piece){const a=this.app;if(a.transitioning||!areaDecorations(a.state).includes(piece)||!this.gate.accept(a.ui.time.now))return;const count=a.state.settlement.decorations.length,message=reclaimDecoration(a.state,piece);if(count!==a.state.settlement.decorations.length){a.sound?.('furniture:recover');a.scene.build();a.save();a.ui.close();}a.ui.feedback(message);}
 readjust(piece){const a=this.app;if(a.transitioning||!areaDecorations(a.state).includes(piece))return;this.original=piece;this.draft={...piece,direction:piece.direction||'down'};a.state.selected='hand';a.ui.close();a.scene.build();a.ui.layout();}
 move(point){if(this.draft)this.draft=adjustPlacement(this.draft,point);}
 nudge(dx,dy){if(this.draft)this.move({x:this.draft.x+dx*8,y:this.draft.y+dy*8});}
 turn(){if(this.draft){this.draft=turnPlacement(this.draft);this.app.sound?.('furniture:rotate');}}
 quote(){return placementQuote(this.app.state,this.draft,{original:this.original,view:this.app.scene.cameras?.main.worldView});}
 confirm(){const a=this.app;if(!this.draft||a.paused||a.transitioning||a.scene.jumping?.active||!this.gate.accept(a.ui.time.now))return;const q=this.quote();if(!q.ok){a.ui.feedback(q.message);a.sound?.('furniture:invalid');return;}const message=this.original?readjustDecoration(a.state,this.original,this.draft):placeDecoration(a.state,this.draft);a.sound?.('furniture:place');this.draft=null;this.original=null;a.state.selected='hand';a.scene.build();a.save();a.ui.layout();a.ui.feedback(message);}
 cancel(){if(!this.draft)return;const a=this.app,moved=!!this.original;a.sound?.('ui:cancel');this.draft=null;this.original=null;a.state.selected='hand';if(moved)a.scene.build();a.save();a.ui.layout();}
 update(){const a=this.app;if(this.draft&&(a.state?.area!==(this.draft.area||'farm')||a.state.area==='farm'&&a.state.currentFarm!==this.draft.farm||this.original&&!areaDecorations(a.state).includes(this.original)||!this.original&&(a.state.selected!=='decorate'||a.state.selectedDecoration!==this.draft.type))){this.draft=null;this.original=null;a.ui.layout();}if(!this.draft&&!a.paused&&a.state?.selected==='decorate')this.draft=placementDraft(a.state,a.scene.player?.direction);}
 snapshot(){return this.draft?{...this.draft,readjusting:!!this.original,...this.quote()}:null;}
}
