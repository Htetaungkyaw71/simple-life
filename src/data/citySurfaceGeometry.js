import {CITY_SURFACE_RECTS} from './citySurfaceMasks.js';
import {CITY_HOUSE_LAWNS} from './cityBuildingArt.js';
import {CITY_FOUNTAIN_ISLAND} from './cityFountainIsland.js';
export const CITY_NATIVE_SIZE={width:1280,height:896};
let cached;
// One shared contour for terrain, planting and road placement. Two world units
// per native pixel; no rectangular joins can expose grass through intersections.
export function citySurfaceMasks(){
 if(cached)return cached;
 const {width:w,height:h}=CITY_NATIVE_SIZE;cached={};
 for(const [name,rects]of Object.entries(CITY_SURFACE_RECTS)){
  const mask=cached[name]=new Uint8Array(w*h);
  for(const [x,y,rw,rh]of rects)for(let yy=y;yy<y+rh;yy++)mask.fill(1,yy*w+x,yy*w+x+rw);
 }
 // The current island is a complete transparent sprite. Release the old baked
 // grass contour back to plaza paving so no rectangular green underlay shows
 // around its authored oval edge.
 const oldIsland=cached.island,[wx,wy,ww,wh]=CITY_FOUNTAIN_ISLAND.bounds,[x0,y0,rw,rh]=[wx/2,wy/2,ww/2,wh/2],radius=(CITY_FOUNTAIN_ISLAND.cornerRadius||0)/2;
 for(let p=0;p<oldIsland.length;p++)if(oldIsland[p]){oldIsland[p]=0;cached.road[p]=1;cached.walk[p]=1;cached.placementWalk[p]=1;cached.cream[p]=0;cached.ramp[p]=0;}
 if(CITY_FOUNTAIN_ISLAND.surface!==false)for(let y=Math.floor(y0);y<Math.ceil(y0+rh);y++)for(let x=Math.floor(x0);x<Math.ceil(x0+rw);x++){
  const dx=Math.max(x0+radius-x,0,x-(x0+rw-radius-1)),dy=Math.max(y0+radius-y,0,y-(y0+rh-radius-1));if(dx*dx+dy*dy>radius*radius)continue;
  const p=y*w+x;oldIsland[p]=1;for(const name of ['road','walk','placementWalk','cream','ramp'])cached[name][p]=0;
 }
 // Residential parcels are grass. Preserve road pixels at parcel edges so the
 // city's connected street network remains intact.
 for(const [rx,ry,rw,rh]of Object.values(CITY_HOUSE_LAWNS))for(let y=Math.floor(ry/2);y<Math.ceil((ry+rh)/2);y++)for(let x=Math.floor(rx/2);x<Math.ceil((rx+rw)/2);x++){
  if(x<0||y<0||x>=w||y>=h)continue;const p=y*w+x;if(cached.road[p])continue;
  for(const name of ['walk','cream','placementWalk','ramp'])if(cached[name])cached[name][p]=0;
 }
 return cached;
}
export function cityMaskAt(name,x,y){const {width:w,height:h}=CITY_NATIVE_SIZE,xx=Math.floor(x/2),yy=Math.floor(y/2);return xx>=0&&yy>=0&&xx<w&&yy<h?!!citySurfaceMasks()[name][yy*w+xx]:false;}
export function cityMaskHits(name,[x,y,w,h],pad=0){
 for(let yy=Math.floor((y-pad)/2);yy<Math.ceil((y+h+pad)/2);yy++)for(let xx=Math.floor((x-pad)/2);xx<Math.ceil((x+w+pad)/2);xx++)if(cityMaskAt(name,xx*2,yy*2))return true;
 return false;
}
export const cityRoadRects=()=>CITY_SURFACE_RECTS.road.map(r=>r.map(v=>v*2));
