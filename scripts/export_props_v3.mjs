import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {PNG,propPixels,PROP_COLORS} from './prop_pixels.mjs';
const out='output/art/props-v3',runtime='public/assets/pixel/processed';
const read=p=>PNG.sync.read(fs.readFileSync(p)),write=(p,im)=>fs.writeFileSync(p,PNG.sync.write(im)),hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const colors=[...PROP_COLORS,...['492c2d','704032','a35b3e','c38358','e9ad7d','765446','ab8260','caaa83','b8b7a3','7b7e70','afc4b6','5b6541','82934b','d6cc9d'].map(s=>s.match(/../g).map(v=>parseInt(v,16)))];
const before=read(out+'/before-town.png'),meta=JSON.parse(fs.readFileSync(out+'/before-town.json')),atlas=new PNG({width:before.width,height:before.height});PNG.bitblt(before,atlas,0,0,before.width,before.height,0,0);
const sourceFor={bench:'bench',table:'table','home-table':'table','home-bench':'home-bench','prop-bench-left':'bench-side','prop-bench-up':'bench-rear','prop-table-left':'table-side',well:'well',notice:'notice',crate:'crate',barrel:'barrel',lamp:'lantern','city-lamp':'lantern',mailbox:'mailbox',wheelbarrow:'wheelbarrow','city-flowerpot':'sunflower','city-tent':'tent','camp-tent':'tent','city-bench-garden':'city-garden',chair:'chair','seed-stall':'stall','produce-stall':'stall','outfitter-stall':'stall','prop-birdbath':'birdbath',planter:'planter','prop-planter':'planter','home-fireplace':'fireplace','home-logs':'logs','home-counter':'counter',dresser:'counter',kitchen:'counter','home-pottery':'pottery',shelf:'bookcase','prop-bookcase':'bookcase','home-bed':'bed',bed:'bed','home-window':'window',window:'window','home-pot':'vase',pot:'vase','prop-vase':'vase'};
const changed=[],sources={},native={};
for(const[name,id]of Object.entries(sourceFor)){
 const file=out+'/sources/'+id+'.png';if(!fs.existsSync(file)){if(process.argv.includes('--partial'))continue;throw Error('Missing '+id);}
 const f=meta.frames[name].frame,im=propPixels(read(file),f.w,f.h,{clean:true,colors});native[name]=im;sources[id]={file,sha256:hash(file)};PNG.bitblt(im,atlas,0,0,f.w,f.h,f.x,f.y);changed.push(name);write(out+'/'+name+'.png',im);
}
for(const[name,shift]of [['produce-stall',[24,-16,-6]],['outfitter-stall',[-14,-4,16]]]){
 if(!changed.includes(name))continue;const f=meta.frames[name].frame;
 for(let y=0;y<f.h*.45;y++)for(let x=0;x<f.w;x++){const i=((f.y+y)*atlas.width+f.x+x)*4;if(atlas.data[i+3]&&atlas.data[i+1]>atlas.data[i]&&atlas.data[i+2]<atlas.data[i])for(let k=0;k<3;k++)atlas.data[i+k]=Math.max(0,Math.min(255,atlas.data[i+k]+shift[k]));}
 const im=new PNG({width:f.w,height:f.h});PNG.bitblt(atlas,im,f.x,f.y,f.w,f.h,0,0);native[name]=im;write(out+'/'+name+'.png',im);
}
let protectedFrames=0;for(const[name,v]of Object.entries(meta.frames)){if(changed.includes(name))continue;const f=v.frame;for(let y=0;y<f.h;y++){const i=((f.y+y)*atlas.width+f.x)*4;if(!before.data.subarray(i,i+f.w*4).equals(atlas.data.subarray(i,i+f.w*4)))throw Error('Protected frame '+name);}protectedFrames++;}
write(out+'/town-preview.png',atlas);fs.writeFileSync(out+'/town-preview.json',JSON.stringify(meta,null,2)+'\n');
const record={version:'0.35.2',date:'2026-10-15',sources,changedFrames:changed,protectedFrames,allCoordinatesUnchanged:true,atlas:meta.meta.size,frames:Object.keys(meta.frames).length,palette:colors.length,mode:'Shared south overhead projection; 3x3 area votes and material-local isolated-speck cleanup; binary alpha; 47-colour stepped material ramp',runtimeSHA256:hash(out+'/town-preview.png')};fs.writeFileSync(out+'/manifest.json',JSON.stringify(record,null,2)+'\n');
const names=Object.keys(native),cw=180,ch=160,board=new PNG({width:cw*6,height:Math.ceil(names.length/6)*ch});for(let i=0;i<board.data.length;i+=4)board.data.set([140,153,98,255],i);
for(const[name,im]of Object.entries(native)){const k=names.indexOf(name),s=Math.max(1,Math.min(4,Math.floor(170/im.width),Math.floor(145/im.height))),xx=k%6*cw+(cw-im.width*s)/2|0,yy=Math.floor(k/6)*ch+ch-8-im.height*s;for(let y=0;y<im.height*s;y++)for(let x=0;x<im.width*s;x++){const a=(Math.floor(y/s)*im.width+Math.floor(x/s))*4,j=((yy+y)*board.width+xx+x)*4;if(im.data[a+3])board.data.set(im.data.subarray(a,a+4),j);}}
write(out+'/native-review.png',board);
fs.writeFileSync(out+'/index.html','<!doctype html><html><head><meta charset="utf-8"><title>Prop projection review</title><style>body{background:#8c9962;color:#352228;font:16px system-ui;margin:24px}main{display:flex;flex-wrap:wrap;gap:20px}figure{margin:0;width:200px;height:190px;text-align:center}img{image-rendering:pixelated;max-width:180px;max-height:150px;object-fit:contain}</style></head><body><h1>Shared overhead object view</h1><p>Native runtime pixels. No outdoor tables; dining table is indoor-only.</p><main>'+names.map(n=>'<figure><figcaption>'+n+'</figcaption><img src="'+n+'.png" width="'+native[n].width*3+'" height="'+native[n].height*3+'"></figure>').join('')+'</main></body></html>');
if(process.argv.includes('--install')){if(process.argv.includes('--partial'))throw Error('Never install partial review');fs.copyFileSync(out+'/town-preview.png',runtime+'/town.png');fs.copyFileSync(out+'/town-preview.json',runtime+'/town.json');}
console.log(JSON.stringify({changed:changed.length,protectedFrames,palette:colors.length,sources:Object.keys(sources).length,installed:process.argv.includes('--install')}));
