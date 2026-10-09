import {channelRows} from './water.js';
// Original deterministic branching river network. Layout never rerolls on reload.
const routes=[
 ['north-basin',[[160,180,100],[600,480,120],[1180,340,136],[1640,880,150],[2240,1060,184],[2920,720,140],[3460,1180,164],[4100,1530,180],[4540,2220,170]]],
 ['west-fork',[[760,1800,90],[1100,1560,110],[1520,1640,125],[1860,1360,140],[2240,1060,184]]],
 ['frost-creek',[[280,650,90],[600,480,120]]],
 ['deepwood',[[4040,80,118],[4300,520,146],[4000,900,164],[4100,1530,180]]],
 ['central-river',[[4540,2220,170],[4960,2400,190],[5640,2160,192],[6100,2760,174],[6660,3020,196],[7140,3520,180],[7620,3360,180],[8160,3920,194],[8660,4600,210]]],
 ['meadow-creek',[[120,2840,90],[700,3000,108],[1180,2700,110],[1660,3000,125],[2300,2800,144],[2920,3240,152],[3540,2940,160],[4060,2420,176],[4540,2220,170]]],
 ['south-fork',[[1840,4760,90],[2260,4380,110],[2600,3960,120],[2920,3240,152]]],
 ['rainforest-fork',[[5520,4440,112],[5980,4100,130],[6200,3600,150],[6660,3020,196]]],
 ['east-basin',[[9960,1120,100],[9300,1320,140],[9000,1880,148],[8320,2040,170],[7740,1700,154],[7080,2100,184],[6680,2580,174],[6660,3020,196]]],
 ['desert-creek',[[9560,280,84],[9100,680,98],[9300,1320,140]]],
 ['dark-fork',[[6520,200,90],[6160,540,120],[6500,1020,136],[6980,1260,154],[7080,2100,184]]],
 ['shrub-creek',[[10020,3660,92],[9380,3840,130],[9000,3520,160],[8500,3500,148],[8160,3920,194]]],
 ['south-pool',[[8160,3920,194],[7960,4540,120],[7460,4760,100]]],
];
export const FOREST_RIVERS=routes.map(([id,points],i)=>{const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return {id,points,phase:i*.73,x:Math.min(...xs)-120,y:Math.min(...ys)-120,w:Math.max(...xs)-Math.min(...xs)+240,h:Math.max(...ys)-Math.min(...ys)+240};});
// Curated axis-aligned crossings on nearly straight stretches; water is walkable too.
const crossings=[
 {river:'deepwood',x:3930,y:870,w:360,h:72},
 {river:'south-fork',x:2310,y:4150,w:400,h:72},
 {river:'rainforest-fork',x:6020,y:3600,w:380,h:72},
 {river:'desert-creek',x:9000,y:640,w:320,h:72},
 {river:'north-basin',x:2210,y:870,w:72,h:400,axis:'vertical'},
 {river:'meadow-creek',x:2200,y:2590,w:72,h:400,axis:'vertical'},
 {river:'central-river',x:5520,y:1950,w:72,h:450,axis:'vertical'},
 {river:'east-basin',x:8250,y:1830,w:72,h:420,axis:'vertical'},
 {river:'shrub-creek',x:9310,y:3610,w:72,h:450,axis:'vertical'},
];

export const FOREST_BRIDGES=crossings.map(b=>{
 const rows=channelRows(FOREST_RIVERS.find(r=>r.id===b.river));
 if(b.axis==='vertical'){
  const cy=b.y+b.h/2,wet=[...rows].filter(([y,spans])=>Math.abs(y-cy)<400&&spans.some(([a,z])=>a<b.x+b.w&&z>b.x)).map(([y])=>y);
  const top=Math.floor((Math.min(...wet)-48)/16)*16,bottom=Math.ceil((Math.max(...wet)+48)/16)*16;return {...b,y:top,h:bottom-top};
 }
 const spans=[...rows].filter(([y])=>y>=b.y&&y<b.y+b.h).flatMap(([,spans])=>spans);
 const left=Math.floor((Math.min(...spans.map(s=>s[0]))-48)/16)*16,right=Math.ceil((Math.max(...spans.map(s=>s[1]))+48)/16)*16;return {...b,x:left,w:right-left};
});
