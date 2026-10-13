// Original native-pixel town signs: a shirt and scissors. No NPC nameplate.
const SHIRT=['00100100','01111110','11111111','11011011','00011000','00011000','00011000','00011000'];
const SCISSORS=['11000011','10100101','01100110','00011000','00100100','01000010','10000001','00000000'];
export function styleMarker(scene,x,y,category){const g=scene.add.graphics();g.fillStyle(0x3b302a).fillRect(-12,-12,26,26);g.fillStyle(0xf5eccb).fillRect(-11,-11,22,22);g.fillStyle(category==='clothes'?0x547680:0x9b6745);const glyph=category==='clothes'?SHIRT:SCISSORS;glyph.forEach((row,yy)=>[...row].forEach((v,xx)=>{if(v==='1')g.fillRect(-8+xx*2,-8+yy*2,2,2);}));return g.setPosition(x,y).setDepth(y+98);}
