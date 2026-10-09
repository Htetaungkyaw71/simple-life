import {forestHabitat} from '../data/forestHabitats.js';
import {waterAt} from '../data/water.js';
import {FOREST_MAP} from '../data/forest.js';
// Original local synthesis: no recordings, remote audio, or additional runtime files.
export function ambienceProfile(state,nearWater=false){
 if(state?.area!=='forest')return null;
 const habitat=forestHabitat(state.position).id,night=state.minute<360||state.minute>=1200;
 const settings={snow:[.045,450,0],darkForest:[.028,800,.010],rainforest:[.023,1400,.017],meadow:[.020,1000,.006],easyRainforest:[.021,1200,.010],shrubland:[.030,950,.005],desert:[.045,600,0]}[habitat];
 return {habitat,night,wind:settings[0],filter:settings[1],insects:night?settings[2]:settings[2]*.3,river:nearWater?.048:0,birds:!night&&!['snow','desert'].includes(habitat)};
}
export class ForestAmbience {
 constructor({contextFactory=()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)(),random=Math.random,storage=null}={}){
  this.factory=contextFactory;this.random=random;this.storage=storage;this.muted=false;this.profile=null;this.active=false;this.chirp=0;this.voices=new Set();try{this.muted=storage?.getItem('simple-life.audio-muted.v1')==='true';}catch{};
 }
 bind(target=document){
  this.target=target;this.unlock=()=>this.resume();this.visibility=()=>{if(target.hidden)this.silence();};
  target.addEventListener('pointerdown',this.unlock,{capture:true});target.addEventListener('keydown',this.unlock,{capture:true});target.addEventListener('visibilitychange',this.visibility);
 }
 async resume(){
  if(this.muted)return;
  try{if(!this.context)this.create();await this.context.resume();}catch{this.unavailable=true;}
 }
 create(){
  const c=this.context=this.factory(),buffer=c.createBuffer(1,c.sampleRate*2,c.sampleRate),samples=buffer.getChannelData(0);
  let last=0;for(let i=0;i<samples.length;i++){last=(last+.04*(this.random()*2-1))/1.04;samples[i]=last*3.5;}
  this.master=c.createGain();this.master.gain.value=0;this.master.connect(c.destination);
  const layer=(type,frequency)=>{const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();source.buffer=buffer;source.loop=true;filter.type=type;filter.frequency.value=frequency;gain.gain.value=0;source.connect(filter);filter.connect(gain);gain.connect(this.master);source.start();return {source,filter,gain};};
  this.wind=layer('lowpass',1000);this.river=layer('highpass',500);this.insects=layer('bandpass',4200);
 }
 ramp(param,value,seconds=.8){const t=this.context.currentTime;param.cancelScheduledValues(t);param.setTargetAtTime(value,t,seconds);}
 silence(){this.active=false;this.wasPlaying=false;if(this.context)this.ramp(this.master.gain,0,.08);}
 toggle(){this.muted=!this.muted;try{this.storage?.setItem('simple-life.audio-muted.v1',String(this.muted));}catch{}if(this.muted)this.silence();else this.resume();return this.muted;}
 update(state,playing,delta){
  if(!playing||state?.area!=='forest'||this.muted){this.silence();return;}
  const nearWater=[[0,0],[64,0],[-64,0],[0,64],[0,-64]].some(([x,y])=>waterAt(FOREST_MAP,{x:state.position.x+x,y:state.position.y+y},false));
  const profile=ambienceProfile(state,nearWater);this.profile=profile;this.active=true;
  if(!this.context||this.context.state!=='running')return;
  const key=JSON.stringify(profile);if(key!==this.lastProfile||!this.wasPlaying){
   this.ramp(this.master.gain,.7);this.ramp(this.wind.gain.gain,profile.wind);this.ramp(this.wind.filter.frequency,profile.filter);
   this.ramp(this.river.gain.gain,profile.river);this.ramp(this.insects.gain.gain,profile.insects);this.lastProfile=key;
  }
  this.wasPlaying=true;this.chirp-=Math.min(100,Math.max(0,delta));
  if(profile.birds&&this.chirp<=0){this.chirp=3200+this.random()*4200;this.bird();}
 }
 bird(){
  const c=this.context,t=c.currentTime,osc=c.createOscillator(),gain=c.createGain();osc.type='sine';osc.frequency.setValueAtTime(1800+this.random()*900,t);osc.frequency.exponentialRampToValueAtTime(3400,t+.09);osc.frequency.exponentialRampToValueAtTime(2000,t+.19);
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.012,t+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+.22);osc.connect(gain);gain.connect(this.master);this.voices.add(osc);osc.onended=()=>{osc.disconnect();gain.disconnect();this.voices.delete(osc);};osc.start(t);osc.stop(t+.25);
 }
 snapshot(){return {muted:this.muted,active:this.active,context:this.context?.state||'locked',profile:this.profile,voices:this.voices.size,unavailable:!!this.unavailable};}
 destroy(){if(this.target){this.target.removeEventListener('pointerdown',this.unlock,{capture:true});this.target.removeEventListener('keydown',this.unlock,{capture:true});this.target.removeEventListener('visibilitychange',this.visibility);}for(const layer of [this.wind,this.river,this.insects])layer?.source.stop();for(const voice of this.voices)voice.stop();this.context?.close();}
}
