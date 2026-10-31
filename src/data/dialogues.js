import {SILAS_STORY} from './connections.js';
const choice=(label,next,id,flags=[],connection=null)=>({label,next,id,flags,...(connection?{connection}:{})});
const continueTo=next=>[choice('Continue',next,'continue')];
export const OPENING_DIALOGUE={start:'arrival',nodes:{
 arrival:{speaker:'You',portrait:'player',text:"I left the City's noise to keep Grandfather's farm. His last letter asked me to finish one promise.",choices:continueTo('welcome')},
 welcome:{speaker:'Silas',portrait:'city-silas',text:"Welcome home. I'm Silas, the lamplighter. Your grandfather and I kept Lantern Square bright together.",choices:continueTo('mystery')},
 mystery:{speaker:'Silas',portrait:'city-silas',text:'He promised to relight Lantern Night, but the old lantern was found broken before he could. No one knows why.',choices:[choice('Did you know Grandfather?','grandfather','opening-grandfather'),choice('What was Lantern Night?','lantern-night','opening-night'),choice('Why was it broken?','broken','opening-broken')]},
 grandfather:{speaker:'Silas',portrait:'city-silas',text:'I did. He made quiet work feel important, and he never left a lamp dark if someone still needed the road.',choices:continueTo('first-step')},
 'lantern-night':{speaker:'Silas',portrait:'city-silas',text:'The brightest night of the year. Every lamp led people to the square, like a river of stars.',choices:continueTo('first-step')},
 broken:{speaker:'Silas',portrait:'city-silas',text:'The glass was cracked and its heart was gone. Your grandfather never said who he suspected.',choices:continueTo('first-step')},
 'first-step':{speaker:'Silas',portrait:'city-silas',text:'Start small: claim the Tomato seeds, plant one, and water it. Then visit City while it grows. We will inspect the lantern.',end:true,closeLabel:'Begin'},
}};
export const CITY_INVITE_DIALOGUE={start:'invite',nodes:{invite:{speaker:'Silas',portrait:'city-silas',text:"That Tomato can grow while you're away. Follow the east road to City; I'll meet you by the broken lantern.",end:true,closeLabel:'Explore freely'}}};

const simple=(name,id,text,a,b,ra,rb,closeLabel=`Thanks, ${name}.`)=>({start:'start',nodes:{
 start:{speaker:name,portrait:id,text,choices:[choice(a,'a',id+'-a'),choice(b,'b',id+'-b')]},
 a:{speaker:name,portrait:id,text:ra,end:true,closeLabel},
 b:{speaker:name,portrait:id,text:rb,end:true,closeLabel},
}});

export const RESIDENT_DIALOGUES={
 'city-silas':{
  conditions:[
   {when:{area:'city',event:SILAS_STORY.events.lamp,choice:['companyResponse','sit-quietly']},branch:'after-quiet'},
   {when:{area:'city',event:SILAS_STORY.events.lamp,choice:['companyResponse','ask-alone']},branch:'after-alone'},
   {when:{area:'city',event:SILAS_STORY.events.lamp},branch:'after-light'},
   {when:{area:'city',invitation:'pending',invitationDue:true,time:SILAS_STORY.evening,near:SILAS_STORY.eastLamp},branch:'lamp-meeting'},
   {when:{area:'city',event:SILAS_STORY.events.company,minPoints:SILAS_STORY.invitationPoints,afterEventDay:SILAS_STORY.events.company,time:SILAS_STORY.morning,near:SILAS_STORY.quietPlace,noInvitation:true},branch:'invitation'},
   {when:{area:'city',event:SILAS_STORY.events.clue,afterEventDay:SILAS_STORY.events.clue,notEvent:SILAS_STORY.events.company,near:SILAS_STORY.quietPlace},branch:'company'},
   {when:{area:'city',flag:'clue:teo-lantern',notEvent:SILAS_STORY.events.clue,time:SILAS_STORY.evening,near:SILAS_STORY.eastLamp},branch:'clue'},
   {when:{repeat:true,time:[1080,1440]},branch:'evening'},
  ],
  first:simple('Silas','city-silas','I keep the village lamps glowing. Quiet roads tell you who still needs a light.','Why keep watch alone?','Tell me about Lantern Night.','Someone must notice the lamp that does not come on. Your grandfather understood that.','It was our brightest night. The old lamp by the east road was always the first one lit.'),
  clue:{start:'clue',nodes:{
   clue:{speaker:'Silas',portrait:'city-silas',text:'Teo sent you, didn’t he? That child notices more than most adults.',choices:[
    choice('He said you still check this lamp.','clue-check','silas-event1-check',[],{remember:{key:'lampQuestion',value:'checks-lamp'}}),
    choice('He told me about Lantern Night.','clue-night','silas-event1-night',[],{remember:{key:'lampQuestion',value:'lantern-night'}}),
    choice('I wanted to ask about my grandfather.','clue-grandfather','silas-event1-grandfather',[],{remember:{key:'lampQuestion',value:'grandfather'}}),
   ]},
   'clue-check':{speaker:'Silas',portrait:'city-silas',text:'I do. Your grandfather lit the first lantern, then carried the broken one at the front of the gathering. I still tend this road lamp for him.',choices:continueTo('clue-close')},
   'clue-night':{speaker:'Silas',portrait:'city-silas',text:'Grandfather lit the first lantern. The broken lantern led the gathering, held high at the front. This road lamp is the last one I still maintain for that night.',choices:continueTo('clue-close')},
   'clue-grandfather':{speaker:'Silas',portrait:'city-silas',text:'He always lit the first lantern, then carried the broken lantern at the head of the gathering. Keeping this road lamp is the promise I can still manage.',choices:continueTo('clue-close')},
   'clue-close':{speaker:'Silas',portrait:'city-silas',text:'I am not ready to tell you why Lantern Night ended. Not yet.',end:true,closeLabel:'I understand.',flags:['clue:silas-lamp'],connection:{event:SILAS_STORY.events.clue,dayFlag:'event1Day'}},
  }},
  company:{start:'company',nodes:{
   company:{speaker:'Silas',portrait:'city-silas',text:'If you have a moment, stay here with me. I do not need anything brought or fixed.',choices:[
    choice('Sit quietly.','company-quiet','silas-company-quiet',[],{remember:{key:'companyResponse',value:'sit-quietly'}}),
    choice('Ask why he works alone.','company-alone','silas-company-alone',[],{remember:{key:'companyResponse',value:'ask-alone'}}),
    choice('Tell him the town still needs its lights.','company-lights','silas-company-lights',[],{remember:{key:'companyResponse',value:'town-needs-lights'}}),
   ]},
   'company-quiet':{speaker:'Silas',portrait:'city-silas',text:'Quiet company is rare. I prefer work without noise. Your grandfather trusted me before most people did; tending the lamp protects that memory.',end:true,closeLabel:'Stay a little longer.',connection:{event:SILAS_STORY.events.company,dayFlag:'event2Day'}},
   'company-alone':{speaker:'Silas',portrait:'city-silas',text:'Quiet work asks no questions. Your grandfather trusted me before the others did. I work alone because maintaining his lamp is how I keep that trust safe.',end:true,closeLabel:'Let the quiet return.',connection:{event:SILAS_STORY.events.company,dayFlag:'event2Day'}},
   'company-lights':{speaker:'Silas',portrait:'city-silas',text:'Perhaps it does. I still prefer quiet work. Your grandfather trusted me early, and every lamp I maintain protects the memory of that trust.',end:true,closeLabel:'Watch the road together.',connection:{event:SILAS_STORY.events.company,dayFlag:'event2Day'}},
  }},
  invitation:{start:'invitation',nodes:{invitation:{speaker:'Silas',portrait:'city-silas',text:'Meet me at the east-road lamp tomorrow evening, after 18:00. There is one light—and one memory—I am ready to share.',end:true,closeLabel:'I’ll be there.',connection:{invitation:'offer'}}}},
  'lamp-meeting':{start:'lamp-meeting',nodes:{
   'lamp-meeting':{speaker:'Silas',portrait:'city-silas',text:'You came. Stand beside me while I light it.',choices:continueTo('lamp-clue')},
   'lamp-clue':{speaker:'Silas',portrait:'city-silas',text:'Walter carved the little brass star that belonged inside the broken lantern. Grandfather left him a note before Lantern Night ended. Ask Walter about the carving—but let him choose what comes next.',end:true,closeLabel:'Watch the lamp burn.',connection:{event:SILAS_STORY.events.lamp,dayFlag:'event3Day',invitation:'attend',flags:{walterLeadUnlocked:true,lampRelit:true},effect:'light-east-lamp'}},
  }},
  'after-quiet':{start:'after',nodes:{after:{speaker:'Silas',portrait:'city-silas',text:'You understood that silence can be company. The lamp burned steadier for it.',end:true,closeLabel:'Share the quiet.'}}},
  'after-alone':{start:'after',nodes:{after:{speaker:'Silas',portrait:'city-silas',text:'You asked why I worked alone without trying to pull me out of it. I remember that.',end:true,closeLabel:'Leave him to the lamps.'}}},
  'after-light':{start:'after',nodes:{after:{speaker:'Silas',portrait:'city-silas',text:'You were right that the town still needs its lights. I had forgotten the lamps could belong to tomorrow, too.',end:true,closeLabel:'Leave the lamp glowing.'}}},
  repeat:{start:'repeat',nodes:{repeat:{speaker:'Silas',portrait:'city-silas',text:'The lamps are steady tonight. The broken one is still waiting for an honest answer.',end:true,closeLabel:'Leave him to his rounds.'}}},
  evening:{start:'evening',nodes:{evening:{speaker:'Silas',portrait:'city-silas',text:'Dusk makes every lamp honest. You can see which roads people still depend on.',end:true,closeLabel:'Leave him to his rounds.'}}},
 },
 clara:{first:simple('Clara','clara','Seeds are small promises. My family has kept this stall through lean summers and generous ones.','What grows well first?','Does your family farm?','Tomatoes forgive a beginner and still make a fine supper. Start with one and learn its rhythm.','We grow a little behind the house. The stall helps every garden in City feel like part of ours.','Browse seeds'),repeat:{start:'repeat',nodes:{repeat:{speaker:'Clara',portrait:'clara',text:'Choose what suits your days, not what makes the biggest boast.',end:true,closeLabel:'Browse seeds'}}}},
 niko:{first:simple('Niko','niko','Market mornings move fast. I love good produce, but I am learning that working past sunset does not make it fresher.','Is the market difficult?','Do you ever rest?','Prices change, people worry, and I try to be fair to both farmers and families.','Bruno keeps leaving food at my counter. Apparently that is his polite way of ordering me home.','Open market'),repeat:{start:'repeat',nodes:{repeat:{speaker:'Niko',portrait:'niko',text:'Bring what is ready. Nothing here needs to be rushed for my sake.',end:true,closeLabel:'Open market'}}}},
 'city-nell':{first:simple('Nell','city-nell','Clothes can be practical and still say something true. I make the bold pieces; wearing them takes its own courage.','What should I wear?','Were you always confident?','Whatever lets you forget the outfit and enjoy the day. That is when it belongs to you.','Not at all. I started with one bright stitch hidden inside a plain sleeve.','See Nell’s clothes'),repeat:{start:'repeat',nodes:{repeat:{speaker:'Nell',portrait:'city-nell',text:'Try the piece that makes you stand a little taller.',end:true,closeLabel:'See Nell’s clothes'}}}},
 'city-sol':{first:simple('Sol','city-sol','A barber notices small changes: a new habit, a lighter step, the moment someone is ready to see themselves differently.','What changed about me?','Do people talk here?','You look toward the road less often than you did when you arrived.','Sometimes. Mostly I listen to what they do not quite say.','Visit the barber'),repeat:{start:'repeat',nodes:{repeat:{speaker:'Sol',portrait:'city-sol',text:'You look more settled today. Even your shoulders know it.',end:true,closeLabel:'Visit the barber'}}}},
 'city-walter':{first:simple('Walter','city-walter','Your grandfather sat here when a carving would not come right. He said the garden lent him patience.','What did he carve?','What was he worried about?','Birds, mostly. Tiny ones with wings tucked close, as if they were keeping a secret.','Near the end? Lantern Night, and a promise he feared he could not finish.','Thank you, Walter.'),repeat:{start:'repeat',nodes:{repeat:{speaker:'Walter',portrait:'city-walter',text:'The garden remembers patient hands. Your grandfather would be glad you stopped here.',end:true,closeLabel:'Sit with him a moment.'}}}},
 'city-bruno':{first:simple('Bruno','city-bruno','Food gets people to the same table before they remember what they were arguing about. That is half of cooking.','What is the other half?','Who needs a meal today?','Making enough that nobody has to pretend they were not hungry.','Niko, certainly. Clara too, if the seed stall has been busy.','I’ll remember that.'),repeat:{start:'repeat',nodes:{repeat:{speaker:'Bruno',portrait:'city-bruno',text:'A shared meal is still the quickest road between two people.',end:true,closeLabel:'Let him get back to cooking.'}}}},
 'city-elena':{first:simple('Elena','city-elena','A public garden belongs to everyone, so I leave a little space for other people to change it.','Does that ever go wrong?','What should I plant?','Of course. Shared places are untidy. They are also alive.','Something you would be happy to see another person care for.','I like that.'),repeat:{start:'repeat',nodes:{repeat:{speaker:'Elena',portrait:'city-elena',text:'The garden changed again. That means people are still using it.',end:true,closeLabel:'Walk through the garden.'}}}},
 'city-luca':{first:simple('Luca','city-luca','The best picnic needs snacks, a game, and one path nobody has explored yet.','What game?','Where would you explore?','A race around the fountain, unless Teo changes the rules halfway through.','Past the garden wall. I bet there is a perfect cloud-watching hill there.','Save me a place.'),repeat:{start:'repeat',nodes:{repeat:{speaker:'Luca',portrait:'city-luca',text:'We are choosing the next picnic path. Teo votes for the one with the most mud.',end:true,closeLabel:'Wish Luca luck.'}}}},
 'city-teo':{first:{start:'start',nodes:{
  start:{speaker:'Teo',portrait:'city-teo',text:'You’re the farmer from the old house, right? Walter says your grandfather used to light the road before Lantern Night.',choices:[choice('My grandfather?','grandfather','teo-grandfather'),choice('Lantern Night?','lantern','teo-lantern')]},
  grandfather:{speaker:'Teo',portrait:'city-teo',text:'Only a little. He carved tiny wooden birds and hid them around the fountain. I found one before he left.',choices:continueTo('notice')},
  lantern:{speaker:'Teo',portrait:'city-teo',text:'It was the brightest night of the year. Luca says the whole road looked like a river of stars.',choices:continueTo('notice')},
  notice:{speaker:'Teo',portrait:'city-teo',text:'Silas still checks the old lamp beside the east road. He thinks nobody notices, but I do.',choices:[choice('Thanks.','final','teo-thanks'),choice('I’ll ask Silas.','final','teo-ask-silas'),choice('Show me the wooden bird.','final','teo-bird')]},
  final:{speaker:'Teo',portrait:'city-teo',text:'I will! But you have to find me before Luca does. We race through the garden after lunch.',end:true,closeLabel:'Let Teo race.',flags:['clue:teo-lantern']},
 }},conditions:[{when:{connectionEvent:SILAS_STORY.events.lamp},branch:'after-lamp'},{when:{connectionEvent:SILAS_STORY.events.clue},branch:'after-silas'}],
 'after-silas':{start:'after',nodes:{after:{speaker:'Teo',portrait:'city-teo',text:'You really spoke with Silas! He looked less alone by that lamp afterward. I knew he would tell you something.',end:true,closeLabel:'Thank Teo for noticing.'}}},
 'after-lamp':{start:'after',nodes:{after:{speaker:'Teo',portrait:'city-teo',text:'The east-road lamp was bright again! Even Luca stopped racing long enough to look. Walter will pretend he did not notice—but he did.',end:true,closeLabel:'Let Teo tell everyone.'}}},
 repeat:{start:'repeat',nodes:{repeat:{speaker:'Teo',portrait:'city-teo',text:'The east-road lamp is Silas’s secret. Well—not secret anymore. Ask him before Luca finds me!',end:true,closeLabel:'Let Teo race.'}}}},
};

export const RESIDENT_SERVICES={clara:{label:'Browse seeds',type:'seed'},niko:{label:'Open market',type:'sell'},'city-nell':{label:'See Nell’s clothes',type:'clothes'},'city-sol':{label:'Visit the barber',type:'hair'}};
export const CONVERSATION_FLAGS=['clue:teo-lantern','clue:silas-lamp',...Object.keys(RESIDENT_DIALOGUES).map(id=>'met:'+id)];
