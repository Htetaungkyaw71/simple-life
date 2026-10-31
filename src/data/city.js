import {PLANTER_BENCH} from './planterBench.js';
// Authored fourfold town: market, riverside, residential lanes and garden commons.
const p=(name,x,y,extra={})=>({name,x,y,...extra});
export const CITY={
 size:{width:2560,height:1792},
 paths:[[0,448,2560,80],[608,160,80,1568],[288,288,800,64],[192,320,64,384],[1088,320,64,1008],[192,672,1056,64],[1248,992,1136,80],[1760,160,80,1504],[1344,224,1056,64],[1248,1312,1136,80],[96,1568,1792,64]],
 paving:[[0,448,2560,80],[608,160,80,1568],[288,288,800,64],[192,320,64,384],[1088,320,64,1008],[192,672,1056,64],[1344,224,1056,64],[1760,160,80,1568],[96,1568,1792,64]],
 sidewalks:[[0,416,2560,144],[576,176,144,1520],[160,256,1024,112],[160,320,128,416],[1056,256,128,1104],[160,640,1088,128],[1280,192,1152,144],[1728,176,144,1520],[64,1536,1856,128],[1280,352,1152,288]],
 plaza:[384,336,640,288],squares:[[368,320,672,320],[1344,352,1056,288]],
 gardens:[[1312,736,320,224],[1904,736,320,224],[1312,1120,320,176]],
 // The canal stays connected below both opaque vertical bridge decks.
 grass:[],water:[],falls:[{x:0,y:32,w:2560,h:128}],bridges:[{x:608,y:0,w:80,h:192},{x:1760,y:0,w:80,h:192}],
 buildings:[p('house',96,168),p('house-blue',1120,168),p('house-blue',96,816),p('house',928,816),p('house-blue',704,1120),p('house-green',256,1184),p('house',1376,304),p('house-green',2080,304),p('house-blue',2016,1152),p('house',2144,1488)],
 props:[p('seed-stall',352,160),p('produce-stall',816,160),p('city-fountain0',624,348,{animated:'fountain'}),p('notice',976,560),p('city-bench-garden',PLANTER_BENCH.position.x,PLANTER_BENCH.position.y,{artTexture:PLANTER_BENCH.texture,artFrame:PLANTER_BENCH.frame,artScale:PLANTER_BENCH.scale,artOffset:PLANTER_BENCH.artOffset,artDepthOffset:PLANTER_BENCH.depthOffset,footprint:PLANTER_BENCH.footprint,noShadow:true}),p('city-bench-garden',840,542),p('city-bench-garden',1460,544),p('city-bench-garden',2040,544),p('city-bench-garden',1456,1456),p('city-bench-garden',2008,1024),p('barrel',304,248),p('crate',304,288),p('crate',1000,248),p('city-tent',1312,1384),p('city-tent',1600,1392),p('bench',1432,1296),p('bench',1560,1328),p('well',1664,788),p('notice',1680,1008)],
 fences:[[32,168,512,'h'],[720,168,512,'h'],[1280,168,384,'h'],[1872,168,608,'h']],
 signs:[{type:'aid',x:1024,y:624,label:'Read seed-aid board'},{type:'settlement',x:1688,y:1064,label:'Town board / orders and projects'}],
 extras:[]
};
for(const [x,y]of [[360,366],[992,366],[552,630],[752,630],[1280,376],[1656,376],[1920,376],[2400,376],[1312,586],[1656,586],[1912,586],[2376,586],[572,1104],[716,1480],[1712,944],[1848,1216],[1712,1552]])CITY.props.push(p('city-lamp',x,y));
for(const [i,b]of CITY.buildings.entries()){b.name='house-village-'+(i+3);b.x-=40;b.y=Math.max(168,b.y-64);}
// Larger cottages need real dry parcels, clear of the circulation streets.
for(const [i,x,y]of [[3,832,752],[4,736,1056],[6,320,752],[7,2288,1088]])Object.assign(CITY.buildings[i],{x,y});
for(const collection of [CITY.paths,CITY.paving])for(const r of collection)if(r[1]===320&&(r[0]===192||r[0]===1088)){r[1]+=80;r[3]-=80;}
// House-front paving stays clear; the small repeated City pots were removed
// in the current visual review.
for(const [x,y]of [[288,112],[992,112],[1380,112],[2240,112],[64,576],[1184,568],[1304,608],[2264,600],[2080,608],[1520,608],[64,1000],[432,888],[1200,1080],[2288,1008],[1216,1464],[1896,1408],[1960,1568],[416,1344],[864,1360],[2240,1352]])CITY.props.push(p('tree',x,y));
for(const [x,y,w,h]of CITY.gardens)for(let dx=28;dx<w-28;dx+=56)for(let dy=28;dy<h-24;dy+=52){const k=(dx+dy)/4;if(k%4===0)CITY.props.push(p('flowers2',x+dx,y+dy));else CITY.grass.push({id:`city:commons:${x+dx}:${y+dy}`,x:x+dx+16,y:y+dy+32,variant:k%3,dry:false});}
