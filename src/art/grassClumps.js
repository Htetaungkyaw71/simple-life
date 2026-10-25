import {groundHash} from './groundSurface.js';
import {groundShadow,shadowTexture} from './GroundShadow.js';

export const GRASS_CLUMP_FRAMES={wide:0,tall:1,small:2};
const FRAME_NAMES=['wide','tall','small'];
const MAX_PARTS=5;

function idSeed(id,x,y){
 let value=2166136261;
 for(const character of String(id)){value^=character.charCodeAt(0);value=Math.imul(value,16777619);}
 return (value^Math.imul(Math.round(x),73856093)^Math.imul(Math.round(y),19349663))>>>0;
}

// Deterministic dart throwing gives each saved grass record one 2-5 member
// cluster. Only its display children move; the original interaction point and
// save identity remain unchanged.
export function grassClusterLayout(id,x,y,preferred=0){
 const seed=idSeed(id,x,y),count=2+seed%4,mirror=seed&1?-1:1;
 // A fixed Poisson-disc stencil keeps every pair at least 11px apart. The
 // sprite silhouettes are wider than that, so the clumps still overlap while
 // their feet remain naturally separated. Seeded mirroring/order prevents a
 // repeated left-to-right rhythm without mutating any vegetation record.
 const stencil=[{dx:0,dy:0},{dx:-13*mirror,dy:-4},{dx:13*mirror,dy:-3},{dx:-8*mirror,dy:9},{dx:9*mirror,dy:10}];
 const points=[stencil[0],...stencil.slice(1).sort((a,b)=>groundHash(a.dx,seed,20261021)-groundHash(b.dx,seed,20261021))].slice(0,count);
 return points.map((point,index)=>({
  ...point,
  variant:(preferred+index+((seed>>>index)%3))%3,
  flipX:((seed>>>(index+7))&1)===1,
 }));
}

export function configureGrassCluster(scene,cluster,data,layout=grassClusterLayout(data.id,data.x,data.y,data.variant||0)){
 cluster.id=data.id;cluster.x=data.x;cluster.y=data.y;cluster.layout=layout;cluster.bend=0;
 for(const [index,part] of layout.entries()){
  const footX=Math.round(data.x+part.dx),footY=Math.round(data.y+part.dy),sprite=cluster.sprites[index],shadow=cluster.shadows[index];
  shadow.setTexture(shadowTexture(scene,FRAME_NAMES[part.variant]==='wide'?34:26,5)).setPosition(footX+2,footY-1).setAlpha(.25).setVisible(true);
  sprite.setFrame(part.variant).setPosition(footX,footY).setFlipX(part.flipX).setDepth(footY-1).setVisible(true);
  sprite.grassBase={x:footX,y:footY,angle:(index%3-1)*.35};sprite.setAngle(sprite.grassBase.angle);
 }
 return cluster;
}

export function createGrassCluster(scene,data,layout=grassClusterLayout(data.id,data.x,data.y,data.variant||0)){
 const sprites=[],shadows=[];
 for(const [index,part] of layout.entries()){
  const footX=Math.round(data.x+part.dx),footY=Math.round(data.y+part.dy);
  shadows.push(groundShadow(scene,footX+2,footY-1,FRAME_NAMES[part.variant]==='wide'?34:26,5,.25));
  const sprite=scene.add.image(footX,footY,'grassClumps',part.variant).setOrigin(.5,1).setScale(1).setFlipX(part.flipX).setDepth(footY-1);
  sprite.grassBase={x:footX,y:footY,angle:(index%3-1)*.35};sprite.setAngle(sprite.grassBase.angle);sprites.push(sprite);
 }
 return {id:data.id,x:data.x,y:data.y,layout,sprites,shadows,bend:0,all:[...shadows,...sprites]};
}

export function setGrassClusterVisible(cluster,visible){for(const object of cluster.all)object.setVisible(visible);return cluster;}

export function updateGrassCluster(cluster,bend){
 cluster.bend=bend;
 for(const [index,sprite] of cluster.sprites.entries()){
  const amount=bend*(2+(index%2));
  sprite.setPosition(Math.round(sprite.grassBase.x+amount),sprite.grassBase.y).setAngle(sprite.grassBase.angle+bend*4);
 }
}

export function destroyGrassCluster(cluster){for(const object of cluster.all)object.destroy();}

export function grassClusterFrame(cluster){
 const state=Math.abs(cluster.bend)>.18?(cluster.bend>0?'right':'left'):'rest';
 return `grass-clump-${FRAME_NAMES[cluster.layout[0]?.variant||0]}-${state}`;
}
