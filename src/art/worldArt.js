// All visible world art uses the same atlas at two world units per source pixel.
const SCALE=2;
export function image(scene,name,x,y,depth=0){return scene.add.image(Math.round(x),Math.round(y),'world',name).setOrigin(0).setScale(SCALE).setDepth(depth);}
function tiled(scene,name,x,y,w,h,depth=0){return scene.add.tileSprite(x,y,w,h,'world',name).setOrigin(0).setTileScale(SCALE).setDepth(depth);}
export function drawWorld(scene,area){
  const indoor=area==='home';
  tiled(scene,indoor?'stone':'grass0',0,0,960,640);
  if(indoor){
    tiled(scene,'floor0',160,128,640,384);tiled(scene,'wall',160,96,640,32,120);
    tiled(scene,'wall',144,128,16,384,520);tiled(scene,'wall',800,128,16,384,520);
    tiled(scene,'wall',160,496,286,16,520);tiled(scene,'wall',514,496,286,16,520);
    image(scene,'window',420,94,128);image(scene,'window',660,94,128);
    image(scene,'bed',240,180,320);image(scene,'dresser',580,174,229);
    image(scene,'table',594,340,405);image(scene,'pot',640,329,406);
    image(scene,'pot',732,156,196);image(scene,'pot',186,440,472);
    tiled(scene,'path0',446,480,68,32,1);image(scene,'door',448,480,2);
    // Woven rug, a pixel pattern composed of atlas floor/soil colors.
    const rug=scene.add.graphics().setDepth(1);rug.fillStyle(0x925d49);rug.fillRect(400,348,152,96);rug.fillStyle(0xc29b68);rug.fillRect(408,356,136,80);rug.fillStyle(0x925d49);rug.fillRect(414,362,124,68);
    for(let x=418;x<540;x+=12){rug.fillStyle(0xd7af55);rug.fillRect(x,366,4,4);rug.fillRect(x,422,4,4);}
  }else{
    // Deterministic tile variation avoids texture noise and visible large repeats.
    for(let y=0;y<20;y++)for(let x=0;x<30;x++){const hash=(x*17+y*31)%11;if(hash<4)image(scene,'grass'+hash,x*32,y*32,0);}
    tiled(scene,'path0',32,256,896,64,1);
    if(area==='farm'){
      tiled(scene,'path1',160,224,64,208,1);tiled(scene,'path1',192,400,448,32,1);
      image(scene,'house',88,56,232);image(scene,'sign',816,214,262);
      tiled(scene,'grass2',326,192,280,200,1);
      for(let x=312;x<640;x+=32)image(scene,'fence',x,422,462);
      for(let y=192;y<384;y+=32)image(scene,'fence',304,y,y+40);
      tiled(scene,'stone',680,336,192,128,1);tiled(scene,'water0',696,352,160,96,2);
      for(let x=696;x<860;x+=32)image(scene,'bush',x,436,472);
      image(scene,'palm',706,82,200);image(scene,'rock',668,350,382);
      image(scene,'flowers',266,324,356);image(scene,'pot',116,224,255);image(scene,'pot',235,224,255);
    }else{
      tiled(scene,'path1',320,224,64,208,1);tiled(scene,'path1',624,224,64,208,1);tiled(scene,'stone',264,320,496,64,1);
      image(scene,'seed-shop',264,104,232);image(scene,'produce-shop',552,104,232);
      image(scene,'sign',60,226,264).setFlipX(true);image(scene,'counter',692,360,408);
      image(scene,'pot',274,240,268);image(scene,'pot',710,236,268);image(scene,'tree1',772,52,180);
      image(scene,'palm',170,54,180);image(scene,'flowers',550,400,432);
    }
    // Borders and vegetation overlap by their feet, so the player passes behind foliage.
    for(let x=-32;x<1000;x+=80){image(scene,'tree'+(Math.abs(x/16)%2),x,-56,72);image(scene,'tree0',x+24,498,626);}
    for(let y=40;y<540;y+=110){image(scene,'tree1',-56,y,y+128);image(scene,'tree0',890,y,y+128);}
    for(const [x,y]of [[70,370],[215,438],[840,410],[580,64],[390,74],[54,170],[650,462]])image(scene,'bush',x,y,y+40);
    for(const [x,y]of [[82,332],[262,364],[554,462],[838,318],[610,90],[276,86]])image(scene,'flowers',x,y,y+32);
    for(const [x,y]of [[56,428],[640,462],[832,128]])image(scene,'rock',x,y,y+32);
  }
}
export function drawPlots(scene,plots,group){
  group.clear(true,true);
  for(const [i,pos]of scene.plotPositions.entries()){
    const p=plots?.[i];const soil=p?.morning||p?.evening?'watered-soil':'soil';
    const tile=scene.add.tileSprite(pos.x-32,pos.y-32,64,64,'world',soil).setOrigin(0).setTileScale(2).setDepth(2);group.add(tile);
    if(p?.crop){const stage=p.dryDays>=2?5:p.dryDays===1?4:p.growth;
      group.add(scene.add.image(pos.x,pos.y+20,'world','crop'+stage).setOrigin(.5,1).setScale(2).setDepth(pos.y+20));
      if(p.growth===3)group.add(scene.add.image(pos.x+22,pos.y-32,'world','marker').setScale(1).setDepth(pos.y+21));
    }
  }
}
