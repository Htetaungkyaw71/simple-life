// The verified v5 sheet keeps every non-water and rim-adjacent pixel fixed.
// Straight stream dashes descend one native row per frame; only compact 2/4/6
// radius landing ripples, six fixed glints and tiny bowl/jet highlights change.
export class FountainView{
 constructor(scene){this.items=scene.fountains;this.frame=-1;}
 update(time){if(!this.items.length)return;const fps=this.items[0].fps||8,frame=Math.floor(time/(1000/fps))%(this.items[0].frames||1);if(frame===this.frame)return;this.frame=frame;for(const item of this.items)item.sprite.setFrame(frame);}
}
