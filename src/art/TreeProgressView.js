import {TREE_HITS,treeHits} from '../data/vegetation.js';
import {panel,text,UI_COLORS} from '../ui/pixelWidgets.js';

// A world-space, three-segment meter stays above the canopy and night overlay.
export class TreeProgressView {
 constructor(scene){this.scene=scene;this.root=scene.add.container().setScale(2).setDepth(10002).setVisible(false);panel(scene,this.root,0,0,54,25);this.label=text(scene,this.root,27,4,'',8,UI_COLORS.light).setOrigin(.5,0);this.bar=scene.add.graphics();this.root.add(this.bar);this.last=null;}
 hit(result){this.last={...result,until:this.scene.time.now+2200};}
 update(context){const s=this.scene.app.state,last=this.last?.until>this.scene.time.now?this.last:null,c=last||(context?.type==='chop'?context:null);this.current=c;this.root.setVisible(!!c&&!this.scene.app.paused&&s.selected==='axe');if(!c)return;
  const hits=last?.felled?TREE_HITS:treeHits(s,c.id);this.root.setPosition(c.x-54,c.y-132);this.label.setText(last?.felled?'+3 Wood':'Tree '+hits+'/'+TREE_HITS);this.bar.clear();for(let i=0;i<TREE_HITS;i++){this.bar.fillStyle(UI_COLORS.ink).fillRect(7+i*14,16,12,5);this.bar.fillStyle(i<hits?0x7b9b48:0xd7d2b4).fillRect(8+i*14,17,10,3);}
 }
 snapshot(){return this.root.visible?{id:this.current.id,hits:this.current.felled?TREE_HITS:treeHits(this.scene.app.state,this.current.id),label:this.label.text}:null;}
}
