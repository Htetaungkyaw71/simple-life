import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {PNG} from './prop_pixels.mjs';

const root=new URL('../',import.meta.url);
const output=new URL('../output/deliverables/existing-non-pixel-snapper-assets/',import.meta.url);
mkdirSync(output,{recursive:true});

const atlases={
 town:{png:'public/assets/pixel/processed/town.png',json:'public/assets/pixel/processed/town.json'},
 world:{png:'public/assets/pixel/world.png',json:'public/assets/pixel/world.json'},
};
const requests=[
 ['previous-cafe-table','town','cedar-table'],['previous-cafe-chair','town','cedar-chair'],
 ['wood-item','town','wood-item'],['grass-item','town','grass-item'],['stone-item','town','stone-item'],
 ['forest-log','town','forest-log'],['home-logs','town','home-logs'],['loose-stones','town','loose-stones'],
 ['mushroom','town','mushroom'],['grass-detail','town','grass-detail'],['tall-grass','town','tall-grass-0-0'],
 ['wild-hide-item','town','wild-hide-item'],['meat-item','town','meat-item'],['dragon-fruit-item','town','dragon-fruit-item'],
 ['terrain-grass','world','grass0'],['terrain-soil','world','soil'],['terrain-water','world','water0'],
 ['terrain-rock','world','rock'],['coin','world','coin'],
];
const cache={};
for(const [id,a] of Object.entries(atlases))cache[id]={image:PNG.sync.read(readFileSync(new URL(a.png,root))),data:JSON.parse(readFileSync(new URL(a.json,root),'utf8'))};
const files=[];
for(const [name,atlasId,frameName] of requests){
 const atlas=cache[atlasId],entry=atlas.data.frames[frameName];
 if(!entry)throw Error(`Missing ${atlasId} frame ${frameName}`);
 const {x,y,w,h}=entry.frame,out=new PNG({width:w,height:h});
 PNG.bitblt(atlas.image,out,x,y,w,h,0,0);
 const bytes=PNG.sync.write(out),file=`${name}.png`;
 writeFileSync(new URL(file,output),bytes);
 files.push({file,atlas:atlases[atlasId].png,frame:frameName,width:w,height:h,sha256:createHash('sha256').update(bytes).digest('hex'),nativePixelsUnchanged:true});
}
writeFileSync(new URL('manifest.json',output),JSON.stringify({generatedAt:new Date().toISOString(),method:'Exact native-size crops from existing local atlases; no image generation, repainting, scaling or filtering.',files},null,2)+'\n');
writeFileSync(new URL('README.md',output),'# Existing non-Pixel-Snapper asset exports\n\nThese PNGs are exact native-size crops from the game’s existing local atlases. No image was generated, repainted, rescaled or filtered. `previous-cafe-table.png` and `previous-cafe-chair.png` are supplied for review only and are not placed back into the game. See `manifest.json` for the source atlas, frame, dimensions and SHA-256 of every file. Existing project/third-party licence terms continue to apply.\n');
console.log(`Exported ${files.length} exact existing sprites to ${output.pathname}`);
