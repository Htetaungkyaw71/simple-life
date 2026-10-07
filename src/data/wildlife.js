import {REGIONS,BOAR_HOME,BOAR_TERRITORY} from './forest.js';
// Difficulty is a game balance value, not a real-world animal ranking.
const species=(name,tier,health,damage,speed,awareness,temperament='predator',warning=700)=>({name,tier,health,damage,speed,awareness,temperament,warning,recovery:1100,body:16});
export const SPECIES={
 boar:species('Wild Boar',1,3,15,280,190,'defensive',650),
 monkey:species('Monkey',1,2,8,250,110,'defensive',950),
 snake:species('Snake',2,2,12,260,120,'predator',850),
 kangaroo:species('Kangaroo',2,4,14,300,130,'defensive',950),
 zebra:species('Zebra',2,4,12,320,120,'defensive',950),
 giraffe:species('Giraffe',2,5,16,240,130,'defensive',1050),
 panda:species('Panda',2,5,14,210,110,'defensive',1050),
 chimpanzee:species('Chimpanzee',2,4,14,270,140,'defensive',900),
 wolf:species('Wolf',3,4,18,330,225),
 hyena:species('Hyena',3,4,17,310,210),
 rhinoceros:species('Rhinoceros',4,7,24,290,140,'defensive',1100),
 elephant:species('Elephant',4,9,26,210,130,'defensive',1200),
 gorilla:species('Gorilla',4,7,24,260,145,'defensive',1100),
 hippopotamus:species('Hippopotamus',4,7,25,240,145,'defensive',1050),
 crocodile:species('Crocodile',4,6,24,270,165,'predator',950),
 komodo:species('Komodo Dragon',4,6,22,260,175,'predator',900),
 cheetah:species('Cheetah',4,4,20,400,230,'predator',850),
 leopard:species('Leopard',4,5,22,350,225),
 jaguar:species('Jaguar',5,6,26,340,240,'predator',850),
 tiger:species('Tiger',5,7,27,350,245,'predator',900),
 lion:species('Lion',5,7,26,335,235,'predator',950),
 polarBear:species('Polar Bear',5,9,28,300,225,'predator',1100),
};
for(const [id,d]of Object.entries(SPECIES))d.body=id==='elephant'?28:['hippopotamus','rhinoceros','polarBear','gorilla'].includes(id)?24:16;
export const ANIMAL_SPAWNS=[];
for(const r of REGIONS){
 const kinds=[r.species,...(r.id==='herds'?['zebra']:r.id==='river'?['hippopotamus']:[])];
 for(const [index,kind]of kinds.entries()){
  const territory=kind==='boar'?BOAR_TERRITORY:kind==='snake'?[r.x+128,r.y+96,336,432]:index?[r.x+64,r.y+160,336,360]:[r.x+704,r.y+128,440,400];
  const [x,y,w,h]=territory,count=['wolf','hyena','monkey'].includes(kind)?4:kind==='boar'?2:3;
  for(let n=0;n<count;n++)ANIMAL_SPAWNS.push({id:kind==='boar'&&n===0?'boar-original':kind+'-'+n,species:kind,region:r.id,territory,home:kind==='boar'&&n===0?{...BOAR_HOME}:{x:x+w/2+(n%2?72:-72),y:y+h/2+Math.floor(n/2)*72}});
 }
}
export const ANIMAL_BY_ID=Object.fromEntries(ANIMAL_SPAWNS.map(a=>[a.id,a]));
