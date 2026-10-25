"""Native semantic template registration for head/torso accessory anchors.
Offline NumPy tool only; no runtime dependency or body pixel modification.
"""
from PIL import Image
import numpy as np
def classify(im):
 a=np.array(im,dtype=np.int16);r,g,b,alpha=[a[:,:,i] for i in range(4)];out=np.zeros((64,64),dtype=np.uint8)
 out[(alpha>0)&(r<155)&(r>g*1.1)&(b<g*1.2)]=1
 out[(alpha>0)&(r>=188)&(r>g*1.25)&(g>b*1.22)]=2
 return out
def register_frames(root):
 frames={}
 for char in ['boy','girl']:
  atlas=Image.open(root/f'public/assets/pixel/processed/{char}.png').convert('RGBA')
  cells={n:atlas.crop((n%8*64,n//8*64,(n%8+1)*64,(n//8+1)*64)) for block,cnt in enumerate([4,8,6,6,6,6,6,6]) for d in range(4) for ph in range(cnt) for n in [block*32+d*8+ph]}
  refs=[]
  for d in range(4):
   im=classify(cells[d*8]);top=16 if char=='girl' else 17
   # The reference top includes the first native hair row.
   ys,xs=np.where(im[:30,:]>0);top=int(ys.min());cx=32
   refs.append((im[top:top+16,cx-8:cx+9],top,cx))
  frames[char]={}
  for n,im in cells.items():
   cls=classify(im);row=n%32//8;block=n//32
   windows=np.lib.stride_tricks.sliding_window_view(cls,(16,17))
   candidates=[]
   for hd in ([row] if block<2 or row==1 else [row,1] if row in [2,3] else [0,1,2,3]):
    ref,_,_=refs[hd];weights=np.where(ref==2,3, np.where(ref==1,2,1))
    scores=np.sum((windows==ref)*weights,axis=(-2,-1))
    # Give the actual facing direction a small preference for ties.
    scores=scores.astype(float)+(5 if hd==row else 0)
    scores[:10,:]=-1;scores[39:,:]=-1;scores[:,:8]=-1;scores[:,39:]=-1
    yy,xx=np.unravel_index(np.argmax(scores),scores.shape)
    candidates.append((scores[yy,xx],xx+8,yy,hd))
   _,cx,top,hd=max(candidates)
   # Face only: largest connected warm-skin component in this head crop.
   pts={(x,y) for y in range(top+3,min(64,top+16)) for x in range(max(0,cx-8),min(64,cx+9)) if cls[y,x]==2}
   groups=[]
   while pts:
    todo=[pts.pop()];group=[]
    while todo:
     p=todo.pop();group.append(p);x,y=p
     for q in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
      if q in pts:pts.remove(q);todo.append(q)
    groups.append(group)
   face=max(groups,key=len) if groups else []
   fx=round((min(x for x,y in face)+max(x for x,y in face))/2) if face else cx
   eyeCandidates=[y for y in range(top+7,min(64,top+14)) for x in range(max(1,cx-6),min(63,cx+7)) if cls[y,x]==1 and cls[y,x-1]==2 and cls[y,x+1]==2]
   ey=round(float(np.median(eyeCandidates))) if eyeCandidates else top+10
   clothY=[y for y in range(top+8,57) for x in range(max(0,cx-12),min(64,cx+13)) if (lambda p:p[3] and p[0] in [69,85,96,103,109] and p[1]>=p[0]*.96 and p[2]<p[1]*.9)(im.getpixel((x,y)))]
   shoulder=max(int(top)+10,min(int(top)+18,round(float(np.percentile(clothY,25)))-3)) if clothY else int(top)+15
   frames[char][n]=[int(cx),int(top),int(fx),int(ey),shoulder,int(row),int(hd)]
 return frames
