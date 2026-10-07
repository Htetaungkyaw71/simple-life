// Opaque horizontal timber crossing with native planks and edge rails.
export function drawBridge(scene,b){
 const g=scene.add.graphics().setDepth(0),{x,y,w,h}=b;
 g.fillStyle(0x494332).fillRect(x,y,w,h);
 for(let dx=4;dx<w-4;dx+=12){
  const width=Math.min(10,w-4-dx);g.fillStyle(dx%24?0x9b8055:0xa68a5d).fillRect(x+dx,y+6,width,h-12);
  g.fillStyle(0xc1a574).fillRect(x+dx,y+6,2,h-12);
  g.fillStyle(0x705b40).fillRect(x+dx+2,y+h-12,width-2,4);
  if(dx%36===4)g.fillRect(x+dx+5,y+20,2,8);
 }
 for(const yy of [y,y+h-8]){
  g.fillStyle(0x554735).fillRect(x,yy,w,8);g.fillStyle(0xb69a69).fillRect(x+2,yy+2,w-4,2);
  for(const xx of [x+4,x+w-12]){g.fillStyle(0x494332).fillRect(xx,yy-2,8,12);g.fillStyle(0xd1b581).fillRect(xx+2,yy,4,4);}
 }
 return g;
}
