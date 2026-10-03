const C = { grass: 0x8fab72, light: 0xb1c486, dark: 0x52775b, path: 0xddc597, edge: 0xbfa77d, wood: 0x885c43, cream: 0xf4e7bd, roof: 0xbb7255, water: 0x79b6ad };
export function drawWorld(scene, area) {
  const g = scene.add.graphics();
  const box = (x,y,w,h,c) => { g.fillStyle(c); g.fillRect(x,y,w,h); };
  const tree = (x,y,k=1) => { box(x-5,y,10,35,C.wood); g.fillStyle(0x45694e); g.fillEllipse(x+4,y+10,70*k,28*k); g.fillStyle(C.dark); g.fillCircle(x,y-10,30*k); g.fillStyle(0x73966a); g.fillCircle(x-10,y-22,23*k); g.fillStyle(0x90ae75); g.fillCircle(x-14,y-30,12*k); };
  const label = (x,y,t,size=15,color='#f9edcb') => scene.add.text(x,y,t,{fontFamily:'monospace',fontSize:size,color,fontStyle:'bold',backgroundColor:'#48664e',padding:{x:9,y:6}}).setOrigin(.5);
  box(0,0,960,540,C.grass);
  for(let i=0;i<240;i++) { const x=(i*137+17)%960,y=(i*73+37)%540; box(x,y,3,5,i%3?0x9bb780:0x7f9e68); }
  box(0,495,960,45,0x749764); box(0,0,960,72,0x75956d);
  for(let i=0;i<11;i++) { tree(i*98+5,63,.9); if(i<3||i>6)tree(i*103,505,.75); }
  if(area==='home') {
    box(165,107,630,398,0x395a4b);box(180,120,600,370,0xb88b5c);
    for(let y=150;y<490;y+=32) { box(180,y,600,2,0xa67a50); for(let x=180+(y%64);x<780;x+=100)box(x,y,2,32,0xae8054); }
    box(180,107,600,45,0xedd7a4);box(180,146,600,9,0x88684c);
    box(406,128,110,55,0x896a49);box(414,130,94,43,0xa8c8a9);box(458,130,5,44,C.cream);
    box(232,178,124,151,0x664f3e);box(240,180,108,140,C.cream);box(246,222,96,91,0x71988e);box(246,226,96,10,0x9fc0a6);box(257,189,73,26,0xfff4d2);
    box(580,174,130,55,C.wood);box(588,178,114,35,0xc39061);box(603,187,28,17,0xf1d5a0);
    box(610,340,90,65,C.wood);box(615,340,80,55,0xb9895d);g.fillStyle(C.cream);g.fillCircle(656,363,20);g.fillStyle(0x76945b);g.fillCircle(656,358,12);
    box(399,337,158,86,0xc27350);box(409,347,138,66,0xd89c6d);box(420,356,116,48,0xc67f58);
    box(445,469,70,25,0x554c3e);label(480,472,'FARM ↓',14);label(291,169,'BED',13);
    tree(738,262,.65);
  } else {
    box(45,250,870,64,C.edge);box(45,256,870,52,C.path);
    for(let i=0;i<40;i++)box(52+i*23,270+(i%3)*13,12,3,0xd0b589);
    if(area==='farm') {
      box(151,225,62,180,C.path);box(180,389,488,43,C.path);
      box(95,127,180,105,C.cream);box(85,109,200,42,C.roof);box(97,96,176,22,0xcc8962);box(107,85,156,16,0xde9e71);
      for(let i=0;i<8;i++)box(90+i*25,114,3,28,0xa96048);
      box(155,169,48,63,0x6c6550);box(219,163,32,30,0x7da4a0);box(225,167,20,22,0xb4d0ba);
      label(180,119,'HOME',13);label(858,233,'CITY →',14);
      box(322,188,299,216,0x739260);
      box(680,338,190,126,0xc5c99b);g.fillStyle(C.water);g.fillRoundedRect(693,350,164,101,25);g.fillStyle(0xa0d1bf);g.fillEllipse(770,384,106,8);g.fillEllipse(788,418,70,5);
      for(let i=0;i<5;i++){box(703+i*27,444,4,23,C.dark);box(700+i*27,440,3,12,0xabc082);}
      tree(750,160);tree(82,366,.8);label(476,170,'THE TOMATO PATCH',13);
      for(let x=305;x<640;x+=28){box(x,430,7,40,C.cream);box(x-1,425,9,7,C.cream);}box(305,438,334,6,C.cream);
    } else {
      box(480,130,50,350,C.path);box(235,320,540,37,C.path);
      for(const [x,title,color] of [[270,'SEEDS',0x729877],[560,'PRODUCE',0xc28159]]) {
        box(x,134,180,96,0xf0ddb0);box(x-8,116,196,38,color);
        for(let i=0;i<8;i++)box(x-8+i*25,149,13,14,0xf2d9a9);
        box(x+7,190,166,42,C.wood);box(x+14,190,152,27,0xc09366);
        for(let i=0;i<5;i++){g.fillStyle(title==='SEEDS'?0xd7b972:0xc96044);g.fillCircle(x+28+i*30,201,8);}
        label(x+90,136,title,16);g.fillStyle(0xdeb58b);g.fillCircle(x+90,173,12);box(x+78,156,24,9,0x536a53);
      }
      label(100,235,'← FARM',14);tree(815,177);tree(174,148,.8);tree(130,410,.8);
      box(695,365,140,25,C.wood);box(706,390,9,43,C.wood);box(814,390,9,43,C.wood);
      g.fillStyle(0x95b4a0);g.fillCircle(495,401,33);g.fillStyle(C.cream);g.fillCircle(495,401,25);g.fillStyle(C.water);g.fillCircle(495,400,19);
    }
  }
  return g;
}
export function makeCharacter(scene, character) {
  const g=scene.add.graphics();
  g.fillStyle(0x263f36,.22);g.fillEllipse(0,6,30,12);
  g.fillStyle(0x425447);g.fillRect(-9,-1,7,9);g.fillRect(3,-1,7,9);
  g.fillStyle(character==='girl'?0xb96e4e:0xe2b35f);g.fillRect(-11,-21,22,23);
  g.fillStyle(0xf0c493);g.fillRect(-14,-19,4,15);g.fillRect(10,-19,4,15);g.fillRect(-10,-39,20,20);
  g.fillStyle(0x4e4636);g.fillRect(-12,-43,24,10);g.fillRect(-12,-35,5,10);
  if(character==='girl'){g.fillRect(8,-34,6,19);g.fillRect(-14,-34,6,19);}
  g.fillStyle(0x33493f);g.fillRect(-5,-30,3,3);g.fillRect(5,-30,3,3);
  g.fillStyle(0xf0d49a);g.fillRect(-15,-43,30,6);g.fillRect(-10,-49,20,8);
  return g;
}
