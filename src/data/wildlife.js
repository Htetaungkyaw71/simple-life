import {EAST_BOARS} from './forestExpansion.js';
import {TREASURES,BOAR_HOME,BOAR_TERRITORY} from './forest.js';
// Only supplied Craftpix animals remain; quiet animals have no combat state.
export const SPECIES={boar:{name:'Wild Boar',tier:1,health:3,damage:15,speed:280,awareness:190,temperament:'defensive',warning:650,recovery:1100,body:16}};
export const ANIMAL_SPAWNS=[
 {id:'boar-original',species:'boar',region:'entrance',territory:BOAR_TERRITORY,home:{...BOAR_HOME}},
 {id:'boar-1',species:'boar',region:'entrance',territory:BOAR_TERRITORY,home:{x:1008,y:4432}},
 ...EAST_BOARS,
 ...TREASURES.map(t=>({id:'boar-'+t.region,species:'boar',region:t.region,territory:[t.x-176,t.y-200,336,352],home:{x:t.x-64,y:t.y-64}})),
];
export const ANIMAL_BY_ID=Object.fromEntries(ANIMAL_SPAWNS.map(a=>[a.id,a]));
