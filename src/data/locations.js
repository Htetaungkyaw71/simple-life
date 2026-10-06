import {MAPS,MAP_SIZE} from './mapLayouts.js';
import {HOUSE,pondRows} from './geometry.js';
export const LOCATIONS = {
 home:{name:'Home',subtitle:'The shade garden',spawn:{x:480,y:500},interactions:[
  {type:'travel',...HOUSE.door,label:'Enter house',to:'interior',spawn:{x:480,y:464},approach:[464,436,32,34]},
  {type:'starter',x:544,y:542,label:'Collect starter seeds'},
  {type:'travel',x:880,y:640,label:'Farm gate',to:'farm',spawn:{x:180,y:300}},
 ]},
 interior:{name:'Home',subtitle:'Inside the house',spawn:{x:480,y:464},interactions:[
  {type:'bed',x:295,y:280,label:'Rest at the bed'},
  {type:'travel',x:480,y:478,label:'Exit house',to:'home',spawn:{...HOUSE.exit},approach:[456,444,48,42]},
 ]},
 farm:{name:'Farm',subtitle:'The active field',spawn:{x:180,y:300},interactions:[
  {type:'travel',x:180,y:247,label:'Home lane',to:'home',spawn:{x:880,y:640}},
  {type:'dialog',x:865,y:275,label:'City road - opening soon',title:'City road closed',body:'City and economy are planned for the next milestone. Collect your starter seeds beside the house and grow your first harvest here.'},
 ]},
};
for(const [area,location]of Object.entries(LOCATIONS)){
 location.bounds=area==='interior'?[240,144,352,352]:[32,32,MAP_SIZE.width-64,MAP_SIZE.height-64];location.obstacles=MAPS[area].obstacles;
 location.interactions.push(...MAPS[area].signs.map(p=>({...p,type:'dialog'})));
 location.shoreline=MAPS[area].water.flatMap(pond=>{const rows=pondRows(pond),[x,y,w,h]=pond;return [{x:x+w/2,y:y-16},{x:x+w/2,y:y+h+16},...rows.filter((_,i)=>i%8===0).flatMap(([x,y,w])=>[{x:x-16,y:y+1},{x:x+w+16,y:y+1}])];});
}
export function inBounds(area,x,y,r=12){const map=LOCATIONS[area];if(!map||!Number.isFinite(x)||!Number.isFinite(y))return false;const [bx,by,w,h]=map.bounds;return x>=bx+r&&x<=bx+w-r&&y>=by+r&&y<=by+h-r;}
export function walkable(area,x,y,r=12){return inBounds(area,x,y,r)&&!LOCATIONS[area].obstacles.some(([ox,oy,ow,oh])=>x+r>ox&&x-r<ox+ow&&y+r>oy&&y-r<oy+oh);}
