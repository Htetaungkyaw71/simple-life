import {dryFootprint} from './water.js';
import {EAST_BOARS} from './forestExpansion.js';
import {TREASURES,BOAR_HOME,BOAR_TERRITORY,FOREST_MAP,REGIONS} from './forest.js';
import {forestHabitat} from './forestHabitats.js';
import {WOODLAND_WILDLIFE} from './woodlandWildlife.js';
// Hostile species share one pure combat loop while retaining their own size,
// telegraph, movement and reward balance.
export const SPECIES={
 boar:{name:'Wild Boar',tier:1,health:3,damage:15,speed:80,awareness:190,disengage:480,temperament:'defensive',recovery:1100,body:16,visualScale:2,meat:2,hide:1},
 spider:{name:'Forest Spider',tier:1,health:3,damage:10,speed:64,awareness:150,disengage:420,temperament:'defensive',recovery:900,body:11,visualScale:1.5,meat:0,hide:0},
};
const NORMAL_ANIMAL_CLEARANCE=280;
const clearOfNormalAnimals=p=>WOODLAND_WILDLIFE.every(a=>Math.hypot(a.x-p.x,a.y-p.y)>=NORMAL_ANIMAL_CLEARANCE);
const rainforest=p=>['rainforest','easyRainforest'].includes(forestHabitat(p).id);
const spiderRegions=REGIONS.filter(r=>!TREASURES.some(t=>t.region===r.id)&&forestHabitat({x:r.x+r.w/2,y:r.y+r.h/2}).id==='darkForest');
const spiderGroupOffsets=[[864,176],[1056,208],[896,352],[1088,400]];
export const SPIDER_GROUPS=spiderRegions.flatMap(r=>spiderGroupOffsets.map(([dx,dy],n)=>({
 id:`spider-${r.id}-${n}`,species:'spider',region:r.id,
 territory:[r.x+800,r.y+112,384,384],
 home:{x:r.x+dx,y:r.y+dy},
}))).filter(a=>clearOfNormalAnimals(a.home));
const hostileCandidates=[
 {id:'boar-original',species:'boar',region:'entrance',territory:BOAR_TERRITORY,home:{...BOAR_HOME}},
 {id:'boar-1',species:'boar',region:'entrance',territory:BOAR_TERRITORY,home:{x:1008,y:4432}},
 ...EAST_BOARS,
 ...TREASURES.filter(rainforest).map(t=>({id:'boar-'+t.region,species:'boar',region:t.region,territory:[t.x-176,t.y-200,336,352],home:{x:t.x-64,y:t.y-64}})),
 ...SPIDER_GROUPS,
];
export const ANIMAL_SPAWNS=hostileCandidates.filter(a=>clearOfNormalAnimals(a.home)&&(a.species!=='boar'||rainforest(a.home)));
// River redesign keeps guarded animal IDs/territories; wet homes move onto a
// nearby open bank within the same territory. Saved injury/loot never rerolls.
for(const a of ANIMAL_SPAWNS){
 if(dryFootprint(FOREST_MAP,{x:a.home.x-16,y:a.home.y-16,w:32,h:32}))continue;
 const old={...a.home},[tx,ty,tw,th]=a.territory;
 outer:for(let r=16;r<=256;r+=16)for(let n=0;n<16;n++){
  const x=Math.round((old.x+Math.cos(n*Math.PI/8)*r)/2)*2,y=Math.round((old.y+Math.sin(n*Math.PI/8)*r)/2)*2;
  if(x<tx+24||x>tx+tw-24||y<ty+24||y>ty+th-24||!clearOfNormalAnimals({x,y})||!dryFootprint(FOREST_MAP,{x:x-16,y:y-16,w:32,h:32})||FOREST_MAP.props.some(p=>Math.hypot(p.x+32-x,p.y+90-y)<52))continue;
  a.home={x,y};break outer;
 }
}
export const ANIMAL_BY_ID=Object.fromEntries(ANIMAL_SPAWNS.map(a=>[a.id,a]));
