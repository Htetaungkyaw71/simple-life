import {SHOP_ROOMS} from '../data/cityShops.js';
import {homeInteriorSurface} from './homeInteriorSurface.js';
export function drawCityShopRoom(scene,area){
 const room=SHOP_ROOMS[area],{width:w,height:h}=room,key='city-room-'+area;
 scene.add.rectangle(-1024,-1024,3072,3072,0x32221e).setOrigin(0).setDepth(-1);
 if(!scene.textures.exists(key+'-back')){
  const surface=homeInteriorSurface(w,h);
  for(const layer of ['back','front']){const t=scene.textures.createCanvas(key+'-'+layer,w,h),pixels=t.context.createImageData(w,h);pixels.data.set(surface[layer]);t.context.putImageData(pixels,0,0);t.setFilter(1);t.refresh();}
 }
 scene.add.image(0,0,key+'-back').setOrigin(0).setDepth(0);
 for(const [x,y,width,height]of room.floorRugs||[]){scene.add.rectangle(x,y,width,height,0x748469).setOrigin(0).setDepth(1).setStrokeStyle(2,0x4d5e49);scene.add.rectangle(x+5,y+5,width-10,height-10,0x829175).setOrigin(0).setDepth(2).setStrokeStyle(1,0xd1c794);}
 for(const [atlas,frame,x,y,scale,depth]of room.props)scene.add.image(x,y,atlas,frame).setOrigin(0).setScale(scale).setDepth(depth);
 scene.add.image(0,0,key+'-front').setOrigin(0).setDepth(h+4);
}
