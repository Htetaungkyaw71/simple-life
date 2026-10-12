import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TradePanel} from '../src/ui/TradePanel.js';
import {newState} from '../src/systems/state.js';
import {CROPS,SALE_ITEMS} from '../src/data/crops.js';
import {recorder} from './helpers/uiRecorder.js';
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
test('trade catalogues, quotes, feedback and details keep separate bounds with native fonts on short and narrow phones',()=>{
 for(const [w,h,safe]of [[1280,720],[320,568],[390,844],[360,640],[844,390],[844,335,{left:30,right:30,bottom:11}],[844,300,{left:22,right:22,bottom:11}],[568,256]])for(const type of ['seed','sell']){
  const u=recorder(w,h);if(safe)Object.assign(u.safe,safe);const s=newState();s.area='city';s.minute=600;s.money=100000;for(const id of Object.keys(SALE_ITEMS))s.inventory[id]=9999;
  const a={ui:u,state:s,sound(){},input:{},transact(fn){fn(s);}};u.app=a;const trade=new TradePanel(a);trade.open(type);trade.quantity=type==='seed'?'max':'all';
  for(let i=0;i<trade.ids.length;i++)for(const details of [false,true]){
   trade.index=i;trade.details=details;trade.message='+999999 coins / HIGH market!';trade.show();const b=u.menuBounds,frame={x:b.x/2,y:b.y/2,w:b.w/2,h:b.h/2};
   for(const c of u.controls){assert.ok(c.w>=22&&c.h>=22,c.id);assert.ok(c.x>=frame.x&&c.y>=frame.y&&c.x+c.w<=frame.x+frame.w&&c.y+c.h<=frame.y+frame.h,c.id+' '+w+'x'+h);for(const d of u.controls)if(c!==d)assert.ok(!overlap(c,d),c.id+' / '+d.id);}
   const texts=u.root.list.filter(n=>n.type==='text'&&n.text).map(n=>({text:n.text,x:n.x-n.originX*n.width,y:n.y-n.originY*n.height,w:n.width,h:n.height}));
   for(const t of texts){assert.ok(t.x>=frame.x&&t.y>=frame.y&&t.x+t.w<=frame.x+frame.w&&t.y+t.h<=frame.y+frame.h,t.text+' '+w+'x'+h);for(const c of u.controls)if(t.text!==c.label)assert.ok(!overlap(t,c),t.text+' in '+c.id);for(const other of texts)if(t!==other)assert.ok(!overlap(t,other),t.text+' / '+other.text);}
   if(!details){const confirm=u.controls.find(c=>c.id==='trade-confirm');assert.equal(confirm.text.text,confirm.label,'full quote is visible');}
  }
  if(type==='seed'){s.inventory[CROPS.tomato.seedKey]=0;trade.index=0;trade.details=false;trade.quantity=5;trade.show();trade.perform();assert.equal(s.inventory.seed,5);assert.equal(s.money,99950);}
 }
});
