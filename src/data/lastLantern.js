export const FESTIVAL_SITE={area:'city',x:704,y:648,radius:112};

export const BANNER_COLOURS={
 past:{name:'Remember the past',cloth:0x9f5948,trim:0xf0c986},
 change:{name:'Welcome change',cloth:0x668d78,trim:0xf2dc9c},
 together:{name:'Belong together',cloth:0x6f668d,trim:0xf0c986},
};

export const FINAL_MEANINGS={
 remember:{label:'Remember those who came before.',summary:'Lantern Night remembers the hands that kept the road bright before us.'},
 welcome:{label:'Welcome anyone searching for home.',summary:'Lantern Night welcomes anyone searching for a place to call home.'},
 together:{label:'Keep the light for one another.',summary:'Lantern Night asks neighbours to keep the light for one another.'},
};

export const LAST_LANTERN_CHAPTERS=[
 {id:'unlit-road',title:'THE UNLIT ROAD',steps:[
  ['opening','Complete the opening','Begin your new life and hear Grandfather’s unfinished promise.'],
  ['teo','Speak with Teo','Teo notices what the adults miss near Lantern Square.'],
  ['silas','Meet Silas at the east-road lamp','After 18:00, ask Silas what Grandfather did on Lantern Night.'],
 ]},
 {id:'seeds-memories',title:'SEEDS AND MEMORIES',steps:[
  ['clara-first','Listen to Clara’s family story','Build a Connection, then visit Clara’s seed stall between 08:00 and 16:00.'],
  ['clara-second','Return when Clara is ready to plant','Come back on a later day during seed-stall hours.'],
  ['clara-support','Gain Clara’s support','Clara will prepare flowers once the rare seed is planted.'],
 ]},
 {id:'empty-table',title:'THE EMPTY TABLE',steps:[
  ['niko-first','Hear Niko and Bruno’s disagreement','Visit Niko’s market between 10:00 and 15:00.'],
  ['niko-second','Help them begin reconciling','Return on a later day and choose an honest way forward.'],
  ['meal-support','Gain their support for the table','Niko and Bruno will prepare food together.'],
 ]},
 {id:'forest-remembers',title:'WHAT THE FOREST REMEMBERS',steps:[
  ['walter-first','Ask Walter what Grandfather left unsaid','Find Walter in City after midday.'],
  ['forest-landmark','Visit the old Forest waystone','Reach the existing central return waystone and come home safely.'],
  ['walter-second','Return to Walter with the truth','Find Walter near the quiet bench on a later day.'],
 ]},
 {id:'light-way',title:'LIGHT THE WAY',steps:[
  ['nell-support','Help Nell choose the banner','Visit Nell’s clothing shop twice, on different days.'],
  ['silas-support','Ask Silas to light the first lantern','Meet Silas at the east-road lamp after 18:00.'],
  ['preparations','Gather every promised contribution','Clara, Niko, Bruno, Nell and Walter must all be ready.'],
  ['gathering','Begin Lantern Night when you are ready','Meet everyone beside the fountain. Normal play continues after the gathering.'],
 ]},
];

export const FESTIVAL_POSITIONS={
 'city-teo':{x:560,y:676,direction:'right'},'city-luca':{x:592,y:676,direction:'left'},
 clara:{x:620,y:596,direction:'right'},niko:{x:812,y:596,direction:'left'},
 'city-bruno':{x:850,y:596,direction:'left'},'city-nell':{x:704,y:548,direction:'down'},
 'city-walter':{x:666,y:684,direction:'up'},'city-silas':{x:742,y:684,direction:'up'},
 'city-elena':{x:900,y:672,direction:'left'},'city-sol':{x:520,y:620,direction:'right'},
};
