const DIRECTIONS=['down','up','left','right'];
export class PlayerView {
  constructor(scene,character){
    this.sprite=scene.add.sprite(0,0,character,0).setOrigin(.5,.94).setScale(2);this.direction='down';this.character=character;
    for(const [row,dir]of DIRECTIONS.entries()){
      const walk=`${character}-${dir}`,idle=`${character}-${dir}-idle`;
      if(!scene.anims.exists(walk))scene.anims.create({key:walk,frames:[1,2,3,4].map(n=>({key:character,frame:row*6+n})),frameRate:8,repeat:-1});
      if(!scene.anims.exists(idle))scene.anims.create({key:idle,frames:[{key:character,frame:row*6,duration:2200},{key:character,frame:row*6+5,duration:130}],frameRate:1,repeat:-1});
    }
  }
  face(dx,dy){if(Math.abs(dx)+Math.abs(dy)<1)return;this.direction=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');this.pose(false);}
  pose(moving){this.sprite.play(`${this.character}-${this.direction}${moving?'':'-idle'}`,true);}
  update(position,dx,dy){if(dx||dy)this.direction=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');this.pose(!!(dx||dy));this.sprite.setPosition(Math.round(position.x),Math.round(position.y)).setDepth(Math.round(position.y));}
}
