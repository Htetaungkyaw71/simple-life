const prop=(name,x,y,extra={})=>({name,x,y,...extra});
export const FORAGE_NODES=[
 {id:'berry-south',item:'wildBerry',x:560,y:858},
 {id:'berry-east',item:'wildBerry',x:728,y:802},
 {id:'berry-west',item:'wildBerry',x:408,y:708},
 {id:'guava-path',item:'guava',x:616,y:536},
 {id:'guava-grove',item:'guava',x:736,y:588},
 {id:'mango-deep',item:'mango',x:1032,y:304},
];
export const BOAR_HOME={x:936,y:376};
export const BOAR_TERRITORY=[736,176,400,320];
export const FOREST_GUIDANCE=[
 'Forest fruit is free. Eat it for energy or sell it in the city.',
 'Wild animals are dangerous. Select your Axe in Bag / Gear to defend yourself.',
 'If defeated, recover your Stash Bag before you fall again.',
];
// Authored clusters frame a connected winding route. No tree grid in the interior.
const clusters=[[144,728],[224,760],[304,864],[384,900],[808,828],[900,760],[1020,844],[1108,700],[184,592],[80,648],[304,624],[328,480],[400,368],[528,316],[604,352],[656,256],[632,144],[480,120],[272,184],[184,272],[1056,504],[1132,416],[1156,220],[1024,88],[864,68],[736,64]];
const edgeTrees=[...Array.from({length:12},(_,i)=>[i*108-20,-40+(i%3)*12]),...Array.from({length:9},(_,i)=>[-42+(i%2)*12,76+i*108]),...Array.from({length:9},(_,i)=>[1216+(i%3)*6,68+i*110]),...[[24,946],[152,932],[268,964],[412,938],[784,952],[904,934],[1048,956],[1180,940]]];
export const FOREST_MAP={
 size:{width:1280,height:1024},
 paths:[[592,784,96,240],[448,720,240,96],[448,496,96,256],[448,480,480,96],[832,240,96,320]],
 buildings:[],
 props:[...clusters.map(([x,y])=>prop('tree',x,y)),...edgeTrees.map(([x,y])=>prop('tree',x,y)),
  prop('guava-tree',560,416),prop('guava-tree',680,468),prop('mango-tree',980,176),prop('tree-wide',256,344),prop('forest-log',696,664),prop('forest-log',1008,120),prop('rock',352,296),prop('rock',1080,600),prop('rock',96,840),prop('shrine-stone',104,360),
  prop('road-sign',512,912,{text:'HOME',direction:2}),prop('road-sign',768,448,{text:'DEEP',direction:6}),
 ],
 water:[[96,432,224,144]],fences:[],
 signs:[{type:'hint',x:542,y:960,label:'HOME / follow the path south'},{type:'hint',x:792,y:500,label:'Deep clearing / wild boar territory'},{type:'dialog',x:128,y:416,label:'Read the moss stone',title:'The still-water stone',body:'A small sun is carved here. The pond has watched many mornings.'}],
 extras:[],
};
