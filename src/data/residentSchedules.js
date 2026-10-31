const place=(x,y,extra={})=>({area:'city',x,y,...extra});
const slot=(id,start,end,location,dialogueGroup,extra={})=>({id,start,end,location,dialogueGroup,...extra});

// These are feet positions on existing dry, walkable City ground. Indoor work
// points use their existing room IDs and are projected to the matching doorway
// while the player is outdoors.
export const RESIDENT_PLACES={
 'seed-stall':place(432,306,{direction:'down'}),
 'produce-stall':place(896,306,{direction:'down'}),
 'produce-visitor':place(946,330,{direction:'left'}),
 'clothing-work':{area:'clothing',x:252,y:154,direction:'down'},
 'barber-work':{area:'barber',x:300,y:220,direction:'down'},
 'fountain-left':place(490,644,{direction:'right',sitting:true,depth:677}),
 'fountain-middle':place(674,644,{direction:'right',sitting:true,depth:677}),
 'quiet-bench':place(948,644,{direction:'left',sitting:true,depth:677}),
 'quiet-bench-pair-a':place(858,644,{direction:'right',sitting:true,depth:677}),
 'quiet-bench-pair-b':place(948,644,{direction:'left',sitting:true,depth:677}),
 'garden-work-west':place(1360,752,{direction:'right'}),
 'garden-middle':place(1480,752,{direction:'down'}),
 'garden-work-east':place(1600,752,{direction:'left'}),
 'garden-play-west':place(1360,896,{direction:'right'}),
 'garden-east':place(1600,896,{direction:'left'}),
 'garden-pair-a':place(1440,864,{direction:'right'}),
 'garden-pair-b':place(1472,864,{direction:'left'}),
 'garden-game-a':place(1584,944,{direction:'right'}),
 'garden-game-b':place(1616,944,{direction:'left'}),
 'cafe-left':place(816,1024,{direction:'right'}),
 'cafe-right':place(944,1024,{direction:'left'}),
 'picnic-left':place(2050,800,{direction:'right'}),
 'picnic-right':place(2170,830,{direction:'left'}),
 'west-lamp':place(360,366,{direction:'up'}),
 'east-lamp':place(1200,560,{direction:'left'}),
 'east-lamp-pair-a':place(1176,560,{direction:'right'}),
 'east-lamp-pair-b':place(1208,560,{direction:'left'}),
 'east-road':place(2200,600,{direction:'left'}),
 'market-food':place(1050,330,{direction:'left'}),
 'fountain-meet-a':place(824,624,{direction:'right'}),
 'fountain-meet-b':place(856,624,{direction:'left'}),
};

const serviceDay=(location,group)=>[
 slot('opening',420,720,location,group,{service:true}),
 slot('midday',720,780,location,group+'-rest',{service:true}),
 slot('afternoon',780,1140,location,group,{service:true}),
];
const indoorServiceDay=(location,group)=>serviceDay(location,group);
const patterns=(normal,social=normal,quiet=normal)=>({normal,social,quiet});

export const WEEKLY_PATTERN=['normal','normal','social','normal','quiet','normal','social'];

export const RESIDENT_SCHEDULES={
 'city-silas':{
  home:9,firstAppearance:375,responsibility:'City lamps',preferredActivities:['lamp rounds','quiet garden work'],
  journalHints:{normal:'Often checks the lamps before evening.',social:'Often speaks with Walter near the quiet bench.',quiet:'Usually rests beside the garden after his lamp round.'},
  variants:patterns(
   [slot('morning-lamps',405,510,'west-lamp','lamp'),slot('east-road-round',540,900,'east-road','lamp'),slot('east-lamp',930,1060,'east-lamp','lamp'),slot('quiet-rest',1080,1095,'fountain-middle','bench')],
   [slot('morning-lamps',405,510,'west-lamp','lamp'),slot('east-road-round',540,900,'east-road','lamp'),slot('walter-meeting',930,1020,'east-lamp-pair-a','social',{meeting:'silas-walter-memory'}),slot('east-lamp',1040,1080,'east-lamp','lamp')],
   [slot('morning-lamps',420,510,'west-lamp','lamp'),slot('quiet-rest',560,900,'fountain-middle','bench'),slot('east-lamp',960,1050,'east-lamp','lamp')]),
 },
 clara:{
  home:3,firstAppearance:360,workLocation:'seed-stall',workHours:[420,1140],responsibility:'Seed stall',preferredActivities:['garden visits','talking with growers'],
  journalHints:{normal:'Works at the seed stall from morning until evening.',social:'Usually at the seed stall; she pauses for neighbours there.',quiet:'Keeps the seed stall open, even on quieter days.'},
  variants:patterns(serviceDay('seed-stall','seed-work')),
 },
 niko:{
  home:5,firstAppearance:360,workLocation:'produce-stall',workHours:[420,1140],responsibility:'Produce market',preferredActivities:['price notes','shared meals'],
  journalHints:{normal:'Runs the produce stall throughout the day.',social:'Usually at the produce stall; Bruno often visits.',quiet:'Keeps the produce stall reliably open on quiet days.'},
  variants:patterns(serviceDay('produce-stall','market-work'),[
   slot('opening',420,720,'produce-stall','market-work',{service:true}),
   slot('bruno-visit',720,780,'produce-stall','social',{service:true,meeting:'bruno-niko-market'}),
   slot('afternoon',780,1140,'produce-stall','market-work',{service:true}),
  ],serviceDay('produce-stall','market-work')),
 },
 'city-nell':{
  home:6,firstAppearance:360,workLocation:'clothing-work',workHours:[420,1140],responsibility:'Clothing shop',preferredActivities:['sketching','talking with Sol'],
  journalHints:{normal:'Works inside the clothing shop until closing.',social:'Works inside the clothing shop; she and Sol compare notes before opening.',quiet:'Spends the day creating clothes inside her shop.'},
  variants:patterns(indoorServiceDay('clothing-work','clothes-work'),[
   slot('sol-meeting',375,395,'fountain-meet-a','social',{meeting:'nell-sol-closing'}),
   ...indoorServiceDay('clothing-work','clothes-work'),
  ],indoorServiceDay('clothing-work','clothes-work')),
 },
 'city-sol':{
  home:2,firstAppearance:360,workLocation:'barber-work',workHours:[420,1140],responsibility:'Barber',preferredActivities:['listening','the long route home'],
  journalHints:{normal:'Works inside the barber until closing.',social:'Works at the barber; he and Nell compare notes before opening.',quiet:'Keeps the barber open and listens more than he speaks.'},
  variants:patterns(indoorServiceDay('barber-work','barber-work'),[
   slot('nell-meeting',375,395,'fountain-meet-b','social',{meeting:'nell-sol-closing'}),
   ...indoorServiceDay('barber-work','barber-work'),
  ],indoorServiceDay('barber-work','barber-work')),
 },
 'city-walter':{
  home:7,firstAppearance:450,responsibility:'Town memory',preferredActivities:['garden benches','quiet company'],
  journalHints:{normal:'Likes the public garden after lunch.',social:'Often sits with Elena or Silas near the garden.',quiet:'Usually rests on a quiet garden bench.'},
  variants:patterns(
   [slot('garden',480,720,'garden-middle','garden'),slot('cafe',750,900,'cafe-right','cafe'),slot('bench',930,1080,'quiet-bench','bench')],
   [slot('garden',480,720,'garden-middle','garden'),slot('elena-meeting',750,870,'fountain-meet-a','social',{meeting:'walter-elena-garden'}),slot('silas-meeting',930,1020,'east-lamp-pair-b','social',{meeting:'silas-walter-memory'}),slot('bench',1040,1080,'quiet-bench','bench')],
   [slot('bench',510,900,'quiet-bench','bench'),slot('garden',930,1050,'garden-middle','garden')]),
 },
 'city-elena':{
  home:8,firstAppearance:390,responsibility:'Public garden',preferredActivities:['tending beds','cafe rests'],
  journalHints:{normal:'Tends the public garden, then rests nearby.',social:'Often sits with Walter in the public garden.',quiet:'Observes the garden from a nearby bench.'},
  variants:patterns(
   [slot('garden',420,720,'garden-work-east','garden-work'),slot('bench',750,960,'fountain-left','bench'),slot('cafe',990,1080,'cafe-left','cafe')],
   [slot('garden',420,720,'garden-work-east','garden-work'),slot('walter-meeting',750,870,'fountain-meet-b','social',{meeting:'walter-elena-garden'}),slot('bench',900,1080,'fountain-left','bench')],
   [slot('bench',450,780,'fountain-left','bench'),slot('garden',810,1020,'garden-work-east','garden-work')]),
 },
 'city-bruno':{
  home:9,firstAppearance:450,responsibility:'Meals and community',preferredActivities:['cafe tables','produce visits'],
  journalHints:{normal:'Often moves between the café and produce stall.',social:'Often visits Niko at the produce stall.',quiet:'Usually lingers near the café tables.'},
  variants:patterns(
   [slot('cafe',480,720,'cafe-right','food'),slot('market',750,900,'market-food','market'),slot('cafe-return',930,1080,'cafe-right','food')],
   [slot('cafe',480,690,'cafe-right','food'),slot('niko-meeting',720,780,'produce-visitor','social',{meeting:'bruno-niko-market'}),slot('market',810,930,'market-food','market'),slot('cafe-return',960,1080,'cafe-right','food')],
   [slot('cafe',510,900,'cafe-right','food'),slot('market',930,1040,'market-food','market')]),
 },
 'city-teo':{
  home:8,firstAppearance:450,responsibility:'Play and errands',preferredActivities:['garden races','wooden-bird searches'],child:true,
  journalHints:{normal:'Plays in the public garden after lunch.',social:'Usually races Luca around the garden.',quiet:'Looks for wooden birds on safe garden paths.'},
  variants:patterns(
   [slot('picnic-play',480,720,'picnic-left','play'),slot('garden-race',750,900,'garden-game-a','play'),slot('luca-game',930,1050,'garden-game-a','social',{meeting:'teo-luca-game'})],
   [slot('picnic-play',480,690,'picnic-left','play'),slot('luca-game',720,900,'picnic-left','social',{meeting:'teo-luca-game'}),slot('bird-search',930,1050,'garden-east','bird')],
   [slot('bird-search',510,780,'garden-east','bird'),slot('picnic-game',810,1020,'picnic-left','play')]),
 },
 'city-luca':{
  home:8,firstAppearance:450,responsibility:'Picnic helper',preferredActivities:['picnic planning','garden games'],child:true,
  journalHints:{normal:'Uses the picnic lawn and safe garden paths.',social:'Usually plays with Teo in the public garden.',quiet:'Plans picnics near the eastern garden.'},
  variants:patterns(
   [slot('picnic',480,720,'picnic-right','picnic'),slot('garden',750,900,'garden-east','play'),slot('teo-game',930,1050,'garden-game-b','social',{meeting:'teo-luca-game'})],
   [slot('picnic',480,690,'picnic-right','picnic'),slot('teo-game',720,900,'picnic-right','social',{meeting:'teo-luca-game'}),slot('picnic-return',930,1050,'picnic-right','picnic')],
   [slot('picnic',510,900,'picnic-right','picnic'),slot('garden',930,1020,'garden-east','play')]),
 },
};

export function scheduleDefinition(id){return RESIDENT_SCHEDULES[id]||null;}
export function schedulePattern(day){return WEEKLY_PATTERN[(Math.max(1,Math.floor(day||1))-1)%WEEKLY_PATTERN.length];}
export function scheduleSlots(id,day){const d=scheduleDefinition(id),pattern=schedulePattern(day);return d?.variants?.[pattern]||d?.variants?.normal||[];}
export function schedulePlace(value){return typeof value==='string'?RESIDENT_PLACES[value]:value;}
