// Long north/south town crossing. Source-pixel planks stay horizontal and opaque.
export function drawCityBridge(scene,b){
 const g=scene.add.graphics().setDepth(0),{x,y,w,h}=b;g.fillStyle(0x594a3c).fillRect(x,y,w,h);
 for(let yy=y+2;yy<y+h;yy+=12){g.fillStyle((yy-y)%24?0xb98d67:0xc39a72).fillRect(x+6,yy,w-12,10);g.fillStyle(0xd5ae80).fillRect(x+6,yy,w-12,2);g.fillStyle(0x96704f).fillRect(x+w-12,yy+2,6,8);}
 for(const xx of [x,x+w-8]){g.fillStyle(0x5c4436).fillRect(xx,y,8,h);g.fillStyle(0xa57a55).fillRect(xx+2,y,2,h);for(let yy=y+4;yy<y+h;yy+=48){g.fillStyle(0x493d31).fillRect(xx-2,yy,12,10);g.fillStyle(0xd2a77a).fillRect(xx,yy,8,2);}}
}
