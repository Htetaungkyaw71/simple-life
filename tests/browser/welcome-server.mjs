// Isolated local QA origin; fixture/capture helpers never enter the runtime build.
import {createServer} from 'node:http';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {newState} from '../../src/systems/state.js';
const root=resolve(process.env.WELCOME_DIST||'dist'),port=43910,out='docs/verification/welcome-v042';
const saved=newState('girl');Object.assign(saved,{money:725,area:'home',position:{x:480,y:600},minute:600,starterSeedsClaimed:true});saved.story.intro='seen';
createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://127.0.0.1:'+port);
 if(url.pathname==='/responsive'){
  const width=Number(url.searchParams.get('width')),height=Number(url.searchParams.get('height'));
  if(![[390,844],[640,360],[568,256]].some(([w,h])=>w===width&&h===height))throw Error('Unsupported QA viewport');
  res.setHeader('Content-Type','text/html');res.end('<style>html,body{margin:0;background:#202b24}iframe{border:0;display:block}</style><iframe title="Responsive game test" src="/?qa&responsive=1" width="'+width+'" height="'+height+'"></iframe>');return;
 }
 if(url.pathname==='/capture'){
  res.setHeader('Content-Type','text/html');
  if(req.method==='POST'){let body='';for await(const chunk of req){body+=chunk;if(body.length>5000000)throw Error('Too large');}const f=new URLSearchParams(body),name=f.get('name');if(!/^(desktop|myanmar|portrait|landscape|live|live-myanmar|live-farm|live-mobile|motion-a|motion-b)\.jpg$/.test(name))throw Error('Invalid name');const bytes=Buffer.from(f.get('image'),'base64');if(bytes[0]!==255||bytes[1]!==216)throw Error('Not JPEG');await mkdir(out,{recursive:true});await writeFile(out+'/'+name,bytes);res.end('Saved '+name);return;}
  res.end('<form method=post><label>Name<input name=name></label><label>Screenshot<textarea name=image></textarea></label><button>Save local screenshot</button></form>');return;
 }
 const path=resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!path.startsWith(root+'/')){res.writeHead(403);res.end();return;}let data=await readFile(path);
 if(path===root+'/index.html'){
  let init='';const fixture=url.searchParams.get('fixture');
  if(fixture==='saved')init='if(sessionStorage.getItem("welcome-fixture")!=="saved"){localStorage.setItem("simple-life.save.v1",'+JSON.stringify(JSON.stringify(saved))+');sessionStorage.setItem("welcome-fixture","saved");}';
  if(fixture==='fresh')init='if(sessionStorage.getItem("welcome-fixture")!=="fresh"){localStorage.removeItem("simple-life.save.v1");localStorage.setItem("simple-life.language.v1","en");sessionStorage.setItem("welcome-fixture","fresh");}';
  data=Buffer.from(data.toString().replace('<head>','<head><script>'+init+';setInterval(()=>{try{const c=document.querySelector("canvas");if(c&&window.__simpleLife){c.setAttribute("data-qa-state",JSON.stringify(window.__simpleLife.snapshot()));c.setAttribute("data-qa-save",localStorage.getItem("simple-life.save.v1")||"");}}catch{}},100)</script>'));
 }
 res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json','.xml':'text/xml'})[extname(path)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 }catch{res.writeHead(404);res.end();}
}).listen(port,'127.0.0.1',()=>console.log('Welcome QA http://127.0.0.1:'+port+'/?qa&fixture=fresh'));
