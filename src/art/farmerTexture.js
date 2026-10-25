import {playerVisual} from '../data/appearance.js';
import {baseFarmerStyle,cosmeticSignature,farmerCosmeticPixels} from '../systems/farmerCosmetics.js';
// Two reusable buffers per identity (world + preview), not an unbounded cache
// of full atlases for every possible accessory combination.
export function farmerTexture(scene,appearance,character='boy',purpose='world'){
 const visual=playerVisual(appearance,character),base=visual.texture;
 if(baseFarmerStyle(appearance,base))return base;
 const key=`farmer-${purpose}-${base}`,signature=cosmeticSignature(appearance,base);
 const existing=scene.textures.get(key);
 if(scene.textures.exists(key)&&existing.cosmeticSignature===signature)return key;
 const source=scene.textures.get(base)?.getSourceImage?.();
 if(!source)return base;
 const texture=scene.textures.exists(key)?existing:scene.textures.createCanvas(key,source.width,source.height),ctx=texture.context;
 ctx.clearRect(0,0,source.width,source.height);ctx.drawImage(source,0,0);
 const pixels=ctx.getImageData(0,0,source.width,source.height);pixels.data.set(farmerCosmeticPixels(pixels.data,source.width,base,appearance));ctx.putImageData(pixels,0,0);
 if(!texture.has(0))for(let row=0;row<source.height/64;row++)for(let col=0;col<8;col++)texture.add(row*8+col,0,col*64,row*64,64,64);
 texture.setFilter(1);texture.refresh();texture.cosmeticSignature=signature;return key;
}
