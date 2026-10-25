// Preserve the approved v2 and export a sibling full package with new layers.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {BOY_CLIPS,BOY_HANDS,BOY_TOOL_FRAMES,BOY_CARRY_ANGLES} from '../src/data/revisedFarmer.js';
const require=createRequire(import.meta.url),{PNG}=require('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const root=path.resolve(import.meta.dirname,'..'),base=root+'/output/art/farmer-boy-revised-v2',extra=root+'/output/art/farmer-boy-extension-v1',out=root+'/output/art/farmer-boy-complete-v3',evidence=root+'/docs/assets/licenses/farmer-boy-extension-v1';
const json=p=>JSON.parse(fs.readFileSync(p,'utf8')),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,v);},writeJson=(p,v)=>write(p,JSON.stringify(v,null,2)+'\n');
const copy=(a,b)=>{fs.mkdirSync(path.dirname(b),{recursive:true});fs.cpSync(a,b,{recursive:true});};
const m=json(extra+'/manifest.json'),gen=json(extra+'/generation.json'),old=json(base+'/manifest.json'),dirs=['down','up','left','right'],exportDirs=['south','north','west','east'];
const png=p=>PNG.sync.read(fs.readFileSync(p));
const crop=(im,x,y,w,h)=>{const b=Buffer.alloc(w*h*4);for(let r=0;r<h;r++)im.data.copy(b,r*w*4,((r+y)*im.width+x)*4,((r+y)*im.width+x+w)*4);return b;};
const runtime=png(root+'/public/assets/pixel/processed/boy.png');assert.equal(runtime.width,512);assert.equal(runtime.height,2176);
let preserved=0,newFrames=0;
for(const [name,spec]of Object.entries(old.actions)){
 const sheet=png(base+'/sheets/'+name+'.png');
 for(let row=0;row<4;row++)for(let phase=0;phase<spec.count;phase++){
  assert.deepEqual(crop(sheet,phase*64,row*64,64,64),crop(runtime,phase*64,(BOY_CLIPS[name].offset/8+row)*64,64,64));preserved++;
 }
}
const palette=new Set(old.palette.map(c=>c.join(',')));
for(const name of ['jumping','carried-tools']){
 const sheet=png(extra+'/sheets/'+name+'.png');
 const count=name==='jumping'?24:12;
 for(let i=0;i<count;i++){
  const columns=name==='jumping'?6:8,row=Math.floor(i/columns),phase=i%columns;
  const data=crop(sheet,phase*64,row*64,64,64),frame=name==='jumping'?224+row*8+phase:256+i;
  assert.deepEqual(data,crop(runtime,(frame%8)*64,Math.floor(frame/8)*64,64,64));
  let ink=0;for(let p=0;p<data.length;p+=4){assert.ok(data[p+3]===0||data[p+3]===255);if(data[p+3]){ink++;assert.ok(palette.has([...data.subarray(p,p+3)].join(',')));const x=p/4%64,y=Math.floor(p/4/64);assert.ok(x>0&&x<63&&y>0&&y<63);}}assert.ok(ink);newFrames++;
 }
}
assert.equal(preserved,168);assert.equal(newFrames,36);
for(const name of ['frames','sheets','compat48','source','provenance'])copy(base+'/'+name,out+'/'+name);
copy(extra+'/sheets/jumping.png',out+'/sheets/jumping.png');copy(extra+'/sheets/carried-tools.png',out+'/sheets/carried-tools.png');
for(const [i,dir]of dirs.entries())copy(extra+'/frames/jumping/'+dir,out+'/frames/jumping/'+exportDirs[i]);
copy(extra+'/tools',out+'/tools');copy(extra+'/source',out+'/source/extension');copy(extra+'/previews',out+'/previews/extension');
const animations=json(base+'/animations.json');
for(let row=0;row<4;row++)animations.clips.push({key:'farmer-jumping-'+exportDirs[row],action:'jumping',direction:exportDirs[row],sheet:'sheets/jumping.png',frameWidth:64,frameHeight:64,row,columns:6,frameIndices:Array.from({length:6},(_,i)=>row*6+i),frameFiles:Array.from({length:6},(_,i)=>'frames/jumping/'+exportDirs[row]+'/'+String(i).padStart(2,'0')+'.png'),frameDurationsMs:m.jump.durations,loop:false});
writeJson(out+'/animations.json',animations);
writeJson(out+'/carry.json',{scale:1.5,frameSize:[64,64],directionNames:exportDirs.map((d,i)=>({export:d,game:dirs[i]})),toolOriginNormalized:[32.5/64,32.5/64],toolFrames:BOY_TOOL_FRAMES,handsWorldOffsets:BOY_HANDS,anglesRadians:BOY_CARRY_ANGLES,angleFactor:{axe:1,shovel:.6,water:.35},notes:'Body phase chooses hand and angle. Subtract jump height once from both layers. Draw north tools behind the body and other tools in front; restore the original hand pixels over the grip. Hide tool and grip layers during every combined action. Tools are separate 64px images, origin32.5,32.5. Runtime frame indices refer to the bundled runtime-boy.png; individual tool PNG names use game direction names.'});
copy(root+'/public/assets/pixel/processed/boy.png',out+'/runtime-boy.png');
writeJson(out+'/runtime-clips.json',BOY_CLIPS);
writeJson(out+'/manifest.json',{...old,status:'Approved original v2 extended with newly generated jump and carried tools; integrated locally in v0.27.0',totalFrames:192,totalToolFrames:12,extension:m,actions:{...old.actions,jumping:m.jump},limitations:'New extension artwork has not yet received user visual approval. All original168body/action frames are preserved. No authored female extension. Copper upgrade uses the matching grey-green carried can; its gameplay effects remain unchanged.'});
const promptText='# New jump and carried tools — exact prompts\n\nOpenAI built-in imagegen, model version not exposed.\n\n'+Object.entries(gen.prompts).map(([name,p])=>'## '+name+'\n\n```text\n'+p+'\n```\n').join('\n');
write(extra+'/PROMPTS.md',promptText);write(evidence+'/PROMPTS.md',promptText);write(out+'/EXTENSION_PROMPTS.md',promptText);
copy(base+'/PROMPTS.md',out+'/ORIGINAL_PROMPTS.md');
const record={date:'2026-10-14',tool:gen.tool,modelVersion:gen.modelVersion,sources:m.sources,referenceRoles:{jump:'Approved original v2 idle-contact.png identity/scale reference.',axe:'Approved original v2 chopping-contact.png tool shape/material reference.',shovel:'Approved original v2 digging-contact.png tool shape/material reference.',water:'Approved original v2 watering-contact.png tool shape/material reference.'},conversion:m.conversion,original168FramesPreserved:true,runtimeAtlas:'public/assets/pixel/processed/boy.png',runtimeSha256:sha(root+'/public/assets/pixel/processed/boy.png'),offlineDependency:'Existing bundled Pillow; project evidence docs/licenses/Pillow-LICENSE.txt. Existing pngjs7.0.0MIT used only for audit; docs/licenses/farmer-approved-export. No new npm/runtime dependency.'};
writeJson(evidence+'/record.json',record);copy(extra+'/generation.json',evidence+'/generation.json');
copy(root+'/docs/assets/licenses/farmer-boy-revised-v2/OUTPUT_TERMS.md',evidence+'/OUTPUT_TERMS.md');
write(evidence+'/SOURCE_RECORD.md','# Male farmer extension — 2026-10-14\n\nThe user requested a matching authored jump and separate carried axe, shovel and watering-can images for standing/running, preserving existing combined actions. Four OpenAI built-in imagegen calls supplied24jump poses and12tool views. Exact prompts, source hashes and conversion are recorded here; unchanged source PNGs are under output/art/farmer-boy-extension-v1/source/. References were the current approved original farmer idles and existing chopping/digging/watering art. No third-party art or reference screenshot pixels were sampled.\n\n'+m.conversion+'\n\nPillow performs offline native conversion/packing only; pngjs audits PNG bytes. Existing dependency evidence is retained. Service output-use evidence was previously reviewed on2026-10-13 and is copied unchanged here; it is not CC0 or a guarantee of exclusive copyright. The existing168frames remain pixel-identical to approved v2. No female art generation, source push, deployment or remote runtime is included.\n');
copy(evidence,out+'/provenance/extension');
write(out+'/README.md',`# Simple Life male farmer — complete v3\n\n192 transparent64×64 body frames: original approved168plus24new jumping frames. Twelve separate carried-tool views (axe, shovel, watering can) are in tools/. Original48×48idle/run compatibility crops are retained.\n\nSheets have no padding between cells. Direction rows are south, north, west, east. Idle4frames; run8; work/attack6; jump6. animations.json gives sheet indices and timings. Jump lasts600ms with90,90,120,120,90,90ms phases. Apply the game jump arc separately; exported boots remain registered to ground row56. Use origin(32,56), nearest filtering and the accepted1.5display scale.\n\ncarry.json gives per-frame hand offsets, angles and tool origins. Tool PNG names use down/up/left/right (south/north/west/east). Position tool grip at the current hand, apply its angle about that grip, and subtract the same jump height used for the body. Suppress separate tools during harvesting, digging, chopping, watering and attack, which keep their existing combined art. Restore the tool on idle/run. Repaint the actual hand crop above the handle for front/side views. No alternate tool-use actions are generated.\n\nOptional runtime-boy.png packs the current game's eight-column atlas: original actions in slots0–223, jumping224–255, tools256–267, final padding268–271. runtime-clips.json supplies its action offsets. Individual action sheets retain their own narrower layouts; use animations.json for those sheets.\n\nOriginal168frames and original face detail are byte-preserved. Extension artwork is AI-generated and adapted, with exact prompts/source records included. Existing female/NPC art, jump physics, save schema and game rules remain. Copper upgrade retains coverage/particles with the same matching grey-green can appearance. No public deployment was performed.\n`);
const zip=out+'.zip';if(fs.existsSync(zip))fs.unlinkSync(zip);execFileSync('/usr/bin/zip',['-qr',zip,path.basename(out)],{cwd:path.dirname(out)});execFileSync('/usr/bin/unzip',['-tq',zip]);
writeJson(root+'/docs/verification/farmer-boy-extension/asset-audit.json',{date:'2026-10-14',result:'pass',approvedFramesPreserved:preserved,newJumpFrames:24,newToolViews:12,newFramesChecked:newFrames,nativeSize:[64,64],binaryAlpha:true,sharedOriginalPalette:true,noClippedEdges:true,runtimeSlots:272,archiveCrc:'pass',archiveSha256:sha(zip),archiveBytes:fs.statSync(zip).size});
console.log('Preserved168original frames; audited24jump poses/12tool views; complete ZIP CRC pass.');
