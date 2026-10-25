"""Crop atlas sources for Simple Life, including the approved Tomato import."""
from pathlib import Path
from PIL import Image, ImageDraw
from import_sheet import candidate_frames

ROOT=Path(__file__).resolve().parents[1]
TOMATO_IMPORT=ROOT/'docs/assets/licenses/tomato-import-v1/candidate-b-runtime.png'
TOMATO_ITEM_IMPORT=ROOT/'docs/assets/licenses/tomato-icons-v1/tomato-item-candidate.png'
TOMATO_SEED_ITEM_IMPORT=ROOT/'docs/assets/licenses/tomato-icons-v1/tomato-seed-item-candidate.png'
TOMATO_STATES=('seed','sprout','young','flowering','ripe','dry','wilted','dead')
CITY_CROP_IMPORTS={
    crop:ROOT/'docs/assets/licenses'/f'{crop}-import-v1'
    for crop in ('strawberry','carrot','corn')
}

def _imported_tomato_frames():
    """Return the approved source-native 48x70 frames without resampling."""
    sheet=Image.open(TOMATO_IMPORT).convert('RGBA')
    assert sheet.size==(48*len(TOMATO_STATES),70),sheet.size
    assert set(sheet.getchannel('A').get_flattened_data())<={0,255}
    return {
        state:sheet.crop((index*48,0,(index+1)*48,70))
        for index,state in enumerate(TOMATO_STATES)
    }

def _imported_tomato_icon(path):
    """Return one approved source-native 24x24 icon without resampling."""
    icon=Image.open(path).convert('RGBA')
    assert icon.size==(24,24),icon.size
    assert set(icon.getchannel('A').get_flattened_data())<={0,255}
    return icon

TOMATO_PALETTE={
    'leaf_outline':'#193f2a','leaf_shadow':'#286139','leaf_base':'#408744','leaf_light':'#69ad50','leaf_highlight':'#a2d166',
    'stem_outline':'#315229','stem_base':'#567a35','stem_highlight':'#91b954',
    'wood_outline':'#4a3426','wood_shadow':'#765238','wood_base':'#a4774c','wood_highlight':'#cca168',
    'flower_shadow':'#c98a1a','flower_base':'#f5d442','flower_highlight':'#fff0a0',
    'fruit_outline':'#6a1d24','fruit_shadow':'#a3292c','fruit_base':'#d63b34','fruit_highlight':'#f06a4a','fruit_glint':'#ffe3cf',
    'green_fruit_outline':'#234a2e','green_fruit_shadow':'#2f6b3a','green_fruit_base':'#4f9a45','green_fruit_highlight':'#8cc65a',
    'soil_outline':'#5a3428','soil_shadow':'#743e2b','soil_base':'#a65a38','soil_highlight':'#cf8050',
    'contact_outline':'#543126','contact_base':'#6d3c2c',
    'seed_outline':'#a68255','seed_base':'#ead8a4','seed_highlight':'#fff1c7',
    'dry_outline':'#4a3a24','dry_shadow':'#73713d','dry_base':'#8a8a4a','dry_light':'#b9a470','dry_highlight':'#dbc58a',
    'wilt_outline':'#453c2b','wilt_shadow':'#696b47','wilt_base':'#858052','wilt_light':'#b09a68','wilt_highlight':'#c8b37b',
    'dead_outline':'#443124','dead_shadow':'#65462f','dead_base':'#815c3d','dead_light':'#a97f57','dead_highlight':'#d1b17a',
    'string_shadow':'#6d5a3e','string_base':'#cdbb83',
}

def _tomato_contact(d,p=TOMATO_PALETTE,width=10):
    x0=(24-width)//2
    d.ellipse((x0,29,x0+width-1,31),fill=p['contact_outline'])
    d.ellipse((x0+2,29,x0+width-3,30),fill=p['contact_base'])
    d.point((x0+1,30),fill=p['contact_base'])

def _tomato_stake(d,top=5,x=14,bottom=29,p=TOMATO_PALETTE):
    d.line((x,top,x,bottom),fill=p['wood_outline'],width=2)
    d.line((x,top+1,x,bottom-1),fill=p['wood_base'])
    d.point((x,top+1),fill=p['wood_highlight'])
    for y in range(top+5,bottom,6):d.point((x,y),fill=p['wood_shadow'])

def _tomato_stem(d,points,p=TOMATO_PALETTE):
    d.line(points,fill=p['stem_outline'],width=2,joint='curve')
    d.line(points,fill=p['stem_base'],width=1,joint='curve')
    if len(points)>2:d.point((points[-2][0]-1,points[-2][1]-1),fill=p['stem_highlight'])

def _tomato_tie(d,x,y,stake=14,p=TOMATO_PALETTE):
    lo=min(x,stake);hi=max(x,stake)
    d.line((lo,y,hi,y),fill=p['string_shadow'])
    if hi-lo>1:d.line((lo+1,y-1,hi-1,y-1),fill=p['string_base'])

def _tomato_cluster(d,anchor,side,p=TOMATO_PALETTE,droop=False,small=False):
    """One connected, serrated compound leaf with four-tone hand-pixel shading."""
    x,y=anchor
    if droop:
        raw=[(0,0),(2,-1),(4,0),(5,1),(7,1),(6,3),(7,4),(5,5),(5,7),(3,6),(2,8),(1,6),(0,4)]
        if small:raw=[(0,0),(2,0),(3,1),(4,2),(3,4),(2,3),(1,5),(0,3)]
    else:
        raw=[(0,0),(1,-2),(3,-2),(3,-4),(5,-3),(6,-4),(7,-2),(9,-2),(8,0),(9,1),(7,2),(6,4),(4,3),(3,4),(2,2),(0,2)]
        if small:raw=[(0,0),(1,-2),(3,-2),(4,-3),(6,-2),(5,0),(7,1),(5,2),(3,2),(2,3),(1,1)]
    pts=[(x+side*dx,y+dy) for dx,dy in raw]
    d.polygon(pts,fill=p['leaf_outline'])
    if droop:
        base=[(x+side*1,y),(x+side*3,y),(x+side*4,y+1),(x+side*6,y+2),(x+side*5,y+4),(x+side*4,y+4),(x+side*4,y+6),(x+side*3,y+5),(x+side*2,y+7),(x+side*1,y+5)]
        if small:base=[(x+side*1,y),(x+side*3,y+1),(x+side*3,y+3),(x+side*2,y+3),(x+side*1,y+4)]
        d.polygon(base,fill=p['leaf_base'])
        d.line((x+side*3,y+3,x+side*4,y+5),fill=p['leaf_shadow'])
        d.line((x+side,y,x+side*3,y),fill=p['leaf_light'])
        d.point((x+side*5,y+2),fill=p['leaf_light'])
        d.point((x+(side if side<0 else 0),y-1),fill=p['leaf_highlight'])
    else:
        base=[(x+side,y),(x+side*2,y-1),(x+side*3,y-3),(x+side*5,y-2),(x+side*6,y-3),(x+side*7,y-1),(x+side*7,y+1),(x+side*5,y+2),(x+side*4,y+2),(x+side*3,y+3),(x+side*2,y+1)]
        if small:base=[(x+side,y),(x+side*2,y-1),(x+side*4,y-2),(x+side*5,y-1),(x+side*5,y+1),(x+side*3,y+1),(x+side*2,y+2)]
        d.polygon(base,fill=p['leaf_base'])
        d.line((x+side,y,x+side*4,y),fill=p['leaf_shadow'])
        d.line((x+side*2,y-1,x+side*4,y-2),fill=p['leaf_light'])
        d.point((x+side*3-(1 if side>0 else 0),y-3),fill=p['leaf_highlight'])
        d.point((x+side*6-(1 if side>0 else 0),y-2),fill=p['leaf_light'])

def _tomato_flower(d,x,y,p=TOMATO_PALETTE):
    d.point((x,y-1),fill=p['flower_highlight']);d.point((x-1,y),fill=p['flower_base']);d.point((x+1,y),fill=p['flower_base']);d.point((x,y+1),fill=p['flower_base']);d.point((x,y),fill=p['flower_shadow'])
    d.point((x-1,y-1),fill=p['flower_base'])

def _tomato_fruit(d,x,y,ripe=True,p=TOMATO_PALETTE,toward=1):
    prefix='fruit_' if ripe else 'green_fruit_'
    if ripe:
        d.line((x,y-4,x+toward*3,y-5),fill=p['stem_outline'])
        outline=[(x-1,y-2),(x+1,y-2),(x+2,y-1),(x+2,y+1),(x+1,y+2),(x-1,y+2),(x-2,y+1),(x-2,y-1)]
        d.polygon(outline,fill=p[prefix+'outline']);d.polygon([(x-1,y-1),(x+1,y-1),(x+1,y+1),(x,y+2),(x-1,y+1)],fill=p[prefix+'base'])
        d.line((x+1,y,x+1,y+1),fill=p[prefix+'shadow']);d.point((x-1,y),fill=p[prefix+'highlight']);d.point((x-1,y-1),fill=p['fruit_glint'])
        d.point((x,y-2),fill=p['leaf_base']);d.point((x-1,y-3),fill=p['leaf_outline']);d.point((x+1,y-3),fill=p['leaf_outline']);d.point((x,y-3),fill=p['leaf_highlight'])
    else:
        d.line((x,y-3,x+toward*3,y-4),fill=p['stem_outline'])
        d.ellipse((x-2,y-1,x+1,y+2),fill=p[prefix+'outline']);d.rectangle((x-1,y,x,y+1),fill=p[prefix+'base']);d.point((x-1,y),fill=p[prefix+'highlight'])
        d.point((x-1,y-2),fill=p['leaf_outline']);d.point((x+1,y-2),fill=p['leaf_outline']);d.point((x,y-2),fill=p['leaf_highlight'])

def _tomato_distressed_palette(p,stem='dry'):
    return {**p,'leaf_outline':p[stem+'_outline'],'leaf_shadow':p[stem+'_shadow'],'leaf_base':p[stem+'_base'],'leaf_light':p[stem+'_light'],'leaf_highlight':p[stem+'_highlight'],'stem_outline':p[stem+'_outline'],'stem_base':p[stem+'_base'],'stem_highlight':p[stem+'_highlight']}

def _tomato_frame(state):
    p=TOMATO_PALETTE;im=Image.new('RGBA',(24,32));d=ImageDraw.Draw(im)
    if state=='seed':
        _tomato_contact(d,width=12)
        d.polygon([(6,29),(8,26),(11,24),(15,25),(18,28),(17,30),(7,30)],fill=p['soil_outline'])
        d.polygon([(8,28),(10,26),(15,26),(17,28),(16,29),(8,29)],fill=p['soil_shadow'])
        d.polygon([(9,27),(11,25),(15,26),(16,28),(12,28)],fill=p['soil_base']);d.line((8,28,11,28),fill=p['soil_highlight'])
        for x,y in ((10,24),(13,25),(16,25)):
            d.rectangle((x,y-1,x+1,y),fill=p['seed_outline']);d.line((x,y-1,x+1,y-1),fill=p['seed_base'])
        d.point((10,23),fill=p['seed_highlight']);d.point((13,24),fill=p['seed_highlight'])
        return im
    if state=='sprout':
        _tomato_contact(d)
        d.line((12,29,12,21),fill=p['stem_outline'],width=2);d.line((11,28,11,21),fill=p['stem_base']);d.point((11,22),fill=p['stem_highlight'])
        d.polygon([(11,22),(9,23),(7,22),(7,20),(9,19),(11,20)],fill=p['leaf_outline']);d.polygon([(10,22),(8,21),(9,20),(11,21)],fill=p['leaf_base']);d.point((8,20),fill=p['leaf_highlight'])
        d.polygon([(12,21),(14,18),(17,19),(18,21),(16,23),(13,22)],fill=p['leaf_outline']);d.polygon([(13,21),(15,19),(17,20),(16,22),(14,22)],fill=p['leaf_base']);d.point((15,19),fill=p['leaf_highlight'])
        return im
    if state=='young':
        _tomato_contact(d);_tomato_stake(d,10,14);_tomato_stem(d,[(11,29),(11,25),(12,21),(11,17),(12,12)])
        _tomato_cluster(d,(11,23),-1);_tomato_cluster(d,(12,16),1)
        _tomato_tie(d,11,24);_tomato_tie(d,12,15)
        return im
    if state=='flowering':
        _tomato_contact(d);_tomato_stake(d,5,14);_tomato_stem(d,[(11,29),(11,25),(12,21),(11,17),(12,13),(11,9),(12,6)])
        _tomato_cluster(d,(11,25),-1);_tomato_cluster(d,(12,17),1);_tomato_cluster(d,(11,10),-1,small=True)
        _tomato_tie(d,11,23);_tomato_tie(d,12,11)
        d.line((12,8,17,7),fill=p['stem_outline']);d.line((11,14,6,14),fill=p['stem_outline']);d.line((12,21,18,22),fill=p['stem_outline'])
        _tomato_flower(d,18,7);_tomato_flower(d,5,14);_tomato_flower(d,19,22)
        d.point((7,19),fill=p['green_fruit_outline']);d.point((7,20),fill=p['green_fruit_base']);d.point((6,18),fill=p['stem_outline'])
        return im
    if state=='ripe':
        _tomato_contact(d);_tomato_stake(d,2,14);_tomato_stem(d,[(11,29),(12,25),(11,21),(12,17),(11,13),(12,9),(11,4)])
        _tomato_cluster(d,(11,26),-1,small=True);_tomato_cluster(d,(12,20),1);_tomato_cluster(d,(11,14),-1);_tomato_cluster(d,(12,7),1,small=True)
        _tomato_tie(d,11,24);_tomato_tie(d,12,11)
        _tomato_fruit(d,6,7,True,toward=1);_tomato_fruit(d,18,13,True,toward=-1);_tomato_fruit(d,6,20,True,toward=1)
        _tomato_fruit(d,18,27,False,toward=-1);_tomato_fruit(d,9,29,False,toward=1)
        return im
    if state=='dry':
        q=_tomato_distressed_palette(p,'dry');_tomato_contact(d);_tomato_stake(d,7,14,p=q);_tomato_stem(d,[(11,29),(11,25),(12,21),(11,17),(12,12),(11,8)],q)
        _tomato_cluster(d,(11,22),-1,q,True);_tomato_cluster(d,(11,15),1,q,True);_tomato_cluster(d,(11,9),-1,q,True,small=True)
        _tomato_tie(d,11,24,p=q);_tomato_tie(d,11,14,p=q)
        d.polygon([(16,22),(18,21),(19,23),(18,26),(16,25)],fill=q['leaf_outline']);d.point((17,22),fill=q['leaf_highlight'])
        return im
    if state=='wilted':
        q=_tomato_distressed_palette(p,'wilt');_tomato_contact(d);_tomato_stake(d,10,15,p=q);_tomato_stem(d,[(11,29),(10,25),(9,21),(8,18),(7,14),(6,12)],q)
        _tomato_cluster(d,(10,24),1,q,True);_tomato_cluster(d,(8,19),-1,q,True);_tomato_cluster(d,(7,14),1,q,True,small=True)
        _tomato_tie(d,10,23,15,q);d.line((13,15,15,15),fill=q['string_shadow']);d.point((12,16),fill=q['string_base'])
        return im
    q=_tomato_distressed_palette(p,'dead');_tomato_contact(d);_tomato_stem(d,[(13,29),(12,26),(13,23),(11,21)],q)
    d.line((12,26,8,24),fill=q['stem_outline']);d.line((8,24,6,27),fill=q['stem_base']);d.line((13,24,17,22),fill=q['stem_outline']);d.line((16,23,18,27),fill=q['stem_base'])
    d.polygon([(5,26),(7,24),(9,25),(8,28),(6,29)],fill=q['leaf_outline']);d.polygon([(6,26),(8,25),(7,28),(6,28)],fill=q['leaf_base'])
    d.polygon([(16,24),(18,22),(20,24),(19,28),(17,27)],fill=q['leaf_outline']);d.polygon([(17,24),(19,24),(18,27),(17,26)],fill=q['leaf_base'])
    d.point((10,22),fill=q['leaf_highlight']);d.point((6,26),fill=q['leaf_highlight']);d.point((17,23),fill=q['leaf_light'])
    return im

def _tomato_item():
    p=TOMATO_PALETTE;im=Image.new('RGBA',(16,16));d=ImageDraw.Draw(im)
    fruit=[(4,4),(6,3),(10,3),(12,4),(14,7),(14,11),(12,14),(5,14),(2,11),(2,7)]
    d.polygon(fruit,fill=p['fruit_outline']);d.polygon([(4,6),(6,4),(10,4),(13,7),(13,11),(11,13),(5,13),(3,10),(3,7)],fill=p['fruit_shadow'])
    d.polygon([(4,6),(7,4),(10,5),(12,7),(12,10),(10,12),(5,12),(3,10),(3,7)],fill=p['fruit_base'])
    d.line((5,6,9,5),fill=p['fruit_highlight']);d.rectangle((4,6,5,7),fill=p['fruit_glint'])
    d.polygon([(5,4),(7,3),(8,4),(9,2),(10,4),(12,4),(10,6),(8,5),(6,6)],fill=p['leaf_outline'])
    d.line((7,4,10,4),fill=p['leaf_base']);d.point((7,3),fill=p['leaf_highlight']);d.line((9,3,9,1),fill=p['stem_outline'])
    return im

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
    for state,frame in _imported_tomato_frames().items():
        assets['tomato-'+state]=frame


def add_city_crop_art(assets):
    """Original native pixels: low berry crown, carrot leaves/root, tall corn stalk."""
    for crop in ('strawberry','carrot','corn'):
        for state in ('seed','sprout','young','flowering','ripe','dry','wilted','dead'):
            im=Image.new('RGBA',(24,32));d=ImageDraw.Draw(im)
            # Transparent roots let the real dry/watered bed show through.
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
    # Verified native sheets replace only the existing plant keys. Item icons
    # remain unchanged because this import pass covers plant artwork only.
    for crop,record_dir in CITY_CROP_IMPORTS.items():
        for state,frame in candidate_frames(record_dir).items():
            assets[crop+'-'+state]=frame
    for crop in ('tomato','strawberry','carrot','corn'):
        im=Image.new('RGBA',(16,16));d=ImageDraw.Draw(im)
        if crop in ('tomato','strawberry'):
            if crop=='tomato':im=_imported_tomato_icon(TOMATO_ITEM_IMPORT);d=ImageDraw.Draw(im)
            else:d.polygon([(3,5),(6,3),(11,3),(14,6),(12,11),(8,15),(4,11)],fill='#84485d');d.polygon([(4,5),(7,4),(11,4),(12,7),(8,13),(5,10)],fill='#e27a88');d.point((7,7),fill='#ffdfae');d.point((10,9),fill='#ffdfae');d.line((5,3,11,3),fill='#528b64',width=2);d.point((6,6),fill='#ffd6a2')
        elif crop=='carrot':
            d.polygon([(6,5),(12,7),(10,12),(4,15),(4,11)],fill='#8b544a');d.polygon([(7,6),(11,7),(8,12),(5,13)],fill='#eda458');d.line((7,8,9,9),fill='#ffe2a0');d.line((8,5,6,1),fill='#63975e',width=2);d.line((9,5,12,1),fill='#8dc06c',width=2)
        else:
            d.rounded_rectangle((5,2,11,14),radius=2,fill='#8c7852');d.rectangle((6,3,10,12),fill='#e8c56a')
            for y in (4,7,10):d.line((7,y,9,y),fill='#ffecae')
            d.line((4,14,3,7),fill='#5b9167',width=2);d.line((11,14,13,6),fill='#82b572',width=2)
        assets[crop+'-item']=im
        seed=Image.new('RGBA',(16,16));sd=ImageDraw.Draw(seed);sd.rectangle((3,1,12,14),fill='#725b51');sd.rectangle((4,2,11,13),fill='#dbb981');sd.rectangle((4,2,11,4),fill='#f2d8a3')
        if crop=='tomato':
            seed=_imported_tomato_icon(TOMATO_SEED_ITEM_IMPORT)
        else:seed.alpha_composite(im.resize((8,8),Image.Resampling.NEAREST),(4,5))
        assets[crop+'-seed-item']=seed


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
