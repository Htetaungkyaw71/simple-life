import {dryFootprint} from './water.js';
import {EAST_BOARS} from './forestExpansion.js';
import {TREASURES,BOAR_HOME,BOAR_TERRITORY,FOREST_MAP} from './forest.js';
// Only supplied Craftpix animals remain; quiet animals have no combat state.
export const SPECIES={boar:{name:'Wild Boar',tier:1,health:3,damage:15,speed:280,awareness:190,temperament:'defensive',warning:650,recovery:1100,body:16}};
export const ANIMAL_SPAWNS=[
 {id:'boar-original',species:'boar',region:'entrance',territory:BOAR_TERRITORY,home:{...BOAR_HOME}},
 {id:'boar-1',species:'boar',region:'entrance',territory:BOAR_TERRITORY,home:{x:1008,y:4432}},
 ...EAST_BOARS,
 ...TREASURES.map(t=>({id:'boar-'+t.region,species:'boar',region:t.region,territory:[t.x-176,t.y-200,336,352],home:{x:t.x-64,y:t.y-64}})),
];
// River redesign keeps guarded animal IDs/territories; wet homes move onto a
// nearby open bank within the same territory. Saved injury/loot never rerolls.
for(const a of ANIMAL_SPAWNS){
 if(dryFootprint(FOREST_MAP,{x:a.home.x-16,y:a.home.y-16,w:32,h:32}))continue;
 const old={...a.home},[tx,ty,tw,th]=a.territory;
 outer:for(let r=16;r<=256;r+=16)for(let n=0;n<16;n++){
  const x=Math.round((old.x+Math.cos(n*Math.PI/8)*r)/2)*2,y=Math.round((old.y+Math.sin(n*Math.PI/8)*r)/2)*2;
  if(x<tx+24||x>tx+tw-24||y<ty+24||y>ty+th-24||!dryFootprint(FOREST_MAP,{x:x-16,y:y-16,w:32,h:32})||FOREST_MAP.props.some(p=>Math.hypot(p.x+32-x,p.y+90-y)<52))continue;
  a.home={x,y};break outer;
 }
}
export const ANIMAL_BY_ID=Object.fromEntries(ANIMAL_SPAWNS.map(a=>[a.id,a]));
