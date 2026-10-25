// Pack the user's native Pixel Snapper PNGs unchanged into a dedicated atlas.
import fs from 'node:fs';
import crypto from 'node:crypto';
import {PNG} from './prop_pixels.mjs';

const root=new URL('../',import.meta.url),out='output/art/pixel-snapper-assets-v1',runtime='public/assets/pixel/processed';
const shopSources={
 clothingRack:'clothing-rack.png',
 clothingCabinet:'snapper-clothing-cabinet.png',clothingCounter:'snapper-clothing-counter.png',clothingFitting:'snapper-clothing-fitting-corner.png',clothingMirror:'snapper-clothing-mirror.png',clothingDisplay:'snapper-clothing-display-table.png',
 barberWorktop:'snapper-barber-worktop.png',barberHooks:'snapper-barber-coat-hooks.png',barberStorage:'snapper-barber-storage.png'
};
const source=name=>name==='clothingRack'?new URL('output/art/clothing-rack-v3/source/clothing-rack.png',root):shopSources[name]?new URL(`output/art/shop-interior-pixel-snapper-v1/sources/${shopSources[name]}`,root):name==='homeWood'?new URL('output/art/home-wood-pile-v2/source/home-wood-pile.png',root):name==='wood'?new URL('output/art/pixel-snapper-wood-v1/source/wood-bundle.png',root):name==='planter'?`/Users/mac/Downloads/ChatGPT Image 16 Oct 2026, 11_47_03-pixel-snapper.png`:name==='storage'?`/Users/mac/Downloads/ChatGPT Image 18 Oct 2026, 18_40_29-pixel-snapper (1).png`:name==='broadleaf'?`/Users/mac/Downloads/download (6)-pixel-snapper.png`:`/Users/mac/Downloads/ChatGPT Image 18 Oct 2026, ${name}-pixel-snapper.png`;
const specs=[
 ['snapper-notice-board','18_37_10',.5],['snapper-fountain','18_37_25',.95],
 ['snapper-outdoor-chair','18_37_30',.7],['snapper-tent','18_37_33',.6],['snapper-ground-flowers','18_37_37',.25],
 ['snapper-mailbox','18_37_56',.8],['snapper-bench','18_38_06',.72],['snapper-bush','18_38_13',.5],
 ['snapper-market-stall','18_38_20',1],['snapper-flowerpot','18_38_24',.65],['snapper-closed-gate','18_38_31',.75],
 ['snapper-barrel','18_38_36',.6],['snapper-table','18_39_09',.75],['snapper-back-bench','18_39_33',.95],
 ['snapper-rug','18_39_37',1.65],['snapper-bed','18_39_41',.58],['snapper-front-bench','18_39_44',.74],
 ['snapper-wall-shelf','18_39_49',.55],['snapper-pottery-shelf','18_39_53',.7],['snapper-counter','18_39_56',.7],
 ['snapper-fireplace','18_40_03',.75],['snapper-window','18_40_09',.63],['snapper-home-flowerpot','18_40_14',.5],
 ['snapper-threshold','18_40_19',.45],['snapper-leafy-pot','18_40_26',.52],['snapper-storage-jar','storage',.6],
 ['snapper-fire-large','18_40_34',.75],['snapper-fire-small','18_40_38',1],['snapper-planter-bench','planter',.56],
 ['snapper-tree-broadleaf','broadleaf',.7],['snapper-tree-tall','22_52_54',1.1],['snapper-tree-palm','22_53_00',1.66],
 ['snapper-grass','22_53_04',.46],['snapper-bush-new','22_53_16',.45],['snapper-tree-sparse','22_53_20',.95],['snapper-tree-snow','22_53_26',.76],
 ['snapper-wood-item','wood',.18],['snapper-home-wood-pile','homeWood',.04],
 ['snapper-clothing-rack-v3','clothingRack',.7],
 ['snapper-clothing-cabinet','clothingCabinet',1.05],['snapper-clothing-counter','clothingCounter',.82],
 ['snapper-clothing-fitting-corner','clothingFitting',.9],['snapper-clothing-mirror','clothingMirror',.8],
 ['snapper-clothing-display-table','clothingDisplay',.95],['snapper-barber-worktop','barberWorktop',.86],
 ['snapper-barber-coat-hooks','barberHooks',.7],['snapper-barber-storage','barberStorage',.82]
];
fs.mkdirSync(new URL(out+'/sources/',root),{recursive:true});fs.mkdirSync(new URL(runtime+'/',root),{recursive:true});fs.mkdirSync(new URL('docs/assets/licenses/pixel-snapper-assets-v1/',root),{recursive:true});
const images=specs.map(([id,file,scale])=>{const filePath=source(file),bytes=fs.readFileSync(filePath),image=PNG.sync.read(bytes),copy=new URL(`${out}/sources/${id}.png`,root);fs.writeFileSync(copy,bytes);return{id,file:filePath,bytes,image,scale};});
const atlas=new PNG({width:2048,height:2048}),frames={},art={},audit=[];let x=2,y=2,row=0;
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const bounds=image=>{let l=image.width,t=image.height,r=0,b=0,transparent=false,partial=false;for(let yy=0;yy<image.height;yy++)for(let xx=0;xx<image.width;xx++){const a=image.data[(yy*image.width+xx)*4+3];transparent||=a===0;partial||=a>0&&a<255;if(a){l=Math.min(l,xx);t=Math.min(t,yy);r=Math.max(r,xx+1);b=Math.max(b,yy+1);}}return{box:[l,t,r,b],transparent,partial};};
for(const item of images){const {id,image,scale}=item;if(x+image.width+2>atlas.width){x=2;y+=row+2;row=0;}if(y+image.height+2>atlas.height)throw Error(id+' does not fit atlas');PNG.bitblt(image,atlas,0,0,image.width,image.height,x,y);frames[id]={frame:{x,y,w:image.width,h:image.height},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:image.width,h:image.height},sourceSize:{w:image.width,h:image.height}};const alpha=bounds(image);art[id]={texture:'pixelSnapper',frame:id,width:image.width,height:image.height,scale,visibleBounds:alpha.box};audit.push({id,original:item.file,source:`${out}/sources/${id}.png`,sha256:hash(item.bytes),dimensions:[image.width,image.height],visibleBounds:alpha.box,alpha:{transparent:alpha.transparent,partial:alpha.partial},nativePixelsUnchanged:true,worldScale:scale});x+=image.width+2;row=Math.max(row,image.height);}
fs.writeFileSync(new URL(runtime+'/pixel-snapper-assets.png',root),PNG.sync.write(atlas));
fs.writeFileSync(new URL(runtime+'/pixel-snapper-assets.json',root),JSON.stringify({frames,meta:{app:'Simple Life user-supplied Pixel Snapper objects',image:'pixel-snapper-assets.png',size:{w:atlas.width,h:atlas.height},scale:'1'}},null,2)+'\n');
const overrides={
 notice:['snapper-notice-board',2], 'cedar-notice':['snapper-notice-board',1],
 'city-fountain0':['snapper-fountain',2],'city-fountain1':['snapper-fountain',2],'cedar-city-fountain0':['snapper-fountain',1],chair:['snapper-outdoor-chair',2],'cedar-chair':['snapper-outdoor-chair',1],
 'city-tent':['snapper-tent',2],'camp-tent':['snapper-tent',2],'cedar-tent':['snapper-tent',1],flowers:['snapper-ground-flowers',2],flowers0:['snapper-ground-flowers',2],flowers1:['snapper-ground-flowers',2],flowers2:['snapper-ground-flowers',2],flowers3:['snapper-ground-flowers',2],flowers4:['snapper-ground-flowers',2],'prop-flowers':['snapper-ground-flowers',2],'cedar-flowers':['snapper-ground-flowers',1],'cedar-flowers1':['snapper-ground-flowers',1],'cedar-flowers2':['snapper-ground-flowers',1],'cedar-flowers3':['snapper-ground-flowers',1],
 mailbox:['snapper-mailbox',2],'cedar-mailbox':['snapper-mailbox',1],bench:['snapper-bench',2],'bench-cedar-review':['snapper-bench',1],'nature-bush-small':['snapper-bush-new',2],'nature-bush-leafy':['snapper-bush-new',2],'nature-bush-berry':['snapper-bush-new',2],'nature-bush-flower':['snapper-bush-new',2],
 'seed-stall':['snapper-market-stall',2],'produce-stall':['snapper-market-stall',2],'outfitter-stall':['snapper-market-stall',2],'cedar-stall':['snapper-market-stall',1],
 planter:['snapper-flowerpot',2],'prop-planter':['snapper-flowerpot',2],'city-flowerpot':['snapper-flowerpot',2],'city-review-golden-flowerpot':['snapper-flowerpot',1],
 'outdoor-closed-gate':['snapper-closed-gate',1],barrel:['snapper-barrel',2],'cedar-barrel':['snapper-barrel',1],table:['snapper-table',2],'home-table':['snapper-table',2],'cedar-table':['snapper-table',1],
 'planter-bench-vertical-review':['snapper-planter-bench',1],
 'forest-oak-0':['snapper-tree-broadleaf',2],'forest-oak-1':['snapper-tree-tall',2],'forest-oak-2':['snapper-tree-broadleaf',2],
 'willow-tree':['snapper-tree-tall',2],'nature-fruit-guava':['snapper-tree-tall',2],'nature-fruit-mango':['snapper-tree-broadleaf',2],
 'env-pine-olive':['snapper-tree-tall',2],'forest-palm-0':['snapper-tree-palm',2],'forest-palm-1':['snapper-tree-palm',2],
 'nature-sapling':['snapper-tree-sparse',2],'nature-young-fruit':['snapper-tree-sparse',2],'env-pine-snow':['snapper-tree-snow',2],
 'grass-detail':['snapper-grass',2],'dry-grass':['snapper-grass',2],'snow-grass':['snapper-grass',2]
 ,'wood-item':['snapper-wood-item',1]
};
const overrideArt=Object.fromEntries(Object.entries(overrides).map(([name,[id,sourceScale]])=>[name,{frame:id,texture:'pixelSnapper',scale:art[id].scale,sourceScale}]));
const homeIds={'home-bed':'snapper-bed','home-bedside-rug':'snapper-rug','home-bench-front':'snapper-front-bench','home-bench':'snapper-back-bench','home-rug':'snapper-rug','home-counter':'snapper-counter','home-pottery':'snapper-pottery-shelf','home-wall-shelf':'snapper-wall-shelf','home-fireplace':'snapper-fireplace','home-logs':'snapper-home-wood-pile','home-fire':'snapper-fire-small','home-window':'snapper-window','home-threshold':'snapper-threshold','home-leafy-pot':'snapper-leafy-pot','home-flower-pot':'snapper-home-flowerpot','home-storage-jar':'snapper-storage-jar','home-table':'snapper-table'};
const homeArt=Object.fromEntries(Object.entries(homeIds).map(([name,id])=>[name,{...art[id],scale:name==='home-bedside-rug'?.8:art[id].scale}]));
const generated='// User-supplied native Pixel Snapper objects; generated by scripts/export_pixel_snapper_assets.mjs.\nexport const PIXEL_SNAPPER_ART='+JSON.stringify(art)+';\nexport const PIXEL_SNAPPER_OVERRIDES='+JSON.stringify(overrideArt)+';\nexport const PIXEL_SNAPPER_HOME_ART='+JSON.stringify(homeArt)+';\n';
fs.writeFileSync(new URL('src/data/pixelSnapperArt.js',root),generated);
const record={date:'2026-10-19',request:'Use the supplied object PNGs at native canvas size with transparent backgrounds; scale only in game. Replace the Home wood pile and clothing-shop rack, keep the wood resource icon, replace matching world vegetation, and add the approved clothing-shop and barber objects. Remove the superseded road-sign source from the runtime atlas.',atlas:{path:runtime+'/pixel-snapper-assets.png',dimensions:[atlas.width,atlas.height],frames:specs.length},assets:audit};
fs.writeFileSync(new URL(out+'/art-audit.json',root),JSON.stringify(record,null,2)+'\n');
fs.writeFileSync(new URL('docs/assets/licenses/pixel-snapper-assets-v1/SOURCE_RECORD.md',root),`# User-supplied Pixel Snapper assets — 2026-10-18 to 2026-10-19\n\nThe user supplied these ${specs.length} retained runtime PNGs directly in this task and instructed the game to use them. Each source is retained byte-identically under \`output/art/pixel-snapper-assets-v1/sources\`; SHA-256 hashes, original local paths, dimensions, alpha checks, and runtime scales are recorded in \`output/art/pixel-snapper-assets-v1/art-audit.json\`. The approved shop objects are also retained at their user-reviewed names under \`output/art/shop-interior-pixel-snapper-v1/sources\` or \`output/art/clothing-rack-v3/source\`. The new Home wood pile is retained under \`output/art/home-wood-pile-v2/source\`. The superseded road-sign PNG is no longer packed into the runtime atlas.\n\nThe runtime atlas packs each retained complete native canvas without trimming, resampling, recolouring, or compositing. All sources contain transparent pixels; none has an opaque white rectangular background. Scaling is applied only by Phaser at runtime with nearest filtering. The Home wood pile replaces the older interior logs while the smaller resource icon remains unchanged. The seven broadleaf, tall tree, palm, grass, bush, sparse tree and snow-pine images replace matching world vegetation while retaining the established approximate display heights. The clothing and barber objects use Phaser-only scaling chosen from the supplied room references; the barber bench remains removed and the existing green rug is placed near the doorway. These files are user-provided AI-assisted assets; the user is responsible for rights to the supplied sources.\n`);
console.log(JSON.stringify({atlas:[atlas.width,atlas.height],frames:specs.length,usedHeight:y+row+2},null,2));
