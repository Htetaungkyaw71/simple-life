import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {newState} from '../../src/systems/state.js';
import {PEOPLE,FARMER} from '../../src/data/appearance.js';
import {FARMER_HANDS} from '../../src/data/farmerHands.js';
import {GIRL_HANDS} from '../../src/data/girlHands.js';
import {TESTING_COIN_GRANT} from '../../src/systems/testingCredit.js';
const {chromium}=await import('/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
const url=process.env.GAME_URL||'http://127.0.0.1:4196/',out=process.env.QA_OUT||'/private/tmp/simple-life-character-motion';await mkdir(out,{recursive:true});
const character=process.env.QA_CHARACTER==='girl'?'girl':'boy',sourceHands=character==='girl'?GIRL_HANDS:FARMER_HANDS;
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true}),records=[];
try{for(const [width,height,lang]of [[1280,720,'en'],[844,390,'mm']]){
 const ctx=await browser.newContext({viewport:{width,height},hasTouch:width<1000}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(['warning','error'].includes(m.type()))errors.push(m.text());});
 const snap=()=>p.evaluate(()=>{const s=window.__simpleLife.snapshot();return {state:s.state,controls:s.controls,player:s.player,residents:s.residents,rendering:s.rendering,camera:s.camera};});
 const click=async id=>{const c=(await snap()).controls.find(c=>c.id===id);assert.ok(c&&!c.disabled,id);await(width<1000?p.touchscreen.tap(c.x+c.w/2,c.y+c.h/2):p.mouse.click(c.x+c.w/2,c.y+c.h/2));await p.waitForTimeout(200);};
 const fixture=(area,position)=>{const s=newState(character);Object.assign(s,{area,position,minute:600,money:1000,testingCoinGrant:TESTING_COIN_GRANT,starterSeedsClaimed:true,hasVisitedFarm:true,forestTutorialComplete:true,nightWarningSeen:true,selected:'water'});s.story.intro='seen';return s;};
 const start=async s=>{const u=new URL(url);u.searchParams.set('qa','');await p.goto(u.href);await p.waitForFunction(()=>{try{return !!window.__simpleLife?.snapshot().controls.length;}catch{return false;}});await p.evaluate(s=>localStorage.setItem('simple-life.save.v1',JSON.stringify(s)),s);await click('language-'+lang);await click('Continue');};
 try{
  await start(fixture('home',{x:480,y:600}));assert.equal((await snap()).player.nativeHeight,FARMER.height);
  // Test pixels themselves, not merely a changing animation index. Both arm
  // and foot regions must change; all four actual source phases are retained (the artist repeats one back pose for Rowan).
  const art=await p.evaluate(async({w,h,rig})=>{
   const load=async path=>{const im=new Image();im.src=new URL(path,location.href);await im.decode();const c=new OffscreenCanvas(im.width,im.height),g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);return g;};
   const appearance=await load('/assets/pixel/processed/appearance.png'),town=await load('/assets/pixel/processed/town.png'),meta=await(await fetch('/assets/pixel/processed/town.json')).json(),rows=[];
   const check=(id,row,frames)=>{
    const changes=(a,b,x0,y0,x1,y1)=>{let count=0;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=(y*w+x)*4;if(a.slice(i,i+4).some((v,k)=>v!==b[i+k]))count++;}return count;};
    const a=frames[0],arms=Math.max(...frames.slice(1).map(b=>changes(a,b,0,Math.floor(h*.4),w,Math.floor(h*.8)))),feet=Math.max(...frames.slice(1).map(b=>changes(a,b,0,Math.floor(h*.8),w,h)));
    const unique=new Set(frames.map(f=>Array.from(f).join(','))).size;
    const ink=frames.map(f=>Array.from(f).filter((v,i)=>i%4===3&&v>0).length);
    return {id,row,arms,feet,unique,ink};
   };
   for(let style=0;style<20;style++)for(let row=0;row<4;row++){const frames=[];for(let f=0;f<rig.runFrames;f++){const index=style*rig.frames+row*rig.columns+rig.runStart+f;frames.push(appearance.getImageData((index%40)*w,Math.floor(index/40)*h,w,h).data);}rows.push(check('style-'+style,row,frames));}
   for(let npc=0;npc<8;npc++)for(const [row,dir]of ['down','up','left','right'].entries()){const frames=[];for(let f=1;f<=rig.walkFrames;f++){const r=meta.frames[`town-person-${npc}-${dir}-${f}`].frame;frames.push(town.getImageData(r.x,r.y,w,h).data);}rows.push(check('npc-'+npc,row,frames));}
   return rows;
  },{w:PEOPLE.width,h:PEOPLE.height,rig:PEOPLE});
  for(const v of art){assert.ok(v.arms>=2,JSON.stringify(v));assert.ok(v.feet>=2,JSON.stringify(v));assert.ok(v.unique>=(v.id==='npc-4'&&v.row===1?3:4),JSON.stringify(v));assert.ok(v.ink.every(n=>n>=100),JSON.stringify(v));}
  const directions=[];
  for(const [dir,key,dx,dy]of [['left','a',-1,0],['right','d',1,0],['up','w',0,-1],['down','s',0,1]]){
   await start(fixture('home',{x:480,y:800}));
   const before=(await snap()).state.position,frames=new Set();let cdp;
   if(width>=1000)await p.keyboard.down(key);else{const c=(await snap()).controls.find(c=>c.id==='move-stick');cdp=await ctx.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:c.x+c.w*(.5+dx*.3),y:c.y+c.h*(.5+dy*.3)}]});}
   try{
    const observed=await p.evaluate(rig=>new Promise(resolve=>{const frames=[],until=performance.now()+800;function collect(){const s=window.__simpleLife.snapshot();frames.push({frame:Number(s.player.frame)%rig.columns,direction:s.player.direction,position:s.state.position,tool:s.heldTool});if(performance.now()>=until)resolve(frames);else requestAnimationFrame(collect);}requestAnimationFrame(collect);}),FARMER);
    for(const sample of observed)if(sample.frame>=FARMER.runStart&&sample.frame<FARMER.runStart+FARMER.runFrames){frames.add(sample.frame);assert.equal(sample.direction,dir);assert.ok(sample.tool.visible);
     const [hx,hy]=sourceHands[dir][sample.frame];assert.ok(Math.abs(sample.tool.x-Math.round(sample.position.x)-hx)<=1);assert.ok(Math.abs(sample.tool.y-Math.round(sample.position.y)-hy)<=1);}

    await p.screenshot({path:`${out}/${width}-${dir}-jogging.png`});
   }finally{if(cdp){await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}else await p.keyboard.up(key);}

   const after=(await snap()).state.position;assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>10);for(const f of Array.from({length:FARMER.runFrames},(_,i)=>FARMER.runStart+i))assert.ok(frames.has(f),JSON.stringify({dir,frames:[...frames]}));await p.waitForTimeout(100);assert.ok(Number((await snap()).player.frame)%FARMER.columns<FARMER.runStart);directions.push({dir,frames:[...frames]});
  }
  await start(fixture('city',{x:700,y:700}));await p.waitForTimeout(1600);const npcFrames=new Set(),positions=[];
  for(let i=0;i<16;i++){await p.waitForTimeout(80);const n=(await snap()).residents.find(n=>n.id==='city-june');assert.ok(n.visible&&n.moving);npcFrames.add(n.frame);positions.push([n.x,n.y]);}
  assert.equal(npcFrames.size,PEOPLE.walkFrames);assert.ok(positions.at(-1)[0]>positions[0][0]);assert.deepEqual(errors,[]);
  await p.screenshot({path:out+'/'+width+'-town-motion.png'});records.push({character,width,height,lang,result:'PASS',art,directions,npcFrames:[...npcFrames],errors});console.log('PASS '+character+' character motion '+width);
 }finally{await ctx.close();}
}await writeFile(out+'/motion-checks.json',JSON.stringify({url,records},null,2)+'\n');}finally{await browser.close();}
