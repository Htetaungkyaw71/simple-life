// Disposable QA fixture origin, never part of the runtime build or user's save.
// Use with the app browser to prepare starting saves, then real inputs test play.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {newState} from '../../src/systems/state.js';
const root=resolve('dist'),port=Number(process.env.QA_PORT||4176);
const places={homewood:[640,4848],river:[2370,1900],bank:[2048,994],palms:[640,3872],willows:[1920,4896],bridge:[2368,1744],bridgeApproach:[2220,1744],oldTerrace:[224,5020],formerFall:[160,3340]};
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json','.xml':'text/xml'};
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1:'+port),path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!path.startsWith(root+'/')){res.writeHead(403);res.end();return;}
  let data=await readFile(path);const place=places[url.searchParams.get('fixture')];
  if(path===root+'/index.html'&&place){
   const s=newState('girl');Object.assign(s,{area:'forest',position:{x:place[0],y:place[1]},minute:url.searchParams.has('night')?1320:600,forestTutorialComplete:true,nightWarningSeen:true,ownsClub:true,clubEquipped:true});
   data=Buffer.from(data.toString().replace('<head>','<head><script>localStorage.setItem("simple-life.save.v1",'+JSON.stringify(JSON.stringify(s))+')</script>'));
  }
  if(path===root+'/index.html')data=Buffer.from(data.toString().replace('</head>','<script>setInterval(()=>{try{const c=document.querySelector("canvas");if(c&&window.__simpleLife)c.setAttribute("data-qa-state",JSON.stringify(window.__simpleLife.snapshot()))}catch{}},100)</script></head>'));
  res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 }catch{res.writeHead(404);res.end();}
}).listen(port,'127.0.0.1',()=>console.log('Disposable forest QA: http://127.0.0.1:'+port+'/?qa&fixture=river'));
