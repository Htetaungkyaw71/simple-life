#!/usr/bin/env node
/**
 * Build the native 32px Forest Spider crawl sheet and append it to the
 * existing runtime atlas without repacking unrelated cells.
 *
 * The generated source image is preserved under output/art/spider-v1/source.
 * This deterministic pass translates that approved silhouette and palette
 * into the game's hard-edged native pixel grid.
 */
import {readFileSync,writeFileSync,renameSync,mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {dirname} from 'node:path';

const ROOT=new URL('..',import.meta.url).pathname;
const ATLAS_PNG=ROOT+'public/assets/pixel/processed/town.png';
const ATLAS_JSON=ROOT+'public/assets/pixel/processed/town.json';
const SHEET=ROOT+'output/art/spider-v1/spider-frames.png';
const REVIEW=ROOT+'output/art/spider-v1/spider-frames-review.png';
const CELL=32,COLS=6,ROWS=4,SHEET_W=CELL*COLS,SHEET_H=CELL*ROWS;
const directions=['down','up','left','right'];
const palette={outline:[25,14,24,255],deep:[55,42,53,255],mid:[92,76,87,255],light:[137,119,128,255],eye:[207,53,60,255]};

function pixel(buffer,width,x,y,color){
 if(x<0||y<0||x>=width||y*width*4>=buffer.length)return;
 const i=(Math.floor(y)*width+Math.floor(x))*4;for(let n=0;n<4;n++)buffer[i+n]=color[n];
}
function rect(buffer,width,x,y,w,h,color){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)pixel(buffer,width,xx,yy,color);}
function ellipse(buffer,width,cx,cy,rx,ry,color){for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)pixel(buffer,width,x,y,color);}
function line(buffer,width,x0,y0,x1,y1,color,thickness=1){
 x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
 const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;let err=dx+dy;
 while(true){rect(buffer,width,x0-Math.floor(thickness/2),y0-Math.floor(thickness/2),thickness,thickness,color);if(x0===x1&&y0===y1)break;const e=2*err;if(e>=dy){err+=dy;x0+=sx;}if(e<=dx){err+=dx;y0+=sy;}}
}
function polyline(buffer,width,points,color,thickness=1){for(let i=1;i<points.length;i++)line(buffer,width,...points[i-1],...points[i],color,thickness);}
function leg(buffer,width,points){polyline(buffer,width,points,palette.outline,4);polyline(buffer,width,points,palette.deep,2);pixel(buffer,width,...points.at(-1),palette.mid);}

function drawSpider(buffer,width,ox,oy,direction,phase){
 const lift=[0,1,0,-1,0,1][phase],sway=[-1,0,1,0,-1,0][phase];
 if(direction==='down'||direction==='up'){
  const down=direction==='down',abdY=down?oy+12:oy+20,headY=down?oy+20:oy+12;
  const anchors=[[-4,-3,-10,-6,-13,-9],[-5,0,-11,-1,-15,-1],[-5,3,-11,5,-14,8],[-3,5,-7,10,-8,14]];
  for(let i=0;i<4;i++)for(const side of [-1,1]){
   const [ax,ay,jx,jy,fx,fy]=anchors[i],step=(i%2?lift:-lift)*side;
   leg(buffer,width,[[ox+16+ax*side,headY+ay],[ox+16+jx*side+sway,headY+jy+step],[ox+16+fx*side,headY+fy-step]]);
  }
  ellipse(buffer,width,ox+16,abdY,8,9,palette.outline);ellipse(buffer,width,ox+16,abdY,6,7,palette.mid);
  rect(buffer,width,ox+12,abdY-5,4,3,palette.light);rect(buffer,width,ox+18,abdY+3,3,3,palette.deep);
  ellipse(buffer,width,ox+16,headY,6,5,palette.outline);ellipse(buffer,width,ox+16,headY,4,3,palette.deep);
  const eyeY=headY+(down?2:-2);pixel(buffer,width,ox+14,eyeY,palette.eye);pixel(buffer,width,ox+18,eyeY,palette.eye);
 }else{
  const right=direction==='right',bodyX=right?ox+13:ox+19,headX=right?ox+22:ox+10;
  const anchors=[[-3,-3,-7,-8,-10,-10],[0,-4,0,-10,2,-13],[2,2,4,8,2,12],[-2,3,-7,7,-9,10]];
  for(let i=0;i<4;i++)for(const side of [-1,1]){
   const [ax,ay,jx,jy,fx,fy]=anchors[i],vertical=side,step=(i%2?lift:-lift);
   const mirror=right?1:-1;
   leg(buffer,width,[[bodyX+ax*mirror,oy+16+ay*vertical],[bodyX+jx*mirror+step,oy+16+jy*vertical],[bodyX+fx*mirror-step,oy+16+fy*vertical]]);
  }
  ellipse(buffer,width,bodyX,oy+16,9,7,palette.outline);ellipse(buffer,width,bodyX,oy+16,7,5,palette.mid);
  rect(buffer,width,bodyX-3,oy+12,4,3,palette.light);rect(buffer,width,bodyX+1,oy+19,4,2,palette.deep);
  ellipse(buffer,width,headX,oy+16,5,5,palette.outline);ellipse(buffer,width,headX,oy+16,3,3,palette.deep);
  const eyeX=headX+(right?2:-2);pixel(buffer,width,eyeX,oy+15,palette.eye);pixel(buffer,width,eyeX,oy+18,palette.eye);
 }
}

function encodeRaw(path,width,height,buffer){
 mkdirSync(dirname(path),{recursive:true});const tmp=path+'.tmp.png';
 const p=spawnSync('ffmpeg',['-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',`${width}x${height}`,'-i','pipe:0','-frames:v','1','-compression_level','9',tmp],{input:buffer,maxBuffer:128*1024*1024});
 if(p.status!==0)throw new Error(String(p.stderr));renameSync(tmp,path);
}
function decodePng(path,width,height){
 const p=spawnSync('ffmpeg',['-loglevel','error','-i',path,'-f','rawvideo','-pix_fmt','rgba','pipe:1'],{maxBuffer:128*1024*1024});
 if(p.status!==0)throw new Error(String(p.stderr));if(p.stdout.length!==width*height*4)throw new Error(`Unexpected decoded size for ${path}`);return p.stdout;
}

const sheet=Buffer.alloc(SHEET_W*SHEET_H*4);
for(let row=0;row<directions.length;row++)for(let frame=0;frame<COLS;frame++)drawSpider(sheet,SHEET_W,frame*CELL,row*CELL,directions[row],frame);
encodeRaw(SHEET,SHEET_W,SHEET_H,sheet);
spawnSync('ffmpeg',['-loglevel','error','-y','-i',SHEET,'-vf','scale=768:512:flags=neighbor',REVIEW],{maxBuffer:32*1024*1024});

const atlas=JSON.parse(readFileSync(ATLAS_JSON,'utf8')),oldW=atlas.meta.size.w,oldH=atlas.meta.size.h;
const existing=atlas.frames['cp-spider-walk-down-0']?.frame;
const startX=existing?.x??0,startY=existing?.y??oldH+2,newH=Math.max(oldH,startY+SHEET_H+2);
const oldPixels=decodePng(ATLAS_PNG,oldW,oldH),newPixels=Buffer.alloc(oldW*newH*4);
for(let y=0;y<oldH;y++)oldPixels.copy(newPixels,y*oldW*4,y*oldW*4,(y+1)*oldW*4);
for(let y=0;y<SHEET_H;y++)sheet.copy(newPixels,((startY+y)*oldW+startX)*4,y*SHEET_W*4,(y+1)*SHEET_W*4);

const cellFrame=(direction,index)=>({frame:{x:startX+index*CELL,y:startY+directions.indexOf(direction)*CELL,w:CELL,h:CELL},rotated:false,trimmed:false,spriteSourceSize:{x:0,y:0,w:CELL,h:CELL},sourceSize:{w:CELL,h:CELL}});
for(const direction of directions){
 for(let i=0;i<6;i++)atlas.frames[`cp-spider-walk-${direction}-${i}`]=cellFrame(direction,i);
 for(let i=0;i<4;i++)atlas.frames[`cp-spider-idle-${direction}-${i}`]=cellFrame(direction,[0,1,0,2][i]);
 for(let i=0;i<5;i++)atlas.frames[`cp-spider-run-${direction}-${i}`]=cellFrame(direction,[0,2,3,5,4][i]);
 for(let i=0;i<5;i++)atlas.frames[`cp-spider-attack-${direction}-${i}`]=cellFrame(direction,[2,3,4,5,3][i]);
}
atlas.meta.size.h=newH;encodeRaw(ATLAS_PNG,oldW,newH,newPixels);writeFileSync(ATLAS_JSON,JSON.stringify(atlas,null,2)+'\n');
console.log(JSON.stringify({sheet:SHEET,review:REVIEW,atlas:{width:oldW,height:newH},spiderFrames:76,uniqueCells:24},null,2));
