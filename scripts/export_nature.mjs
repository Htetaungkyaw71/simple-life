// Offline native conversion of four original imagegen outputs. Never reads reference pixels.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url);
const {PNG}=require(process.env.SIMPLE_LIFE_PNGJS||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const out='output/art/nature-v1',art='public/assets/pixel/processed';
const read=p=>PNG.sync.read(fs.readFileSync(p)),write=(p,im)=>fs.writeFileSync(p,PNG.sync.write(im));
const blank=(w,h)=>new PNG({width:w,height:h});
const sha=b=>createHash('sha256').update(b).digest('hex');
const hex=s=>s.match(/../g).map(v=>parseInt(v,16));
const leaves=['28341f','364325','48562b','5c6b34','728141','8a984e','a6ae65','bdc47a'].map(hex),bark=['422c25','5b3a2c','754b36','936145','ad7d55','c19468'].map(hex);
function sample(source,w,h,palette){
 let x0=source.width,y0=source.height,x1=0,y1=0;
 for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++)if(source.data[(y*source.width+x)*4+3]>=128){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
 const scale=Math.min((w-4)/(x1-x0+1),(h-4)/(y1-y0+1)),ww=(x1-x0+1)*scale,hh=(y1-y0+1)*scale,left=(w-ww)/2,top=h-2-hh,im=blank(w,h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const sx=Math.floor(x0+(x-left)/scale),sy=Math.floor(y0+(y-top)/scale);if(sx<x0||sx>x1||sy<y0||sy>y1)continue;
  const i=(sy*source.width+sx)*4,j=(y*w+x)*4;if(source.data[i+3]<128)continue;
  const rgb=[...source.data.subarray(i,i+3)],c=palette.reduce((best,c)=>{const distance=c.reduce((n,v,k)=>n+(v-rgb[k])**2,0);return distance<best.distance?{c,distance}:best;},{c:palette[0],distance:Infinity}).c;
  im.data.set([...c,255],j);
 }
 return im;
}
function variant(im,flip=false,shift=0){const r=blank(im.width,im.height);for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++){const i=(y*im.width+x)*4,j=(y*im.width+(flip?im.width-1-x:x))*4;if(!im.data[i+3])continue;const c=[...im.data.subarray(i,i+3)];if(c[1]>c[0])for(let n=0;n<3;n++)c[n]=Math.max(0,Math.min(255,c[n]+shift));r.data.set([...c,255],j);}return r;}
function anchor(im){let total=0,count=0;for(let y=im.height-8;y<im.height;y++)for(let x=0;x<im.width;x++)if(im.data[(y*im.width+x)*4+3]){total+=x+.5;count++;}return Math.round((total/count/im.width)*10000)/10000;}
function bend(im,side=0){const r=blank(im.width,im.height);for(let y=0;y<im.height;y++)for(let x=0;x<im.width;x++){const offset=Math.round(side*3*((im.height-1-y)/(im.height-1))**1.4),xx=x+offset;if(xx<0||xx>=im.width)continue;im.data.copy(r.data,(y*im.width+xx)*4,(y*im.width+x)*4,(y*im.width+x+1)*4);}return r;}
function theme(im,kind){const r=blank(im.width,im.height);for(let i=0;i<im.data.length;i+=4){if(!im.data[i+3])continue;const light=(im.data[i]+im.data[i+1])/2;const colors=kind==='snow'?[[63,79,65],[99,120,98],[148,169,138],[199,211,175]]:[[58,66,34],[111,116,57],[154,155,79],[192,187,113]];const c=colors[Math.min(3,Math.floor(light/53))];r.data.set([...c,255],i);}return r;}
const native={oak:sample(read(out+'/sources/oak.png'),80,112,[...leaves,...bark]),palm:sample(read(out+'/sources/palm.png'),96,128,[...leaves,...bark]),grass:sample(read(out+'/sources/grass.png'),24,24,leaves),pine:sample(read(out+'/sources/pine.png'),52,114,[...leaves,...bark])};
for(const [n,im]of Object.entries(native))write(out+'/'+n+'-native.png',im);
const before=read(out+'/before-town.png'),meta=JSON.parse(fs.readFileSync(out+'/before-town.json')),atlas=blank(before.width,before.height+116);PNG.bitblt(before,atlas,0,0,before.width,before.height,0,0);
const changed=[],anchors={};
function put(key,im,newX=null){
 if(!meta.frames[key])meta.frames[key]={frame:{x:newX,y:before.height+2,w:im.width,h:im.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:im.width,h:im.height},sourceSize:{w:im.width,h:im.height}};
 const f=meta.frames[key].frame;if(f.w!==im.width||f.h!==im.height)throw Error('Size mismatch '+key);
 for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){const i=(y*f.w+x)*4,j=((f.y+y)*atlas.width+f.x+x)*4;atlas.data.set(im.data.subarray(i,i+4),j);}
 changed.push(key);if(/forest-oak|forest-palm|willow|nature-fruit|env-pine/.test(key))anchors[key]=anchor(im);
}
for(let n=0;n<3;n++)put('forest-oak-'+n,variant(native.oak,n===1,n===2?-5:0));
for(let n=0;n<2;n++)put('forest-palm-'+n,variant(native.palm,n===1));
put('willow-tree',sample(read(out+'/sources/oak.png'),72,96,[...leaves,...bark]));
put('env-pine-olive',native.pine);
const snowPine=sample(read(out+'/sources/pine.png'),60,114,[...leaves,...bark]);for(let i=0;i<snowPine.data.length;i+=4)if(snowPine.data[i+3]&&snowPine.data[i+1]>snowPine.data[i])for(let n=0;n<3;n++)snowPine.data[i+n]=Math.round(snowPine.data[i+n]*.36+[164,183,169][n]*.64);put('env-pine-snow',snowPine);
for(let v=0;v<3;v++)for(let b=0;b<3;b++){
 const im=bend(variant(native.grass,v===1,v===2?-4:0),b===1?1:b===2?-1:0);put(`tall-grass-${v}-${b}`,im);
 for(const t of ['dry','snow'])put(`tall-grass-${t}-${v}-${b}`,theme(im,t));
}
for(const name of Object.keys(meta.frames).filter(k=>k.startsWith('grass-detail'))){const f=meta.frames[name].frame;put(name,sample(read(out+'/sources/grass.png'),f.w,f.h,leaves.slice(1,7)));}
// Original project fruit clusters are composited into the generated crown, preserving fruit identities.
for(const [n,color] of [['guava',[167,189,91]],['mango',[218,159,78]]]){
 const im=variant(native.oak,n==='mango');
 for(const [x,y]of [[19,39],[57,48],[32,62],[59,25]])for(let yy=0;yy<4;yy++)for(let xx=0;xx<3;xx++){const i=((y+yy)*im.width+x+xx)*4;im.data.set([...(yy===0?[201,198,128]:xx===2?[110,99,50]:color),255],i);}
 put('nature-fruit-'+n,im,n==='guava'?2:84);
}
meta.meta.size={w:atlas.width,h:atlas.height};write(art+'/town.png',atlas);fs.writeFileSync(art+'/town.json',JSON.stringify(meta,null,2)+'\n');
fs.writeFileSync('src/data/natureArt.js','// Root origins from native opaque pixels; map coordinates/collision stay unchanged.\nexport const NATURE_TREE_ORIGINS='+JSON.stringify(anchors,null,1)+';\n');
const untouched=[];for(const [key,value]of Object.entries(JSON.parse(fs.readFileSync(out+'/before-town.json')).frames)){if(changed.includes(key))continue;const f=value.frame;for(let y=0;y<f.h;y++){const a=((f.y+y)*before.width+f.x)*4,z=((f.y+y)*atlas.width+f.x)*4;if(!before.data.subarray(a,a+f.w*4).equals(atlas.data.subarray(z,z+f.w*4)))throw Error('Protected cell changed: '+key);}untouched.push(key);}
const manifest={version:'0.33.0',date:'2026-10-15',mode:'built-in imagegen; nearest native sampling; shared 14-color palette; binary alpha; mirrored/tone variants; row-shear grass bend adaptation',sources:Object.fromEntries(['oak','palm','grass','pine'].map(n=>[n,{file:'sources/'+n+'.png',sha256:sha(fs.readFileSync(out+'/sources/'+n+'.png'))}])),changedFrames:changed.filter(k=>!k.startsWith('nature-fruit')),addedFrames:changed.filter(k=>k.startsWith('nature-fruit')),untouchedFrames:untouched.length,oldAtlas:{w:before.width,h:before.height},atlas:{w:atlas.width,h:atlas.height},origins:anchors,runtimeSHA256:sha(fs.readFileSync(art+'/town.png'))};
fs.writeFileSync(out+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');
const board=blank(820,400);for(let i=0;i<board.data.length;i+=4)board.data.set([140,153,98,255],i);
function paste(im,x,y,scale){for(let yy=0;yy<im.height*scale;yy++)for(let xx=0;xx<im.width*scale;xx++){const i=(Math.floor(yy/scale)*im.width+Math.floor(xx/scale))*4,j=((y+yy)*board.width+x+xx)*4;if(im.data[i+3])board.data.set(im.data.subarray(i,i+4),j);}}
paste(native.oak,18,44,3);paste(native.palm,280,12,3);paste(native.grass,175,282,4);paste(native.pine,620,45,3);write(out+'/native-review.png',board);
console.log(JSON.stringify({changed:manifest.changedFrames.length,added:manifest.addedFrames.length,protected:untouched.length,origins:anchors}));
