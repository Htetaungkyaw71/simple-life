import {MM as BASE} from './myanmar.js';
import {MM_EXTRA} from './myanmarExtra.js';
export const MM={...BASE,...MM_EXTRA};
export const LANGUAGE_KEY='simple-life.language.v1';
export const LANGUAGES=['en','mm'];
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const fragments=Object.keys(MM).filter(k=>!k.includes('\n')).sort((a,b)=>b.length-a.length);
const fragmentPattern=new RegExp('(?<![A-Za-z])(?:'+fragments.map(escape).join('|')+')(?![A-Za-z])','g');
const rules=[
 [/^Day (\d+)$/,'နေ့ $1'],[/^(\d+:\d+) am$/,'နံနက် $1'],[/^(\d+:\d+) pm$/,'ညနေ $1'],
 [/^Bag (\d+)$/,'အိတ် $1'],[/^(\d+) each$/,'တစ်ခု $1'],[/^(Buy|Sell) (\d+) \/ (\d+)c$/,(m,a,b,c)=>(a==='Buy'?'ဝယ်':'ရောင်း')+' '+b+' / '+c+'c'],
 [/^Harvest \/ (\d+) (watered )?days$/,'ရိတ်ရန် / $1 ရက်'],[/^(\d+) days \/ yield (\d+)$/,'$1 ရက် / အထွက် $2'],
 [/^Normal sell (\d+)c \/ Food (\d+) EP$/,'ပုံမှန်ရောင်း $1c / အားအင် $2'],[/^\+(\d+) seeds$/,'မျိုးစေ့ +$1'],[/^\+(\d+) coins.*$/,'ဒင်္ဂါး +$1'],
 [/^Need (\d+) coins$/,'ဒင်္ဂါး $1 လိုသည်'],[/^Wait (\d+)s$/,'$1 စက္ကန့်စောင့်ပါ'],[/^Next food in (\d+) active seconds\.$/,'နောက်အစာစားရန် $1 စက္ကန့်စောင့်ပါ။'],
 [/^Wake at (.+)\. Energy restored\.$/,(m,time)=>translate(time,'mm')+' တွင်နိုးမည်။ အားအင်ပြန်ပြည့်မည်။'],
 [/^Received (\d+) (.+) seeds\.$/,(m,n,crop)=>translate(crop,'mm')+'မျိုးစေ့ '+n+' စေ့ရပြီ။'],
 [/^Journal updated \/ (.+)$/,(m,s)=>'မှတ်တမ်းအသစ် / '+translate(s,'mm')],
 [/^(.+) seeds selected\.$/,(m,s)=>translate(s,'mm')+'မျိုးစေ့ရွေးထားသည်။'],
 [/^(.+) planted$/,(m,s)=>translate(s,'mm')+' စိုက်ပြီးပြီ'],[/^(.+) harvested$/,(m,s)=>translate(s,'mm')+' ရိတ်ပြီးပြီ'],
 [/^Collected (.+)$/,(m,s)=>translate(s,'mm')+' ရပြီ'],[/^Recovered (\d+) coins\.?$/,'ဒင်္ဂါး $1 ပြန်ရပြီ'],
 [/^Watered (\d+) (.+)$/,(m,n,s)=>translate(s,'mm')+' '+n+' ခုရေလောင်းပြီးပြီ'],
 [/^Talk to (.+)$/,'$1 နှင့်စကားပြောမည်'],[/^(.+) needs help$/,'$1 က အကူအညီလိုသည်'],
 [/^(\d+) \/ 4  (.+)$/,(m,n,s)=>n+' / 4  '+translate(s,'mm')],
 [/^CHAPTER (\d+) \/ (.+)$/,(m,n,s)=>'အခန်း '+n+' / '+translate(s,'mm')],
 [/^(.+) bought \/ -(\d+)c \/ Bag Gear$/,(m,s,n)=>translate(s,'mm')+' ဝယ်ပြီးပြီ / -'+n+'c / အိတ်'],
 [/^(.+) (added|readjusted|removed)(.*)$/,(m,s,action)=>translate(s,'mm')+' '+({added:'ချပြီးပြီ',readjusted:'ရွှေ့ပြီးပြီ',removed:'ဖယ်ပြီးအိတ်ထဲသိမ်းပြီ'})[action]],
];
export function translate(value,language='en'){
 const s=String(value??'');if(language!=='mm'||!s)return s;if(Object.hasOwn(MM,s))return MM[s];const titleCase=s[0]?.toUpperCase()+s.slice(1).toLowerCase();if(/^[A-Z]+$/.test(s)&&Object.hasOwn(MM,titleCase))return MM[titleCase];
 for(const [pattern,replacement]of rules)if(pattern.test(s))return s.replace(pattern,replacement);
 if(s.includes('\n'))return s.split('\n').map(line=>translate(line,language)).join('\n');
 return s.replace(fragmentPattern,key=>MM[key]);
}
export class LanguageService {
 constructor(storage){this.storage=storage;this.current='en';this.persisted=true;try{const v=storage?.getItem(LANGUAGE_KEY);if(LANGUAGES.includes(v))this.current=v;}catch{this.persisted=false;}}
 select(language){if(!LANGUAGES.includes(language))return false;this.current=language;try{this.storage?.setItem(LANGUAGE_KEY,language);this.persisted=true;}catch{this.persisted=false;}return true;}
}

const BUTTON_MM={'Farmer source & terms':'လယ်သမားမူရင်း','Original character template':'ဇာတ်ကောင်မူရင်း','Forest & licences':'တောလိုင်စင်','CC BY 4.0 licence':'CC BY 4.0','Font source':'ဖောင့်မူရင်း','Thaleah source':'Thaleah','m5x7 source':'m5x7','More art':'အနုပညာ',Resume:'ဆက်ကစား',Continue:'ဆက်ကစား',Begin:'စကစား',Close:'ပိတ်',Back:'နောက်',Replay:'ပြန်','Return to title':'အစသို့',MAX:'အကုန်',ALL:'အားလုံး',Equip:'ကိုင်',Select:'ရွေး',Place:'ချ',Build:'ဆောက်',Deliver:'ပေး',Cook:'ချက်',Uses:'အသုံး','Put away':'သိမ်း','Complete Commons seating first':'ထိုင်ခုံလို','Craft / materials':'ဖန်တီး','House designs':'အိမ်ပုံစံ','Trees & garden':'ဥယျာဉ်','Room furniture':'ပရိဘောဂ','Town projects':'စီမံကိန်း','Daily requests':'တောင်းဆို', 'Buy one':'ဝယ်', 'Confirm purchase':'ဝယ်မည်'};
export const translateButton=(value,language)=>language==='mm'&&Object.hasOwn(BUTTON_MM,value)?BUTTON_MM[value]:translate(value,language);
const COMPACT_MM={'Dead / select Harvest':'ရိတ်ကိရိယာရွေးပါ','Clear dead crop':'အပင်သေဖယ်ပါ','Ripe - select Harvest':'ရိတ်ကိရိယာရွေးပါ','Recovering - select Water':'ရေဘူးရွေးပါ','Recovering - water to recover':'ရေလောင်း၍ကယ်ပါ','Growing - select Water':'ရေဘူးရွေးပါ','Already watered today':'ရေလောင်းပြီးပြီ','Crop planted':'စိုက်ပြီးပြီ','Plant seed':'မျိုးစေ့စိုက်ပါ','Harvest':'ရိတ်သိမ်းပါ','Water':'ရေလောင်းပါ','No seeds':'မျိုးစေ့လိုသည်','Select a seed':'မျိုးစေ့ရွေးပါ'};
export const compactMyanmarPrompt=value=>COMPACT_MM[value]||translate(value,'mm');
