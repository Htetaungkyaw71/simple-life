// Pure native-pixel layouts shared by the canvas renderer and bounds checks.
export function hudLayout(u,forest,armed,selected='shovel'){
 const utility=['shovel','axe','hand','grass','decorate'].includes(selected)?selected:'shovel';
 const narrow=u.touch&&u.w>u.h&&u.w-(u.safe.left||0)-(u.safe.right||0)<300;
 const ids=[...(forest?['water',...(narrow||['axe','hand'].includes(utility)?[]:[utility])]:['seed','water','harvest',...(narrow||['axe','hand'].includes(utility)?[]:[utility])]),'bag',...(forest?['map']:[]),'journal','pause'];
 const short=u.touch&&u.w>u.h,left=(u.safe.left||0)+(short?70:6),right=u.w-(u.safe.right||0)-(short?70:6),gap=2;
 const cell=Math.min(u.touch?20:32,Math.floor((right-left-gap*(ids.length-1))/ids.length));
 const width=cell*ids.length+gap*(ids.length-1),x=Math.floor(left+(right-left-width)/2),y=u.h-(u.touch&&u.w<u.h?(u.safe.bottom||0)+86:cell+8);
 return {ids,cell,x,y,gap,width};
}
export function bagLayout(u){
 const availableHeight=u.h-(u.safe.top||0)-(u.safe.bottom||0),compactLandscape=u.w>u.h&&availableHeight<300;
 const w=Math.min(340,u.w-(u.safe.left||0)-(u.safe.right||0)-12),h=Math.min(compactLandscape?176:254,availableHeight-12),gap=4;
 const landscape=u.w>u.h&&h<190,cols=landscape?6:4,rows=landscape?(h<144?1:2):3;
 const cell=Math.floor(Math.min(48,(w-24-gap*(cols-1))/cols,(h-(h<190?92:104)-(u.app?.language?.current==='mm'&&h>=144?16:0)-gap*(rows-1))/rows));
 return {x:Math.floor((u.w-w)/2),y:Math.floor((u.h-h)/2),w,h,cell,gap,cols,rows};
}
export const facingIndex={right:0,down:2,left:4,up:6};
export function displayClock(minute){const whole=Math.floor(minute),hour=Math.floor(whole/60);return `${hour%12||12}:${String(whole%60).padStart(2,'0')} ${hour<12?'am':'pm'}`;}
export function mapLayout(u){
 const mobile=u.touch,maxW=Math.min(520,u.w-(u.safe.left||0)-(u.safe.right||0)-12),maxH=u.h-(u.safe.top||0)-(u.safe.bottom||0)-12,chrome=mobile?53:75;
 const mw=Math.floor(Math.min(maxW-58,(maxH-chrome)*2)/2)*2,mh=mw/2,w=mw+58,h=mh+chrome;
 return {x:Math.floor((u.w-w)/2),y:Math.floor((u.h-h)/2),w,h,mw,mh,mobile};
}
