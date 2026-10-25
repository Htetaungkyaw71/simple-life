// Offline packaging only. Artwork and motion come from imagegen-authored poses.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {PNG}=require(process.env.PNGJS_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const sharp=require(process.env.SHARP_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'output/art/farmer-boy-approved-v1');
const config=JSON.parse(fs.readFileSync(path.join(out,'generation.json'),'utf8'));
const specs={idle:[1,1],running:[8,16],harvesting:[6,12],digging:[6,12],chopping:[6,14],watering:[6,10],attack:[6,14]};
const directions=['south','north','west','east'];
const SIZE=48,GROUND=40;
const sha=data=>createHash('sha256').update(data).digest('hex');
const read=file=>PNG.sync.read(fs.readFileSync(file));
const write=(file,image)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,PNG.sync.write(image));};
const blank=(w,h)=>new PNG({width:w,height:h});
const pixel=(image,x,y)=>{const i=(y*image.width+x)*4;return image.data.subarray(i,i+4);};
const ink=(image,x,y)=>pixel(image,x,y)[3]>=128;
function bounds(image){let l=image.width,t=image.height,r=-1,b=-1;for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)if(ink(image,x,y)){l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);}assert.ok(r>=l,'Empty sprite');return [l,t,r+1,b+1];}
function paste(to,from,x0,y0){for(let y=0;y<from.height;y++)for(let x=0;x<from.width;x++){const sx=x0+x,sy=y0+y;assert.ok(sx>=0&&sx<to.width&&sy>=0&&sy<to.height);from.data.copy(to.data,(sy*to.width+sx)*4,(y*from.width+x)*4,(y*from.width+x+1)*4);}}
function crop(image,x0,y0,x1,y1){const result=blank(x1-x0,y1-y0);for(let y=y0;y<y1;y++)image.data.copy(result.data,(y-y0)*result.width*4,(y*image.width+x0)*4,(y*image.width+x1)*4);return result;}
function splits(image,count,axis){const extent=axis===0?image.width:image.height,other=axis===0?image.height:image.width,hist=new Uint32Array(extent);for(let i=0;i<extent;i++)for(let j=0;j<other;j++)if(ink(image,axis===0?i:j,axis===0?j:i))hist[i]++;const cuts=[0];for(let i=1;i<count;i++){const c=extent*i/count,pitch=extent/count,lo=Math.round(c-pitch*.25),hi=Math.round(c+pitch*.25);let choice=lo;for(let p=lo+1;p<hi;p++)if(hist[p]<hist[choice]||(hist[p]===hist[choice]&&Math.abs(p-c)<Math.abs(choice-c)))choice=p;assert.equal(hist[choice],0,`No alpha gutter at ${axis}/${i}`);cuts.push(choice);}cuts.push(extent);return cuts;}
function cells(image,columns,rows){const xs=splits(image,columns,0),strips=Array.from({length:columns},(_,i)=>crop(image,xs[i],0,xs[i+1],image.height));const ys=strips.map(s=>splits(s,rows,1));return Array.from({length:rows},(_,r)=>{const top=Math.min(...ys.map(v=>v[r])),bottom=Math.max(...ys.map(v=>v[r+1]));return strips.map((s,i)=>{const dest=blank(s.width,bottom-top);paste(dest,crop(s,0,ys[i][r],s.width,ys[i][r+1]),0,ys[i][r]-top);return dest;});});}
const median=values=>{const s=[...values].sort((a,b)=>a-b);return s[Math.floor(s.length/2)];};
// The correction's axe/next-body x bounds overlap, while the actual silhouettes
// remain separate. Extract connected alpha silhouettes instead of cutting ink.
function connectedCells(image,columns,rows){
 const seen=new Uint8Array(image.width*image.height),components=[];
 for(let i=0;i<seen.length;i++){
  if(seen[i]||image.data[i*4+3]<128)continue;
  const todo=[i],indices=[];seen[i]=1;let l=image.width,t=image.height,r=0,b=0;
  while(todo.length){const q=todo.pop(),x=q%image.width,y=Math.floor(q/image.width);indices.push(q);l=Math.min(l,x);t=Math.min(t,y);r=Math.max(r,x);b=Math.max(b,y);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const sx=x+dx,sy=y+dy;if(sx<0||sy<0||sx>=image.width||sy>=image.height)continue;const next=sy*image.width+sx;if(!seen[next]&&image.data[next*4+3]>=128){seen[next]=1;todo.push(next);}}
  }
  if(indices.length>1000)components.push({indices,box:[l,t,r+1,b+1]});
 }
 assert.equal(components.length,columns*rows,'Unexpected connected pose count');
 const groups=Array.from({length:rows},()=>[]);for(const c of components){const row=Math.min(rows-1,Math.floor((c.box[1]+c.box[3])/2/image.height*rows));groups[row].push(c);}
 return groups.map(group=>{assert.equal(group.length,columns);group.sort((a,b)=>a.box[0]-b.box[0]);const top=Math.min(...group.map(c=>c.box[1])),bottom=Math.max(...group.map(c=>c.box[3]));return group.map(c=>{const dest=blank(c.box[2]-c.box[0],bottom-top);for(const i of c.indices){const x=i%image.width-c.box[0],y=Math.floor(i/image.width)-top;dest.data.set(image.data.subarray(i*4,i*4+4),(y*dest.width+x)*4);}return dest;});});
}
function bodyLimits(image){const box=bounds(image),points=[];for(let y=box[1];y<box[3];y++)for(let x=box[0];x<box[2];x++){const [r,g,b,a]=pixel(image,x,y);if(a>=128&&r<155&&r>g*1.12&&g>=b*.66)points.push([x,y]);}const upper=points.filter(p=>p[1]<box[1]+(box[3]-box[1])*.55),lower=points.filter(p=>p[1]>box[1]+(box[3]-box[1])*.7);assert.ok(upper.length&&lower.length,'Missing hair/boot calibration');return [Math.min(...upper.map(p=>p[1])),Math.max(...lower.map(p=>p[1]))];}
function torsoCentre(image){const points=[];for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++){const [r,g,b,a]=pixel(image,x,y);if(a>=128&&r<170&&g>40&&g>=r*.93&&b<g*.84)points.push(x);}assert.ok(points.length,'Missing olive torso');return median(points);}
function native(image,scale,ground){const centre=torsoCentre(image),box=bounds(image);const logical=[(box[0]-centre)/scale+24,(box[1]-ground)/scale+GROUND,(box[2]-centre)/scale+24,(box[3]-ground)/scale+GROUND];assert.ok(logical[0]>0&&logical[2]<SIZE&&logical[1]>=0&&logical[3]<SIZE,`Clipped pose ${JSON.stringify(logical)}`);const result=blank(SIZE,SIZE);for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){const sx=Math.round(centre+(x-24+.5)*scale),sy=Math.round(ground+(y-GROUND)*scale);if(sx<0||sy<0||sx>=image.width||sy>=image.height)continue;const p=pixel(image,sx,sy),i=(y*SIZE+x)*4;if(p[3]>=128){result.data[i]=p[0];result.data[i+1]=p[1];result.data[i+2]=p[2];result.data[i+3]=255;}}bounds(result);return result;}
function idleNative(image){const b=bounds(image),h=30,w=Math.round((b[2]-b[0])*h/(b[3]-b[1])),result=blank(SIZE,SIZE),left=Math.floor((SIZE-w)/2);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=pixel(image,Math.min(b[2]-1,b[0]+Math.floor((x+.5)*(b[2]-b[0])/w)),Math.min(b[3]-1,b[1]+Math.floor((y+.5)*(b[3]-b[1])/h)));if(p[3]>=128){const i=((11+y)*SIZE+left+x)*4;result.data.set([p[0],p[1],p[2],255],i);}}assert.equal(bounds(result)[3]-bounds(result)[1],30);return result;}
function mirror(image){const result=blank(image.width,image.height);for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)result.data.set(pixel(image,image.width-1-x,y),(y*image.width+x)*4);return result;}
function magnify(image,scale){const result=blank(image.width*scale,image.height*scale);for(let y=0;y<result.height;y++)for(let x=0;x<result.width;x++)result.data.set(pixel(image,Math.floor(x/scale),Math.floor(y/scale)),(y*result.width+x)*4);return result;}
const sourceRecords={};
fs.mkdirSync(path.join(out,'source'),{recursive:true});
for(const item of [...config.sources,{name:'approved-front-source',path:config.anchor},{name:'approved-south-native',path:config.approved}]){assert.ok(item.path);const dest=path.join(out,'source',item.name+'.png'),bytes=fs.readFileSync(fs.existsSync(item.path)?item.path:dest);fs.writeFileSync(dest,bytes);sourceRecords[item.name]={originalPath:item.path,sha256:sha(bytes)};}
const source=name=>read(path.join(out,'source',name+'.png'));
const packed={idle:[[source('approved-south-native')],...cells(source('idle3'),3,1)[0].map(im=>[idleNative(im)])]},records={};
for(const [action,[count,fps]]of Object.entries(specs)){
 if(action!=='idle'){
  const raw=cells(source(action==='running'?'running_alpha':action),count,4),limits=raw.map(row=>bodyLimits(row[0])),scale=median(limits.map(([t,b])=>(b-t+1)/30));
  packed[action]=raw.map((row,r)=>row.map(im=>native(im,scale,limits[r][1])));
  records[action]={scale,bodyCalibration:limits};
  if(action==='attack'){
   const correction=connectedCells(source('attack_frontback'),6,2),cl=correction.map(row=>bodyLimits(row[0])),cs=median(cl.map(([t,b])=>(b-t+1)/30));
   packed[action][0]=correction[0].map(im=>native(im,cs,cl[0][1]));packed[action][1]=correction[1].map(im=>native(im,cs,cl[1][1]));
   packed[action][2]=packed[action][3].map(mirror);
   records[action].frontBackCorrection={scale:cs,bodyCalibration:cl,extraction:'12 separate connected alpha silhouettes; no ink cut at overlapping x bounds'};records[action].mirroredWest=true;
  }
 }
 const sheet=blank(SIZE*count,SIZE*4),unique=[],boundsByDirection=[];
 for(let r=0;r<4;r++){
  const row=packed[action][r];assert.equal(row.length,count);unique.push(new Set(row.map(im=>sha(im.data))).size);boundsByDirection.push(row.map(bounds));
  for(let i=0;i<count;i++){const file=path.join(out,'frames',action,directions[r],String(i).padStart(2,'0')+'.png');write(file,row[i]);paste(sheet,row[i],i*SIZE,r*SIZE);}
 }
 write(path.join(out,'sheets',action+'.png'),sheet);write(path.join(out,'previews',action+'-contact.png'),magnify(sheet,4));
 const animation=blank(SIZE*4,SIZE*count);
 for(let f=0;f<count;f++)for(let r=0;r<4;r++){
  const im=packed[action][r][f];for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){const p=pixel(im,x,y),a=p[3]/255,i=((f*SIZE+y)*animation.width+r*SIZE+x)*4;animation.data.set([Math.round(p[0]*a+211*(1-a)),Math.round(p[1]*a+212*(1-a)),Math.round(p[2]*a+182*(1-a)),255],i);}
 }
 const big=magnify(animation,3),delays=Array.from({length:count},(_,i)=>Math.round((i+1)*1000/fps)-Math.round(i*1000/fps));
 await sharp(big.data,{raw:{width:big.width,height:big.height,channels:4,pageHeight:SIZE*3}}).gif({loop:0,delay:delays,dither:0}).toFile(path.join(out,'previews',action+'.gif'));
 records[action]={...records[action],framesPerDirection:count,fps,uniqueFrames:unique,boundsByDirection,sheetSha256:sha(fs.readFileSync(path.join(out,'sheets',action+'.png')))};
 console.log(action,unique.join('/'));
}
// Preserve the byte-exact user-approved south idle, including original alpha.
const approvedSource=fs.existsSync(config.approved)?config.approved:path.join(out,'source/approved-south-native.png');
fs.copyFileSync(approvedSource,path.join(out,'frames/idle/south/00.png'));
assert.equal(sha(fs.readFileSync(approvedSource)),sha(fs.readFileSync(path.join(out,'frames/idle/south/00.png'))));
const contact=blank(SIZE*8,SIZE*4*7);let ar=0;for(const [action,[count]]of Object.entries(specs)){for(let r=0;r<4;r++)for(let i=0;i<count;i++)paste(contact,packed[action][r][i],i*SIZE,(ar*4+r)*SIZE);ar++;}write(path.join(out,'contact.png'),magnify(contact,3));
const manifest={tool:'OpenAI built-in imagegen',modelVersion:'not exposed',date:config.date,cellSize:[SIZE,SIZE],groundRow:GROUND,standingHeightTarget:30,directions,totalFrames:156,approvedSouthIdleByteExact:true,conversion:'Nearest-neighbour sampling; one shared body scale per action; olive-torso registration; generated frame alpha threshold128; original sampled RGB colours without repainting or palette replacement. West attack mirrors authored east poses. Approved south idle is byte-exact.',status:'animation review export; not installed into runtime',actions:records,sources:sourceRecords,limitations:'Generated head/body clusters, tool geometry and pose transitions vary across action sheets. Native resampling can simplify facial details; hand/event integration and final art acceptance remain for review.'};
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Exported 156 native frames; approved south idle preserved exactly.');
