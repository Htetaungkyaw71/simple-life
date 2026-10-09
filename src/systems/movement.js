// Input vectors stay bounded: diagonals never move faster than straight travel.
export function movementVector(keys={},input={}){
 const down=name=>!!keys[name]?.isDown;
 const x=Number(down('D')||down('RIGHT')||!!input.right)-Number(down('A')||down('LEFT')||!!input.left);
 const y=Number(down('S')||down('DOWN')||!!input.down)-Number(down('W')||down('UP')||!!input.up);
 const v=x||y?{x,y}:input.stick||{x:0,y:0},length=Math.hypot(v.x,v.y),scale=Math.max(1,length);
 return {x:v.x/scale,y:v.y/scale};
}
export function movementFacing(x,y,previous='down'){
 const ax=Math.abs(x),ay=Math.abs(y);if(ax+ay<.001)return previous;
 const horizontal=x<0?'left':'right',vertical=y<0?'up':'down';
 // Hysteresis keeps four native walk poses steady on eight-way movement.
 if(Math.abs(ax-ay)<=Math.max(ax,ay)*.18){if(previous===horizontal||previous===vertical)return previous;return vertical;}
 return ax>ay?horizontal:vertical;
}
export function joystickVector(x,y,radius,deadZone=.14){
 const length=Math.hypot(x,y);if(length<=radius*deadZone)return {x:0,y:0};
 const strength=Math.min(1,(length/radius-deadZone)/(1-deadZone));
 return {x:x/length*strength,y:y/length*strength};
}
