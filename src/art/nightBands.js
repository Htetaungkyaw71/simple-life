// Merge equal darkness bands so transparent cell edges cannot draw a grid.
export function nightBands({left,top,right,bottom,cx,cy,radius}){
 const rects=[];let previous=new Map();
 for(let y=top;y<bottom;y+=16){
  const runs=[];for(let x=left;x<right;x+=16){
   const a=Math.abs(x-cx),b=Math.abs(y-cy),d=Math.max(a,b)+Math.min(a,b)*.4;
   const alpha=!radius||a>radius||b>radius?1:d<112?.28:d<160?.48:d<200?.72:1,last=runs.at(-1);
   if(last?.alpha===alpha)last.w+=16;else runs.push({x,y,w:16,h:16,alpha});
  }
  const next=new Map();for(const r of runs){const key=[r.x,r.w,r.alpha].join(':'),old=previous.get(key);if(old){old.h+=16;next.set(key,old);}else{rects.push(r);next.set(key,r);}}previous=next;
 }
 return rects;
}
