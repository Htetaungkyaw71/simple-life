import {forestHabitat} from './forestHabitats.js';
import {dryFootprint} from './water.js';
export const FOREST_PORTAL={x:5120,y:2704,radius:30,clearing:156};
// One-way return gate: walking into the central ring returns to the entrance.
export function forestPortalTravel(state,now,ready){
 if(state?.area!=='forest'||now<ready)return null;
 return Math.hypot(state.position.x-FOREST_PORTAL.x,state.position.y-FOREST_PORTAL.y)<=FOREST_PORTAL.radius?
 {to:'forest',spawn:{x:640,y:4848},facing:'down',portal:true}:null;
}
const objects=[['rocky-cave',164,192],['rocky-deer',194,240],['rocky-fox',82,122],['rocky-rock',154,108],['rocky-mushroom',88,100],['rocky-orange',54,58],['rocky-cairn',62,64]];
export function addDarkLandmarks(map,protectedPlaces){
 // The large skeleton has its own open clearing, away from resources and crossings.
 const places=[{name:'rocky-bones',x:7472,y:258,w:432,h:352,foot:610,rocky:true,solid:false}];let n=0;
 for(let y=200;y<1600;y+=240)for(let x=1300;x<9100;x+=320){
  const point={x:x+(n%3)*26,y:y+(n%4)*18};if(Math.abs(point.x%1280-480)<112||Math.abs(point.y%1024-720)<100)continue;if(forestHabitat(point).id!=='darkForest')continue;
  const [name,w,h]=objects[n%objects.length],rect={x:point.x-w/2,y:point.y-h,w,h};
  const overlaps=r=>rect.x+rect.w>r.x-24&&rect.x<r.x+r.w+24&&rect.y+rect.h>r.y-24&&rect.y<r.y+r.h+24;
  if(!dryFootprint(map,rect)||protectedPlaces.some(p=>Math.abs(p.x-point.x)<w/2+112&&Math.abs(p.y-point.y)<h+100)||places.some(overlaps)||map.bridges.some(overlaps)||map.ledges.some(l=>overlaps({...l,w:32,h:48})))continue;
  places.push({name,x:rect.x,y:rect.y,w,h,foot:point.y,rocky:true,solid:name==='rocky-rock'||name==='rocky-deer'||name==='rocky-fox'||name==='rocky-cairn'});n++;
 }
 // Keep each landmark's silhouette clear, without moving saved tree identities.
 map.props=map.props.filter(p=>!places.some(o=>{const x=p.x+32,y=p.y+90,tree=p.name==='tree'||p.name==='snow-pine'||p.name.endsWith('-tree');return tree?x+96>o.x-24&&x-96<o.x+o.w+24&&y>o.y-16&&y-256<o.y+o.h+40:x>o.x-24&&x<o.x+o.w+24&&y>o.y-16&&y<o.y+o.h+40;}));
 map.grass=map.grass.filter(g=>!places.some(o=>g.x>o.x-16&&g.x<o.x+o.w+16&&g.y>o.y&&g.y<o.y+o.h+32));
 map.props.push(...places);return places;
}
