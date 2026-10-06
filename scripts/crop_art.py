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
