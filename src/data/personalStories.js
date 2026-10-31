const choice=(label,next,id,narrative=null)=>({label,next,id,...(narrative?{narrative}:{})});
const onward=next=>[choice('Continue',next,'continue')];

export const PERSONAL_STORIES={
 clara:{residentId:'clara',events:[
  {id:'clara-seed-1',title:'Seeds We Keep',conditions:{chapter:'unlit-road',area:'city',time:[480,960],minPoints:5},dialogue:{start:'start',nodes:{
   start:{speaker:'Clara',portrait:'clara',text:'When our garden failed, your grandfather gave my family one rare seed. I kept the last seed because losing it feels like losing that kindness.',choices:[
    choice('Some memories need protecting.','past','clara-past'),choice('Memories can grow with us.','grow','clara-grow'),choice('Trust the next hands to care for it.','trust','clara-trust'),
   ]},
   past:{speaker:'Clara',portrait:'clara',text:'Keeping it safe was not cowardice. But perhaps a memory can be protected without staying hidden.',end:true,closeLabel:'Leave the seed with Clara.',narrative:{event:'clara-seed-1',remember:{key:'seedMeaning',value:'preserve'}}},
   grow:{speaker:'Clara',portrait:'clara',text:'A seed remembers by becoming more than it was. I am frightened, but I understand what you mean.',end:true,closeLabel:'Give Clara time.',narrative:{event:'clara-seed-1',remember:{key:'seedMeaning',value:'grow'}}},
   trust:{speaker:'Clara',portrait:'clara',text:'My family was trusted with it once. Perhaps keeping that trust means passing it forward.',end:true,closeLabel:'Give Clara time.',narrative:{event:'clara-seed-1',remember:{key:'seedMeaning',value:'trust'}}},
  }}},
  {id:'clara-seed-2',title:'Seeds We Keep',conditions:{after:'clara-seed-1',laterDay:true,area:'city',time:[480,960],minPoints:6},dialogue:{start:'start',nodes:{
   start:{speaker:'Clara',portrait:'clara',text:'I planted the seed this morning. I used the old flower bed, where everyone can help care for what comes next.',choices:onward('promise')},
   promise:{speaker:'Clara',portrait:'clara',text:'I will bring flowers to Lantern Night. Not a monument—a living promise.',end:true,closeLabel:'Watch the garden grow.',narrative:{event:'clara-seed-2',support:'flowers'}},
  }}},
 ]},
 niko:{residentId:'niko',events:[
  {id:'niko-table-1',title:'The Empty Table',conditions:{requires:'clara-support',area:'city',time:[600,900],minPoints:5},dialogue:{start:'start',nodes:{
   start:{speaker:'Niko',portrait:'niko',text:'I act busy because I am afraid the market will fail. Bruno says food should be shared first when times are hard; I say the stall must survive to feed anyone tomorrow.',choices:onward('bruno')},
   bruno:{speaker:'Bruno',portrait:'city-bruno',text:'A full ledger cannot comfort an empty table. But I know giving everything away would leave Niko carrying the worry alone.',choices:onward('niko')},
   niko:{speaker:'Niko',portrait:'niko',text:'Neither of us is entirely wrong. That somehow made the argument harder, not easier.',end:true,closeLabel:'Let both sides stand.',narrative:{event:'niko-table-1'}},
  }}},
  {id:'niko-table-2',title:'The Empty Table',conditions:{after:'niko-table-1',laterDay:true,area:'city',time:[600,900],minPoints:6},dialogue:{start:'start',nodes:{
   start:{speaker:'Niko',portrait:'niko',text:'Bruno and I are ready to try again. How should we begin without pretending the disagreement never happened?',choices:[
    choice('Share one meal first.','meal','niko-meal'),choice('Open a community table.','table','niko-table'),choice('Speak honestly before deciding.','honest','niko-honest'),
   ]},
   meal:{speaker:'Bruno',portrait:'city-bruno',text:'One meal gives us a small table and no audience. We can listen before we promise more.',end:true,closeLabel:'Plan the Lantern Night meal.',narrative:{event:'niko-table-2',remember:{key:'reconciliation',value:'meal'},support:'food'}},
   table:{speaker:'Niko',portrait:'niko',text:'A community table can share food without hiding its cost. We will write the numbers down together.',end:true,closeLabel:'Plan the Lantern Night table.',narrative:{event:'niko-table-2',remember:{key:'reconciliation',value:'table'},support:'food'}},
   honest:{speaker:'Niko',portrait:'niko',text:'Then we start with the argument itself. No cheerful performance until we understand what frightened us.',end:true,closeLabel:'Let them speak plainly.',narrative:{event:'niko-table-2',remember:{key:'reconciliation',value:'honest'},support:'food'}},
  }}},
 ]},
 nell:{residentId:'city-nell',events:[
  {id:'nell-cloth-1',title:'Cloth for a Quiet Town',conditions:{requires:'meal-support',area:'clothing',time:[480,1020],minPoints:5},dialogue:{start:'start',nodes:{
   start:{speaker:'Nell',portrait:'city-nell',text:'I design clothes no one has seen. I keep the drawings hidden because practical work can be judged quietly, while original work feels like showing the town my whole heart.',choices:[
    choice('Hidden work can still be real.','real','nell-real'),choice('Let one piece speak before you do.','speak','nell-speak'),choice('The town may surprise you.','surprise','nell-surprise'),
   ]},
   real:{speaker:'Nell',portrait:'city-nell',text:'Thank you for not calling the hiding wasted time. I think I am ready to let one design leave the drawer.',end:true,closeLabel:'Leave the sketch with Nell.',narrative:{event:'nell-cloth-1',remember:{key:'creativeCourage',value:'real'}}},
   speak:{speaker:'Nell',portrait:'city-nell',text:'A banner could speak without asking me to stand beside it. That feels possible, if not easy.',end:true,closeLabel:'Let Nell consider it.',narrative:{event:'nell-cloth-1',remember:{key:'creativeCourage',value:'work-speaks'}}},
   surprise:{speaker:'Nell',portrait:'city-nell',text:'They may reject it, too. But surprise is at least a door, and hiding is only a wall.',end:true,closeLabel:'Let Nell consider it.',narrative:{event:'nell-cloth-1',remember:{key:'creativeCourage',value:'surprise'}}},
  }}},
  {id:'nell-cloth-2',title:'Cloth for a Quiet Town',conditions:{after:'nell-cloth-1',laterDay:true,area:'clothing',time:[480,1020],minPoints:6},dialogue:{start:'start',nodes:{
   start:{speaker:'Nell',portrait:'city-nell',text:'I will make the Lantern Night banner from my own design. What should it say when people look up?',choices:[
    choice('Remember the past.','past','banner-past'),choice('Welcome change.','change','banner-change'),choice('Belong together.','together','banner-together'),
   ]},
   past:{speaker:'Nell',portrait:'city-nell',text:'Then the colours will carry old warmth without pretending the town never changed.',end:true,closeLabel:'Let Nell begin.',narrative:{event:'nell-cloth-2',remember:{key:'bannerMeaning',value:'past'},support:'banner'}},
   change:{speaker:'Nell',portrait:'city-nell',text:'Then the cloth should feel like a door opening, not an old rule returning.',end:true,closeLabel:'Let Nell begin.',narrative:{event:'nell-cloth-2',remember:{key:'bannerMeaning',value:'change'},support:'banner'}},
   together:{speaker:'Nell',portrait:'city-nell',text:'Then separate colours can meet at the centre. None of them needs to disappear to belong.',end:true,closeLabel:'Let Nell begin.',narrative:{event:'nell-cloth-2',remember:{key:'bannerMeaning',value:'together'},support:'banner'}},
  }}},
 ]},
 walter:{residentId:'city-walter',events:[
  {id:'walter-truth-1',title:'What Grandfather Left Unsaid',conditions:{requires:'meal-support',area:'city',time:[720,1080],minPoints:5},dialogue:{start:'start',nodes:{
   start:{speaker:'Walter',portrait:'city-walter',text:'Your grandfather argued with the town before the final Lantern Night. He wanted Forest travellers and outsiders welcomed; some of us wanted the tradition unchanged.',choices:onward('silence')},
   silence:{speaker:'Walter',portrait:'city-walter',text:'I helped end the argument by ending the gathering. Visit the old waystone in the Forest; then come back, and I will tell you why.',end:true,closeLabel:'Remember the waystone.',narrative:{event:'walter-truth-1'}},
  }}},
  {id:'walter-truth-2',title:'What Grandfather Left Unsaid',conditions:{after:'walter-truth-1',laterDay:true,requires:'forest-landmark',area:'city',time:[480,1080],near:{x:960,y:648,radius:150},minPoints:6},dialogue:{start:'start',nodes:{
   start:{speaker:'Walter',portrait:'city-walter',text:'A traveller was hurt near that waystone. I let fear turn one accident into a reason to divide the town, and I supported ending Lantern Night.',choices:[
    choice('Tell everyone the truth.','public','walter-public'),choice('Apologize privately first.','private','walter-private'),choice('The town can change with you.','change','walter-change'),
   ]},
   public:{speaker:'Walter',portrait:'city-walter',text:'Then I will speak plainly at the gathering. Regret is useless if it remains another secret.',end:true,closeLabel:'Ask Walter to stand with you.',narrative:{event:'walter-truth-2',remember:{key:'truthResponse',value:'public'},support:'truth'}},
   private:{speaker:'Walter',portrait:'city-walter',text:'I will begin with the people I failed most closely, then speak at the gathering. An apology should not be a performance.',end:true,closeLabel:'Give Walter that time.',narrative:{event:'walter-truth-2',remember:{key:'truthResponse',value:'private'},support:'truth'}},
   change:{speaker:'Walter',portrait:'city-walter',text:'Then I must change where people can see it. I will tell the truth when the lanterns are lit.',end:true,closeLabel:'Ask Walter to stand with you.',narrative:{event:'walter-truth-2',remember:{key:'truthResponse',value:'change'},support:'truth'}},
  }}},
 ]},
};

export const SILAS_FESTIVAL_SUPPORT={start:'start',nodes:{
 start:{speaker:'Silas',portrait:'city-silas',text:'The road lamp is ready. Are the others truly prepared to bring Lantern Night back?',choices:[choice('They are ready to tell the whole story.','agree','silas-ready'),choice('The light can belong to tomorrow.','agree','silas-tomorrow')]},
 agree:{speaker:'Silas',portrait:'city-silas',text:'Then I will light the first lantern. You choose when the town gathers.',end:true,closeLabel:'Prepare Lantern Square.',narrative:{support:'lantern'}},
}};

export const PERSONAL_REPEAT_LINES={
 clara:{default:'The planted seed has opened into a familiar flower. Memory looks different when it is alive.',post:'The flowers held their colour all night. Next year, someone else can choose where they grow.'},
 niko:{default:'Bruno and I are planning the table together. We still disagree, but we no longer hide the worry.',post:'The table emptied because people shared it. That is a market result I can live with.'},
 'city-bruno':{default:'Niko and I are cooking and counting together. A good table needs both generosity and enough for tomorrow.',post:'There are leftovers for breakfast. That is how you know a festival was generous, not wasteful.'},
 'city-nell':{default:'The banner is my own design. I am still nervous, which is how I know showing it matters.',post:'People looked at the banner and saw themselves in it. I may bring more drawings out of the drawer.'},
 'city-walter':{default:'I will speak when the town gathers. The truth will be brief, but it will not be hidden.',post:'The town heard the truth and stayed. I had forgotten people could do both.'},
};

// Story-driven schedule overlays stay authored with the story rather than
// embedding Niko/Bruno checks in the schedule resolver.
export const PERSONAL_SCHEDULE_CHANGES={
 niko:{support:'food',residents:{
  niko:[{id:'reconciled-table',start:720,end:780,location:'produce-stall',dialogueGroup:'reconciled-table',service:true,meeting:'bruno-niko-reconciled'}],
  'city-bruno':[{id:'reconciled-table',start:720,end:780,location:'produce-visitor',dialogueGroup:'reconciled-table',meeting:'bruno-niko-reconciled'}],
 }},
};
