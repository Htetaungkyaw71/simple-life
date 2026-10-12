// Original recipes, requests and communal projects. Existing local art is reused.
export const ORDERS=[
 {id:'rowan-timber',resident:'rowan',name:'Rowan',purpose:'Timber for a garden bench',cost:{wood:12},coins:80,seed:'seed',seeds:2},
 {id:'june-stones',resident:'city-june',name:'June',purpose:'Stones for a flower border',cost:{stone:8},coins:90,seed:'carrotSeed',seeds:2},
 {id:'bea-planters',resident:'city-bea',name:'Bea',purpose:'Materials for new planters',cost:{wood:8,stone:6},coins:120,seed:'strawberrySeed',seeds:2},
 {id:'tomas-paving',resident:'city-tomas',name:'Tomas',purpose:'Repair the garden paving',cost:{stone:12},coins:110,seed:'cucumberSeed',seeds:2},
 {id:'ira-fencing',resident:'city-ira',name:'Ira',purpose:'Wood for flowerbed fencing',cost:{wood:16},coins:100,seed:'chiliSeed',seeds:3},
 {id:'sol-garden',resident:'city-sol',name:'Sol',purpose:'Restore a quiet garden corner',cost:{wood:10,stone:10},coins:150,seed:'blueberrySeed',seeds:2},
];
export const PROJECTS=[
 {id:'commons',name:'Commons seating',description:'Build a leafy bench corner in the garden commons.',cost:{wood:12,stone:6},coins:240,seed:'grapeSeed',seeds:2,x:1440,y:880,props:[['bench',1408,816],['planter',1352,836],['planter',1496,836],['flowers2',1352,820],['flowers2',1496,820]]},
 {id:'flowerCourt',name:'Flower court',description:'Plant a welcoming flower court east of the square.',cost:{wood:18,stone:24},coins:220,seed:'watermelonSeed',seeds:2,x:2056,y:880,props:[['planter',1984,800],['planter',2080,800],['flowers2',1984,784],['flowers2',2080,784],['bench',2024,864]]},
 {id:'picnic',name:'Picnic garden',description:'Add seating and flowers beside the picnic camp.',cost:{wood:36,stone:16},coins:250,seed:'pumpkinSeed',seeds:2,x:1440,y:1208,props:[['bench',1376,1184],['bench',1488,1184],['planter',1448,1148],['flowers2',1448,1132]]},
];
export const DECORATIONS={
 bench:{name:'Garden bench',item:'benchDecor',icon:'wood-item',frame:'bench',w:64,h:40,box:[-32,-18,64,18],cost:{wood:8,stone:2}},
 planter:{name:'Flower planter',item:'planterDecor',icon:'grass-item',frame:'planter',w:32,h:32,box:[-12,-14,24,14],cost:{wood:4,stone:2}},
 fence:{name:'Wood fence',item:'fenceDecor',icon:'wood-item',frame:'fence',w:32,h:32,box:[-8,-20,16,20],cost:{wood:3}},
 path:{name:'Stone path',item:'pathDecor',icon:'stone-item',frame:null,w:48,h:48,box:null,cost:{stone:2}},
 table:{name:'Picnic table',item:'tableDecor',icon:'wood-item',frame:null,w:64,h:48,box:[-28,-26,56,26],cost:{wood:12,stone:4}},
 barrel:{name:'Garden barrel',item:'barrelDecor',icon:'wood-item',frame:'barrel',w:32,h:36,box:[-12,-16,24,16],cost:{wood:5}},
 lantern:{name:'Lantern post',item:'lanternDecor',icon:'stone-item',frame:'lamp',w:32,h:64,box:[-8,-10,16,10],cost:{wood:6,stone:4}},
};
// Coin shop prices are separate from the seven material recipes.
Object.assign(DECORATIONS,{
 oak:{name:'Shade oak',item:'oakDecor',icon:'grass-item',w:112,h:144,box:[-12,-20,24,20],outdoors:true,price:900,description:'A leafy shade tree. Decorative; cannot be chopped.'},
 palm:{name:'Garden palm',item:'palmDecor',icon:'grass-item',w:96,h:144,box:[-8,-20,16,20],outdoors:true,price:1200,description:'A tropical palm for your Home or Farm.'},
 blossom:{name:'Blossom tree',item:'blossomDecor',icon:'grass-item',w:96,h:120,box:[-10,-18,20,18],outdoors:true,price:1600,description:'Pink spring blossoms, all year round.'},
 hedge:{name:'Leafy hedge',item:'hedgeDecor',icon:'grass-item',w:64,h:40,box:[-28,-20,56,20],outdoors:true,price:180,description:'A tidy border for your garden.'},
 flowers:{name:'Flower patch',item:'flowersDecor',icon:'grass-item',w:48,h:32,box:null,outdoors:true,price:120,description:'Warm wildflowers with room to walk through.'},
 birdbath:{name:'Stone birdbath',item:'birdbathDecor',icon:'stone-item',w:40,h:56,box:[-12,-16,24,16],outdoors:true,price:700,description:'A small stone bowl for a peaceful garden.'},
 rug:{name:'Woven rug',item:'rugDecor',icon:'grass-item',w:64,h:48,box:null,price:350,description:'A patterned rug for your room or terrace.'},
 bookcase:{name:'Little bookcase',item:'bookcaseDecor',icon:'wood-item',w:48,h:64,box:[-20,-16,40,16],price:800,description:'Books and keepsakes for your reading corner.'},
 vase:{name:'Ceramic flowers',item:'vaseDecor',icon:'grass-item',w:32,h:48,box:[-10,-12,20,12],price:450,description:'A glazed vase full of bright flowers.'},
});
DECORATIONS.fence.outdoors=true;DECORATIONS.path.outdoors=true;
export const CRAFT_DECORATIONS=Object.keys(DECORATIONS).filter(id=>DECORATIONS[id].cost);
export const DECORATION_DIRECTIONS=['down','left','up','right'];
export const STOVE_COST={wood:20,stone:16};
export const GRILL_COST={meat:1,wood:1};
export const MAX_DECORATIONS=96;
export const freshSettlement=()=>({projects:[],orders:{day:1,completed:[]},stove:false,decorations:[]});
