// Offline draw-command/art study: no browser, Phaser instance or live save.
import {mkdirSync,writeFileSync} from 'node:fs';
import {recorder,recording} from '../../tests/helpers/uiRecorder.js';
import {newState} from '../../src/systems/state.js';
import {CROPS,CROP_IDS} from '../../src/data/crops.js';
import {FARM_PLOTS} from '../../src/data/farms.js';
import {drawFarmBeds,drawWetGround} from '../../src/art/FarmView.js';
import {paintGround} from '../../src/art/groundSurface.js';
import {MAPS} from '../../src/data/mapLayouts.js';
const out='/tmp/simplelife-free-farm';mkdirSync(out,{recursive:true});
const floor=new Uint8ClampedArray(1120*576*4);paintGround(floor,1120,576);writeFileSync(out+'/floor.rgba',floor);
for(const state of ['growing','watered']){
 const s=newState();s.area='farm';s.minute=600;
 CROP_IDS.forEach((id,i)=>{const p=s.plots[i];p.crop=id;p.growth=i%3===0?CROPS[id].growthDays:Math.min(2,CROPS[id].growthDays-1);p.morning=state==='watered';if(i===4||i===10)p.missedWindows=1;});
 if(state==='watered')s.wetGround=FARM_PLOTS.slice(0,12).map(p=>({area:'farm',farm:0,x:p.x,y:p.y,remaining:180000}));
 const u=recorder(1280,720);u.app={state:s};u.root.setScale(.5).setPosition(-140,-50);const soil=u.add.container(),wet=u.add.container();u.root.add([wet,soil]);drawFarmBeds(u,soil);drawWetGround(u,wet);
 // Retained map props and decorative pixels supply the same Farm context.
 for(const p of [...MAPS.farm.details,...MAPS.farm.props])if(!p.fence){const n=u.add.image(p.x,p.y,'town',p.name==='tree'?'tree0':p.name).setOrigin(0).setScale(2).setDepth(p.name==='tree'?p.y+90:0);u.root.add(n);}
 u.root.add(u.add.sprite(476,384,'boy',0).setOrigin(.5,1).setScale(2).setDepth(384));if(state==='watered')u.root.add(u.add.image(456,340,'town','can').setScale(2).setDepth(500));
 const r=recording(u);r.camera={x:280,y:100};writeFileSync(out+'/'+state+'.json',JSON.stringify(r));
}
console.log('2 offline Farm view command studies; not browser acceptance');
