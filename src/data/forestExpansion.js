// Eastern extension: the original 5120-square forest keeps its coordinates/IDs.
const habitats=[
 ['moss','Mossreach','wood'],['cedar','Cedar Hollow','pine'],['sunpalm','Sunpalm Grove','jungle'],['reed','Reedwater','marsh'],
 ['orchid','Orchid Woods','jungle'],['greenbamboo','Green Bamboo','bamboo'],['amber','Amber Meadow','savanna'],['riversong','Riversong','marsh'],
 ['coconut','Coconut Grove','jungle'],['silverpine','Silver Pines','pine'],['redstone','Redstone Caves','stone'],['fruitvale','Fruitvale','wood'],
 ['mistwood','Mistwood','highland'],['papaya','Papaya Grove','jungle'],['willow','Willow Bend','marsh'],['sungrass','Sungrass Reach','savanna'],
 ['eastwood','Eastwood','wood'],['banana','Banana Glade','bamboo'],['fernshade','Palmshade','jungle'],['lakewood','Lakewood','marsh'],
];
export const EAST_REGIONS=habitats.map(([id,name,biome],i)=>({id:'east-'+id,name,biome,danger:0,species:'woodland',x:5120+(i%4)*1280,y:Math.floor(i/4)*1024,w:1280,h:1024}));
export const EAST_BOARS=EAST_REGIONS.filter((r,i)=>i%3===0).flatMap(r=>[0,1].map(n=>({id:r.id+'-boar-'+n,species:'boar',region:r.id,territory:[r.x+752,r.y+144,384,360],home:{x:r.x+824+n*72,y:r.y+280+n*48}})));
