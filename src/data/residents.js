const resident=(id,name,art,x,y,body,route=[],npcType='adult')=>({id,name,art,x,y,body,route,npcType});
export const RESIDENTS={
 home:[],
 city:[resident('city-nell','Nell',2,1568,1040,'A quiet bench and a little sunshine. Perfect.'),resident('city-sol','Sol',5,472,1040,'I like taking the long way home.'),resident('city-luca','Luca',6,1648,1344,'There is always room for a picnic.',[],'kid')]
};

// Current custom residents keep their established houses after removing legacy pack NPCs.
for(const [id,home]of Object.entries({'city-nell':6,'city-sol':2,'city-luca':8}))RESIDENTS.city.find(n=>n.id===id).home=home;
RESIDENTS.city.find(n=>n.npcType==='kid').spriteSheet='girl-child';
RESIDENTS.city.push({...resident('city-elena','Elena',6,1360,1040,'The garden looks lovely today.',[[1360,1040],[1600,1040]]),home:8,spriteSheet:'purple-woman'});
RESIDENTS.city.push({...resident('city-walter','Walter',4,1720,1040,'The garden is a fine place to rest.',[[1720,1040],[1880,1040]],'elder'),home:7,spriteSheet:'elder-man'});
RESIDENTS.city.push({...resident('city-teo','Teo',6,1480,1040,'Race you to the garden!',[[1480,1040],[1600,1040]],'kid'),home:8,spriteSheet:'boy-child'});
RESIDENTS.city.push({...resident('city-bruno','Bruno',3,1120,1040,'Fresh produce makes every meal better.',[[1120,1040],[1240,1040]]),home:9,spriteSheet:'produce-seller-new'});
RESIDENTS.city.push({...resident('city-silas','Silas',5,1040,560,'I keep the village lamps glowing after dusk.',[[1040,560],[1240,560]]),home:9,spriteSheet:'lamplighter'});

// Daytime seats cover each retained City bench type. Positions are the seated
// body anchors; depth keeps the authored seated pose above the bench artwork.
const CITY_BENCH_SEATS={
 'city-elena':{x:490,y:644,direction:'right',depth:677},
 'city-teo':{x:674,y:644,direction:'right',depth:677},
 'city-silas':{x:948,y:644,direction:'left',depth:677},
 'city-walter':{x:2104,y:800,direction:'down',depth:830},
 'city-luca':{x:2232,y:832,direction:'down',depth:862},
};
for(const [id,seat]of Object.entries(CITY_BENCH_SEATS)){
 const n=RESIDENTS.city.find(n=>n.id===id);Object.assign(n,{x:seat.x,y:seat.y,route:[],seat});
}
export const MERCHANT_RESIDENTS=[
 {...resident('clara','Clara',2,432,306,'',[[432,306],[480,306],[480,330],[432,330]]),kind:'seed',home:3,spriteSheet:'seed-seller'},
 {...resident('niko','Niko',3,896,306,'',[[896,306],[944,306],[944,330],[896,330]]),kind:'sell',home:5,spriteSheet:'produce-seller'},
];

// Fixed town stylists retain their existing homes and 19:00 curfew.
RESIDENTS.city.find(n=>n.id==='city-nell').service='clothes';
RESIDENTS.city.find(n=>n.id==='city-sol').service='hair';
RESIDENTS.city.find(n=>n.id==='city-sol').spriteSheet='barber-npc';
