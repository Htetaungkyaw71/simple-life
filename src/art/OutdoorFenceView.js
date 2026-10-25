// Join existing 32-unit fence cells visually; their shared collision data stays in mapLayouts.
export function outdoorFenceRuns(props){
 const groups=new Map();
 for(const p of props.filter(p=>p.fence)){
  const vertical=p.name==='fence-v',key=(vertical?'v:':'h:')+(vertical?p.x:p.y);
  if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p);
 }
 const runs=[];
 for(const cells of groups.values()){
  const vertical=cells[0].name==='fence-v';cells.sort((a,b)=>vertical?a.y-b.y:a.x-b.x);
  let run=null;
  for(const p of cells){const n=vertical?p.y:p.x;if(!run||n!==run.end){run={x:p.x,y:p.y,vertical,length:0,end:n};runs.push(run);}run.length+=32;run.end=n+32;}
 }
 return runs;
}
export function drawOutdoorFences(scene,props){
 for(const r of outdoorFenceRuns(props)){
  const direction=r.vertical?'v':'h',start=r.vertical?28:12,end=start;
  if(r.length<start+end){scene.add.image(r.x,r.y,'town',r.vertical?'cedar-fence-v':'cedar-fence').setOrigin(0).setDepth(r.y+32);continue;}
  const image=(part,x,y,depth)=>scene.add.image(x,y,'town','outdoor-fence-'+direction+'-'+part).setOrigin(0).setDepth(depth);
  const depth=r.y+(r.vertical?r.length:32);
  image('start',r.x,r.y,r.y+32);
  // Atlas subframes must use cropped Images: TileSprite can repeat unrelated atlas pixels.
  const step=r.vertical?72:104,length=r.length-start-end;
  for(let n=0;n<length;n+=step){const size=Math.min(step,length-n);image('rail',r.x+(r.vertical?0:start+n),r.y+(r.vertical?start+n:0),r.vertical?r.y+start+n+size:depth).setCrop(0,0,r.vertical?32:size,r.vertical?size:32);}
  image('end',r.x+(r.vertical?0:r.length-end),r.y+(r.vertical?r.length-end:0),depth);
 }
}
