import {NATURE_TREE_ORIGINS} from '../data/natureArt.js';
import {NATURE_EXTRA_ORIGINS} from '../data/natureExtras.js';
// Visual selection is independent of saved vegetation IDs and trunk collision.
export function treeVisual(p,habitat=''){
 if(p.treeVisual)return p.treeVisual;
 const variant=Math.abs(Math.floor(p.x/32+p.y/32));
 const frame=habitat==='snow'?'env-pine-snow':p.name==='palm-tree'?'forest-palm-'+variant%2:p.name==='willow-tree'?'willow-tree':p.name==='guava-tree'?'nature-fruit-guava':p.name==='mango-tree'?'nature-fruit-mango':p.name==='snow-pine'?'env-pine-olive':p.name==='tree'&&variant%5===0?'env-pine-olive':['tree','broadleaf-tree','tree-wide'].includes(p.name)&&variant%7===1?'nature-sapling':['tree','broadleaf-tree','tree-wide'].includes(p.name)&&variant%7===2?'nature-young-fruit':'forest-oak-'+variant%3;
 return {frame,originX:NATURE_EXTRA_ORIGINS[frame]??NATURE_TREE_ORIGINS[frame]??.5};
}

// Retire the two rejected designs while retaining their saved ground-cover IDs.
export function groundPlantVisual(p){
 const n=Math.abs(Math.floor(p.x*3+p.y*7));
 if(p.name==='fern'||p.name==='bush')return {frame:'nature-bush-small',originX:NATURE_EXTRA_ORIGINS['nature-bush-small']};
 if(p.name.startsWith('forest-palmetto-')){const frame=['nature-bush-leafy','nature-bush-berry','nature-bush-flower'][n%3];return {frame,originX:NATURE_EXTRA_ORIGINS[frame]};}
 return null;
}
