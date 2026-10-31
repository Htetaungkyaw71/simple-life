export const LIFE_PATH_ORDER=['grower','explorer','neighbour'];

export const LIFE_PATHS={
 grower:{
  name:'Grower',description:'Care for living things and learn the rhythm of useful work.',
  thresholds:[0,5,11,19,29],
  objectives:[
   'Plant and water a crop.','Harvest produce and sell a new kind.','Cook a meal at the Home hearth.',
   'Keep tending several crops.','Your work already speaks for itself.',
  ],
 },
 explorer:{
  name:'Explorer',description:'Learn the Forest by travelling carefully and returning with stories.',
  thresholds:[0,5,11,19,29],
  objectives:[
   'Enter a new Forest habitat.','Discover a landmark and gather fruit.','Open a guarded treasure.',
   'Complete another Forest challenge.','You know how to find the way home.',
  ],
 },
 neighbour:{
  name:'Neighbour',description:'Notice people, keep promises and make room for honest conversations.',
  thresholds:[0,5,11,19,29],
  objectives:[
   'Meet a resident and listen.','Have a meaningful talk on another day.','Complete a personal story event.',
   'Keep an invitation or deepen a Connection.','The town knows it can count on you.',
  ],
 },
};

export const LIFE_PATH_ACTIONS={
 grower:{plant:[1,6],care:[1,7],harvest:[2,10],sell:[2,12],cook:[2,8]},
 explorer:{habitat:[2,14],landmark:[2,20],forage:[1,8],treasure:[3,18],challenge:[3,15]},
 neighbour:{meet:[1,10],conversation:[1,12],personal:[3,24],invitation:[3,9],connection:[1,10]},
};
