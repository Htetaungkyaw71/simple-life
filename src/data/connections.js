export const CONNECTION_LEVELS=[
 {id:1,name:'Stranger',threshold:0},
 {id:2,name:'Acquaintance',threshold:5},
 {id:3,name:'Friend',threshold:12},
 {id:4,name:'Trusted Friend',threshold:24},
 {id:5,name:'Kindred',threshold:40},
];

const npc=(name,portrait,unknown,known,personalFlags=[])=>({name,portrait,unknown,known,personalFlags});

export const CONNECTION_NPCS={
 'city-silas':npc('Silas','city-silas','A lamplighter you have not met.',"Silas maintains City's lamps and remembers Grandfather's quiet kindness.",[
  'event1Day','event2Day','event3Day','walterLeadUnlocked','lampRelit',
 ]),
 clara:npc('Clara','clara','The seed seller is still a stranger.','Clara treats every seed as a small promise.'),
 niko:npc('Niko','niko','The produce buyer is still a stranger.','Niko tries to keep the market fair without working through every sunset.'),
 'city-nell':npc('Nell','city-nell','The clothier is still a stranger.','Nell hides courage in bright stitches and practical clothes.'),
 'city-sol':npc('Sol','city-sol','The barber is still a stranger.','Sol notices the changes people do not quite say aloud.'),
 'city-walter':npc('Walter','city-walter','An older resident you have not met.','Walter remembers Grandfather carving patient little birds.'),
 'city-bruno':npc('Bruno','city-bruno','The cook is still a stranger.','Bruno believes a shared meal is the shortest road between people.'),
 'city-elena':npc('Elena','city-elena','A gardener you have not met.','Elena leaves room for everyone to change the public garden.'),
 'city-luca':npc('Luca','city-luca','A young resident you have not met.','Luca is always planning the next picnic path and game.'),
 'city-teo':npc('Teo','city-teo','A young resident you have not met.','Teo notices the lamps, carvings and town secrets adults overlook.'),
};

export const CONNECTION_IDS=Object.keys(CONNECTION_NPCS);

export const CONNECTION_RULES={
 introduction:4,
 dailyUsefulConversation:2,
 thoughtfulChoice:2,
 keptPromise:4,
 attendedInvitation:3,
 personalEvent:3,
};

export const SILAS_STORY={
 events:{clue:'silas-lamp-beside-road',company:'silas-quiet-company',lamp:'silas-lamp-meeting'},
 eventDayFlags:{'silas-lamp-beside-road':'event1Day','silas-quiet-company':'event2Day','silas-lamp-meeting':'event3Day'},
 invitationId:'silas-east-road-lamp',
 invitationPoints:16,
 eastLamp:{x:1200,y:560,radius:86},
 quietPlace:{x:948,y:644,radius:92},
 evening:[1080,1140],
 morning:[480,720],
};

export function connectionDefinition(id){return CONNECTION_NPCS[id]||null;}
