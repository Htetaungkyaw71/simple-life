import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {TRACKS,EFFECTS,AMBIENCE,renderEffect,renderAmbience} from '../src/audio/score.js';
const dir='/tmp/simple-life-audio-audit';mkdirSync(dir,{recursive:true});const inputs=[];
for(const [id,d]of Object.entries(TRACKS))inputs.push({name:d.name,id,duration:d.seconds,loop:!d.once,filename:'public/assets/audio/'+id+'.wav',method:'Original score / offline bounded harmonic synthesis',license:'Original Simple Life project / Codex-assisted'});
for(const [id,d]of Object.entries(EFFECTS)){const samples=renderEffect(id);writeFileSync(dir+'/'+id.replace(':','-')+'.f32',Buffer.from(samples.buffer));inputs.push({name:id,id,duration:d[0],loop:false,filename:dir+'/'+id.replace(':','-')+'.f32',runtime:'src/audio/score.js / renderEffect',method:'Original finite harmonic chirp with attack/release envelope',license:'Original Simple Life project / Codex-assisted'});}
for(const [id,seconds]of Object.entries(AMBIENCE)){const samples=renderAmbience(id);writeFileSync(dir+'/'+id+'.f32',Buffer.from(samples.buffer));inputs.push({name:id,id,duration:seconds,loop:true,filename:dir+'/'+id+'.f32',runtime:'src/audio/score.js / renderAmbience',method:'Original quiet low-frequency tonal texture / no white noise',license:'Original Simple Life project / Codex-assisted'});}
writeFileSync(dir+'/inputs.json',JSON.stringify(inputs));
const result=spawnSync(process.env.PYTHON_EXECUTABLE||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',['scripts/audit-audio.py',dir],{encoding:'utf8'});if(result.status!==0)throw Error(result.stderr);console.log(result.stdout);
