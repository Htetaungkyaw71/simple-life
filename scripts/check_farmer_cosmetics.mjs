// Offline native-pixel audit. pngjs comes from the documented bundled export
// runtime; it is not a game dependency or production asset.
import {createRequire} from 'node:module';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {farmerCosmeticPixels} from '../src/systems/farmerCosmetics.js';
import {freshAppearance,OUTFIT_IDS,HAIRCUT_IDS} from '../src/data/appearance.js';
import {COSMETIC_FRAMES} from '../src/data/farmerCosmetics.js';
const require=createRequire('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {PNG}=require('pngjs');
const folder='docs/verification/farmer-cosmetics';mkdirSync(folder,{recursive:true});
const baseline=JSON.parse(readFileSync(folder+'/baseline-hashes.json')),hash=b=>createHash('sha256').update(b).digest('hex');
const checks={baseAssetsUnchanged:[],styles:0,bodyFrames:0,alphaChecks:0,toolPixelsChecks:0};
for(const [file,sha]of Object.entries(baseline)){assert.equal(hash(readFileSync('public/assets/pixel/processed/'+file)),sha);checks.baseAssetsUnchanged.push(file);}
for(const character of ['boy','girl']){
 const src=PNG.sync.read(readFileSync('public/assets/pixel/processed/'+character+'.png'));
 const output=new PNG({width:1024,height:1024});output.data.fill(0);
 let index=0;
 for(const outfit of OUTFIT_IDS)for(const hair of HAIRCUT_IDS){
  const a={...freshAppearance(character),outfit,hair},data=farmerCosmeticPixels(src.data,src.width,character,a);
  assert.equal(data.length,src.data.length);for(let i=3;i<data.length;i+=4){assert.equal(data[i],src.data[i]);checks.alphaChecks++;}
  for(const [frame,anchor]of Object.entries(COSMETIC_FRAMES[character])){
   const [cx,top,,eye]=anchor,ox=Number(frame)%8*64,oy=Math.floor(Number(frame)/8)*64;
   for(let y=top+6;y<Math.min(64,top+16);y++)for(let x=Math.max(0,cx-8);x<Math.min(64,cx+9);x++){
    const i=((oy+y)*src.width+ox+x)*4,p=src.data.subarray(i,i+4);
    // All warm face/skin pixels and near-black original pupils remain source.
    if(p[3]&&(p[0]>180&&p[0]>p[1]*1.25&&p[1]>p[2]*1.22||p[0]===29&&Math.abs(y-eye)<=2))assert.deepEqual(Array.from(data.subarray(i,i+4)),Array.from(p),'original face '+character+' '+frame);
   }
  }
  if(character==='boy'){const toolStart=32*64*src.width*4;assert.deepEqual(Buffer.from(data.subarray(toolStart)),src.data.subarray(toolStart));checks.toolPixelsChecks++;}
  checks.styles++;index++;
 }
 const a={...freshAppearance(character),outfit:'plum',accessories:{hat:'straw',glasses:'round',bag:'canvas'}},data=farmerCosmeticPixels(src.data,src.width,character,a);
 let n=0;
 for(const [frame]of Object.entries(COSMETIC_FRAMES[character])){
  const f=Number(frame),ox=f%8*64,oy=Math.floor(f/8)*64,dx=(n%16)*64,dy=Math.floor(n/16)*64;
  for(let y=0;y<64;y++)for(let x=0;x<64;x++){
   const i=((oy+y)*src.width+ox+x)*4,j=((dy+y)*output.width+dx+x)*4;
   output.data.set(data.subarray(i,i+4),j);
   if(x===0||x===63||y===0||y===63)assert.equal(data[i+3],0,'clear frame margin');
  }
  const [cx,top]=COSMETIC_FRAMES[character][frame];
  const skin=p=>p[0]>=188&&p[0]>p[1]*1.25&&p[1]>p[2]*1.22;
  for(let y=top+7;y<Math.min(64,top+14);y++)for(let x=Math.max(1,cx-8);x<Math.min(63,cx+9);x++){
   const i=((oy+y)*src.width+ox+x)*4,p=src.data.subarray(i,i+4);
   if(p[3]&&p[0]<60&&(skin(src.data.subarray(i-4,i))||skin(src.data.subarray(i+4,i+8))))assert.deepEqual(Array.from(data.subarray(i,i+4)),Array.from(p),'accessories preserve source eyes '+character+' '+frame);
  }
  checks.bodyFrames++;n++;
 }
 writeFileSync(folder+'/'+character+'-all-poses.png',PNG.sync.write(output));
}
writeFileSync(folder+'/asset-audit.json',JSON.stringify(checks,null,2)+'\n');console.log(checks);
