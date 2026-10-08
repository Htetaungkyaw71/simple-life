// Original code-native pixel materials. Screenshots inform texture density only;
// no reference pixels, tiles or layouts are sampled. All coordinates are native.
export function groundHash(x,y,salt=0){
 let n=Math.imul(x^salt,374761393)^Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return (n^(n>>>16))>>>0;
}
export const GROUND_PALETTES={wood:[137,154,99],jungle:[108,140,87],savanna:[163,157,101],pine:[114,140,103],marsh:[115,143,101],bamboo:[132,158,102],highland:[138,157,115],stone:[140,148,119],snow:[182,203,193]};
export const FOREST_GROUND_PALETTES={wood:[145,157,99],jungle:[134,149,91],savanna:[150,158,102],pine:[129,144,91],marsh:[132,149,95],bamboo:[141,155,96],highland:[140,153,101],stone:[140,150,99],snow:GROUND_PALETTES.snow};
function field(w,h,step,salt){
 const cols=Math.ceil(w/step)+2,rows=Math.ceil(h/step)+2,grid=new Float32Array(cols*rows),out=new Float32Array(w*h);
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)grid[y*cols+x]=(groundHash(x,y,salt)%1024)/1023;
 for(let y=0;y<h;y++){
  const gy=Math.floor(y/step),fy=y/step-gy,ty=fy*fy*(3-2*fy);
  for(let x=0;x<w;x++){const gx=Math.floor(x/step),fx=x/step-gx,tx=fx*fx*(3-2*fx),i=gy*cols+gx;
   const a=grid[i]*(1-tx)+grid[i+1]*tx,b=grid[i+cols]*(1-tx)+grid[i+cols+1]*tx;out[y*w+x]=a*(1-ty)+b*ty;
  }
 }
 return out;
}
export function paintGround(pixels,w,h,biomes=[]){
 const palette=biomes.length?FOREST_GROUND_PALETTES:GROUND_PALETTES,soil=new Uint8Array(w*h);
 const broad=field(w,h,84,417),small=field(w,h,27,916),regions=biomes.length?biomes:[{x:0,y:0,w:w*2,h:h*2,biome:'wood'}];
 const paletteAt=(x,y)=>palette[regions.find(r=>x>=r.x/2&&x<(r.x+r.w)/2&&y>=r.y/2&&y<(r.y+r.h)/2)?.biome]||GROUND_PALETTES.wood;
 for(const r of regions){const base=palette[r.biome]||GROUND_PALETTES.wood;
  const left=paletteAt(r.x/2-1,(r.y+r.h/2)/2),right=paletteAt((r.x+r.w)/2,(r.y+r.h/2)/2),up=paletteAt((r.x+r.w/2)/2,r.y/2-1),down=paletteAt((r.x+r.w/2)/2,(r.y+r.h)/2);
  for(let y=Math.max(0,r.y/2);y<Math.min(h,(r.y+r.h)/2);y++)for(let x=Math.max(0,r.x/2);x<Math.min(w,(r.x+r.w)/2);x++){
   const p=y*w+x,i=p*4,shade=biomes.length?(broad[p]<.32?-20:broad[p]<.47?-9:2)+Math.floor((small[p]-.5)*4)*2:Math.floor((broad[p]-.5)*7)*3+Math.floor((small[p]-.5)*5)*2;
   if(biomes.length&&r.biome!=='snow'&&((broad[p]>.69&&small[p]>.38)||(broad[p]>.62&&small[p]>.72))){soil[p]=1;const tone=Math.floor((small[p]-.5)*5)*3,grain=groundHash(Math.floor(x/2),Math.floor(y/2),107)%11===0?-6:0;for(let c=0;c<3;c++)pixels[i+c]=[130,70,48][c]+tone+grain;pixels[i+3]=255;continue;}
   const dx=x-r.x/2,dy=y-r.y/2,rx=(r.x+r.w)/2-x,by=(r.y+r.h)/2-y;
   const tx=dx<32&&r.x>0?(32-dx)/64:rx<32&&r.x+r.w<w*2?(32-rx)/64:0,ty=dy<32&&r.y>0?(32-dy)/64:by<32&&r.y+r.h<h*2?(32-by)/64:0;
   const horizontal=dx<32?left:right,vertical=dy<32?up:down;
   for(let c=0;c<3;c++)pixels[i+c]=(base[c]*(1-tx)+horizontal[c]*tx)*(1-ty)+vertical[c]*ty+shade;pixels[i+3]=255;
  }
 }
 // A narrow jagged turf edge separates bare earth from grass, with no ledge.
 for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const p=y*w+x;if(!soil[p])continue;const above=!soil[p-w],side=!soil[p-1]||!soil[p+1],below=!soil[p+w];if(above||side||below){const c=above?[102,112,62]:below?[65,78,43]:[90,101,55];for(let k=0;k<3;k++)pixels[p*4+k]=c[k];}}
 return {broad,small,soil};
}
// Distance to the opposite material, in source pixels, for a continuous bank.
// Two linear sweeps avoid repeatedly searching every river/pond for every pixel.
export function shoreDistance(water,w,h){
 const distance=new Uint16Array(w*h);distance.fill(65535);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,v=water[i];
  if((x&&water[i-1]!==v)||(x+1<w&&water[i+1]!==v)||(y&&water[i-w]!==v)||(y+1<h&&water[i+w]!==v))distance[i]=0;
 }
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;
  if(x)distance[i]=Math.min(distance[i],distance[i-1]+1);if(y)distance[i]=Math.min(distance[i],distance[i-w]+1);
 }
 for(let y=h-1;y>=0;y--)for(let x=w-1;x>=0;x--){const i=y*w+x;
  if(x+1<w)distance[i]=Math.min(distance[i],distance[i+1]+1);if(y+1<h)distance[i]=Math.min(distance[i],distance[i+w]+1);
 }
 return distance;
}
export function paintWater(pixels,water,distance,w,h,fields){
 const {broad,small}=fields;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const p=y*w+x,d=distance[p],i=p*4;if(!water[p]&&d>12)continue;
  const noise=Math.floor((small[p]-.5)*5)*2;
  let color;
  if(!water[p]){
   // Raised turf lip, exposed earth below it, and broken sandy bank pockets.
   const sandWidth=3+Math.floor(small[p]*7);
   if(d<2)color=[100,91,61];
   else if(d<4)color=[141,118,75];
   else if(d<sandWidth)color=[196,168,113];
   else if(d<sandWidth+2)color=[109,124,77];
   else {for(let c=0;c<3;c++)pixels[i+c]=Math.max(0,pixels[i+c]-Math.max(0,11-d)*2);continue;}
  }else{
   // Shadows and warm submerged stones in the shallows; cooler deep channels.
   const depth=Math.min(1,(d+small[p]*5)/25),tones=Math.round(depth*6)/6;
   color=[Math.round(105-43*tones),Math.round(126-40*tones),Math.round(110-19*tones)];
  }
  const variation=noise;
  for(let c=0;c<3;c++)pixels[i+c]=color[c]+variation;pixels[i+3]=255;
 }
 // Unequal, jagged rock clusters interrupt the channels without contour rings.
 // Draw only through the shared water mask: currents, collision and feet agree.
 for(let yy=4;yy<h-10;yy+=11)for(let xx=4;xx<w-12;xx+=13){
  const seed=groundHash(xx,yy,438);if(seed%5===0)continue;
  const cx=xx+seed%13-3,cy=yy+(seed>>>5)%11-3,rw=4+(seed>>>9)%7,rh=3+(seed>>>13)%5;
  if(!water[cy*w+cx])continue;
  for(let sy=0;sy<rh;sy++)for(let sx=0;sx<rw;sx++){
   const x=cx+sx,y=cy+sy,p=y*w+x,i=p*4;
   if(x<0||y<0||x>=w||y>=h)continue;
   if(!water[p]||distance[p]<2||((sy===0||sy===rh-1)&&(sx<2||sx>rw-3))||sx===0&&sy<2)continue;
   const edge=sy===rh-1||sx===rw-1,light=sy===1&&sx>1&&sx<rw-2;
   const delta=edge?-7:light?14:7;
   pixels[i]+=delta-2;pixels[i+1]+=delta;pixels[i+2]+=delta+2;
  }
 }
}
export function paintGroundDetails(ctx,w,h,path,water,distance,biomes=[],soil=null){
 const safe=(x,y,pad=3)=>x>=pad&&y>=pad&&x<w-pad&&y<h-pad&&!water[y*w+x]&&!path[y*w+x]&&!soil?.[y*w+x]&&distance[y*w+x]>12;
 const dot=(color,x,y,ww=1,hh=1)=>{ctx.fillStyle=color;ctx.fillRect(x,y,ww,hh);};
 const biomeAt=(x,y)=>biomes.find(r=>x*2>=r.x&&x*2<r.x+r.w&&y*2>=r.y&&y*2<r.y+r.h)?.biome||'wood';
 for(let yy=6;yy<h-8;yy+=13)for(let xx=6;xx<w-8;xx+=13){
  const seed=groundHash(xx,yy,671),x=xx+(seed%9)-4,y=yy+((seed>>>4)%9)-4;
  if(path[y*w+x]&&!water[y*w+x]&&distance[y*w+x]>12){
   if(seed%3===0&&path[(y+2)*w+x+3]){dot('#b89966',x,y,3,2);dot('#ddc28d',x,y,2,1);if(seed%2===0)dot('#c2a471',x+5,y+3,2,1);}
   continue;
  }
  if(!safe(x,y)||seed%7===0)continue;
  const biome=biomeAt(x,y),snow=biome==='snow',dry=biome==='savanna',base=(biomes.length?FOREST_GROUND_PALETTES:GROUND_PALETTES)[biome]||GROUND_PALETTES.wood;
  const dark=`rgb(${base[0]-24},${base[1]-25},${base[2]-18})`,light=`rgb(${base[0]+13},${base[1]+12},${base[2]+8})`;
  if(seed%19===0&&!snow&&biome!=='stone'){
   for(let n=0;n<3+seed%5;n++){
    const f=groundHash(x+n,y,981),fx=x+(f%17)-8,fy=y+((f>>>5)%13)-6;
    if(!safe(fx,fy)||!safe(fx-2,fy-2)||!safe(fx+3,fy+4))continue;
    dot(dark,fx+1,fy+2,3,2);dot('#e1dbb0',fx-1,fy,4,2);dot('#f5efcf',fx,fy-2,2,5);dot('#e4b073',fx+1,fy,1,1);
   }
  }else if(seed%4===0){
   for(let n=0;n<2+seed%3;n++){const dx=n*3-3,dy=(seed>>n)%3;dot(dry?'#a69a61':dark,x+dx,y+dy,2,1);dot(light,x+dx+1,y+dy-1,2,1);}
  }else{
   const height=2+(seed%3);dot(dark,x,y+1,1,height);dot(dark,x-2,y,1,height);dot(dark,x+2,y-1,1,height+1);
   dot(dark,x-3,y,2,1);dot(dark,x+3,y-1,2,1);dot(dark,x-1,y+height,4,1);
   dot(light,x-1,y+1,1,2);dot(light,x+3,y+1,1,1);
   if(seed%3===0){dot(dark,x+5,y+4,3,2);dot(dark,x+7,y+2,2,2);dot(light,x+6,y+4,1,1);}
  }
 }
}
