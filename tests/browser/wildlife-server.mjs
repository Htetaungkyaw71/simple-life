// Disposable animal QA saves, prepared before real native canvas input.
// Separate origin protects the player's save; never shipped by Vite.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {newState} from '../../src/systems/state.js';
import {ANIMAL_SPAWNS,SPECIES} from '../../src/data/wildlife.js';
import {nearestSafe} from '../../src/data/locations.js';
const root=resolve('dist'),port=Number(process.env.QA_PORT||4176);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json','.xml':'application/xml'};
createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://127.0.0.1:'+port),path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
  if(!path.startsWith(root+'/')){res.writeHead(403);res.end();return;}
  let data=await readFile(path);
  if(path===root+'/index.html'){
   const species=url.searchParams.get('species'),a=ANIMAL_SPAWNS.find(a=>a.species===species);
   if(a){
    const s=newState('girl'),active=s.forest.animals[a.id].position;Object.assign(s,{area:'forest',position:nearestSafe('forest',{x:active.x-(url.searchParams.has('near')?100:220),y:active.y+70}),minute:600,forestTutorialComplete:true,nightWarningSeen:true,selected:'axe'});s.story.intro='seen';
    if(url.searchParams.has('combat')){
     s.position=nearestSafe('forest',{x:active.x-40,y:active.y});s.forest.animals[a.id].health=1;
     for(const other of ANIMAL_SPAWNS)if(other.id!==a.id){s.forest.animals[other.id].health=0;s.forest.animals[other.id].defeatedDay=s.day;}
    }
    data=Buffer.from(data.toString().replace('<head>','<head><script>localStorage.setItem("simple-life.save.v1",'+JSON.stringify(JSON.stringify(s))+')</script>'));
   }
   data=Buffer.from(data.toString().replace('</head>','<script>setInterval(()=>{try{const c=document.querySelector("canvas");if(c&&window.__simpleLife)c.setAttribute("data-qa-state",JSON.stringify(window.__simpleLife.snapshot()))}catch{}},100)</script></head>'));
  }
  res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 }catch{res.writeHead(404);res.end();}
}).listen(port,'127.0.0.1',()=>console.log('Isolated animal QA at http://127.0.0.1:'+port+'/?qa&species=lion'));
