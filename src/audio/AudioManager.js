import {TRACKS,EFFECTS,AUDIO_FILES,renderEffect,renderAmbience} from './score.js';
import {forestHabitat} from '../data/forestHabitats.js';
import {waterAt} from '../data/water.js';
import {FOREST_MAP} from '../data/forest.js';
import {ROOM} from '../data/interior.js';
import {CITY} from '../data/city.js';
export const AUDIO_KEY='simple-life.audio.v2';
export const DEFAULT_AUDIO={master:.5,music:.5,ambience:.25,effects:.75,muted:false};
const clamp=v=>Math.max(0,Math.min(1,v));
export function loadPreferences(storage){
 const p={...DEFAULT_AUDIO};try{const raw=JSON.parse(storage?.getItem(AUDIO_KEY)||'null');if(raw&&typeof raw==='object'){for(const bus of ['master','music','ambience','effects'])if(Number.isFinite(raw[bus]))p[bus]=clamp(raw[bus]);p.muted=raw.muted===true;}else p.muted=storage?.getItem('simple-life.audio-muted.v1')==='true';}catch{try{p.muted=storage?.getItem('simple-life.audio-muted.v1')==='true';}catch{}}return p;
}
export function nightMix(minute){if(minute<300||minute>=1200)return 1;if(minute<420)return (420-minute)/120;return clamp((minute-1050)/150);}
export function audioProfile(s){
 if(!s)return {music:{title:1},layers:{},flavour:'title',night:0};
 const night=nightMix(s.minute),day=s.area==='city'?'city':s.area==='forest'?'forest':'farm';
 let water=0,fire=0,flavour=s.area;
 if(s.area==='forest'){
  flavour=forestHabitat(s.position).id;
  for(const r of [0,64,128,192,256])if([0,1,2,3,4,5,6,7].some(i=>waterAt(FOREST_MAP,{x:s.position.x+Math.cos(i*Math.PI/4)*r,y:s.position.y+Math.sin(i*Math.PI/4)*r},false))){water=1-r/320;break;}
 }else if(s.area==='city'){const fountain=CITY.props.find(p=>p.animated==='fountain');water=clamp(1-Math.hypot(s.position.x-fountain.x-80,s.position.y-fountain.y-90)/420);}
 if(s.area==='interior')fire=clamp(1-Math.hypot(s.position.x-ROOM.width/2+64,s.position.y-100)/160);
 return {music:{[day]:1-night,night},layers:s.area==='interior'?{room:1}: {wind:s.area==='forest'?.5+night*.15:.28,water:water*.55},flavour,night,fire};
}
const aliases={'shop:open':'ui:open','shop:close':'ui:close','farming:chop':'tree:hit','farming:gatherGrass':'wood:pickup','farming:placeGrass':'furniture:place'};
export class AudioManager {
 constructor({contextFactory=()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)(),storage=null,loader=null,random=Math.random}={}){
  this.factory=contextFactory;this.storage=storage;this.preferences=loadPreferences(storage);this.random=random;this.loader=loader|| (async(id,c)=>{const response=await fetch(new URL(AUDIO_FILES[id],new URL(import.meta.env?.BASE_URL||'./',globalThis.location.href)));if(!response.ok)throw Error('Audio '+id+' unavailable');return c.decodeAudioData(await response.arrayBuffer());});
  this.loops=new Map();this.voices=new Set();this.queued=[];this.buffers=new Map();this.pending=new Map();this.lastEffects=new Map();this.unlocked=false;this.focused=true;this.destroyed=false;this.desired=audioProfile(null);this.world=false;this.paused=false;this.serial=0;this.nextAmbient=0;this.failures=[];
 }
 get muted(){return this.preferences.muted;}
 bind(target=document,win=window){
  this.target=target;this.win=win;this.unlock=()=>this.resume();this.visibility=()=>this.setFocus(!target.hidden&&(!target.hasFocus||target.hasFocus()));this.blur=()=>this.setFocus(false);this.focus=()=>this.setFocus(!target.hidden);this.hide=()=>this.setFocus(false);this.show=()=>this.setFocus(!target.hidden);
  target.addEventListener('pointerdown',this.unlock,{capture:true});target.addEventListener('keydown',this.unlock,{capture:true});target.addEventListener('visibilitychange',this.visibility);win.addEventListener('blur',this.blur);win.addEventListener('focus',this.focus);win.addEventListener('pagehide',this.hide);win.addEventListener('pageshow',this.show);
 }
 create(){
  const c=this.context=this.factory();this.buses={};this.master=c.createGain();this.gate=c.createGain();this.limiter=c.createDynamicsCompressor();this.limiter.threshold.value=-8;this.limiter.knee.value=8;this.limiter.ratio.value=8;this.limiter.attack.value=.003;this.limiter.release.value=.15;
  this.master.connect(this.gate);this.gate.connect(this.limiter);this.limiter.connect(c.destination);this.gate.gain.value=0;
  for(const bus of ['music','ambience','effects']){const n=c.createGain();n.connect(this.master);this.buses[bus]=n;}
  this.applyPreferences();
 }
 async resume(){
  if(this.destroyed)return;this.unlocked=true;
  try{if(!this.context)this.create();await this.reconcileFocus();if(this.focused&&!this.muted)this.sync();}catch{this.unavailable=true;}
 }
 async reconcileFocus(){
  // Serialize suspend/resume. A quick blur/focus cannot leave a late suspend winning.
  this.focusTask=(this.focusTask||Promise.resolve()).catch(()=>{}).then(async()=>{if(this.destroyed||!this.context)return;const c=this.context;if(this.focused){await c.resume();if(this.focused)this.ramp(this.gate.gain,this.muted?0:1,.2);}else{this.ramp(this.gate.gain,0,.05);await c.suspend();}});return this.focusTask;
 }
 setFocus(focused){this.focused=focused;if(this.context)this.reconcileFocus().catch(()=>{this.unavailable=true;});}
 ramp(param,value,seconds=.8){const t=this.context.currentTime;if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(t);else {param.cancelScheduledValues(t);param.setValueAtTime(param.value,t);}param.linearRampToValueAtTime(value,t+seconds);}
 applyPreferences(){if(!this.context)return;this.ramp(this.master.gain,this.preferences.master,.12);for(const bus of ['music','ambience','effects'])this.ramp(this.buses[bus].gain,this.preferences[bus],.12);this.ramp(this.gate.gain,this.muted||!this.focused?0:1,.12);}
 setVolume(bus,value){if(!['master','music','ambience','effects'].includes(bus)||!Number.isFinite(value))return;this.preferences[bus]=clamp(value);this.persist();this.applyPreferences();}
 toggle(){this.preferences.muted=!this.muted;this.persist();this.applyPreferences();if(!this.muted)this.resume();return this.muted;}
 persist(){try{this.storage?.setItem(AUDIO_KEY,JSON.stringify(this.preferences));}catch{this.preferenceSaveUnavailable=true;}}
 silence(){this.setFocus(false);}
 bufferFor(id){
  if(this.failures.includes(id))return Promise.resolve(null);if(this.buffers.has(id))return Promise.resolve(this.buffers.get(id));if(this.pending.has(id))return this.pending.get(id);
  const pending=this.loader(id,this.context).then(buffer=>{if(!this.destroyed)this.buffers.set(id,buffer);return buffer;}).catch(()=>{if(!this.failures.includes(id))this.failures.push(id);return null;}).finally(()=>this.pending.delete(id));this.pending.set(id,pending);return pending;
 }
 synthBuffer(id,ambient=false){const key=(ambient?'ambient:':'fx:')+id;if(!this.buffers.has(key)){const samples=ambient?renderAmbience(id):renderEffect(id),b=this.context.createBuffer(1,samples.length,22050);b.getChannelData(0).set(samples);this.buffers.set(key,b);}return this.buffers.get(key);}
 source(buffer,bus,loop=false){const source=this.context.createBufferSource(),gain=this.context.createGain();source.buffer=buffer;source.loop=loop;gain.gain.value=0;source.connect(gain);gain.connect(this.buses[bus]);return {source,gain,bus,stopped:false};}
 cleanup(v){if(v.stopped)return;v.stopped=true;v.source.onended=null;try{v.source.stop();}catch{}v.source.disconnect();v.gain.disconnect();this.voices.delete(v);}
 desiredGain(key){const [bus,id]=key.split(':');const duck=this.paused&&this.world?(bus==='music'?.35:.08):1,ending=this.cueUntil>this.context.currentTime&&this.world?.15:1;return (bus==='music'?this.desired.music[id]||0:this.desired.layers[id]||0)*duck*(bus==='music'?ending:1);}
 ensureLoop(key){
  if(this.loops.has(key)||this.loadingLoops?.has(key))return;const [bus,id]=key.split(':');this.loadingLoops??=new Set();this.loadingLoops.add(key);
  const request=bus==='music'?this.bufferFor(id):Promise.resolve(this.synthBuffer(id,true));
  request.then(buffer=>{this.loadingLoops.delete(key);if(!buffer||this.destroyed||!this.context||!this.desiredGain(key)||this.muted)return;const v=this.source(buffer,bus,true);v.id=id;v.level=-1;this.loops.set(key,v);v.source.start();this.sync();});
 }
 sync(){
  if(!this.context||!this.unlocked||this.destroyed||this.muted)return;
  const desired=[...Object.keys(this.desired.music).map(id=>'music:'+id),...Object.keys(this.desired.layers).map(id=>'ambience:'+id)];
  for(const key of desired)if(this.desiredGain(key)>.001)this.ensureLoop(key);
  for(const [key,v]of this.loops){const value=this.desiredGain(key);if(Math.abs(v.level-value)>.01){this.ramp(v.gain.gain,value,key.startsWith('music:')?2.5:1.8);v.level=value;v.retireAt=value<=.001?this.context.currentTime+2.6:null;}}
 }
 update(state,playing=true,delta=0,{paused=!playing}={}){
  this.world=!!state;this.paused=paused;this.desired=audioProfile(state);
  if(!this.context)return;const t=this.context.currentTime;
  for(const [key,v]of this.loops)if(v.retireAt&&t>=v.retireAt){this.cleanup(v);this.loops.delete(key);}
  if(this.cueUntil&&t>=this.cueUntil){this.cueUntil=0;this.sync();}
  this.sync();
  for(const q of this.queued.splice(0))if(t<q.expires&&!this.effect(q.raw,q.bus,true))this.queued.push(q);
  if(state&&playing&&this.focused&&!this.muted&&t>=this.nextAmbient){this.nextAmbient=t+6+this.random()*7;const p=this.desired;
   const id=state.area==='interior'?(p.fire>.15?'fire':'wood'):state.area==='city'?'step':p.night>.5?'cricket':p.flavour==='desert'||p.flavour==='snow'?'animal':'bird';this.effect('ambient:'+id,'ambience');
  }
 }
 effect(raw,bus='effects',retry=false){
  const id=aliases[raw]||raw;if(!EFFECTS[id]||!this.context||!this.unlocked||this.muted||!this.focused||this.context.state!=='running'||this.destroyed)return false;
  const t=this.context.currentTime;if(t-(this.lastEffects.get(id)??-100)<.085)return false;
  if(this.voices.size>=6||t===this.lastFrame&&this.frameEffects>=2){if(!retry&&['project:complete','request:complete','keepsake:collect','wood:pickup','food:health','food:energy'].includes(id)&&this.queued.length<4&&!this.queued.some(q=>q.raw===raw))this.queued.push({raw,bus,expires:t+.25});return false;}
  if(t!==this.lastFrame){this.lastFrame=t;this.frameEffects=0;}this.frameEffects++;this.lastEffects.set(id,t);
  const v=this.source(this.synthBuffer(id),bus);v.gain.gain.value=.85+this.random()*.1;v.source.playbackRate.value=.97+this.random()*.06;this.voices.add(v);v.source.onended=()=>this.cleanup(v);v.source.start();return true;
 }
 async completion(){
  if(!this.context||this.muted||!this.focused)return;const token=this.serial,buffer=await this.bufferFor('completion');if(!buffer||this.destroyed||token!==this.serial||!this.world)return;
  const v=this.source(buffer,'music');v.gain.gain.value=1;this.voices.add(v);v.source.onended=()=>this.cleanup(v);v.source.start();this.cueUntil=this.context.currentTime+TRACKS.completion.seconds;this.sync();
 }
 startWorld(state){this.queued=[];this.serial++;this.cueUntil=0;for(const v of [...this.voices])this.cleanup(v);this.world=true;this.paused=false;this.desired=audioProfile(state);this.sync();}
 stopWorld(){this.queued=[];this.serial++;this.cueUntil=0;for(const [key,v]of this.loops){this.cleanup(v);this.loops.delete(key);}for(const v of [...this.voices])this.cleanup(v);this.world=false;this.desired=audioProfile(null);this.sync();}
 snapshot(){return {muted:this.muted,preferences:{...this.preferences},context:this.context?.state||'locked',unlocked:this.unlocked,focused:this.focused,profile:this.desired,loops:[...this.loops].map(([key,v])=>({key,gain:v.level,retiring:!!v.retireAt})),voices:this.voices.size,pending:this.pending.size,buffers:this.buffers.size,failures:[...this.failures],unavailable:!!this.unavailable};}
 destroy(){if(this.destroyed)return;this.destroyed=true;this.queued=[];if(this.target){this.target.removeEventListener('pointerdown',this.unlock,{capture:true});this.target.removeEventListener('keydown',this.unlock,{capture:true});this.target.removeEventListener('visibilitychange',this.visibility);for(const [event,fn]of [['blur',this.blur],['focus',this.focus],['pagehide',this.hide],['pageshow',this.show]])this.win.removeEventListener(event,fn);}for(const v of this.loops.values())this.cleanup(v);for(const v of [...this.voices])this.cleanup(v);this.loops.clear();this.buffers.clear();for(const n of [this.master,this.gate,this.limiter,...Object.values(this.buses||{})])n?.disconnect();this.context?.close();}
}
