// Forest-only olive foliage treatment; native silhouettes, bark and fruit stay.
export const FOREST_LEAF_TONES=[[43,51,31],[58,69,36],[78,91,43],[103,116,53],[129,140,68],[154,164,88],[181,187,116],[207,211,155]];
export function forestLeafColor(r,g,b,habitat=''){
 if(r===52&&g===52&&b===79)return FOREST_LEAF_TONES[0];
 if(g<=r*1.03||g<b*.82||Math.max(r,g,b)-Math.min(r,g,b)<10)return [r,g,b];
 const light=.24*r+.60*g+.16*b,index=[44,65,87,110,137,165,195].filter(t=>light>=t).length;
 const tone=FOREST_LEAF_TONES[index];
 const shifts={darkForest:[-16,-13,-5],rainforest:[-4,0,-3],meadow:[8,9,3],easyRainforest:[4,6,0],shrubland:[16,8,6],desert:[35,17,9]};
 if(habitat==='snow')return tone.map((v,i)=>Math.round(v*.38+[145,160,155][i]));
 const shift=shifts[habitat]||[0,0,0];return tone.map((v,i)=>Math.max(0,Math.min(255,v+shift[i])));
}
export function forestTexture(scene,name,habitat=''){
 const key='forest-foliage-'+name+'-'+habitat;if(scene.textures.exists(key))return key;
 const f=scene.textures.getFrame('town',name),texture=scene.textures.createCanvas(key,f.width,f.height),ctx=texture.context;
 ctx.imageSmoothingEnabled=false;ctx.drawImage(f.source.image,f.cutX,f.cutY,f.cutWidth,f.cutHeight,0,0,f.width,f.height);
 const pixels=ctx.getImageData(0,0,f.width,f.height);
 for(let i=0;i<pixels.data.length;i+=4){if(!pixels.data[i+3])continue;const c=forestLeafColor(...pixels.data.subarray(i,i+3),habitat);for(let n=0;n<3;n++)pixels.data[i+n]=c[n];}
 ctx.putImageData(pixels,0,0);texture.refresh();return key;
}
