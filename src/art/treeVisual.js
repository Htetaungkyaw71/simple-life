import {NATURE_TREE_ORIGINS} from '../data/natureArt.js';
import {NATURE_EXTRA_ORIGINS} from '../data/natureExtras.js';
const FOLIAGE_TREES=['nature-foliage-tree-olive','nature-foliage-tree-jungle','nature-foliage-tree-sparse'];
const FOLIAGE_BUSHES=['nature-bush-foliage-leafy','nature-bush-foliage-upright','nature-bush-foliage-olive','nature-bush-foliage-tropical'];
// Visual selection is independent of saved vegetation IDs and trunk collision.
export function treeVisual(p,habitat=''){
 if(p.treeVisual)return p.treeVisual;
 const variant=Math.abs(Math.floor(p.x/32+p.y/32));
 const foliage=FOLIAGE_TREES[variant%FOLIAGE_TREES.length];
 const frame=habitat==='snow'?'env-pine-snow':p.name==='palm-tree'?(variant%3===0?'nature-foliage-tree-palm':'forest-palm-'+variant%2):p.name==='willow-tree'?(variant%3===0?'nature-foliage-tree-jungle':'willow-tree'):p.name==='guava-tree'?'nature-fruit-guava':p.name==='mango-tree'?'nature-fruit-mango':p.name==='snow-pine'?'env-pine-olive':p.name==='tree'&&variant%5===0?'env-pine-olive':['tree','broadleaf-tree','tree-wide'].includes(p.name)&&variant%4===0?foliage:['tree','broadleaf-tree','tree-wide'].includes(p.name)&&variant%7===1?'nature-sapling':['tree','broadleaf-tree','tree-wide'].includes(p.name)&&variant%7===2?'nature-young-fruit':'forest-oak-'+variant%3;
 return {frame,originX:NATURE_EXTRA_ORIGINS[frame]??NATURE_TREE_ORIGINS[frame]??.5};
}

// Retire the two rejected designs while retaining their saved ground-cover IDs.
export function groundPlantVisual(p){
 const n=Math.abs(Math.floor(p.x*3+p.y*7));
 if(p.name.startsWith('forest-bush-')){const index=Number(p.name.at(-1));return {frame:FOLIAGE_BUSHES[Number.isInteger(index)?index%4:n%4],originX:.5};}
 if(p.name==='fern'||p.name==='bush'){const frame=FOLIAGE_BUSHES[n%FOLIAGE_BUSHES.length];return {frame,originX:.5};}
 if(p.name.startsWith('forest-palmetto-')){const frame=[...FOLIAGE_BUSHES,'nature-bush-leafy','nature-bush-berry','nature-bush-flower'][n%7];return {frame,originX:NATURE_EXTRA_ORIGINS[frame]??.5};}
 return null;
}
