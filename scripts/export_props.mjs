// Offline native export of original transparent imagegen outputs. Sources never ship.
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const {PNG}=createRequire(import.meta.url)(process.env.SIMPLE_LIFE_PNGJS||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const out='output/art/props-v1',art='public/assets/pixel/processed';
const read=p=>PNG.sync.read(fs.readFileSync(p)),write=(p,im)=>fs.writeFileSync(p,PNG.sync.write(im)),blank=(w,h)=>new PNG({width:w,height:h}),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
// A shared restrained material palette, including separate snow/stone/needle ramps.
const palette=['332b29','48332e','604034','7b4e3d','98634a','b67b58','cf986e','e5b78a','edd0a5','fbebc8','28341f','39472a','4d5d32','65743e','7f8b4c','9da563','bcc27e','d2d29c','514f47','6b695d','858775','a2a58f','bfc4ac','d9ddc7','f1efda','53676a','758b8d','a5b8b7','cbd8d5','eef1df','414f56','5d717b','8295a3','b0bfcc','dce2de','342f33','525052','7a7370','ae9f8a','774d47','9b6257','ba7b69','d8967c','ebbb97','75494c','995f68','bc8089','dba6a5','efd0b8','b08a49','d0ab5b','eed48b','354b4a','526c65','75958a','a2b8a4','d4d9be'].map(s=>s.match(/../g).map(v=>parseInt(v,16)));
const sources=new Map();
function sample(id,w,h,pad=1){
 const src=sources.get(id)||read(out+'/sources/'+id+'.png');sources.set(id,src);
 let x0=src.width,y0=src.height,x1=-1,y1=-1;
 for(let y=0;y<src.height;y++)for(let x=0;x<src.width;x++)if(src.data[(y*src.width+x)*4+3]>=224){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
 if(x1<0)throw Error('Empty source '+id);
 const s=Math.min((w-pad*2)/(x1-x0+1),(h-pad*2)/(y1-y0+1)),left=(w-(x1-x0+1)*s)/2,top=h-pad-(y1-y0+1)*s,im=blank(w,h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const xx=Math.floor(x0+(x-left)/s),yy=Math.floor(y0+(y-top)/s);if(xx<x0||xx>x1||yy<y0||yy>y1)continue;
  const i=(yy*src.width+xx)*4;if(src.data[i+3]<224)continue;
  const rgb=src.data.subarray(i,i+3);let best=palette[0],distance=Infinity;
  for(const c of palette){const d=c.reduce((sum,v,k)=>sum+(v-rgb[k])**2,0);if(d<distance){distance=d;best=c;}}
  im.data.set([...best,255],(y*w+x)*4);
 }
 return im;
}
const copy=(im,flip=false)=>{const dst=blank(im.width,im.height);for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++)dst.data.set(im.data.subarray((y*im.width+x)*4,(y*im.width+x+1)*4),(y*im.width+(flip?im.width-1-x:x))*4);return dst;};
const rect=(im,x,y,w,h,c)=>{const rgb=typeof c==='string'?c.match(/../g).map(v=>parseInt(v,16)):c;for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(xx>=0&&yy>=0&&xx<im.width&&yy<im.height)im.data.set([...rgb,255],(yy*im.width+xx)*4);};
const native={};
const existing={bench:'bench',table:'table',well:'well',lamp:'lantern',notice:'notice',crate:'crate',barrel:'barrel',planter:'planter',mailbox:'mailbox',wheelbarrow:'wheelbarrow','city-lamp':'lantern','city-flowerpot':'sunflower','city-tent':'tent','home-bed':'bed',bed:'bed','home-table':'table','home-counter':'counter',dresser:'counter',kitchen:'counter',shelf:'bookcase','home-pottery':'pottery','home-pot':'vase',pot:'vase',rug:'rug','home-rug':'rug','env-pine-snow':'snow-pine','seed-stall':'stall','produce-stall':'stall','outfitter-stall':'stall',chair:'chair','home-fireplace':'fireplace','home-logs':'logs','city-bench-garden':'city-garden','camp-tent':'tent','env-boulder':'boulder','shrine-stone':'shrine','ancient-chest':'chest',scarecrow:'scarecrow','home-window':'window',window:'window','forest-log':'forest-log'};
const meta=JSON.parse(fs.readFileSync(out+'/before-town.json')),before=read(out+'/before-town.png');
for(const[name,id]of Object.entries(existing)){const f=meta.frames[name].frame;native[name]=sample(id,f.w,f.h,name==='env-pine-snow'?2:0);}
// Market identity remains the established muted green / red / blue awning colour.
for(const[name,shift]of [['produce-stall',[32,-21,-8]],['outfitter-stall',[-18,-6,15]]]){
 const im=native[name];for(let y=0;y<im.height*.45;y++)for(let x=0;x<im.width;x++){const i=(y*im.width+x)*4;if(im.data[i+3]&&im.data[i+1]>im.data[i]&&im.data[i+2]<im.data[i])for(let k=0;k<3;k++)im.data[i+k]=Math.max(0,Math.min(255,im.data[i+k]+shift[k]));}
}
const additions={'prop-blossom':['blossom',48,60],'prop-hedge':['hedge',32,20],'prop-flowers':['flowers',24,16],'prop-birdbath':['birdbath',20,28],'prop-rug':['rug',32,24],'prop-bookcase':['bookcase',24,32],'prop-vase':['vase',16,24],'prop-bench-left':['bench-side',20,32],'prop-table-left':['table-side',24,32],'prop-planter':['planter',16,24]};
for(const[name,[id,w,h]]of Object.entries(additions))native[name]=sample(id,w,h,0);
// Back of the slatted bench and end-on fence are original code-native views,
// edited from the established direction drawings, sharing the exported wood ramp.
const back=blank(32,20);
for(const x of [3,26]){rect(back,x,3,3,17,'48332e');rect(back,x,3,2,15,'98634a');rect(back,x,3,1,12,'cf986e');}
for(const y of [2,6,10]){rect(back,1,y,30,4,'604034');rect(back,1,y,30,1,'cf986e');rect(back,2,y+1,28,2,'98634a');rect(back,4,y+1,5,1,'b67b58');rect(back,19,y+2,5,1,'7b4e3d');}
rect(back,5,14,22,2,'604034');native['prop-bench-up']=back;
const fence=blank(12,24);for(const y of [2,10,18]){rect(fence,1,y,10,3,'604034');rect(fence,1,y,10,1,'cf986e');rect(fence,2,y+1,8,1,'98634a');}rect(fence,5,0,4,23,'48332e');rect(fence,5,1,3,21,'98634a');rect(fence,5,1,1,20,'cf986e');rect(fence,4,0,6,2,'b67b58');native['prop-fence-left']=fence;
// The existing low interior seats remain backless at their original footprint.
const seat=blank(32,12);for(const x of [3,26]){rect(seat,x,6,3,6,'48332e');rect(seat,x,6,2,5,'98634a');}
for(const y of [0,3,6]){rect(seat,0,y,32,4,'604034');rect(seat,1,y,30,1,'cf986e');rect(seat,1,y+1,30,2,'98634a');rect(seat,7,y+1,5,1,'b67b58');}native['home-bench']=seat;
let px=2,py=before.height+2,rowHeight=0;
for(const[name,im]of Object.entries(native))if(!meta.frames[name]){if(px+im.width+2>before.width){px=2;py+=rowHeight+2;rowHeight=0;}meta.frames[name]={frame:{x:px,y:py,w:im.width,h:im.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:im.width,h:im.height},sourceSize:{w:im.width,h:im.height}};px+=im.width+2;rowHeight=Math.max(rowHeight,im.height);}
const atlas=blank(before.width,py+rowHeight+2);PNG.bitblt(before,atlas,0,0,before.width,before.height,0,0);
for(const[name,im]of Object.entries(native)){const f=meta.frames[name].frame;PNG.bitblt(im,atlas,0,0,im.width,im.height,f.x,f.y);write(out+'/'+name+'.png',im);}
let protectedFrames=0;
for(const[name,v]of Object.entries(JSON.parse(fs.readFileSync(out+'/before-town.json')).frames)){
 const f=v.frame;if(JSON.stringify(v)!==JSON.stringify(meta.frames[name]))throw Error('Old frame moved '+name);if(native[name])continue;
 for(let y=0;y<f.h;y++){const i=((f.y+y)*before.width+f.x)*4,j=((f.y+y)*atlas.width+f.x)*4;if(!before.data.subarray(i,i+f.w*4).equals(atlas.data.subarray(j,j+f.w*4)))throw Error('Protected frame changed '+name);}protectedFrames++;
}
meta.meta.size={w:atlas.width,h:atlas.height};write(art+'/town.png',atlas);fs.writeFileSync(art+'/town.json',JSON.stringify(meta,null,2)+'\n');
const pine=native['env-pine-snow'];let sum=0,n=0;for(let y=pine.height-8;y<pine.height;y++)for(let x=0;x<pine.width;x++)if(pine.data[(y*pine.width+x)*4+3]){sum+=x+.5;n++;}const origin=+(sum/n/pine.width).toFixed(4);
const originFile='src/data/natureArt.js';fs.writeFileSync(originFile,fs.readFileSync(originFile,'utf8').replace(/("env-pine-snow":\s*)[\d.]+/,'$1'+origin));
const record={date:'2026-10-15',version:'0.35.0',alphaThreshold:224,palette:palette.length,sources:Object.fromEntries([...sources.keys()].map(id=>[id,{file:'sources/'+id+'.png',sha256:hash(out+'/sources/'+id+'.png')}])),changedFrames:Object.keys(native).filter(n=>!n.startsWith('prop-')),addedFrames:Object.keys(native).filter(n=>n.startsWith('prop-')),protectedFrames,allOldCoordinatesUnchanged:true,atlas:meta.meta.size,snowRootOrigin:origin,runtimeSHA256:hash(art+'/town.png')};fs.writeFileSync(out+'/manifest.json',JSON.stringify(record,null,2)+'\n');
const names=Object.keys(native),cellW=170,cellH=210,board=blank(cellW*7,Math.ceil(names.length/7)*cellH);for(let i=0;i<board.data.length;i+=4)board.data.set([140,153,98,255],i);
for(const[name,im]of Object.entries(native)){const k=names.indexOf(name),s=Math.min(4,Math.floor(160/im.width),Math.floor(195/im.height)),xx=k%7*cellW+Math.floor((cellW-im.width*s)/2),yy=Math.floor(k/7)*cellH+cellH-12-im.height*s;for(let y=0;y<im.height*s;y++)for(let x=0;x<im.width*s;x++){const a=(Math.floor(y/s)*im.width+Math.floor(x/s))*4,j=((yy+y)*board.width+xx+x)*4;if(im.data[a+3])board.data.set(im.data.subarray(a,a+4),j);}}
write(out+'/native-review.png',board);console.log(JSON.stringify(record));
