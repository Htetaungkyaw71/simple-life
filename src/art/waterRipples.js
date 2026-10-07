import {waterRows,waterAt} from '../data/water.js';
import {groundHash} from './groundSurface.js';
// Each ripple has an independent place, lifetime and delay; no aligned grid.
export function waterRipples(map){
 const ripples=[];
 for(const [i,row]of waterRows(map).entries()){
  const seed=groundHash(i,row[1],1351),[left,y,width]=row;if(seed%17!==0||width<40)continue;
  const x=Math.round((left+16+(seed>>>6)%(width-32))/2)*2,yy=y+((seed>>>23)%9)*2;
  if(![[x-12,yy-4],[x+16,yy-4],[x-12,yy+8],[x+16,yy+8],[x,yy]].every(([a,b])=>waterAt(map,{x:a,y:b})))continue;
  ripples.push({x,y:yy,seed,delay:seed%4900,period:2100+(seed>>>12)%2800,length:6+seed%7*2});
 }
 return ripples;
}
export function ripplePose(r,time){
 const age=(time+r.delay)%r.period;if(age>r.period*.72)return null;
 const t=age/(r.period*.72),tick=Math.floor(age/260);
 return {x:r.x+((r.seed>>>3)%3-1)*Math.floor(t*2)*2,y:r.y+Math.floor(t*3)*2,width:r.length+(tick%3)*2,alpha:Math.min(1,t*5,(1-t)*5)};
}
