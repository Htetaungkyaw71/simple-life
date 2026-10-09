import {dryFootprint} from './water.js';
import {forestHabitat} from './forestHabitats.js';
// Low, staggered earth shelves, with wide grassy breaks instead of sealed walls.
export function addForestTerrain(map,regions,protectedPlaces,clearings=[]){
 const blocked=(x,y)=>protectedPlaces.some(p=>Math.abs(p.x-x)<96&&Math.abs(p.y-y)<104);
 map.terraces=[];map.ledges=[];
 for(const [i,r]of regions.entries())for(let row=0;row<2;row++){
  const band={id:r.id+'-shelf-'+row,segments:[],habitat:forestHabitat({x:r.x+640,y:r.y+400}).id};
  for(let n=0;n<30;n++){
   const x=r.x+96+n*32,y=r.y+192+row*576+Math.round(Math.sin(n/7+i*.7)*4+Math.sin(n/12-i*.4)*2+n*.10)*16;
   // Existing crossways, caches, food, animal homes and water stay accessible.
   if(clearings.some(([cx,cy,cw,ch])=>x+32>cx&&x<cx+cw&&y+32>=cy&&y<=cy+ch)||Math.abs(x+16-(r.x+480))<88||n>=22&&n<=25||blocked(x+16,y)||!dryFootprint(map,{x:x-24,y:y-144,w:80,h:224}))continue;
   const face={x,y,w:32,h:48,terrace:band.id};band.segments.push(face);map.ledges.push(face);
  }
  if(band.segments.length)map.terraces.push(band);
 }
 // Roots and grass must never protrude through cliff faces. IDs remain unchanged.
 const onFace=(x,y,pad=0)=>map.ledges.some(l=>x+pad>l.x-8&&x-pad<l.x+l.w+8&&y>l.y-16&&y<l.y+l.h+pad);
 map.props=map.props.filter(p=>!((p.name==='tree'||p.name==='snow-pine'||p.name.endsWith('-tree'))&&onFace(p.x+32,p.y+90,24)));
 map.grass=map.grass.filter(g=>!onFace(g.x,g.y,24));
 map.details=map.details.filter(p=>!onFace(p.x+16,p.y+32,24));
}
