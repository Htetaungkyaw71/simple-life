"""Original olive forest crowns, palms and low palmettos, drawn in native pixels.
References guide density and palette only; no screenshot pixels are sampled.
"""
from PIL import Image, ImageDraw
import random, math
INK='#29351f';DEEP='#3c4828';DARK='#596536';MID='#7d8949';LIGHT='#9da55e';TIP='#b9be79'

def lobe(d,cx,cy,rx,ry,rng,tones=(DEEP,DARK,MID,LIGHT)):
    # A stepped, uneven contour gives leaves a pixel silhouette rather than ovals.
    pts=[]
    for k in range(32):
        a=k*math.tau/32;r=1+rng.choice([-.12,-.05,.02,.09])
        pts.append((round(cx+math.cos(a)*rx*r),round(cy+math.sin(a)*ry*r)))
    d.polygon(pts,fill=INK)
    inner=[(round(cx+(x-cx)*.90),round(cy+(y-cy)*.88)-1) for x,y in pts]
    d.polygon(inner,fill=tones[0])
    d.polygon([(x,y-2) for x,y in inner if y<cy+ry*.45],fill=tones[1])
    d.polygon([(round(cx+(x-cx)*.79),round(cy+(y-cy)*.76)-4) for x,y in pts],fill=tones[2])
    for n in range(10):
        x=cx+rng.randint(-max(1,rx-5),max(1,rx-5));y=cy+rng.randint(-max(1,ry-4),max(1,ry-4))
        if ((x-cx)/rx)**2+((y-cy)/ry)**2>.65:continue
        c=tones[3] if y<cy+1 else tones[1]
        d.polygon([(x-3,y),(x-1,y-2),(x+3,y-2),(x+5,y),(x+2,y+2),(x-2,y+1)],fill=c)

def add_forest_canopies(assets):
    for variant in range(3):
        im=Image.new('RGBA',(80,112));d=ImageDraw.Draw(im);rng=random.Random(1037+variant)
        d.polygon([(31,110),(46,110),(42,102),(43,63),(54,42),(49,37),(39,54),(29,40),(24,44),(35,64),(35,102)],fill='#3e332a')
        d.polygon([(34,109),(40,104),(39,62),(33,49),(30,48),(36,67),(36,100)],fill='#a0714d')
        d.polygon([(40,105),(43,107),(42,68),(40,68)],fill='#704b36')
        d.line((37,70,37,101),fill='#bb8a60',width=2)
        for y in [76,88,96]:d.line((40,y,42,y-3),fill='#453729')
        # Separate boughs, lower dark crown, and broad sunlit top clusters.
        crowns=[[(15,59,14,14),(65,60,14,13),(40,55,21,17),(18,34,16,16),(62,32,16,16),(39,23,22,20)],[(17,59,15,13),(63,58,15,15),(35,53,17,14),(16,37,16,14),(43,33,22,16),(66,34,13,14),(29,20,21,16),(54,17,18,14)],[(13,65,12,14),(66,64,12,12),(31,62,18,14),(52,51,18,17),(14,45,12,15),(31,38,18,18),(63,29,14,15),(40,20,20,15)]]
        for cx,cy,rx,ry in crowns[variant]:
            lobe(d,cx+(variant-1)*rng.randrange(3),cy,rx,ry,rng)
        assets[f'forest-oak-{variant}']=im
    for variant in range(2):
        im=Image.new('RGBA',(96,128));d=ImageDraw.Draw(im)
        d.polygon([(43,126),(56,126),(51,103),(50,78),(48,34),(43,34),(46,77),(47,104)],fill='#423327')
        d.polygon([(46,123),(50,121),(48,89),(47,39),(44,39),(46,83),(47,106)],fill='#a3734d')
        for y in range(52,120,8):d.line((47,y,50,y+2),fill='#694b34');d.line((45,y-1,47,y-1),fill='#c09160')
        targets=[(5,48),(13,69),(28,83),(80,77),(92,43),(77,17),(48,3),(19,10)]
        for n,(tx,ty) in enumerate(targets):
            tx+=variant*(1 if n%2 else -1)*3
            spine=[(round(47+(tx-47)*k/12),round(35+(ty-35)*k/12-11*math.sin(math.pi*k/12))) for k in range(13)]
            # Solid frond bodies plus ragged leaf tips; broad fronds read at 2x.
            top=[];bottom=[]
            for k,(x,y) in enumerate(spine):
                spread=round(10*math.sin(math.pi*k/12))+1
                top.append((x,y-spread));bottom.append((x,y+spread+(k%2)))
            d.polygon(top+list(reversed(bottom)),fill=INK)
            d.polygon([(x,y+1) for x,y in top[1:-1]]+[(x,y-2) for x,y in reversed(bottom[1:-1])],fill=LIGHT if n>=4 else MID)
            for k in range(1,12):
                x,y=spine[k];spread=round(10*math.sin(math.pi*k/12))
                d.line((x,y-spread+1,x,y+spread-1),fill=LIGHT if n>=4 else MID,width=3)
                if k%2:d.line((x,y+1,x-2 if tx<47 else x+2,y+spread+2),fill=DARK,width=2)
            d.line(spine,fill=TIP if n>=4 else LIGHT,width=1)
        d.ellipse((43,33,50,40),fill='#694b34');d.rectangle((43,35,46,37),fill='#b19159')
        assets[f'forest-palm-{variant}']=im
    for variant in range(2):
        im=Image.new('RGBA',(40,40));d=ImageDraw.Draw(im);cx=20
        for n,(tx,ty) in enumerate([(1,21),(4,9),(13,2),(23,0),(34,6),(39,18),(34,32)]):
            d.polygon([(cx-2,37),(tx,ty),(tx+5 if tx<cx else tx-5,ty+10),(cx+2,37)],fill=INK)
            d.polygon([(cx,34),(tx+1,ty+3),(tx+4 if tx<cx else tx-4,ty+11)],fill=MID if n%2 else LIGHT)
            d.line((cx,34,tx+1,ty+4),fill=TIP,width=1)
            for k in range(3,9,2):
                x=round(cx+(tx-cx)*k/10);y=round(34+(ty-34)*k/10)
                d.line((x,y,x+(-3 if tx<cx else 3),y+4),fill=DARK,width=2)
        d.polygon([(13,38),(19,29),(25,38)],fill=DARK)
        if variant:im=im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        assets[f'forest-palmetto-{variant}']=im
