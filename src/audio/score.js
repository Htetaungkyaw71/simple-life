// Original Simple Life scores. MIDI pitches, bars and phrases authored for this project.
// No recordings, borrowed tunes or commercial-game arrangements.
export const TRACKS={
 title:{name:'A letter at dawn',seconds:64,bpm:60,roots:[48,53,57,55,50,53,48,55],melody:[72,76,74,69,71,74,67,72]},
 farm:{name:'Rows in the sunlight',seconds:96,bpm:80,roots:[48,52,57,53,50,55,53,48],melody:[67,72,76,74,69,65,71,72]},
 city:{name:'Lantern Square',seconds:80,bpm:96,roots:[53,57,55,48,50,53,55,48],melody:[72,69,77,76,74,71,67,72]},
 forest:{name:'Under the leaves',seconds:96,bpm:80,roots:[45,50,48,52,53,45,50,52],melody:[69,72,76,74,67,71,65,69]},
 night:{name:'The way home',seconds:96,bpm:60,roots:[45,53,50,52,48,45,53,52],melody:[64,69,67,65,62,64,71,69]},
 completion:{name:'Home again',seconds:11,bpm:72,roots:[48,53,55,48],melody:[67,72,76,74,77,76,79,72],once:true},
};
export const EFFECTS={
 'ui:move':[.09,420,510,.11], 'ui:confirm':[.16,660,880,.14], 'ui:cancel':[.13,500,360,.12],
 'ui:disabled':[.13,240,220,.09], 'ui:open':[.2,440,660,.12], 'ui:close':[.18,660,440,.11], 'journal:update':[.5,660,990,.17],
 'farming:dig':[.16,160,95,.17], 'farming:plant':[.18,330,520,.16], 'farming:water':[.28,360,210,.17],
 'farming:empty':[.13,270,200,.1], 'farming:growth':[.5,520,780,.18], 'farming:harvest':[.28,550,880,.2], 'farming:clear':[.15,170,120,.14],
 'shop:buy':[.23,660,880,.18], 'shop:sell':[.26,740,1100,.18], 'shop:failure':[.13,240,220,.09],
 'project:complete':[.65,520,1040,.24], 'request:complete':[.45,520,780,.22], 'coin:reward':[.2,880,1100,.15],
 'combat:swing':[.15,220,110,.16], 'tree:hit':[.16,150,90,.2], 'tree:fall':[.5,180,60,.22], 'wood:pickup':[.17,330,440,.15],
 'stone:collect':[.18,480,310,.16], 'craft:complete':[.32,330,660,.18], 'furniture:place':[.2,200,320,.17],
 'furniture:rotate':[.12,440,520,.12], 'furniture:invalid':[.13,240,220,.09], 'furniture:recover':[.2,320,440,.15],
 'stove:open':[.2,240,360,.13], 'food:cook':[.4,300,600,.18], 'food:eat':[.25,280,420,.17],
 'food:health':[.3,520,780,.17], 'food:energy':[.3,440,660,.17], 'forest:collect':[.24,440,660,.18],
 'animal:warning':[.32,160,120,.16], 'combat:hit':[.16,180,90,.22], 'combat:hurt':[.25,220,100,.24],
 'animal:defeat':[.42,360,540,.22], 'cache:open':[.5,440,880,.22], 'stash:drop':[.3,340,170,.21],
 'stash:recover':[.48,550,1100,.23], 'keepsake:collect':[.8,660,1320,.24],
 'door:open':[.25,160,260,.14], 'travel:enter':[.35,330,660,.15], 'bed:open':[.22,440,330,.13],
 'sleep:begin':[.8,520,260,.18], 'morning:wake':[.7,440,880,.2],
 'ambient:bird':[.38,1000,1350,.055], 'ambient:cricket':[.28,1400,1600,.035],
 'ambient:wood':[.13,130,90,.05], 'ambient:fire':[.12,220,110,.05], 'ambient:animal':[.48,220,180,.045], 'ambient:step':[.12,90,60,.045],
};
export const AMBIENCE={wind:24,water:24,room:24};
export const AUDIO_FILES=Object.fromEntries(Object.keys(TRACKS).map(id=>[id,'assets/audio/'+id+'.wav']));
const TAU=Math.PI*2,frequency=n=>440*2**((n-69)/12);
function tone(samples,rate,start,duration,hz,level,kind='bell',endHz=hz){
 const from=Math.floor(start*rate),length=Math.floor(duration*rate);let phase=0;
 for(let i=0;i<length&&from+i<samples.length;i++){
  const t=i/rate,p=i/length,attack=Math.min(1,t/.025),release=Math.min(1,(duration-t)/.085),env=attack*release*(kind==='bell'?Math.exp(-p*3):1);
  phase+=TAU*(hz+(endHz-hz)*p)/rate;
  // Finite harmonic sums keep high-frequency energy bounded. No raw saw/square edges.
  const wave=kind==='bass'?Math.sin(phase)-Math.sin(3*phase)/9+Math.sin(5*phase)/25:kind==='pulse'?(Math.sin(phase)+.18*Math.sin(3*phase))*.8:Math.sin(phase)+.18*Math.sin(phase*2);
  samples[from+i]+=wave*env*level;
 }
}
export function renderTrack(id,rate=22050){
 const d=TRACKS[id],out=new Float32Array(Math.round(d.seconds*rate)),beat=60/d.bpm,bars=Math.round(d.seconds/(beat*4));
 for(let bar=0;bar<bars;bar++){
  const section=Math.floor(bar/8),root=d.roots[bar%d.roots.length],start=bar*beat*4,minor=[45,50,57].includes(root),third=minor?3:4;
  for(const [n,offset]of [[root,0],[root+7,2]])tone(out,rate,start+offset*beat,beat*1.6,frequency(n),.040,'bass');
  if(bar%2===0)for(const n of [root+12,root+12+third,root+19])tone(out,rate,start+.08,beat*2.5,frequency(n),.009,'pulse');
  const base=d.melody[(bar+section*2)%d.melody.length],rhythms=id==='forest'||id==='night'?[.5,2.5]:[.25,1.5,3];
  rhythms.forEach((offset,i)=>{if((bar+i+section)%5===4)return;const n=i===1?root+24+third:i===2?root+19:base;tone(out,rate,start+beat*offset,beat*(i===0?1.2:.65),frequency(n),d.once?.095:.05,'bell');});
  if(id==='farm'||id==='city')tone(out,rate,start+beat,beat*.13,90,.011,'bass',55);
 }
 if(d.once){[67,72,76,79,84,79,76,72].forEach((n,i)=>tone(out,rate,1+i*.8,1.45,frequency(n),.075));}
 // Rounded phrase edges, with a quiet breath between long forms, avoid loop clicks.
 for(let i=0;i<out.length;i++){const t=i/rate;out[i]*=Math.min(1,t/.18,(d.seconds-t)/.35);}
 return out;
}
export function renderEffect(id,rate=22050){
 const [seconds,hz,end,level]=EFFECTS[id]||EFFECTS['ui:confirm'],out=new Float32Array(Math.ceil(seconds*rate));
 tone(out,rate,0,seconds,hz,level,hz<280?'bass':'bell',end);return out;
}
export function renderAmbience(id,rate=22050){
 const seconds=AMBIENCE[id],out=new Float32Array(seconds*rate);
 // Gentle coherent low-frequency air/water; no white-noise loops or high-pass hiss.
 for(let i=0;i<out.length;i++){const t=i/rate,env=Math.sin(Math.PI*t/seconds)**2,flutter=.7+.3*Math.sin(TAU*t/8);
  out[i]=env*flutter*(id==='room'?.003*Math.sin(TAU*65*t):id==='wind'?.008*(Math.sin(TAU*83*t)+.5*Math.sin(TAU*117*t)):.012*(Math.sin(TAU*173*t+1.2*Math.sin(TAU*t/3))+.4*Math.sin(TAU*239*t)));
 }
 return out;
}
