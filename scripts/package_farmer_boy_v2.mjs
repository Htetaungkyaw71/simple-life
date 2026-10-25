// Package and audit approved, already exported art without changing its pixels.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const require=createRequire(import.meta.url);
const {PNG}=require(process.env.PNGJS_MODULE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'output/art/farmer-boy-revised-v2');
const evidence=path.join(root,'docs/assets/licenses/farmer-boy-revised-v2');
const verification=path.join(root,'docs/verification/farmer-boy-revised-v2');
const readJson=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const write=(p,data)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,data);};
const json=(p,v)=>write(p,JSON.stringify(v,null,2)+'\n');
const sha=v=>createHash('sha256').update(v).digest('hex');
const m=readJson(out+'/manifest.json'),gen=readJson(out+'/generation.json');
const clips=[];
for(const [action,spec] of Object.entries(m.actions))for(const [row,direction]of m.directions.entries())clips.push({
  key:`farmer-${action}-${direction}`,action,direction,sheet:`sheets/${action}.png`,
  frameWidth:64,frameHeight:64,row,columns:spec.count,
  frameIndices:Array.from({length:spec.count},(_,i)=>row*spec.count+i),
  frameFiles:Array.from({length:spec.count},(_,i)=>`frames/${action}/${direction}/${String(i).padStart(2,'0')}.png`),
  frameDurationsMs:spec.durations,loop:['idle','running'].includes(action),
});
json(out+'/animations.json',{version:1,frameIndexBase:0,rowOrder:m.directions,originPixels:[32,56],originNormalized:[0.5,0.875],clips});
m.status='User-approved sprite export; not integrated into game';
m.approval={date:'2026-10-14',scope:'User accepted revised appearance and requested full sprite delivery.'};
m.limitations='Generated shape/tool details may vary between poses. West running mirrors east. Engine collision boxes, tool contact events and movement speed require game-specific integration.';
json(out+'/manifest.json',m);
const readme=`# Simple Life — approved farmer, revised v2

Approved in this chat on 2026-10-14. All seven actions use the revised original farmer identity.

## Import into your game

Use PNGs in sheets/ or individual PNGs in frames/. Every main frame is **64×64**, transparent, with about **40 pixels of standing character height**. Keep the transparent padding: it accommodates raised tools. There is no spacing or extrusion between sheet cells.

Rows from top to bottom: **south, north, west, east**. Columns advance from frame 0. Sheet frame index = row × columns + column. Use nearest-neighbour filtering, disable smoothing and avoid automatic trim/rotation when importing. Prefer integer display scales.

Use origin (32,56), or normalized (0.5,0.875), for a shared character ground anchor. Keep the collision body separate from the padded art; choose its size for your game. The PNG contains the farmer and any held tool together. Harvesting is empty-handed; targets, produce, hit effects and water particles belong to game logic.

| Action | Frames per direction | Sheet size | Timing |
| --- | ---: | --- | --- |
| idle | 4 | 256×256 | 1100, 1000, 120, 1000 ms |
| running | 8 | 512×256 | approximately 12 fps |
| harvesting | 6 | 384×256 | 10 fps |
| digging | 6 | 384×256 | 10 fps |
| chopping | 6 | 384×256 | 10 fps |
| watering | 6 | 384×256 | 8 fps |
| attack (axe) | 6 | 384×256 | approximately 12 fps |

animations.json contains all 28 clips, zero-based sheet indices, individual frame paths and exact millisecond durations. Idle/running default to looping; work/attack default to playing once. Return to the direction's idle when an action completes. Adjust running translation to match the stride in your game; sprites run in place. Add tool/hit events at the appropriate phase after testing your interactions. No collision boxes or damage/contact events are invented in this export.

compat48/ contains **48 extra 48×48 idle/running frames**. These are exact crops, not scaled versions: main-frame crop x=8, y=12, width=48, height=48. Their origin is (24,44), normalized (0.5,0.9166667). Work/tool actions need the 64×64 frames. If 48×48 means your tile size, you can still draw a 64×64 sprite over it using the ground anchor.

## Contents

- frames/: 168 individual 64×64 RGBA PNGs.
- sheets/: seven packed sheets, four directional rows each.
- compat48/: 48 optional idle/running crops.
- animations.json and manifest.json: timing, indices, palette, source hashes and export details.
- previews/: enlarged nearest-neighbour contacts and GIFs; contact.png shows the full set. Previews are for inspection, not game textures.
- source/: ten unchanged high-resolution imagegen source PNGs.
- PROMPTS.md, generation.json and provenance/: exact prompts and output-use records.
- index.html: interactive reviewer, including comparison/ (previous rejected art, preview only).

For the interactive reviewer, serve the extracted folder with a local static server (for example, run python3 -m http.server 4203 from inside this folder, then open http://127.0.0.1:4203/). Double-clicking index.html through file:// may block JSON loading. The game PNGs themselves require no server or generation service.

## Art and export notes

Original AI-generated artwork made with OpenAI built-in imagegen, then adapted to native pixels with Codex assistance. The user supplied screenshots and requested broad Plant Tales-inspired proportions/pixel language. No Plant Tales character pixels are included. Existing user-generated PixelLab poses guided running motion. West running is a horizontal mirror of the newly authored east sequence.

The export uses nearest sampling, a shared 32-colour palette and binary alpha. Chopping source silhouettes were separated using their opaque cores; raw source files remain unchanged. Generated shapes/tool details can vary slightly between frames. User visual approval does not define engine-specific contact timing.

See provenance/OUTPUT_TERMS.md for previously reviewed service terms and provenance/SOURCE_RECORD.md for references and conversion. This is generated output under applicable service terms, not a CC0 licence or an exclusive-copyright guarantee. No runtime integration or new runtime dependency was performed.
`;
write(out+'/README.md',readme);
const prompts='# Revised farmer — exact imagegen prompt set\n\nBuilt-in imagegen; model-version metadata was not exposed. Source outputs were generated before the user approved delivery.\n\n'+gen.sources.map(s=>`## ${s.name}\n\nSource: source/${s.name}.png\n\n\`\`\`text\n${s.prompt}\n\`\`\`\n`).join('\n');
write(out+'/PROMPTS.md',prompts);write(evidence+'/PROMPTS.md',prompts);
const record={date:'2026-10-14',tool:gen.source,modelVersion:'not exposed',approval:m.approval,sources:m.sources,conversion:m.conversion,referenceRoles:{screenshots:'User-supplied proportion/pixel-style references only; not packaged.',plantTales:'Broad style reference https://store.steampowered.com/app/3693970/Plant_Tales/ ; no game pixels copied.',running:'Existing user-generated PixelLab running poses used as motion guidance; source/licences in docs/assets/licenses/characters-pixellab.'},dependencies:'Existing offline pngjs7.0.0 MIT and sharp0.35.5 Apache-2.0; evidence docs/licenses/farmer-approved-export. No new npm/runtime dependencies.'};
json(evidence+'/record.json',record);
write(evidence+'/SOURCE_RECORD.md',`# Revised farmer v2 source record\n\n2026-10-14: user approved the revised appearance and requested the complete sprite export. OpenAI built-in imagegen produced ten selected source PNGs. Model version was not exposed. Exact prompts are in PROMPTS.md; record.json stores source paths and SHA-256 hashes. Byte-identical raw PNGs accompany the export under source/.\n\nReferences: the user's two Desktop screenshots dated 2026-10-13 supplied proportion/pixel language. Plant Tales official Steam screenshots were inspected for broad visual style; no screenshot or Plant Tales sprite pixels enter this export. Existing user-generated PixelLab run poses guided the new run phases; their source/use evidence remains in ../characters-pixellab/. Older generated work-action poses guided the revised action sheets.\n\nNative conversion: ${m.conversion}\n\nAll seven actions were regenerated for the revised identity. 168 native64×64 frames plus48 exact idle/run48×48 crops; original30-pixel revision is retained separately. West running is explicitly mirrored. No procedural limb motion, runtime replacement or deployment. AI generation/adaptation is disclosed.\n\nOutput-use evidence is copied unchanged from the previously reviewed OpenAI terms record (2026-10-13). Offline dependency evidence remains in docs/licenses/farmer-approved-export. These are service output terms, not CC0 or a claim of exclusive copyright.\n`);
fs.copyFileSync(root+'/docs/assets/licenses/farmer-boy-approved-v1/OUTPUT_TERMS.md',evidence+'/OUTPUT_TERMS.md');
fs.cpSync(evidence,out+'/provenance',{recursive:true});
fs.mkdirSync(out+'/comparison',{recursive:true});
for(const action of Object.keys(m.actions))fs.copyFileSync(root+'/output/art/farmer-boy-approved-v1/sheets/'+action+'.png',out+'/comparison/'+action+'.png');
const html=fs.readFileSync(out+'/index.html','utf8').replaceAll('../farmer-boy-approved-v1/sheets/','comparison/');write(out+'/index.html',html);

// Byte-level checks inspect actual exported PNGs, independently of exporter assertions.
const readPng=p=>PNG.sync.read(fs.readFileSync(p));
const region=(im,x,y,w,h)=>{const b=Buffer.alloc(w*h*4);for(let r=0;r<h;r++)im.data.copy(b,r*w*4,((r+y)*im.width+x)*4,((r+y)*im.width+x+w)*4);return b;};
let fullCount=0,cropCount=0;const colours=new Set();const frames={};
for(const [action,spec]of Object.entries(m.actions)){
 const sheet=readPng(out+'/sheets/'+action+'.png');assert.equal(sheet.width,64*spec.count);assert.equal(sheet.height,256);assert.equal(sha(fs.readFileSync(out+'/sheets/'+action+'.png')),spec.sheetSha256);
 frames[action]={};
 for(const [row,dir]of m.directions.entries()){
  frames[action][dir]=[];
  for(let i=0;i<spec.count;i++){
   const im=readPng(out+`/frames/${action}/${dir}/${String(i).padStart(2,'0')}.png`);assert.equal(im.width,64);assert.equal(im.height,64);assert.deepEqual(im.data,region(sheet,i*64,row*64,64,64));
   let opaque=0;for(let p=0;p<im.data.length;p+=4){const a=im.data[p+3];assert.ok(a===0||a===255);if(a){opaque++;colours.add(im.data.subarray(p,p+3).toString('hex'));const x=p/4%64,y=Math.floor(p/4/64);assert.ok(x>0&&x<63&&y>0&&y<63,'Clipped edge');}}assert.ok(opaque);frames[action][dir].push(im);fullCount++;
   if(['idle','running'].includes(action)){const c=readPng(out+`/compat48/${action}/${dir}/${String(i).padStart(2,'0')}.png`);assert.equal(c.width,48);assert.equal(c.height,48);assert.deepEqual(c.data,region(im,8,12,48,48));cropCount++;}
  }
 }
}
assert.equal(fullCount,168);assert.equal(cropCount,48);assert.equal(colours.size,32);assert.equal(clips.length,28);
for(let i=0;i<8;i++){const west=frames.running.west[i],east=frames.running.east[i];for(let y=0;y<64;y++)for(let x=0;x<64;x++)assert.deepEqual(west.data.subarray((y*64+x)*4,(y*64+x+1)*4),east.data.subarray((y*64+63-x)*4,(y*64+64-x)*4));}
for(const [name,s]of Object.entries(m.sources))assert.equal(sha(fs.readFileSync(out+'/source/'+name+'.png')),s.sha256);
for(const c of clips){assert.equal(c.frameIndices.length,c.frameDurationsMs.length);assert.ok(c.frameIndices.every(i=>i>=0&&i<m.actions[c.action].count*4));assert.ok(c.frameDurationsMs.every(n=>n>0));}
const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);
const pngs=walk(out+'/frames').filter(p=>p.endsWith('.png'));assert.equal(pngs.length,168);
const zip=path.join(root,'output/art/farmer-boy-revised-v2.zip');
// Remove only this reproducible generated archive before rebuilding, avoiding stale entries.
if(fs.existsSync(zip))fs.unlinkSync(zip);
execFileSync('/usr/bin/zip',['-qr',zip,path.basename(out)],{cwd:path.dirname(out)});
execFileSync('/usr/bin/unzip',['-tq',zip]);
const archiveEntries=execFileSync('/usr/bin/unzip',['-Z1',zip],{encoding:'utf8'}).trim().split('\n').filter(s=>!s.endsWith('/'));assert.equal(archiveEntries.length,walk(out).length);
const audit={date:'2026-10-14',result:'pass',fullFrames:fullCount,compatibilityCrops:cropCount,animationClips:clips.length,sheets:7,sharedOpaqueColours:colours.size,binaryAlpha:true,noInkOnFrameEdges:true,sheetCellsEqualFrames:true,compatibilityCropsPixelExact:true,westRunningMirrorVerified:true,rawSourceHashesVerified:10,zipCrc:'pass',archiveFileCount:archiveEntries.length,zipBytes:fs.statSync(zip).size,zipSha256:sha(fs.readFileSync(zip))};
json(verification+'/audit.json',audit);console.log(JSON.stringify(audit,null,2));
