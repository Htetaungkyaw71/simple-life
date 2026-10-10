const resident=(id,name,art,x,y,body,route=[])=>({id,name,art,x,y,body,route});
export const RESIDENTS={
 home:[resident('home-mara','Mara',1,984,768,'The garden is looking lovely today.',[[984,768],[1112,768]]),resident('home-eli','Eli',5,1736,500,'Good morning! The City road is just south of here.')],
 city:[resident('city-june','June',0,560,600,'Fresh seeds make a fresh start.',[[560,600],[800,600]]),resident('city-tomas','Tomas',3,1184,488,'Follow the river walk to the garden commons.',[[1184,488],[1560,488]]),resident('city-nell','Nell',2,1568,1040,'A quiet bench and a little sunshine. Perfect.'),resident('city-ira','Ira',4,1700,680,'These flowers brighten the whole square.',[[1700,680],[1880,680]]),resident('city-bea','Bea',1,2000,1040,'The commons are my favourite part of town.',[[2000,1040],[2224,1040]]),resident('city-sol','Sol',5,472,1040,'I like taking the long way home.'),resident('city-luca','Luca',6,1648,1344,'There is always room for a picnic.'),resident('city-ada','Ada',7,1800,224,'The river is beautiful from the bridge.',[[1800,224],[2096,224]])]
};

// Every visitor/resident has a real house; the porch route is derived from its art.
for(const [area,homes]of Object.entries({home:[0,2],city:[0,1,6,4,7,2,8,9]}))RESIDENTS[area].forEach((n,i)=>n.home=homes[i]);
RESIDENTS.city.push({...resident('rowan','Rowan',4,336,738,'Your Axe is in Bag / Gear. It cuts trees and protects you in the Forest.'),home:2});
export const MERCHANT_RESIDENTS=[
 {...resident('clara','Clara',2,432,306,'',[]),kind:'seed',home:3},
 {...resident('niko','Niko',3,896,306,'',[]),kind:'sell',home:5},
];
