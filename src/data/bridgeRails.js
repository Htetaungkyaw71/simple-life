// The two side rails are solid; the two end approaches stay open.
const cache=new WeakMap();
export function bridgeRailBoxes(map){
 if(!map)return [];
 if(!cache.has(map))cache.set(map,(map.bridges||[]).flatMap(b=>b.axis==='horizontal'||!b.axis&&b.w>b.h?[[b.x,b.y,b.w,8],[b.x,b.y+b.h-8,b.w,8]]:[[b.x,b.y,8,b.h],[b.x+b.w-8,b.y,8,b.h]]));
 return cache.get(map);
}
export const bridgeRailBlocked=(map,x,y,r=12)=>bridgeRailBoxes(map).some(([a,b,w,h])=>x+r>a&&x-r<a+w&&y>b&&y-r<b+h);
