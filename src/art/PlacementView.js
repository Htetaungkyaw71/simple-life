import {drawDecorationArt} from './DecorationArt.js';
import {decorationRect} from '../systems/settlementGeometry.js';
export class PlacementView {
 constructor(scene){this.scene=scene;this.root=scene.add.container().setDepth(10003);this.signature='';}
 update(){const a=this.scene.app,d=a.placement.draft;this.root.setVisible(!!d&&!a.paused);if(!d)return;const q=a.placement.quote(),signature=[d.type,d.x,d.y,d.direction,q.ok].join(':');if(signature===this.signature)return;this.signature=signature;this.root.removeAll(true);const r=decorationRect(d);drawDecorationArt(this.scene,this.root,d.type,d.direction,r.x,r.y,2);this.root.list.forEach(n=>n.setAlpha(.7));const g=this.scene.add.graphics();this.root.add(g);g.lineStyle(2,q.ok?0xd9ee9c:0xe98e71,1).strokeRect(r.x-2,r.y-2,r.w+4,r.h+4);g.lineStyle(2,0xfff2c8,1);const [dx,dy]={down:[0,1],up:[0,-1],left:[-1,0],right:[1,0]}[d.direction],cx=d.x,cy=r.y+r.h/2;g.lineBetween(cx,cy,cx+dx*14,cy+dy*14);g.lineBetween(cx+dx*14,cy+dy*14,cx+dx*7+dy*5,cy+dy*7-dx*5);g.lineBetween(cx+dx*14,cy+dy*14,cx+dx*7-dy*5,cy+dy*7+dx*5);}
}
