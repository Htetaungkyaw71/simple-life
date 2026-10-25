// Pack the user's twelve native Pixel Snapper PNGs into a dedicated runtime atlas.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {PNG} from './prop_pixels.mjs';

const root=new URL('../',import.meta.url);
const path=name=>new URL(name,root);
const sourceDir='output/art/city-building-snapper-v2/sources/';
const specs=[
 ['house-07-alpine-timber','house-07-alpine-timber.png',0,0],
 ['house-09-broad-farmhouse','house-09-broad-farmhouse.png',271,0],
 ['house-01-terracotta-gable','house-01-terracotta-gable.png',531,0],
 ['cafe-terracotta-awning','cafe-terracotta-awning.png',778,0],
 ['house-04-balcony-vine','house-04-balcony-vine.png',0,183],
 ['house-02-blue-slate','house-02-blue-slate.png',245,183],
 ['house-03-green-bay','house-03-green-bay.png',452,183],
 ['house-08-grey-hipped','house-08-grey-hipped.png',651,183],
 ['house-06-green-hipped','house-06-green-hipped.png',0,357],
 ['house-05-plum-townhouse','house-05-plum-townhouse.png',193,357],
 ['shop-clothing-sage-awning','shop-clothing-sage-awning.png',380,357],
 ['shop-barber-blue-roof','shop-barber-blue-roof.png',552,357]
];
const atlas=new PNG({width:1024,height:512});
const frames={},art={},audit=[];
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const rowsFor=(image,scale,minY=0)=>{
 const rows=[];let previous=null,start=0,x0=image.width,y0=image.height,x1=-1,y1=-1;
 for(let y=0;y<=image.height;y++){
  const ink=[];
  for(let x=0;x<image.width&&y<image.height;x++)if(y>=minY&&image.data[(y*image.width+x)*4+3]>=128)ink.push(x);
  const run=ink.length?[ink[0],ink.at(-1)-ink[0]+1]:null;
  if(run){x0=Math.min(x0,run[0]);x1=Math.max(x1,run[0]+run[1]-1);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  if(JSON.stringify(run)!==JSON.stringify(previous)){
   if(previous)rows.push([previous[0]*scale,start*scale,previous[1]*scale,(y-start)*scale]);
   previous=run;start=y;
  }
 }
 return {bounds:[x0,y0,x1+1,y1+1],solidRows:rows};
};
for(const [id,file,x,y] of specs){
 const bytes=fs.readFileSync(path(sourceDir+file)),image=PNG.sync.read(bytes);
 if(x+image.width>atlas.width||y+image.height>atlas.height)throw Error(id+' does not fit atlas');
 for(let yy=0;yy<image.height;yy++)for(let xx=0;xx<image.width;xx++){
  const src=(yy*image.width+xx)*4,dst=((y+yy)*atlas.width+x+xx)*4;
  image.data.copy(atlas.data,dst,src,src+4);
 }
 frames[id]={frame:{x,y,w:image.width,h:image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:image.width,h:image.height},sourceSize:{w:image.width,h:image.height}};
 const scale=id==='cafe-terracotta-awning'?1:2,rawMask=rowsFor(image,1),collisionTop=Math.max(rawMask.bounds[1],rawMask.bounds[3]-24),mask=rowsFor(image,scale,collisionTop),alphas=[...new Set(image.data.filter((_,i)=>i%4===3))].sort((a,b)=>a-b);
 art[id]={texture:'cityBuildings',frame:id,width:image.width,height:image.height,scale,bounds:rawMask.bounds,foundationRows:rowsFor(image,1,collisionTop).solidRows,solidRows:mask.solidRows};
 audit.push({id,source:sourceDir+file,sha256:sha(bytes),dimensions:[image.width,image.height],bounds:rawMask.bounds,alpha:{transparent:alphas.includes(0),minimumInk:alphas.find(v=>v>0),maximum:alphas.at(-1),partial:alphas.some(v=>v>0&&v<255)},nativePixelsUnchanged:true,worldScale:scale});
}
fs.writeFileSync(path('public/assets/pixel/processed/city-buildings.png'),PNG.sync.write(atlas));
fs.writeFileSync(path('public/assets/pixel/processed/city-buildings.json'),JSON.stringify({frames,meta:{app:'Simple Life user-supplied Pixel Snapper city buildings',image:'city-buildings.png',size:{w:atlas.width,h:atlas.height},scale:'1'}},null,2)+'\n');
const slots={0:'house-01-terracotta-gable',2:'house-02-blue-slate',3:'house-03-green-bay',4:'house-04-balcony-vine',5:'house-05-plum-townhouse',6:'house-06-green-hipped',7:'house-07-alpine-timber',8:'house-08-grey-hipped',9:'house-09-broad-farmhouse'};
// Keep the first wide cottage at the accepted reference height. The two upper
// City cottages are only modestly enlarged to 225 visible world pixels, close
// to the lower blue/grey houses without returning to the former 2x oversize.
// Anchors retain each facade's visible foundation line.
const anchors={0:[234,1037.5714285714],2:[160,1588],3:[2026,474],4:[436,1344.7635135135],5:[157,416],6:[1446,754],7:[898,1343.6842105263],8:[455,1580],9:[2077,1360]};
const scales={0:190/133,4:225/148,7:225/152};
const placements=Object.fromEntries(Object.entries(slots).map(([index,id])=>[index,{id,anchor:anchors[index],scale:scales[index]||art[id].scale}]));
const lawnFor=({id,anchor,scale})=>{const a=art[id],[cx,base]=anchor,[x0,y0,x1,y1]=a.bounds,origin=[cx-a.width*scale/2,base-a.height*scale];return [origin[0]+x0*scale,origin[1]+y0*scale,(x1-x0)*scale,(y1-y0)*scale];};
const lawns=Object.fromEntries(Object.entries(placements).map(([index,p])=>[index,lawnFor(p)]));
const porches={0:[234,1040],2:[160,1592],3:[2026,464],4:[436,1344],5:[157,416],6:[1248,720],7:[898,1344],8:[455,1580],9:[2077,1328]};
for(const [index,p]of Object.entries(placements)){const lawn=lawns[index];p.porch=porches[index];p.entry=[p.porch[0],Math.round(lawn[1]+lawn[3]-8)];}
// The separately approved reference cottage is also a residence and gets grass.
lawns[1]=[2230,250,242,190];
fs.writeFileSync(path('src/data/cityBuildingArt.js'),'// User-supplied native Pixel Snapper houses and cafe; generated by scripts/export_city_building_snapper.mjs.\nexport const CITY_BUILDING_ART='+JSON.stringify(art)+';\nexport const CITY_BUILDING_PLACEMENTS='+JSON.stringify(placements)+';\nexport const CITY_HOUSE_LAWNS='+JSON.stringify(lawns)+';\n');
fs.writeFileSync(path('output/art/city-building-snapper-v2/art-audit.json'),JSON.stringify({atlas:{path:'public/assets/pixel/processed/city-buildings.png',dimensions:[atlas.width,atlas.height],frames:specs.length},assets:audit},null,2)+'\n');
console.log(JSON.stringify({atlas:[atlas.width,atlas.height],frames:Object.keys(frames),placements},null,2));
