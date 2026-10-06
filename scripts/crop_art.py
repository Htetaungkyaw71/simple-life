"""Original tomato/soil pixels for Simple Life; no external source imagery."""
from PIL import Image, ImageDraw

def add_crop_art(assets):
    for name,base,shadow,light in [('field-soil','#9a7b61','#745743','#b49471'),('field-watered','#625565','#494651','#837381')]:
        im=Image.new('RGBA',(24,24),base);d=ImageDraw.Draw(im)
        # Broken, uneven furrows read as earth rather than continuous wooden boards.
        for row,y in enumerate((4,11,18)):
            for x in (2,12):
                shift=(row+x)%3
                d.line((x,y+shift,x+7,y+shift),fill=shadow)
                d.line((x+1,y+shift+1,x+6,y+shift+1),fill=light)
                d.point((x+8,y+shift-1),fill=shadow)
        d.line((1,0,22,0),fill=shadow);d.line((0,1,0,22),fill=shadow)
        for x,y in ((5,2),(18,9),(9,16),(21,23)):d.point((x,y),fill=light)
        if name=='field-watered':d.line((18,5,20,5),fill='#b8c6c3')
        assets[name]=im
    for state in ['seed','sprout','young','flowering','ripe','dry','wilted','dead']:
        im=Image.new('RGBA',(24,32));d=ImageDraw.Draw(im)
        d.ellipse((5,25,19,30),fill='#72564f');d.line((7,26,16,26),fill='#c5a17c')
        if state=='seed':
            d.rectangle((10,24,13,25),fill='#d8bb8d');d.point((11,24),fill='#fff0bf')
        else:
            dead=state=='dead';weak=state in ['dry','wilted'];ink='#344b40';stem='#699458' if not weak else '#8f9258'
            top={'sprout':20,'young':14,'flowering':8,'ripe':8,'dry':13,'wilted':18,'dead':18}[state]
            d.line((12,27,12,top),fill='#725642' if dead else ink,width=3)
            d.line((12,26,12,top),fill='#b59b75' if dead else stem)
            if dead:
                d.line((12,23,8,20),fill='#94795b');d.line((12,21,16,18),fill='#94795b');d.point((8,29),fill='#c3aa89')
            else:
                leaves=[(7,22,-1),(16,20,1)] if state=='sprout' else [(7,22,-1),(17,20,1),(7,16,-1),(16,13,1)]
                if state in ['flowering','ripe']:leaves += [(10,9,-1),(17,8,1)]
                for x,y,side in leaves:
                    if weak:y+=4 if state=='wilted' else 2
                    d.line((12,y+2,x,y+1),fill=ink)
                    pts=[(x-side*2,y),(x+side*3,y-2 if not weak else y+3),(x+side*4,y+2 if not weak else y+5),(x,y+4)]
                    d.polygon(pts,fill='#6f7548' if weak else '#3f8055');d.line((x,y+1,x+side*2,y),fill='#b0b875' if weak else '#8cbd69')
                if state=='flowering':
                    for x,y in [(7,12),(16,18),(13,7)]:d.rectangle((x-1,y-1,x+1,y+1),fill='#ebcc73');d.point((x,y),fill='#fff1c6')
                if state=='ripe':
                    for x,y in [(6,17),(15,12),(14,23),(7,24)]:
                        d.ellipse((x-2,y-2,x+3,y+3),fill='#803e49');d.ellipse((x-1,y-2,x+3,y+2),fill='#dc654f');d.point((x,y-1),fill='#ffc487');d.line((x,y-3,x+1,y-3),fill='#669452')
        assets['tomato-'+state]=im


def add_city_crop_art(assets):
    """Original native pixels: low berry crown, carrot leaves/root, tall corn stalk."""
    for crop in ('strawberry','carrot','corn'):
        for state in ('seed','sprout','young','flowering','ripe','dry','wilted','dead'):
            im=Image.new('RGBA',(24,32));d=ImageDraw.Draw(im)
            d.ellipse((4,26,20,30),fill='#72564f');d.line((7,27,17,27),fill='#c5a17c')
            weak=state in ('dry','wilted');dead=state=='dead'
            ink='#344b40';green='#66985a' if not weak else '#92905e';light='#a7c575' if not weak else '#bbb080'
            if state=='seed':
                d.rectangle((10,25,13,26),fill='#d8bb8d');d.point((11,25),fill='#fff0bf')
            elif dead:
                d.line((12,27,11,18),fill='#927552',width=2);d.line((11,22,6,19),fill='#b39a71');d.line((11,24,16,22),fill='#b39a71')
            elif crop=='strawberry':
                points=[(8,24),(14,23)] if state=='sprout' else [(5,23),(10,19),(16,20),(18,25),(11,25)]
                for x,y in points:
                    if weak:y+=3 if state=='wilted' else 1
                    d.line((12,28,x,y),fill=ink,width=2);d.polygon([(x-3,y),(x,y-4),(x+3,y),(x,y+3)],fill=green);d.line((x-1,y,x,y-2),fill=light)
                if state=='flowering':
                    for x,y in [(7,21),(15,23)]:d.ellipse((x-2,y-2,x+2,y+2),fill='#fff0ca');d.point((x,y),fill='#e4bb62')
                if state=='ripe':
                    for x,y in [(6,25),(13,23),(17,27)]:
                        d.polygon([(x-3,y-2),(x+2,y-2),(x+3,y+1),(x,y+5),(x-3,y+1)],fill='#713e53');d.polygon([(x-2,y-2),(x+1,y-2),(x+2,y+1),(x,y+3),(x-2,y+1)],fill='#e16e7c');d.point((x-1,y),fill='#ffdfae');d.point((x+1,y+1),fill='#ffdfae');d.line((x-2,y-3,x+1,y-3),fill='#69965b')
            elif crop=='carrot':
                top=21 if state=='sprout' else 12
                for dx in (-6,-3,0,3,6):
                    y=top+abs(dx)//2+(8 if state=='wilted' else 3 if weak else 0)
                    d.line((12,27,12+dx,y),fill=ink,width=3);d.line((12,26,12+dx,y),fill=green)
                    if state!='sprout':d.line((11+dx,y+4,8+dx,y+1),fill=green,width=2);d.line((12+dx,y+3,15+dx,y),fill=light,width=2)
                if state in ('flowering','ripe'):
                    d.polygon([(8,25),(15,24),(16,28),(12,31),(7,29)],fill='#975543');d.polygon([(9,25),(14,25),(14,28),(11,30),(8,28)],fill='#e99b50');d.line((10,26,13,26),fill='#ffe0a0')
                    if state=='ripe':d.polygon([(7,25),(15,24),(17,28),(12,31),(6,29)],fill='#e99b50');d.line((8,26,14,26),fill='#ffe0a0');d.line((9,29,13,28),fill='#bd7145')
            else:
                top=21 if state=='sprout' else 8 if state=='young' else 3
                if weak:top=14 if state=='dry' else 18
                d.line((12,28,12,top),fill=ink,width=3);d.line((12,27,12,top),fill=green)
                for x,y,side in [(7,23,-1),(16,18,1),(7,13,-1),(16,9,1)]:
                    if state=='sprout' and y<20:continue
                    if weak:y+=3
                    d.polygon([(12,y+4),(x+side*3,y-3),(x+side*2,y+3),(12,y+6)],fill=ink);d.line((12,y+4,x+side*2,y),fill=green,width=2);d.point((x+side,y),fill=light)
                if state in ('flowering','ripe'):
                    d.line((8,5,16,5),fill='#d9c987');d.line((10,3,14,3),fill='#eada9f')
                if state=='ripe':
                    for x,y in [(7,17),(16,22)]:
                        d.rounded_rectangle((x-2,y-4,x+2,y+4),radius=1,fill='#7f6950');d.rectangle((x-1,y-3,x+1,y+3),fill='#eac76d');d.point((x,y-2),fill='#fff0b0');d.line((x-3,y+4,x-2,y),fill=green)
            assets[crop+'-'+state]=im
    for crop in ('tomato','strawberry','carrot','corn'):
        im=Image.new('RGBA',(16,16));d=ImageDraw.Draw(im)
        if crop in ('tomato','strawberry'):
            if crop=='tomato':d.ellipse((3,4,13,14),fill='#7f4050');d.ellipse((4,4,12,12),fill='#de7058')
            else:d.polygon([(3,5),(6,3),(11,3),(14,6),(12,11),(8,15),(4,11)],fill='#84485d');d.polygon([(4,5),(7,4),(11,4),(12,7),(8,13),(5,10)],fill='#e27a88');d.point((7,7),fill='#ffdfae');d.point((10,9),fill='#ffdfae')
            d.line((5,3,11,3),fill='#528b64',width=2);d.point((6,6),fill='#ffd6a2')
        elif crop=='carrot':
            d.polygon([(6,5),(12,7),(10,12),(4,15),(4,11)],fill='#8b544a');d.polygon([(7,6),(11,7),(8,12),(5,13)],fill='#eda458');d.line((7,8,9,9),fill='#ffe2a0');d.line((8,5,6,1),fill='#63975e',width=2);d.line((9,5,12,1),fill='#8dc06c',width=2)
        else:
            d.rounded_rectangle((5,2,11,14),radius=2,fill='#8c7852');d.rectangle((6,3,10,12),fill='#e8c56a')
            for y in (4,7,10):d.line((7,y,9,y),fill='#ffecae')
            d.line((4,14,3,7),fill='#5b9167',width=2);d.line((11,14,13,6),fill='#82b572',width=2)
        assets[crop+'-item']=im
        seed=Image.new('RGBA',(16,16));sd=ImageDraw.Draw(seed);sd.rectangle((3,1,12,14),fill='#725b51');sd.rectangle((4,2,11,13),fill='#dbb981');sd.rectangle((4,2,11,4),fill='#f2d8a3');seed.alpha_composite(im.resize((8,8),Image.Resampling.NEAREST),(4,5));assets[crop+'-seed-item']=seed


def add_stall_art(assets):
    paving=Image.new('RGBA',(16,16),'#8d9c8b');pd=ImageDraw.Draw(paving)
    for y in range(0,16,8):
        for x in range(-4 if y else 0,16,8):
            pd.rectangle((x+1,y+1,x+7,y+7),fill='#bdc2a4');pd.line((x+2,y+2,x+6,y+2),fill='#d8d2b3');pd.line((x+7,y+3,x+7,y+7),fill='#a3af95')
    assets['town-paving']=paving
    for name,col in [('seed-stall','#699e85'),('produce-stall','#b66e7b')]:
        im=Image.new('RGBA',(80,64));d=ImageDraw.Draw(im)
        d.ellipse((2,54,77,63),fill=(35,46,60,70))
        d.rectangle((3,20,7,62),fill='#694757');d.rectangle((4,20,5,61),fill='#c18d62');d.rectangle((72,20,76,62),fill='#694757');d.rectangle((73,20,74,61),fill='#c18d62')
        d.rectangle((8,22,71,27),fill='#956448');d.line((9,23,70,23),fill='#dbb57b')
        for x in (13,24,54,65):d.rectangle((x,19,x+5,22),fill='#b8c483' if name=='seed-stall' else '#d58764')
        d.polygon([(1,17),(10,3),(68,3),(78,17),(78,22),(1,22)],fill='#34344f');d.polygon([(3,17),(11,5),(67,5),(76,17),(76,20),(3,20)],fill=col)
        for x in range(13,70,14):d.polygon([(x,5),(x+6,5),(x+8,19),(x,19)],fill='#e7cf9f')
        d.rectangle((3,20,76,22),fill='#bd9870');d.line((4,20,75,20),fill='#ffe1ab')
        d.rectangle((4,44,75,60),fill='#694757');d.rectangle((5,43,74,47),fill='#e2bc86');d.rectangle((6,48,73,58),fill='#aa7659');d.line((7,48,72,48),fill='#ce9d6b')
        for x in range(12,73,14):d.line((x,49,x,58),fill='#865b4d')
        for x in (14,58):d.rectangle((x,38,x+7,43),fill='#619575' if name=='seed-stall' else '#d5846c');d.line((x+1,39,x+5,39),fill='#dbca90')
        assets[name]=im
    for stem,npc in [('seed-keeper','npc0'),('produce-keeper','npc1')]:
        assets[stem+'0']=assets[npc].copy();im=assets[npc].copy();d=ImageDraw.Draw(im)
        for x in (9,15):d.line((x,10,x,11),fill='#ecb889');d.point((x,11),fill='#34344f')
        assets[stem+'1']=im
