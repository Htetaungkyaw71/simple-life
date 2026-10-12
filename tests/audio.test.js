import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AudioManager,AUDIO_KEY,audioProfile,nightMix,loadPreferences} from '../src/audio/AudioManager.js';
import {TRACKS,EFFECTS,renderEffect,renderAmbience} from '../src/audio/score.js';
import {SAMPLE_EFFECTS,COZY_FILES} from '../src/audio/cozy.js';
function context(){
 const nodes=new Set(),param=()=>({value:0,cancelScheduledValues(){},setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v){this.value=v;}});
 const node=()=>{const n={gain:param(),playbackRate:param(),threshold:param(),knee:param(),ratio:param(),attack:param(),release:param(),connect(){},disconnect(){nodes.delete(n);},start(time=0){this.started=true;this.startTime=time;},stop(){this.stopped=true;}};nodes.add(n);return n;};
 return {nodes,state:'suspended',currentTime:0,destination:{},createGain:node,createDynamicsCompressor:node,createBufferSource:node,createBuffer:(channels,size)=>({duration:size/22050,getChannelData:()=>new Float32Array(size)}),resume(){this.state='running';return Promise.resolve();},suspend(){this.state='suspended';return Promise.resolve();},close(){this.state='closed';return Promise.resolve();}};
}
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),m};};
const settle=async()=>{for(let i=0;i<10;i++)await Promise.resolve();};
const create=()=>{const c=context(),p=storage();let factories=0;const audio=new AudioManager({contextFactory:()=>{factories++;return c;},storage:p,loader:async()=>({duration:96}),random:()=>.5});return {audio,c,p,count:()=>factories};};
const state=(area='home',minute=720)=>({area,minute,position:{x:5120,y:4848},roomSize:{width:624}});
test('autoplay stays locked until interaction; one context survives repeated start/continue/unlock',async()=>{const {audio,c,count}=create();audio.update(state());assert.equal(count(),0);assert.equal(audio.effect('ui:confirm'),false);await Promise.all([audio.resume(),audio.resume(),audio.resume()]);await settle();assert.equal(count(),1);assert.equal(c.state,'running');audio.stopWorld();await audio.resume();audio.update(state('farm'));await settle();assert.equal(count(),1);audio.destroy();});
test('title music stops immediately on gameplay; all locations retain nature without music',async()=>{
 const {audio,c}=create();await audio.resume();await settle();const title=audio.loops.get('music:cozyMusic').source;
 audio.startWorld(state());await settle();assert.equal(title.stopped,true);assert.equal(audio.loops.has('music:cozyMusic'),false);
 for(const area of ['home','farm','interior','city','forest']){audio.update(state(area));await settle();c.currentTime+=3;audio.update(state(area));assert.deepEqual(audio.desired.music,{});assert.ok([...audio.loops.keys()].every(k=>k.startsWith('ambience:')));}
 audio.stopWorld();await settle();assert.ok(audio.loops.has('music:cozyMusic'));audio.destroy();assert.equal(c.nodes.size,0);
});
test('evening and dawn blend gradually, with map ambience independent of the music',()=>{assert.equal(nightMix(1020),0);assert.equal(nightMix(1125),.5);assert.equal(nightMix(1200),1);assert.equal(nightMix(360),.5);const day=audioProfile(state('forest',720)),night=audioProfile(state('forest',1320));assert.deepEqual(day.music,{});assert.deepEqual(night.music,{});assert.equal(day.layers.forestDay,1);assert.equal(night.layers.night,1);assert.equal(night.layers.forestDay,0);assert.deepEqual(audioProfile(null).layers,{});});
test('Pause ducks nature ambience and resumes the same source, without gameplay music',async()=>{
 const {audio}=create();audio.update(state('forest'));await audio.resume();await settle();const source=audio.loops.get('ambience:forestDay').source;
 audio.update(state('forest'),false,0,{paused:true});assert.equal(audio.loops.get('ambience:forestDay').level,.08);
 audio.update(state('forest'),true,0,{paused:false});assert.equal(audio.loops.get('ambience:forestDay').source,source);assert.equal(audio.loops.get('ambience:forestDay').level,1);assert.equal(audio.loops.has('music:cozyMusic'),false);audio.destroy();
});
test('focus loss suspends and rapid focus recovery safely resumes without another context',async()=>{const {audio,c,count}=create();await audio.resume();audio.setFocus(false);await audio.focusTask;assert.equal(c.state,'suspended');audio.setFocus(true);audio.setFocus(false);audio.setFocus(true);await audio.focusTask;assert.equal(c.state,'running');assert.equal(count(),1);audio.destroy();});
test('four independent volumes, mute migration and preferences persist separately from gameplay',()=>{const p=storage();p.setItem('simple-life.audio-muted.v1','true');assert.equal(loadPreferences(p).muted,true);const audio=new AudioManager({storage:p});for(const bus of ['master','music','ambience','effects'])audio.setVolume(bus,.25);assert.deepEqual(loadPreferences(p),{master:.25,music:.25,ambience:.25,effects:.25,muted:true});assert.ok(p.m.has(AUDIO_KEY));assert.equal(p.m.has('simple-life.save.v1'),false);audio.preferences.muted=false;audio.persist();assert.equal(loadPreferences(p).muted,false);p.setItem(AUDIO_KEY,'broken');assert.equal(loadPreferences(p).muted,true);audio.destroy();});
test('denied storage and unavailable audio do not break the game',async()=>{const audio=new AudioManager({storage:{getItem(){throw Error();},setItem(){throw Error();}},contextFactory(){throw Error();}});assert.doesNotThrow(()=>audio.setVolume('music',.5));await audio.resume();assert.equal(audio.snapshot().unavailable,true);audio.destroy();});
test('rapid effects are limited per event, frame and active voice pool; ended nodes disconnect',async()=>{const {audio,c}=create();await audio.resume();await settle();assert.equal(audio.effect('shop:buy'),true);assert.equal(audio.effect('shop:buy'),false);assert.equal(audio.effect('shop:sell'),true);assert.equal(audio.effect('shop:buy'),false);for(let i=0;i<20;i++){c.currentTime+=.1;audio.effect(i%2?'shop:buy':'shop:sell');}assert.equal(audio.voices.size,6);for(const v of [...audio.voices])v.source.onended();assert.equal(audio.voices.size,0);audio.destroy();assert.equal(c.nodes.size,0);});
test('repeated travel cleans retiring nodes and title stops all world sources and cues',async()=>{const {audio,c}=create();await audio.resume();for(let i=0;i<40;i++){audio.update(state(['home','farm','city','forest'][i%4]));await settle();c.currentTime+=3;audio.update(state(['home','farm','city','forest'][i%4]));assert.ok(audio.loops.size<=6);}for(const v of [...audio.voices])v.source.onended();assert.equal(await audio.completion(),true);assert.equal(audio.voices.size,1);audio.stopWorld();await settle();assert.deepEqual([...audio.loops.keys()],['music:cozyMusic']);assert.equal(audio.voices.size,0);audio.destroy();assert.equal(c.nodes.size,0);});
test('late audio loads cannot start old loops after Return to title or destruction',async()=>{let resolve;const c=context(),audio=new AudioManager({contextFactory:()=>c,loader:()=>new Promise(r=>resolve=r)});audio.update(state('forest'));await audio.resume();audio.stopWorld();audio.destroy();resolve({duration:96});await settle();assert.equal(audio.loops.size,0);assert.equal(c.nodes.size,0);});
test('six original PCM scores stay unclipped and have smooth silent loop boundaries',()=>{for(const [id,d]of Object.entries(TRACKS)){const b=readFileSync('public/assets/audio/'+id+'.wav');assert.equal(b.toString('ascii',0,4),'RIFF');assert.equal(b.readUInt32LE(24),22050);assert.equal((b.length-44)/44100,d.seconds);let max=0,sum=0;for(let i=44;i<b.length;i+=2){const n=b.readInt16LE(i)/32767;max=Math.max(max,Math.abs(n));sum+=n;}assert.ok(max<.45,id);assert.ok(Math.abs(sum/((b.length-44)/2))<.0001,id);assert.ok(Math.abs(b.readInt16LE(44)-b.readInt16LE(b.length-2))<4,id);assert.equal(b.readInt16LE(44),0);}});
test('all effects and quiet ambience stay bounded; production uses an explicit local audio allowlist',()=>{for(const id of Object.keys(EFFECTS)){const samples=renderEffect(id);assert.ok(samples.length<22050);assert.ok(Math.max(...samples.map(Math.abs))<.4,id);}for(const id of ['wind','water','room']){const samples=renderAmbience(id);let peak=0;for(const v of samples)peak=Math.max(peak,Math.abs(v));assert.ok(peak<.025,id);assert.equal(samples[0],0);}const runtime=readFileSync('src/audio/AudioManager.js','utf8'),config=readFileSync('vite.config.js','utf8');assert.ok(!/https?:\/\//.test(runtime));assert.ok(config.includes('Object.values(AUDIO_FILES)'));assert.ok(!runtime.includes('setInterval'));assert.ok(!runtime.includes('createOscillator'));});

test('restarting world clears completion/effect voices while keeping one source per track',async()=>{const {audio,c,count}=create();audio.update(state());await audio.resume();await settle();audio.effect('shop:buy');await audio.completion();assert.ok(audio.voices.size>0);audio.startWorld(state('city'));await settle();assert.equal(audio.voices.size,0);assert.equal(audio.cueUntil,0);assert.equal(count(),1);assert.equal(audio.loops.has('music:cozyMusic'),false);audio.destroy();assert.equal(c.nodes.size,0);});
test('City fountain ambience follows the authored fountain, fading with distance',()=>{const near=audioProfile({area:'city',minute:720,position:{x:704,y:438}}),far=audioProfile({area:'city',minute:720,position:{x:2000,y:1000}});assert.ok(near.layers.fountain>.5);assert.equal(far.layers.fountain,0);});

test('outdoor Home, Farm and City retain daytime birds after entering and exiting a quiet house',async()=>{
 const {audio,c}=create();await audio.resume();
 for(const area of ['home','farm','city']){
  audio.startWorld(state(area));await settle();assert.equal(audio.desired.layers.forestDay,.6);assert.ok(audio.loops.has('ambience:forestDay'));
  c.currentTime+=3;audio.update(state('interior'));c.currentTime+=3;audio.update(state('interior'));assert.equal(audio.loops.size,0);
  audio.update(state(area));await settle();assert.ok(audio.loops.has('ambience:forestDay'));assert.deepEqual(audio.desired.music,{});
  assert.equal(audioProfile(state(area,1320)).layers.night,.65);assert.equal(audioProfile(state(area,1320)).layers.forestDay,0);
 }
 audio.destroy();assert.equal(c.nodes.size,0);
});

test('transactions deferred by a full voice pool play once when space becomes available',async()=>{
 const {audio,c}=create();await audio.resume();
 for(let i=0;i<6;i++){c.currentTime+=.1;assert.equal(audio.effect(i%2?'shop:buy':'shop:sell'),true);}
 c.currentTime+=.1;assert.equal(audio.effect('shop:buy'),false);assert.equal(audio.queued.length,1);
 const first=[...audio.voices][0];first.source.onended();c.currentTime+=.02;audio.update(state(),false,0,{paused:true});
 assert.equal(audio.queued.length,0);assert.equal(audio.lastEffects.get('shop:buy'),c.currentTime);assert.equal(audio.voices.size,6);
 audio.stopWorld();assert.equal(audio.queued.length,0);audio.destroy();
});

test('a missing local score fails quietly once without fetching on every update',async()=>{const c=context();let loads=0;const audio=new AudioManager({contextFactory:()=>c,loader:async()=>{loads++;throw Error('Missing');}});await audio.resume();await settle();for(let i=0;i<30;i++){audio.update(null,false);await settle();}assert.equal(loads,1);assert.deepEqual(audio.failures,['cozyMusic']);assert.equal(audio.pending.size,0);audio.destroy();assert.equal(c.nodes.size,0);});

test('farming, tree/animal hits and trades use decoded samples after warmup without reloading',async()=>{
 const c=context(),loads=new Map(),buffers=new Map(),audio=new AudioManager({contextFactory:()=>c,loader:async id=>{loads.set(id,(loads.get(id)||0)+1);const b={id,duration:.5};buffers.set(id,b);return b;}});
 audio.startWorld(state('forest'));await audio.resume();await settle();assert.equal(audio.pending.size,0);
 for(const event of Object.keys(SAMPLE_EFFECTS)){assert.ok(COZY_FILES[SAMPLE_EFFECTS[event]],event);c.currentTime+=.1;assert.equal(audio.effect(event),true,event);const v=[...audio.voices].at(-1);assert.equal(v.source.buffer,buffers.get(SAMPLE_EFFECTS[event]));v.source.onended();}
 await audio.resume();await settle();assert.ok([...loads.values()].every(n=>n===1));audio.destroy();assert.equal(c.nodes.size,0);
});

test('disallowed empty-action and retired effects stay silent without loading or synthesis',async()=>{
 const c=context(),loads=[],audio=new AudioManager({contextFactory:()=>c,loader:async id=>{loads.push(id);return {duration:.5};}});
 audio.startWorld(state('forest'));await audio.resume();await settle();const before={loads:[...loads],buffers:audio.buffers.size,nodes:c.nodes.size};
 for(const id of [...Object.keys(EFFECTS),'shop:open','shop:close','jump','toString']){
  if(Object.hasOwn(SAMPLE_EFFECTS,id)||['shop:open','shop:close'].includes(id))continue;
  c.currentTime+=.1;assert.equal(audio.effect(id),false,id);
 }
 await settle();assert.deepEqual(loads,before.loads);assert.equal(audio.buffers.size,before.buffers);assert.equal(c.nodes.size,before.nodes);assert.equal(audio.lastEffects.size,0);assert.equal(audio.voices.size,0);assert.equal(audio.queued.length,0);
 assert.ok(Object.hasOwn(SAMPLE_EFFECTS,'journal:update'));assert.ok(!Object.hasOwn(SAMPLE_EFFECTS,'combat:swing'));assert.ok(audio.loops.has('ambience:forestDay'));audio.destroy();
});

test('farming chop, grass gathering and grass planting aliases use restored samples',async()=>{
 const {audio,c}=create();audio.startWorld(state('farm'));await audio.resume();await settle();
 for(const [alias,event]of [['farming:chop','tree:hit'],['farming:gatherGrass','wood:pickup'],['farming:placeGrass','furniture:place']]){
  c.currentTime+=.1;assert.equal(audio.effect(alias),true);assert.equal(audio.lastEffects.has(event),true);[...audio.voices].at(-1).source.onended();
 }audio.destroy();assert.equal(c.nodes.size,0);
});

test('completion plays one short effect while gameplay remains music-free',async()=>{
 const c=context(),loads=[],audio=new AudioManager({contextFactory:()=>c,loader:async id=>{loads.push(id);return {duration:1};}});
 audio.startWorld(state());await audio.resume();await settle();const before=[...loads];assert.equal(await audio.completion(),true);assert.deepEqual(loads,before);assert.equal(audio.voices.size,1);assert.ok(!loads.includes('cozyMusic')&&!loads.includes('completion'));audio.destroy();
});

test('dedicated wind loops are absent at every location/habitat/time and from runtime files',()=>{
 for(const area of ['home','farm','city','interior','forest'])for(const minute of [360,720,1125,1320])for(const position of [{x:5120,y:4848},{x:9000,y:2000},{x:600,y:1500}]){const p=audioProfile({area,minute,position});assert.deepEqual(p.music,{});assert.equal(Object.hasOwn(p.layers,'wind'),false);assert.equal(Object.hasOwn(p.layers,'winter'),false);}
 assert.ok(!Object.values(COZY_FILES).some(p=>/meadow|winter|wind/.test(p)));
});
test('all house interiors stay quiet at day and night while sleep, waking and item effects still play',async()=>{
 const c=context(),loads=[],audio=new AudioManager({contextFactory:()=>c,loader:async id=>{loads.push(id);return {duration:.5};}});
 for(const design of ['starter','rose','orchard','coastal','bamboo','brick','glass','alpine','manor'])for(const minute of [360,720,1125,1320]){
  audio.startWorld({...state('interior',minute),home:{design,owned:[design]}});await audio.resume();await settle();assert.deepEqual(audio.desired.layers,{});assert.equal(audio.loops.size,0);
 }
 assert.ok(!loads.includes('room')&&!Object.values(COZY_FILES).some(p=>p.endsWith('/fireplace.wav')));
 for(const event of ['sleep:begin','morning:wake','evening:wake','furniture:place','item:pickup','shop:buy','shop:sell']){c.currentTime+=.1;assert.equal(audio.effect(event),true);[...audio.voices].at(-1).source.onended();}
 audio.startWorld(state('forest'));await settle();assert.ok(audio.loops.has('ambience:forestDay'));
 audio.update(state('interior'));c.currentTime+=3;audio.update(state('interior'));assert.equal(audio.loops.size,0);audio.destroy();assert.equal(c.nodes.size,0);
});
test('sleep and wake effects are separated on the audio clock and reset cancels future waking',async()=>{
 const {audio,c}=create();audio.startWorld(state('interior'));await audio.resume();await settle();c.currentTime=10;
 assert.equal(audio.effect('sleep:begin'),true);const bed=[...audio.voices].at(-1);assert.equal(bed.source.startTime,10);
 assert.equal(audio.effect('morning:wake'),true);const wake=[...audio.voices].at(-1);assert.equal(wake.source.startTime,10+bed.source.buffer.duration+.08);assert.equal(wake.id,'morning:wake');
 audio.stopWorld();assert.equal(bed.source.stopped,true);assert.equal(wake.source.stopped,true);assert.equal(audio.sleepCueUntil,0);assert.equal(audio.voices.size,0);audio.destroy();
});
test('a new sleep cancels the prior queued morning call; evening wake uses a short rustle',async()=>{
 const {audio,c}=create();audio.startWorld(state('interior'));await audio.resume();await settle();audio.effect('sleep:begin');audio.effect('morning:wake');const old=[...audio.voices];c.currentTime+=.2;
 assert.equal(audio.effect('sleep:begin'),true);assert.ok(old.every(v=>v.source.stopped));assert.equal(audio.effect('evening:wake'),true);assert.equal(audio.voices.size,2);assert.equal(SAMPLE_EFFECTS['evening:wake'],'sfx-bush-rustle');assert.equal(SAMPLE_EFFECTS['morning:wake'],'sfx-rooster');audio.destroy();
});

test('outdoor travel is silent at playback, fallback and preload boundaries',async()=>{
 const {audio,c}=create();audio.startWorld(state('home'));await audio.resume();await settle();
 for(const area of ['farm','home','city','home','forest','home']){c.currentTime+=3;audio.update(state(area));await settle();const buffers=audio.buffers.size;assert.equal(audio.effect('travel:enter'),false);assert.equal(audio.buffers.size,buffers);assert.equal(audio.voices.size,0);assert.equal(audio.queued.length,0);assert.equal(audio.lastEffects.has('travel:enter'),false);}
 assert.ok(!Object.hasOwn(SAMPLE_EFFECTS,'travel:enter'));assert.ok(!Object.values(COZY_FILES).some(p=>p.endsWith('/sfx-gate.wav')));
 c.currentTime+=1;assert.equal(audio.effect('farming:water'),true);audio.destroy();assert.equal(c.nodes.size,0);
});

test('cold door effect waits for the wooden-door recording without a synth fallback, then plays once',async()=>{
 const c=context();let release;const door=new Promise(r=>release=r),audio=new AudioManager({contextFactory:()=>c,storage:storage(),loader:async path=>path==='sfx-door-wood-open'?door:{duration:96},random:()=>.5});
 await audio.resume();await settle();audio.startWorld(state());await settle();c.currentTime=1;
 assert.equal(audio.effect('door:open'),false);assert.equal([...audio.voices].some(v=>v.id==='door:open'),false);assert.equal(audio.queued.filter(q=>q.raw==='door:open').length,1);
 c.currentTime=1.1;audio.update(state('interior'));assert.equal([...audio.voices].some(v=>v.id==='door:open'),false);
 const recording={duration:.8};release(recording);await settle();c.currentTime=1.2;audio.update(state('interior'));
 const voices=[...audio.voices].filter(v=>v.id==='door:open');assert.equal(voices.length,1);assert.equal(voices[0].source.buffer,recording);assert.equal(voices[0].source.playbackRate.value,1);assert.ok(voices[0].gain.gain.value>=.65);assert.equal(audio.queued.length,0);
 c.currentTime=1.3;audio.update(state('interior'));assert.equal([...audio.voices].filter(v=>v.id==='door:open').length,1);audio.destroy();assert.equal(c.nodes.size,0);
});
