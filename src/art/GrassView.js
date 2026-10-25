import {vegetationState} from '../data/vegetation.js';
import {settlementCovers} from './SettlementView.js';
import {configureGrassCluster,createGrassCluster,grassClusterFrame,grassClusterLayout,setGrassClusterVisible,updateGrassCluster} from './grassClumps.js';
// Only nearby grass owns Phaser sprites. Distant patches remain data, not display objects.
export class GrassView {
 constructor(scene,map){this.scene=scene;this.active=new Map();this.pool=new Map();this.buckets=new Map();this.map=map;this.refresh();
 }
 refresh(){const map=this.map,v=vegetationState(this.scene.app.state);this.buckets.clear();this.total=(map.grass||[]).filter(g=>!v?.grass.includes(g.id)).length+(v?.placed.length||0);
  for(const g of [...(map.grass||[]).filter(g=>!v?.grass.includes(g.id)),...(v?.placed||[])]){if(settlementCovers(this.scene.app.state,this.scene.worldArea,g.x,g.y))continue;const k=Math.floor(g.x/256)+':'+Math.floor(g.y/256);if(!this.buckets.has(k))this.buckets.set(k,[]);this.buckets.get(k).push(g);}
 }
 update(delta,p,airborne=false){
  const v=this.scene.cameras.main.worldView,wanted=new Map();
  for(let y=Math.floor((v.y-80)/256);y<=Math.floor((v.bottom+80)/256);y++)for(let x=Math.floor((v.x-80)/256);x<=Math.floor((v.right+80)/256);x++)for(const g of this.buckets.get(x+':'+y)||[])if(g.x>v.x-64&&g.x<v.right+64&&g.y>v.y-32&&g.y<v.bottom+64)wanted.set(g.id,g);
  for(const [id,g]of this.active)if(!wanted.has(id)){setGrassClusterVisible(g.cluster,false);if(!this.pool.has(g.cluster.sprites.length))this.pool.set(g.cluster.sprites.length,[]);this.pool.get(g.cluster.sprites.length).push(g.cluster);this.active.delete(id);}
  for(const [id,data]of wanted){let g=this.active.get(id);if(!g){const layout=grassClusterLayout(data.id,data.x,data.y,data.variant||0),pooled=this.pool.get(layout.length)?.pop(),cluster=pooled?configureGrassCluster(this.scene,pooled,data,layout):createGrassCluster(this.scene,data,layout);g={...data,cluster,bend:0};this.active.set(id,g);}
   const touching=!airborne&&Math.abs(p.x-g.x)<26&&Math.abs(p.y-g.y)<20;
   const target=touching?(p.x<g.x?1:-1):0;g.bend+=(target-g.bend)*Math.min(1,delta/130);
   updateGrassCluster(g.cluster,g.bend);
  }
  for(const g of this.scene.touchGrass||[]){if(!g.sprite?.active)continue;
   const touching=!airborne&&Math.abs(p.x-g.x)<26&&Math.abs(p.y-g.y)<20;
   const target=touching?(p.x<g.x?1:-1):0;g.bend+=(target-g.bend)*Math.min(1,delta/130);
   if(g.cluster)updateGrassCluster(g.cluster,g.bend);else {const frame=Math.abs(g.bend)>.18?(g.bend>0?'snapper-grass-bend-right':'snapper-grass-bend-left'):'snapper-grass';if(g.sprite.frame.name!==frame)g.sprite.setFrame(frame);}
  }
 }
 snapshot(){return {total:this.total,visible:this.active.size,bending:[...this.active.values()].filter(g=>Math.abs(g.bend)>.18).map(g=>({x:g.x,y:g.y,frame:grassClusterFrame(g.cluster)})),touchBending:(this.scene.touchGrass||[]).filter(g=>g.sprite?.active&&Math.abs(g.bend)>.18).map(g=>({x:g.x,y:g.y,frame:g.cluster?grassClusterFrame(g.cluster):g.sprite.frame.name}))};}
}
