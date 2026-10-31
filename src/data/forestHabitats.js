import {FOREST_SIZE} from './forestBounds.js';
// Broad, irregular climate bands are independent of stable discovery IDs.
export const HABITATS=[
 {id:'snow',name:'Snowy',x:1440,y:1200,color:[188,206,194]},
 {id:'darkForest',name:'Dark Forest',x:15300,y:650,color:[79,105,73]},
 {id:'rainforest',name:'Rainforest',x:15300,y:2420,color:[113,139,78]},
 {id:'meadow',name:'Meadow',x:5550,y:3350,color:[157,170,103]},
 {id:'easyRainforest',name:'Easy Rainforest',x:FOREST_SIZE.width/2,y:4590,color:[145,163,91]},
 {id:'shrubland',name:'Shrubland',x:23100,y:3780,color:[168,164,105]},
 {id:'desert',name:'Desert',x:28500,y:1820,color:[199,166,106]},
];
export const HABITAT_BY_ID=Object.fromEntries(HABITATS.map(h=>[h.id,h]));
export function forestHabitat({x,y}){
 // The Home gate opens into a broad, calm rainforest at the true bottom-centre.
 if(y>FOREST_SIZE.height-1440&&Math.abs(x-FOREST_SIZE.width/2)<1980)return HABITAT_BY_ID.easyRainforest;
 // Scale the original habitat layout across the full enlarged world. Each
 // habitat remains one contiguous place instead of repeating by province.
 const nx=x/FOREST_SIZE.width,ny=y/FOREST_SIZE.height;
 const ripple=Math.sin(y/570)*.022+Math.sin(y/193)*.009;
 if(nx>.875+ripple-.035*ny)return HABITAT_BY_ID.desert;
 if(nx<.16-.16*ny+ripple&&ny<.84)return HABITAT_BY_ID.snow;
 if(ny<.245+Math.sin(x/920)*.027+Math.sin(x/310)*.011)return HABITAT_BY_ID.darkForest;
 if(ny>.80+Math.sin(x/730)*.025&&nx<.685+ripple)return HABITAT_BY_ID.easyRainforest;
 if(nx<.34+ripple+Math.sin(y/690)*.035&&ny>.48+Math.sin(x/480)*.035)return HABITAT_BY_ID.meadow;
 if(nx>.695+ripple-.075*ny&&ny>.46+Math.sin(x/900)*.06)return HABITAT_BY_ID.shrubland;
 return HABITAT_BY_ID.rainforest;
}
export function habitatColor(p){
 // Soft seams retain crisp pixels without revealing the rectangular discovery grid.
 const center=forestHabitat(p).color,neighbors=[[-48,0],[48,0],[0,-48],[0,48]].map(([dx,dy])=>forestHabitat({x:p.x+dx,y:p.y+dy}).color);
 return center.map((c,i)=>Math.round((c*4+neighbors.reduce((n,a)=>n+a[i],0))/8));
}
