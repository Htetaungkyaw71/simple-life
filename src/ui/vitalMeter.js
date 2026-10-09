import {STATUS_PIXELS} from './statusArt.js';
// Original stepped round badges and stone/cream bevels, inspired by the reference.
function rounded(g,x,y,w,h,r,color){
 g.fillStyle(color);
 for(let row=0;row<h;row++){
  const edge=row<r?r-row-.5:row>=h-r?row-(h-r)+.5:0;
  const cut=edge?Math.ceil(r-Math.sqrt(Math.max(0,r*r-edge*edge))):0;
  g.fillRect(x+cut,y+row,w-cut*2,1);
 }
}
export function meterFrame(g,x,y,w,h=18){
 rounded(g,x+1,y+2,w,h,4,0x403d34);
 rounded(g,x,y,w,h,4,0x403d34);
 rounded(g,x+1,y+1,w-2,h-2,3,0xc1bcac);
 rounded(g,x+2,y+2,w-4,h-4,2,0xf8f5e4);
 rounded(g,x+3,y+3,w-6,h-6,1,0x77776e);
 g.fillStyle(0x323a35).fillRect(x+4,y+4,w-8,h-8);
 g.fillStyle(0xffffff).fillRect(x+5,y+1,w-10,1);
 g.fillStyle(0x9d998d).fillRect(x+5,y+h-2,w-10,1);
 return g;
}
export function meterBadge(g,x,y){
 rounded(g,x+1,y+2,28,28,14,0x403d34);
 rounded(g,x,y,28,28,14,0x403d34);
 rounded(g,x+1,y+1,26,26,13,0xb9b8a7);
 rounded(g,x+2,y+2,24,24,12,0xe7e4ce);
 rounded(g,x+3,y+3,22,22,11,0xfffbe5);
 g.fillStyle(0xffffff).fillRect(x+10,y+2,8,1);
 for(const [dx,dy]of [[3,21],[22,3]])g.fillStyle(0x566b3f).fillRect(x+dx,y+dy,3,2).fillStyle(0x91a168).fillRect(x+dx+1,y+dy-1,2,1);
 return g;
}
export function meterGlyph(g,name,color){
 const mask=STATUS_PIXELS[name];g.fillStyle(name==='heart'?0x74382f:name==='bolt'?0x87662c:0x595238);
 for(let y=0;y<mask.length;y++)for(let x=0;x<mask[y].length;x++)if(mask[y][x]==='1')for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]])g.fillRect(x+dx,y+dy,1,1);
 g.fillStyle(color);for(let y=0;y<mask.length;y++)for(let x=0;x<mask[y].length;x++)if(mask[y][x]==='1')g.fillRect(x,y,1,1);
 return g;
}
