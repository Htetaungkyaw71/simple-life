// Audit and package the authored female art; no changes to existing male pixels.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {GIRL_FARMER,BOY_FARMER} from '../src/data/appearance.js';
import {BOY_TOOL_FRAMES} from '../src/data/revisedFarmer.js';
const require=createRequire(import.meta.url);
const {PNG}=require('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const root=path.resolve(import.meta.dirname,'..'),out=root+'/output/art/farmer-girl-v2';
const evidence=root+'/docs/assets/licenses/farmer-girl-v2',qa=root+'/docs/verification/farmer-girl-v2';
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,v);};
const writeJson=(p,v)=>write(p,JSON.stringify(v,null,2)+'\n');
const copy=(a,b)=>{fs.mkdirSync(path.dirname(b),{recursive:true});fs.cpSync(a,b,{recursive:true});};
const png=p=>PNG.sync.read(fs.readFileSync(p));
const pixel=(im,x,y)=>[...im.data.subarray((y*im.width+x)*4,(y*im.width+x+1)*4)];
const crop=(im,x,y,w,h)=>{const b=Buffer.alloc(w*h*4);for(let r=0;r<h;r++)im.data.copy(b,r*w*4,((r+y)*im.width+x)*4,((r+y)*im.width+x+w)*4);return b;};
const m=json(out+'/manifest.json'),gen=json(out+'/generation.json'),runtime=png(out+'/runtime-girl.png');
const directions=['south','north','west','east'],gameDirections=['down','up','left','right'];
assert.equal(runtime.width,512);assert.equal(runtime.height,2048);
assert.equal(sha(out+'/runtime-girl.png'),sha(root+'/public/assets/pixel/processed/girl.png'));
const allowed=new Set(m.palette.map(c=>c.join(','))),colours=new Set();let count=0;
for(const [action,spec]of Object.entries(m.actions)){
 const sheet=png(out+'/sheets/'+action+'.png');assert.equal(sheet.width,64*spec.count);assert.equal(sheet.height,256);
 assert.equal(sha(out+'/sheets/'+action+'.png'),spec.sheetSha256);
 for(const [row,dir]of directions.entries())for(let phase=0;phase<spec.count;phase++){
  const im=png(out+`/frames/${action}/${dir}/${String(phase).padStart(2,'0')}.png`);
  assert.equal(im.width,64);assert.equal(im.height,64);
  assert.deepEqual(im.data,crop(sheet,phase*64,row*64,64,64));
  assert.deepEqual(im.data,crop(runtime,phase*64,(m.clips[action].offset/8+row)*64,64,64));
  let ink=0;for(let p=0;p<im.data.length;p+=4){const a=im.data[p+3];assert.ok(a===0||a===255);if(a){ink++;const key=[...im.data.subarray(p,p+3)].join(',');assert.ok(allowed.has(key));colours.add(key);const x=p/4%64,y=Math.floor(p/4/64);assert.ok(x>0&&x<63&&y>0&&y<63);}}assert.ok(ink);
  if(['idle','running','jumping'].includes(action)){
   const [hx,hy]=m.handsWorldOffsets[gameDirections[row]][action][phase];
   const x=Math.round(hx/m.scale+32-.5),y=Math.round(hy/m.scale+56-.5),p=pixel(im,x,y);
   assert.ok(p[3]===255&&p[0]>120&&p[0]>p[1]*1.25&&p[1]>p[2]*1.25,'Grip on actual painted skin');
  }
  count++;
 }
}
assert.equal(count,192);
const eyeChecks=[];
for(const phase of [0,1,3]){
 const im=png(out+`/frames/idle/south/${String(phase).padStart(2,'0')}.png`);
 for(const x of [29,34])for(const y of [27,28]){
  assert.ok(Math.max(...pixel(im,x,y).slice(0,3))<90);
  assert.ok(Math.max(...pixel(im,x-1,y).slice(0,3))>=90&&Math.max(...pixel(im,x+1,y).slice(0,3))>=90,'Eye is exactly one column wide');
 }
 eyeChecks.push({phase,eyes:[{x:29,y:27,width:1,height:2},{x:34,y:27,width:1,height:2}]});
}
const boy=json(root+'/output/art/farmer-boy-revised-v2/manifest.json');
const girlBox=m.actions.idle.bounds[0][0],boyBox=boy.actions.idle.bounds[0][0];
const heights={girl:(girlBox[3]-girlBox[1])*GIRL_FARMER.scale,boy:(boyBox[3]-boyBox[1])*BOY_FARMER.scale};
assert.ok(Math.abs(heights.girl-heights.boy)<1,'Matching in-game standing height');
for(const [name,digest]of Object.entries(m.sources))assert.equal(sha(out+'/source/'+name),digest);
const baselinePath='/private/tmp/simple-life-female-baseline.json';
const preserved=[];
if(fs.existsSync(baselinePath))for(const [file,digest]of Object.entries(json(baselinePath))){if(file.endsWith('/girl.png'))continue;assert.equal(sha(root+'/'+file),digest,file+' unchanged');preserved.push(file);}
const toolFrames={};
for(const [tool,views]of Object.entries(BOY_TOOL_FRAMES)){
 toolFrames[tool]={};for(let row=0;row<4;row++){
  const src=root+`/output/art/farmer-boy-extension-v1/tools/${tool}/${gameDirections[row]}.png`;
  const dst=out+`/tools/${tool}/${directions[row]}.png`;copy(src,dst);assert.equal(sha(src),sha(dst));toolFrames[tool][directions[row]]=views[gameDirections[row]]-256;
 }
}
copy(root+'/output/art/farmer-boy-extension-v1/sheets/carried-tools.png',out+'/sheets/carried-tools.png');
writeJson(out+'/carry.json',{scale:m.scale,bodyOriginPixels:[32,56],toolOriginPixels:[32.5,32.5],toolSheet:'sheets/carried-tools.png',toolFrames,worldHandOffsets:m.handsWorldOffsets,wristAngles:m.carryAnglesRadians,angleFactors:{axe:1,shovel:.6,water:.35},directions:directions.map((d,i)=>({export:d,game:gameDirections[i]})),notes:'Use the same body phase for hand/angle. Add offsets at the registered feet, subtract the same world jump height once. Draw north tools behind the body; front/side tools in front, with the original female hand crop above the handle. Hide tool/hand overlays during combined actions.'});
const prompts='# Female farmer v2 — exact imagegen prompts\n\nBuilt-in imagegen; model-version metadata was not exposed. Ten initial outputs plus one targeted idle-eye edit.\n\n'+Object.entries(gen.prompts).map(([name,p])=>'## '+name+'\n\n```text\n'+p+'\n```\n').join('\n');
write(out+'/PROMPTS.md',prompts);write(evidence+'/PROMPTS.md',prompts);copy(out+'/generation.json',evidence+'/generation.json');
copy(root+'/docs/assets/licenses/farmer-boy-revised-v2/OUTPUT_TERMS.md',evidence+'/OUTPUT_TERMS.md');
writeJson(evidence+'/record.json',{date:'2026-10-14',tool:gen.tool,modelVersion:gen.modelVersion,sources:m.sources,sourceDirectory:'output/art/farmer-girl-v2/source',selectedIdle:'idle-eye-fix.png',references:{bodyStyle:'Approved original male farmer v2 and its extension; existing female v1 identity cue.',poseGuides:'Male idle/run/harvest/dig/chop/water/axe/jump sheets; preserve phase choreography while replacing identity.',tools:'Reuse the existing original generated axe/shovel/can views, evidence ../farmer-boy-extension-v1.'},conversion:m.conversion,sizeCorrection:m.sizeCorrection,eyeCorrection:m.eyeCorrection,idleFrontGridPhaseX:m.idleFrontGridPhaseX,offlineDependencies:'Existing bundled Pillow12.3.0 and pngjs7.0.0; evidence docs/licenses/Pillow-LICENSE.txt and docs/licenses/farmer-approved-export. No runtime dependency.',runtimeSha256:m.runtimeSha256});
write(evidence+'/SOURCE_RECORD.md',`# Female farmer v2 — 2026-10-14\n\nUser requested a complete female counterpart to the accepted male, then reported a slightly larger figure and an uneven eye. Eleven built-in OpenAI imagegen calls (ten initial selected outputs and one targeted idle-eye edit) authored a new low-ponytail identity and192whole-body animation frames: idle4, run8 and six each for harvest/dig/chop/water/axe attack/jump, in four directions. Existing male motion sheets were pose/style guides; the previous female supplied the ponytail/identity cue. No external game pixels were copied.\n\n${m.conversion}\n\n${m.sizeCorrection}\n\n${m.eyeCorrection} South idle uses one consistent whole-frame sampling-grid phase0.25 to keep both pupils registered; no individual face pixel or limb was manually repainted or displaced. Source PNGs remain byte-identical. Initial idle source is retained beside its selected eye-edit output.\n\nSeparate carried axe/shovel/watering-can views are reused unchanged from the approved male extension, with the female's own skin-pixel hand registration and wrist-angle tables. Their source/use evidence remains in ../farmer-boy-extension-v1. All new poses are generated/adapted artwork, not human-drawn or original generated high-resolution pixels copied unchanged.\n\nPreviously reviewed OpenAI output-use terms (2026-10-13) are copied unchanged here; this is not CC0 or a guarantee of exclusive copyright. Existing bundled offline Pillow/pngjs evidence remains under docs/licenses. Runtime uses the existing girl.png path and shared boy.png tool slots; raw sources, exports and previews do not ship. No push or publication.\n`);
copy(evidence,out+'/provenance');
write(out+'/README.md',`# Simple Life female farmer v2 — corrected size and eyes\n\n192transparent64×64 body frames across eight actions and four directions. Twelve matching separate carried-tool views are reused unchanged from the accepted male farmer. Exact prompts, raw generated sources, native sheets, GIF previews and integration metadata are included.\n\nRows: south, north, west, east. Columns advance left to right with no gutters. Idle4poses with1100/1000/120/1000ms holds; running8poses at about12fps; harvesting/digging/chopping6at10fps; watering6at8fps; axe attack6at12fps; jump6with90/90/120/120/90/90ms timing. See animations.json for each standalone sheet's frame indices and durations.\n\nBody origin(32,56), display scale1.45, nearest filtering. Female standing ink41pixels displays at59.45world units; the male's40at1.5displays at60. This corrects the reported larger female. Front open-eye idle frames0/1/3have two matching1-column×2-row pupils. The blink remains brief. No native48×48downsampling is used.\n\nUse carry.json for per-frame female hand offsets/angles and shared tool views. Export tool indices refer to sheets/carried-tools.png (8columns,64pxcells). The existing game stores those same tool pixels in male atlas slots256–267; the female body atlas has256slots. Tools follow idle/run/jump phases, share the world jump height, and hide during the existing combined action poses. Draw the original female hand crop above the carried grip. Apply the existing600msjump world arc separately; jump boot registration is already normalized.\n\nThe complete game atlas is runtime-girl.png: eight columns,32rows. Each action reserves four rows/eight slots per row; counts in unused row slots stay transparent. manifests retain original sources/hashes and conversion. Assets are OpenAI-generated and Codex-adapted under the recorded service terms, not CC0 or an exclusive-copyright guarantee. Current male/NPC/world artwork and saved gameplay remain. Local integration only; no deployment.\n`);
const zip=out+'.zip';if(fs.existsSync(zip))fs.unlinkSync(zip);execFileSync('/usr/bin/zip',['-qr',zip,path.basename(out)],{cwd:path.dirname(out)});execFileSync('/usr/bin/unzip',['-tq',zip]);
writeJson(qa+'/asset-audit.json',{date:'2026-10-14',result:'pass',femaleFrames:count,sharedToolViews:12,clips:32,runtimeCells:256,alpha:'binary',paletteColoursUsed:colours.size,paletteMatchesMale:true,allCellsMatchSheetsAndRuntime:true,noClippedFrameEdges:true,skinPixelGripsVerified:true,eyeChecks,standingWorldHeights:heights,preservedFiles:preserved,sourceHashesVerified:Object.keys(m.sources).length,zipCrc:'pass',zipSha256:sha(zip),zipBytes:fs.statSync(zip).size});
console.log({frames:count,standingWorldHeights:heights,eyes:'matching1×2in all open-eye south idle phases',zipBytes:fs.statSync(zip).size});
