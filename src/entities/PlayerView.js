export class PlayerView {
  constructor(scene,character){
    this.sprite=scene.add.sprite(0,0,character,0).setOrigin(.5,.94).setScale(2);this.direction='down';
    for(const [row,dir]of ['down','up','left','right'].entries()){
      const key=`${character}-${dir}`;
      if(!scene.anims.exists(key))scene.anims.create({key,frames:[{key:character,frame:row*3+1},{key:character,frame:row*3},{key:character,frame:row*3+2},{key:character,frame:row*3}],frameRate:8,repeat:-1});
    }
    this.character=character;
  }
  face(dx,dy){if(Math.abs(dx)+Math.abs(dy)<1)return;this.direction=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');this.pose(false);}
  pose(moving){if(moving)this.sprite.play(`${this.character}-${this.direction}`,true);else{this.sprite.anims.stop();this.sprite.setFrame(['down','up','left','right'].indexOf(this.direction)*3);}}
  update(position,dx,dy){if(dx||dy)this.direction=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');this.pose(!!(dx||dy));this.sprite.setPosition(Math.round(position.x),Math.round(position.y)).setDepth(Math.round(position.y));}
}
