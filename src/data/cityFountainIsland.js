// The user-supplied 207 x 214 island sheet is centred in the 640 x 264 main
// road plaza at (704, 420). The short rows follow its stepped silhouette so the
// visible island is solid without blocking the transparent canvas corners.
export const CITY_FOUNTAIN_ISLAND={
 bounds:[614,335,181,170],center:[704,420],surface:false,
 texture:'fountainIsland',frameSize:[207,214],frames:8,fps:8,scale:1.35,
 position:[565,276],visibleBounds:[36,44,170,170],
 solidRows:[
  [55,44,94,11],[48,55,109,11],[40,66,126,4],
  [36,70,134,23],[40,93,126,22],[36,115,134,28],
  [39,143,129,3],[43,146,120,12],[55,158,95,12]
 ]
};

export const CITY_FOUNTAIN_PLANTING=[
 {frame:'cedar-flowers',x:604,y:340,scale:1,foot:[620,372]},
 {frame:'cedar-flowers2',x:772,y:340,scale:1,foot:[788,372]},
 {frame:'cedar-flowers3',x:636,y:334,scale:1,foot:[652,366]},
 {frame:'cedar-flowers1',x:740,y:334,scale:1,foot:[756,366]},
 {frame:'cedar-flowers',x:596,y:392,scale:1,foot:[612,424]},
 {frame:'cedar-flowers2',x:780,y:392,scale:1,foot:[796,424]},
 {frame:'cedar-flowers3',x:596,y:448,scale:1,foot:[612,480]},
 {frame:'cedar-flowers1',x:780,y:448,scale:1,foot:[796,480]},
 {frame:'cedar-flowers',x:628,y:500,scale:1,foot:[644,532]},
 {frame:'cedar-flowers2',x:744,y:500,scale:1,foot:[760,532]},
 {frame:'tall-grass-1-0',x:588,y:404,scale:2,foot:[612,452]},
 {frame:'tall-grass-0-0',x:772,y:404,scale:2,foot:[796,452]},
];

// Targets are visible-centre X and visible-foot Y. The source PNG itself is
// placed from these anchors so the transparent canvas never skews symmetry.
export const CITY_FOUNTAIN_POT_TARGETS=[[622,402],[786,402],[622,522],[786,522]];
