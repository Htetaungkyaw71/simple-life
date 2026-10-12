import {CURSED_CAVE,CURSE_GHOST,curseNight} from '../data/cursedCave.js';
import {curseTextures} from './CurseArt.js';
export class CurseView{
 constructor(scene){this.scene=scene;curseTextures(scene);const s=scene.app.state;
  this.cave=s?.area==='forest'?scene.add.image(CURSED_CAVE.x,CURSED_CAVE.y,'curse-cave-'+(s.curse?.stage||'sealed')).setOrigin(.5,1).setScale(3).setDepth(CURSED_CAVE.y):null;
  this.ghosts=Array.from({length:CURSE_GHOST.count},()=>({sprite:scene.add.image(0,0,'curse-spirit-0').setOrigin(.5,1).setScale(2).setVisible(false),marks:scene.add.graphics(),warning:scene.add.bitmapText(0,0,'m5x7','!',16).setOrigin(.5,1).setScale(2).setTint(0xffd080).setVisible(false)}));
 }
 update(now){const s=this.scene.app.state;if(!s)return;this.cave?.setTexture('curse-cave-'+s.curse.stage);
  for(const [i,entry]of this.ghosts.entries()){const g=s.curse.ghosts[i],visible=s.curse.stage==='broken'&&curseNight(s)&&s.area!=='interior'&&g.area===s.area&&!!g.position&&g.health>0;
   entry.sprite.setVisible(visible);entry.warning.setVisible(visible&&!!g.windup);entry.marks.clear();if(!visible)continue;
   const p=g.position,x=Math.round(p.x/2)*2,y=Math.round(p.y/2)*2,bob=Math.floor(now/180+i)%2*2;
   entry.sprite.setPosition(x,y-bob).setTexture('curse-spirit-'+(Math.floor(now/240+i)%2)).setDepth(p.y).setAlpha(g.arrival>0 ? .35 : 1);
   entry.warning.setPosition(x,y-58).setDepth(p.y+2);entry.marks.setDepth(p.y+1);
   if(g.arrival){entry.marks.lineStyle(2,0xe1bc76,.8).strokeRect(x-24,y-10,48,12);}
   else if(Math.hypot(p.x-s.position.x,p.y-s.position.y)<170)for(let n=0;n<CURSE_GHOST.health;n++)entry.marks.fillStyle(n<g.health?0xd3bd82:0x3e5140).fillRect(x-11+n*8,y-58,6,3);
  }
 }
 hit(result){const s=this.scene.app.state,g=s.curse.ghosts.find(g=>g.id===result.animalId),entry=this.ghosts[s.curse.ghosts.indexOf(g)];if(!g||!entry)return;
  this.scene.forestView.bits(g.position.x,g.position.y-24,0xdfd8ad);
  if(result.defeated){const fade=this.scene.add.image(entry.sprite.x,entry.sprite.y,entry.sprite.texture.key).setOrigin(.5,1).setScale(2).setDepth(g.position.y+1);this.scene.tweens.add({targets:fade,y:fade.y-12,alpha:0,duration:320,onComplete:()=>fade.destroy()});this.scene.app.ui.feedback('Spirit dispersed / returns in 5s.');}
 }
 snapshot(){return {cave:this.cave?{texture:this.cave.texture.key,x:this.cave.x,y:this.cave.y,width:this.cave.displayWidth,height:this.cave.displayHeight}:null,ghosts:this.ghosts.map(g=>({visible:g.sprite.visible,texture:g.sprite.texture.key,x:g.sprite.x,y:g.sprite.y,warning:g.warning.visible}))};}
}
