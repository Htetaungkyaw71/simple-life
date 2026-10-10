// Original sixteen-pixel wooden sun medallion. Shared key item / Home / story panel.
export function keepsakePixels(g,x,y,scale=1){
 const r=(a,b,w,h,c)=>g.fillStyle(c).fillRect(x+a*scale,y+b*scale,w*scale,h*scale);
 r(7,0,2,3,0x93694c);r(5,2,6,1,0x423a32);r(3,3,10,10,0x423a32);r(2,5,12,6,0x423a32);r(4,4,8,8,0xd8ac61);r(3,6,10,4,0xb78554);r(6,5,4,6,0xffe6a0);r(5,6,6,4,0xffe6a0);r(7,7,2,2,0xa37035);r(7,12,2,2,0xf3eccf);
}
export function keepsakeThumb(u,parent,cx,cy){const g=u.add.graphics();parent.add(g);keepsakePixels(g,cx-8,cy-8);}
