// Fixed tile layout: smaller screens explore with a bounded camera, never stretch art.
export const ROOM={width:1344,height:800,spawn:{x:672,y:608},bed:{x:320,y:320},exit:{x:672,y:700}};
export const FURNITURE=[
 ['window',288,80],['window',704,80],['window',1088,80],
 ['bed',240,224],['shelf',240,384],['kitchen',864,144],['dresser',1088,160],
 ['table',960,416],['chair',978,470],['rug',608,480],['pot',1248,192],['pot',1248,608],['planter',464,112]
];
export const ROOM_SOLIDS=[
 [32,64,1280,64],[32,128,32,640],[1280,128,32,640],[32,736,592,32],[720,736,592,32],
 [240,224,48,80],[240,384,64,48],[864,144,128,64],[1088,160,64,64],
 [960,416,64,48],[978,470,32,32],[1248,192,32,48],[1248,608,32,48],[464,112,64,32]
];
