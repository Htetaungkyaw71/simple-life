// Opaque horizontal timber crossing with native planks and edge rails.
export function drawBridge(scene,b){
 const g=scene.add.graphics().setDepth(0);
 if(b.axis==='vertical'){const {x,y,w,h}=b;g.fillStyle(0x494332).fillRect(x,y,w,h);for(let dy=4;dy<h-4;dy+=12){g.fillStyle(dy%24?0x9b8055:0xa68a5d).fillRect(x+6,y+dy,w-12,10);g.fillStyle(0xc1a574).fillRect(x+6,y+dy,w-12,2);}for(const xx of [x,x+w-8]){g.fillStyle(0x554735).fillRect(xx,y,8,h);g.fillStyle(0xb69a69).fillRect(xx+2,y+2,2,h-4);}drawBridgeRails(scene,b);return g;}
 const {x,y,w,h}=b;
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
 drawBridgeRails(scene,b);return g;
}

// Upright rail sections sort at their ground contact, separately from the deck.
// Side rails use short sections so a long crossing never becomes one tall layer.
export function drawBridgeRails(scene,b,wood=0x956f49,light=0xc9aa78){
 const rails=[],{x,y,w,h}=b;
 const add=(foot,paint)=>{const g=scene.add.graphics().setDepth(Math.round(foot));paint(g);rails.push(g);};
 if(b.axis==='vertical'){
  for(const xx of [x,x+w-8])for(let dy=0;dy<h;dy+=24){const length=Math.min(24,h-dy),yy=y+dy;
   add(yy+length,g=>{
    g.fillStyle(0x493d31).fillRect(xx,yy-12,8,length).fillStyle(wood).fillRect(xx+2,yy-10,4,Math.max(2,length-2)).fillStyle(light).fillRect(xx+2,yy-12,2,length);
    if(dy%48===0)g.fillStyle(0x493d31).fillRect(xx-2,yy-16,12,24).fillStyle(wood).fillRect(xx,yy-14,8,20).fillStyle(light).fillRect(xx,yy-16,8,2);
   });
  }
 }else{
  for(const foot of [y+8,y+h])add(foot,g=>{
   g.fillStyle(0x493d31).fillRect(x,foot-18,w,8).fillStyle(wood).fillRect(x+2,foot-16,w-4,4).fillStyle(light).fillRect(x+2,foot-18,w-4,2);
   for(let dx=4;dx<w-8;dx+=48)g.fillStyle(0x493d31).fillRect(x+dx,foot-22,8,22).fillStyle(wood).fillRect(x+dx+2,foot-20,4,18).fillStyle(light).fillRect(x+dx+2,foot-22,4,2);
  });
 }
 scene.bridgeRails??=[];scene.bridgeRails.push(...rails);return rails;
}
