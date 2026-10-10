import {writeFileSync,mkdirSync} from 'node:fs';
import {TRACKS,renderTrack} from '../src/audio/score.js';
mkdirSync('public/assets/audio',{recursive:true});
for(const id of Object.keys(TRACKS)){
 const samples=renderTrack(id),b=Buffer.alloc(44+samples.length*2),rate=22050;
 b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(samples.length*2,40);
 samples.forEach((v,i)=>{if(Math.abs(v)>=1)throw Error('Clipped '+id);b.writeInt16LE(Math.round(v*32767),44+i*2);});writeFileSync('public/assets/audio/'+id+'.wav',b);
}
console.log('Six original mono PCM scores rendered at 22050 Hz.');
