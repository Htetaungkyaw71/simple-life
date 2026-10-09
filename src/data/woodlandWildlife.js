import {forestHabitat} from './forestHabitats.js';
import {EAST_REGIONS} from './forestExpansion.js';
const kinds=[['deer','Deer'],['hare','Hare'],['fox','Fox'],['grouse','Grouse']];
export const WOODLAND_WILDLIFE=[
 {species:'deer',name:'Deer',x:480,y:4680},{species:'deer',name:'Deer',x:520,y:4736},
 {species:'hare',name:'Hare',x:480,y:4840},{species:'hare',name:'Hare',x:520,y:4896},
 {species:'fox',name:'Fox',x:1760,y:3784},{species:'fox',name:'Fox',x:1800,y:3840},
 {species:'grouse',name:'Grouse',x:4320,y:2792},{species:'grouse',name:'Grouse',x:4360,y:2848},
 ...EAST_REGIONS.flatMap((r,i)=>[0,1].map(n=>({species:kinds[i%4][0],name:kinds[i%4][1],x:r.x+344+n*48,y:r.y+632+n*36}))),
 // Two additional quiet animals per discovery area, using the existing native species.
 ...Array.from({length:40},(_,i)=>({x:i<20?(i%4)*1280:5120+((i-20)%4)*1280,y:Math.floor((i%20)/4)*1024})).flatMap((r,i)=>[0,1].map(n=>{
  const x=r.x+448+n*128,y=r.y+712+n*40,habitat=forestHabitat({x,y}).id;
  const k=habitat==='snow'?kinds[1]:habitat==='desert'||habitat==='shrubland'?kinds[(i+n)%2+1]:kinds[(i+n)%4];
  return {species:k[0],name:k[1],x,y};
 })),
].map(a=>({...a,id:`woodland-${a.species}-${a.x}-${a.y}`}));
export const WOODLAND_BY_ID=Object.fromEntries(WOODLAND_WILDLIFE.map(a=>[a.id,a]));
export const WOODLAND_SPECIES={deer:{health:3,meat:2},fox:{health:2,meat:1},hare:{health:1,meat:1},grouse:{health:1,meat:1}};
