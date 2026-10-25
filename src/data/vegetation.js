import {MAPS} from './mapLayouts.js';
export const isTree=p=>p.name==='tree'||p.name==='snow-pine'||p.name.startsWith('tree-')||p.name.endsWith('-tree');
// Native sprite sizes keep gathering at the visible plant's foot (world scale 2).
const GROUND_PLANTS={
 'grass-detail':[16,16],'dry-grass':[16,16],'snow-grass':[16,16],
 flowers:[16,16],flowers0:[16,16],flowers1:[16,16],flowers2:[16,16],flowers3:[16,16],flowers4:[16,16],
 fern:[24,20],mushroom:[16,16],'bamboo-clump':[32,40],
 'forest-palmetto-0':[40,40],'forest-palmetto-1':[40,40],
 'cp-plant-1-0':[40,42],'cp-plant-2-0':[40,42],'cp-plant-3-0':[40,42]
};
export const isGrass=p=>Object.hasOwn(GROUND_PLANTS,p.name);
// Coordinate identities survive save/load and are independent of camera/display sprites.
export const VEGETATION=Object.fromEntries(Object.entries(MAPS).map(([area,map])=>{
 const trees=map.props.filter(isTree).map(p=>({id:p.vegetationId||`tree:${p.name}:${p.x}:${p.y}`,x:p.x+32,y:p.y+90,prop:p}));
 const grass=[...(map.grass||[]),...[...map.details,...map.props].filter(isGrass).map(p=>{const [w,h]=GROUND_PLANTS[p.name],[x,y]=p.landscapeVisual?.foot??[p.x+w,p.y+h*2];return {id:p.vegetationId||`grass:${p.name}:${p.x}:${p.y}`,x,y,prop:p,dry:p.name==='dry-grass',variant:0};})];
 const boxes=new Map();for(const t of trees){const wide=t.prop.name==='tree-wide';boxes.set([t.prop.x+(wide?26:22),t.prop.y+76,wide?42:20,16].join(','),t.id);}
 for(const n of grass)if(n.prop?.name==='bamboo-clump')boxes.set([n.prop.x+20,n.prop.y+48,20,16].join(','),n.id);
 const buckets=new Map();for(const node of [...trees,...grass]){const key=Math.floor(node.x/128)+':'+Math.floor(node.y/128);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(node);}
 return [area,{trees,grass,boxes,buckets,byId:new Map([...trees,...grass].map(n=>[n.id,n])),byProp:new Map([...trees,...grass].filter(n=>n.prop).map(n=>[n.prop,n]))}];
}));
export const vegetationKey=s=>s.area==='farm'?'farm:'+s.currentFarm:s.area;
export const vegetationState=s=>s?.vegetation?.[vegetationKey(s)];
export const TREE_HITS=3;
export const treeHits=(s,id)=>vegetationState(s)?.treeHits?.[id]||0;
export function removed(s,id){const v=vegetationState(s);return !!v&&(id.startsWith('tree:')?v.trees:v.grass).includes(id);}
export function cutObstacle(s,area,box){const key=area==='farm'?'farm:'+(s?.currentFarm||0):area,v=s?.vegetation?.[key];if(!v)return false;const id=VEGETATION[area]?.boxes.get(box.join(','));if(!id)return false;return (id.startsWith('tree:')?v.trees:v.grass).includes(id);}
export function nearbyVegetation(s,p,r=80){const data=VEGETATION[s.area],found=[];if(!data)return found;
 for(let y=Math.floor((p.y-r)/128);y<=Math.floor((p.y+r)/128);y++)for(let x=Math.floor((p.x-r)/128);x<=Math.floor((p.x+r)/128);x++)for(const n of data.buckets.get(x+':'+y)||[])if(!removed(s,n.id)&&Math.hypot(n.x-p.x,n.y-p.y)<r)found.push(n);
 for(const n of vegetationState(s)?.placed||[])if(Math.hypot(n.x-p.x,n.y-p.y)<r)found.push(n);return found;
}
