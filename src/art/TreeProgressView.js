import {TREE_HITS,treeHits} from '../data/vegetation.js';
import {panel,text,UI_COLORS} from '../ui/pixelWidgets.js';

// A world-space, three-segment meter stays above the canopy and night overlay.
export class TreeProgressView {
 constructor(scene){this.scene=scene;this.mm=scene.app.language?.current==='mm';this.root=scene.add.container().setScale(2).setDepth(10002).setVisible(false);panel(scene,this.root,0,0,this.mm?70:54,this.mm?33:25);this.label=text(scene,this.root,this.mm?35:27,this.mm?2:4,'',8,UI_COLORS.light).setOrigin(.5,0);this.bar=scene.add.graphics();this.root.add(this.bar);this.last=null;}
 hit(result){const sprites=this.scene.vegetationVisuals.get(result.id);if(sprites)for(const sprite of sprites){if(!sprite.texture||!sprite.frame)continue;if(result.felled){const ghost=this.scene.add.image(sprite.x,sprite.y,sprite.texture.key,sprite.frame.name).setOrigin(sprite.originX,sprite.originY).setScale(sprite.scaleX,sprite.scaleY).setDepth(sprite.depth);this.scene.tweens.add({targets:ghost,x:ghost.x+12,y:ghost.y+8,angle:18,alpha:0,duration:260,onComplete:()=>ghost.destroy()});}else this.scene.tweens.add({targets:sprite,x:sprite.x+4,duration:45,yoyo:true,repeat:1});}this.last={...result,until:this.scene.time.now+2200};}
 update(context){const s=this.scene.app.state,last=this.last?.until>this.scene.time.now?this.last:null,c=last||(context?.type==='chop'?context:null);this.current=c;this.root.setVisible(!!c&&!this.scene.app.paused&&s.selected==='axe');if(!c)return;
  const hits=last?.felled?TREE_HITS:treeHits(s,c.id);this.root.setPosition(c.x-(this.mm?70:54),c.y-132);this.label.setText(last?.felled?'+3 Wood':hits+'/'+TREE_HITS);this.bar.clear();for(let i=0;i<TREE_HITS;i++){this.bar.fillStyle(UI_COLORS.ink).fillRect((this.mm?15:7)+i*14,this.mm?22:16,12,5);this.bar.fillStyle(i<hits?0x7b9b48:0xd7d2b4).fillRect((this.mm?16:8)+i*14,this.mm?23:17,10,3);}
 }
 snapshot(){return this.root.visible?{id:this.current.id,hits:this.current.felled?TREE_HITS:treeHits(this.scene.app.state,this.current.id),label:this.label.text}:null;}
}
