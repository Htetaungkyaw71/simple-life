import {FOREST_PORTAL} from '../data/forestLandmarks.js';
// Original pixel stone ring, inner light and rising motes; no extra HUD button.
export class ForestPortalView{
 constructor(scene){this.scene=scene;this.ring=scene.add.graphics().setDepth(1);this.light=scene.add.graphics().setDepth(FOREST_PORTAL.y+2);this.label=scene.add.bitmapText(FOREST_PORTAL.x,FOREST_PORTAL.y+74,'pixel','RETURN GATE',6).setOrigin(.5,0).setScale(2).setTint(0xffefd0).setDropShadow(1,1,0x34344f,1).setDepth(FOREST_PORTAL.y+3);this.phase=-1;}
 update(time){
  const phase=Math.floor(time/160);if(this.phase===phase)return;this.phase=phase;
  const {x,y}=FOREST_PORTAL,g=this.ring;g.clear().fillStyle(0x303d34,.3).fillEllipse(x+8,y+12,156,80);
  for(let n=0;n<32;n++){const a=n*Math.PI/16,xx=Math.round((x+Math.cos(a)*66)/2)*2,yy=Math.round((y+Math.sin(a)*32)/2)*2;
   g.fillStyle(0x4b5145).fillRect(xx-7,yy-2,14,14);g.fillStyle(n<16?0x929987:0xb4b79d).fillRect(xx-7,yy-6,14,8);g.fillStyle(0xd5d8ba).fillRect(xx-5,yy-6,10,2);
  }
  g.fillStyle(0x507970,.46).fillEllipse(x,y,116,48);
  const l=this.light;l.clear();for(let n=0;n<18;n++){const a=n*Math.PI/9+phase*.09,xx=Math.round((x+Math.cos(a)*42)/2)*2,yy=Math.round((y+Math.sin(a)*18)/2)*2;
   l.fillStyle(0xabc6a4,.6).fillRect(xx,yy,4,2);
  }
  for(let n=0;n<7;n++){const rise=(phase*2+n*14)%76;l.fillStyle(n%2?0xd6e4bc:0x86bdae,(1-rise/80)*.65).fillRect(x-34+n*10,y-6-rise,2,4);}
 }
}
