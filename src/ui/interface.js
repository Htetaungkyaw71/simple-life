import { clock, phase } from '../systems/time.js';
import { LOCATIONS } from '../data/locations.js';
export class Interface {
  constructor(app) { this.app=app;this.overlay=document.querySelector('#overlay');this.hud=document.querySelector('#hud');this.bottom=document.querySelector('#bottom');this.location=document.querySelector('#location'); }
  modal(kicker,title,body,buttons) {
    this.app.paused=true;this.app.input={};this.overlay.hidden=false;
    this.overlay.innerHTML=`<div class="card"><div class="eyebrow">${kicker}</div><h1>${title}</h1><div class="copy">${body}</div><div class="actions"></div></div>`;
    for(const [label,fn,style]of buttons){const b=document.createElement('button');b.textContent=label;b.className=style||'';b.onclick=fn;this.overlay.querySelector('.actions').append(b);}
    this.overlay.querySelector('button')?.focus({preventScroll:true});
  }
  close(){this.overlay.hidden=true;this.app.paused=false;document.activeElement?.blur();this.app.scene.keys&&Object.values(this.app.scene.keys).forEach(k=>k.reset());}
  title(){
    const save=this.app.saves.load();
    this.hud.hidden=true;this.bottom.hidden=true;this.location.hidden=true;
    this.modal('A LITTLE ROOM TO GROW','Simple Life',`<p class="subtitle">Slow mornings. Small seeds.<br>A life of your own.</p><p class="title-note">A tropical farming adventure</p>${this.app.saves.error?`<p>${this.app.saves.error}</p>`:''}`,[['New Game',()=>save?this.confirmNew():this.choose()],...(save?[['Continue · Day '+save.day,()=>this.app.start(save),'secondary']]:[]),['How to play',()=>this.help(()=>this.title()),'text-button']]);
  }
  confirmNew(){this.modal('A FRESH START','Start a new life?','<p>This replaces your saved farm when you choose a character.</p>',[['Keep my farm',()=>this.title()],['Start fresh',()=>this.choose(),'secondary']]);}
  choose(){this.modal('YOUR FIRST CHAPTER','Who will you be?','<div class="portraits"><div><span class="portrait boy"><i></i></span>Boy</div><div><span class="portrait girl"><i></i></span>Girl</div></div><p>Same little farm. Your own story.</p>',[['Play as Boy',()=>this.app.newGame('boy')],['Play as Girl',()=>this.app.newGame('girl'),'secondary'],['Back',()=>this.title(),'text-button']]);}
  help(back){this.modal('FIELD NOTES','A little care, every day',`<ol><li>Walk to the city and buy tomato seeds.</li><li>Stand near a farm plot. Select Seed, then Use.</li><li>Water before and after 16:00, for three days.</li><li>Rest until evening at the bed, then water again.</li><li>Sleep, repeat, harvest on day 4, and sell in the city.</li></ol><p>WASD / arrows move · E / Space use<br>1–3 select tools · Escape pauses<br>Touch: direction pad, tool buttons and Use.</p><p>Dry days delay growth; two fully dry days kill a crop. Use it to clear. The game saves automatically.</p>`,[['Got it',back]]);}
  play(){
    this.hud.hidden=false;this.bottom.hidden=false;this.location.hidden=false;
    this.hud.innerHTML='<div class="day"><small>YOUR LITTLE LIFE</small><b id="day"></b></div><div class="time"><b id="clock"></b><small id="phase"></small></div><div class="stat"><label>HEALTH <span id="health"></span></label><meter id="health-meter" min="0" max="100"></meter></div><div class="stat"><label>ENERGY <span id="energy"></span></label><meter id="energy-meter" min="0" max="100"></meter></div><div class="money"><small>COINS</small><b id="money"></b></div><button id="pause" class="icon-button" aria-label="Pause game">Ⅱ</button>';
    this.bottom.innerHTML='<div class="journal"><small>FIRST ROOTS</small><div id="objective"></div></div><div class="tools"></div><div class="interaction"><span id="context"></span><button id="use">Use <kbd>E</kbd></button></div><div class="mobile-pad"><button data-dir="up" aria-label="Move up">↑</button><button data-dir="left" aria-label="Move left">←</button><button data-dir="down" aria-label="Move down">↓</button><button data-dir="right" aria-label="Move right">→</button></div><div class="save-line"><span id="save-status">Autosave on</span><button id="save" class="text-button">Save now</button><span class="desktop-help">WASD / arrows move · 1–3 tools · Esc pause</span></div>';
    for(const [i,tool,icon,name]of [[1,'seed','✿','Seed'],[2,'water','◒','Water'],[3,'harvest','✂','Harvest']]) { const b=document.createElement('button');b.dataset.tool=tool;b.innerHTML=`<small>${i}</small><span class="tool-icon">${icon}</span><span>${name}</span><b id="count-${tool}"></b>`;b.onclick=()=>this.app.select(tool);this.bottom.querySelector('.tools').append(b); }
    document.querySelector('#pause').onclick=()=>this.app.pause();document.querySelector('#use').onclick=()=>this.app.use();document.querySelector('#save').onclick=()=>this.app.save(true);
    for(const b of this.bottom.querySelectorAll('[data-dir]')) { const release=()=>{this.app.input[b.dataset.dir]=false;};b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);this.app.input[b.dataset.dir]=true;};b.onpointerup=release;b.onpointercancel=release;b.onlostpointercapture=release; }
    this.refs=Object.fromEntries([...document.querySelectorAll('#hud [id],#bottom [id]')].map(e=>[e.id,e]));this.close();
  }
  update(s,context){if(!this.refs)return;
    const put=(id,value)=>{if(this.refs[id].textContent!==String(value))this.refs[id].textContent=value;};
    put('day',`Day ${String(s.day).padStart(2,'0')}`);put('clock',clock(s));put('phase',`${phase(s)} · Clear`);put('money',s.money.toLocaleString());
    for(const stat of ['health','energy']){put(stat,s[stat]);this.refs[stat+'-meter'].value=s[stat];}
    put('count-seed',s.inventory.seed);put('count-harvest',s.inventory.tomato);put('context',context?.label||'Follow the paths. Find your own pace.');this.refs.use.disabled=!context;
    const objective=s.sold?'First harvest sold. Plant another little beginning.':s.inventory.tomato?'Take your tomatoes to the city produce market.':s.plots.some(p=>p.crop)?'Water before & after 16:00. Sleep to grow.':s.inventory.seed?'Head to the farm. Plant a tomato seed.':'Visit the city seed shop. Your first seed costs 10 coins.';
    put('objective',objective);
    for(const b of this.bottom.querySelectorAll('[data-tool]')){const selected=b.dataset.tool===s.selected;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',selected);}
    const name=LOCATIONS[s.area];const html=`<span>${name.name}</span><small>${name.subtitle}</small>`;if(this.location.innerHTML!==html)this.location.innerHTML=html;
  }
  toast(text){const el=document.querySelector('#toast');el.textContent=text;el.classList.add('visible');clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>el.classList.remove('visible'),4300);}
}
