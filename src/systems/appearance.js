import {residentsFor} from './residents.js';
import {OUTFITS,HAIRCUTS,ACCESSORIES,STYLE_SERVICES,freshAppearance} from '../data/appearance.js';
export function restoreAppearance(raw,character){
 const a=freshAppearance(character);
 a.owned=Object.keys(OUTFITS).filter(id=>OUTFITS[id].price===0||Array.isArray(raw?.owned)&&raw.owned.includes(id));
 if(a.owned.includes(raw?.outfit))a.outfit=raw.outfit;
 if(Object.hasOwn(HAIRCUTS,raw?.hair))a.hair=raw.hair;
 a.ownedAccessories=Object.keys(ACCESSORIES).filter(id=>Array.isArray(raw?.ownedAccessories)&&raw.ownedAccessories.includes(id));
 for(const id of a.ownedAccessories){const slot=ACCESSORIES[id].slot;if(raw?.accessories?.[slot]===id)a.accessories[slot]=id;}
 return a;
}
export function styleServiceOpen(s,category){const p=STYLE_SERVICES[category==='accessories'?'clothes':category];return !!p&&s?.area===p.area&&s.minute>=420&&s.minute<1140&&Math.hypot(s.position.x-p.x,s.position.y-p.y)<58&&residentsFor(p.area,s).some(n=>n.id===p.resident&&n.mode==='work'&&n.visible);}
export function styleQuote(s,category,id){
 const catalog=category==='clothes'?OUTFITS:category==='hair'?HAIRCUTS:category==='accessories'?ACCESSORIES:null,d=catalog&&Object.hasOwn(catalog,id)?catalog[id]:null;
 const current=!!d&&(category==='clothes'?s.appearance.outfit===id:category==='hair'?s.appearance.hair===id:s.appearance.accessories?.[d.slot]===id);
 const owned=category==='clothes'?s.appearance.owned.includes(id):category==='accessories'&&(s.appearance.ownedAccessories||[]).includes(id),price=owned?0:d?.price;
 return {ok:!!d&&(!current||category==='accessories')&&(owned||styleServiceOpen(s,category))&&Number.isInteger(s.money)&&s.money>=price,current,owned,price};
}
export function changeAppearance(s,category,id){
 const q=styleQuote(s,category,id);if(q.current&&category!=='accessories')return 'Already wearing this style';
 if(!q.ok)return q.price>s.money?'Not enough coins':'Visit the town stylist / 7 am - 7 pm';
 s.money-=q.price;
 if(category==='clothes'){if(!q.owned)s.appearance.owned.push(id);s.appearance.outfit=id;}
 else if(category==='accessories'){
  const slot=ACCESSORIES[id].slot;
  s.appearance.ownedAccessories??=[];s.appearance.accessories??={hat:null,glasses:null,bag:null};
  if(!q.owned)s.appearance.ownedAccessories.push(id);
  s.appearance.accessories[slot]=q.current?null:id;
 }else s.appearance.hair=id;
 return 'Style changed'+(q.price?' / -'+q.price+'c':'');
}
