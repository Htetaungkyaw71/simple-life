"""Curate licensed animal pixels, with explicit species adaptations.

Only selected animation cells join the town atlas. No generative model,
pack preview, source archive or remote request is used by the game.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import io, os, zipfile, json

ROOT = Path('public/assets/vendor/wildlife')
LPC = 'lpc animals 2022 v1.1/individual creature spritesheets/'

def add_wildlife_sprites(assets):
    records, rigs = {}, {}
    lpc = zipfile.ZipFile(ROOT / 'lpc_animals_2022_v1.1.zip')
    wolf = zipfile.ZipFile(ROOT / 'Wolf_2.zip')
    elephant = zipfile.ZipFile(ROOT / 'elephant-1.1.zip')
    stojkea_path = Path(os.environ.get('SIMPLE_LIFE_ANIMALS_ZIP', str(Path.home() / 'Downloads/Animals v1.0.zip')))
    stojkea = zipfile.ZipFile(stojkea_path)
    panther_path = Path(os.environ.get('SIMPLE_LIFE_ENDANGERED_PNG', str(Path.home() / 'Downloads/endangered_animals_ilaria_lazzartotto.png')))

    def load(z, name):
        return Image.open(io.BytesIO(z.read(name))).convert('RGBA')

    def cleanup(im):
        # LPC's unused cells use a magenta key. Preserve all native animal alpha.
        im = im.copy()
        for y in range(im.height):
            for x in range(im.width):
                r, g, b, a = im.getpixel((x, y))
                if r > 240 and b > 240 and g < 20:
                    im.putpixel((x, y), (0, 0, 0, 0))
        return im

    def register(species, actions, source, modifications='', facing=None):
        cells = [cell for directions in actions.values() for row in directions.values() for cell, rect in row]
        bounds = [cell.getbbox() for cell in cells if cell.getbbox()]
        left, top = min(b[0] for b in bounds), min(b[1] for b in bounds)
        right, bottom = max(b[2] for b in bounds), max(b[3] for b in bounds)
        # Common crop across every action/direction: never trim each pose separately.
        # Keep the source cell's horizontal centre, for stable ground-foot anchors.
        centre = cells[0].width // 2
        radius = max(centre-left, right-centre)
        crop = (max(0, centre-radius), top, min(cells[0].width, centre+radius), bottom)
        counts, origins = {}, {}
        for directions in actions.values():
            for direction, row in directions.items():
                foot=max(cell.getbbox()[3] for cell, _ in row if cell.getbbox())
                origins[direction]=max(origins.get(direction,0), (foot-top)/(bottom-top))
        for action, directions in actions.items():
            for direction, row in directions.items():
                counts[action] = len(row)
                for i, (cell, rect) in enumerate(row):
                    name = f'wa-{species}-{action}-{direction}-{i}'
                    assets[name] = cell.crop(crop)
                    records[name] = {**source, 'rectangle': list(rect), 'commonTrim': list(crop), 'modifications': 'Selected cells; common transparent-padding trim; local atlas repack. '+modifications}
                    if 'inputFrames' in source: records[name]['file']=source['inputFrames'][i]
                    if 'animationFiles' in source: records[name]['file']=source['animationFiles'].get(action,source['animationFiles']['walk'])
        rigs[species] = {'directional': facing is None, 'facing': facing or 'right', 'counts': counts, 'width': crop[2]-crop[0], 'height': crop[3]-crop[1], 'origins': origins}
        # Superseded geometric placeholders are not shipped as unused pack cells.
        for i in range(4):
            assets.pop(species+str(i), None)

    def sheet_rows(sheet, cellw, cellh, directions, frames):
        return {direction: [(cleanup(sheet.crop((i*cellw, row*cellh, (i+1)*cellw, (row+1)*cellh))), (i*cellw, row*cellh, (i+1)*cellw, (row+1)*cellh)) for i in range(frames)] for row, direction in enumerate(directions)}

    lpc_source = {'creator':'tapatilorenzo', 'license':'CC0 (creator exception for non-Sevarihk animals)', 'source':'https://opengameart.org/content/lpc-bears-deer-lions-and-more', 'archive':'lpc_animals_2022_v1.1.zip'}
    for species, file in [('lion','lion.png'), ('polarBear','bear, polar.png')]:
        path = LPC+file
        directions=['up','right','left','down'] if species=='polarBear' else ['up','left','right','down']
        rows = sheet_rows(load(lpc,path),64,64,directions,4)
        actions = {'idle':{d:[r[0]] for d,r in rows.items()}, 'walk':rows, 'run':rows}
        if species == 'polarBear':
            attack = sheet_rows(load(lpc,path).crop((0,256,320,512)),64,64,directions,4)
            actions['attack'] = {d:[(im,(rect[0],rect[1]+256,rect[2],rect[3]+256)) for im,rect in r] for d,r in attack.items()}
        register(species,actions,{**lpc_source,'file':path})

    # A lioness provides an anatomically readable four-direction feline walk.
    path = LPC+'lioness.png'
    rows = sheet_rows(load(lpc,path),64,64,['up','left','right','down'],4)
    tiger = {}
    for direction, row in rows.items():
        tiger[direction] = []
        for im, rect in row:
            im=im.copy()
            for y in range(im.height):
                for x in range(im.width):
                    r,g,b,a=im.getpixel((x,y))
                    if a and r>g*1.1 and r>80:
                        light=(r+g+b)/3
                        tone=(184,109,49) if light<95 else (215,141,65) if light<140 else (235,174,93)
                        body=(22<y<48 and 15<x<54) if direction in ['left','right'] else (12<y<47 and 23<x<42)
                        if body and (x+y//3)%9<2:tone=(54,48,35)
                        im.putpixel((x,y),(*tone,a))
            tiger[direction].append((im,rect))
    register('tiger',{'idle':{d:[r[0]] for d,r in tiger.items()},'walk':tiger,'run':tiger}, {**lpc_source,'file':path},'Lioness walk adapted with orange fur and native dark tiger stripes; not an original tiger pack.')

    # Retain the bear's native textured silhouette; use a recognisable panda coat.
    path=LPC+'bear, black.png'
    rows=sheet_rows(load(lpc,path),64,64,['up','right','left','down'],4)
    panda={}
    for direction,row in rows.items():
        panda[direction]=[]
        for im,rect in row:
            im=im.copy()
            hx,hy={'up':(32,8),'down':(32,12),'left':(8,12),'right':(55,12)}[direction]
            for y in range(im.height):
                for x in range(im.width):
                    r,g,b,a=im.getpixel((x,y))
                    if not a:continue
                    light=(r+g+b)/3
                    white=(23<x<44 and 12<y<42) if direction in ['up','down'] else (20<x<43 and 4<y<42)
                    white=white or ((x-hx)**2/100+(y-hy)**2/81<1)
                    eye_patch=direction=='down' and abs(y-12)<3 and 3<abs(x-32)<8
                    eye_patch=eye_patch or (direction in ['left','right'] and abs(x-hx)<3 and abs(y-11)<2)
                    tone=(18,23,23) if r==g==b==0 else (40,48,43) if not white or eye_patch else (175,182,157) if light<28 else (211,216,188) if light<42 else (236,237,211)
                    im.putpixel((x,y),(*tone,a))
            panda[direction].append((im,rect))
    register('panda',{'idle':{d:[r[0]] for d,r in panda.items()},'walk':panda,'run':panda}, {**lpc_source,'file':path},'Black bear adapted with ivory torso/head, charcoal limbs and dark eye patches for panda identity.')

    # True wolf walk/run cycles; a separate howl is used for the warning pose.
    for species in ['wolf','hyena']:
        actions={}
        for action,file in [('walk','Walk'),('run','Run'),('attack','Howl')]:
            path=f'Wolf/Wolf_{file}.png';sheet=load(wolf,path)
            row=sheet_rows(sheet,64,40,['side'],sheet.width//64)['side']
            if species=='hyena':
                adapted=[]
                for im,rect in row:
                    im=im.copy()
                    for y in range(im.height):
                        for x in range(im.width):
                            r,g,b,a=im.getpixel((x,y))
                            if not a:continue
                            light=(r+g+b)/3
                            tone=(53,46,33) if light<35 else (108,85,52) if light<65 else (153,121,71) if light<105 else (191,160,101)
                            if 24<x<48 and 14<y<27 and (x*3+y*7)%23<3:tone=(67,53,34)
                            im.putpixel((x,y),(*tone,a))
                    adapted.append((im,rect))
                row=adapted
            actions[action]={'side':row}
        actions['idle']={'side':[actions['walk']['side'][0]]}
        source={'creator':'ScratchIO (Scratchlo)','license':'CC0','source':'https://opengameart.org/content/animated-wild-animals','archive':'Wolf_2.zip','animationFiles':{'walk':'Wolf/Wolf_Walk.png','run':'Wolf/Wolf_Run.png','attack':'Wolf/Wolf_Howl.png'}}
        register(species,actions,source, 'Wolf animations adapted to a tawny spotted hyena coat.' if species=='hyena' else '',facing='left')

    path='PNG/96x96/elephant-NESW.png'
    rows=sheet_rows(load(elephant,path),96,96,['up','right','down','left'],3)
    register('elephant',{'idle':{d:[r[1]] for d,r in rows.items()},'walk':rows,'run':rows},{'creator':'lawnjelly and Jordan Irwin (AntumDeluge)','license':'CC BY 3.0','source':'https://opengameart.org/content/elephant-rework','archive':'elephant-1.1.zip','file':path})

    # User sheet: Florida panther, not a generic zoo sheet. Crop only its five
    # native feline poses, remove the blue guide line, then identify adaptations.
    sheet=Image.open(panther_path).convert('RGBA')
    rectangles=[(569,112,628,146),(646,112,706,146),(750,112,811,146),(832,112,895,146),(914,112,978,146)]
    panthers=[]
    for rect in rectangles:
        cut=sheet.crop(rect)
        for y in range(cut.height):
            for x in range(cut.width):
                r,g,b,a=cut.getpixel((x,y))
                if b>r*1.25 and b>g*1.25:cut.putpixel((x,y),(0,0,0,0))
        cell=Image.new('RGBA',(72,36));cell.alpha_composite(cut,(4,2));panthers.append((cell,rect))
    for species in ['cheetah','leopard','jaguar']:
        row=[]
        for i,(base,rect) in enumerate(panthers):
            im=base.copy()
            for y in range(im.height):
                for x in range(im.width):
                    r,g,b,a=im.getpixel((x,y))
                    if not a or r<85 or g<60:continue
                    if species=='jaguar':r=max(0,r-17);g=max(0,g-19)
                    elif species=='cheetah':r=min(255,r+9);g=min(255,g+8)
                    # Coats differ: small spots, ring rosettes, heavier rosettes.
                    if 12<y<26 and 20<x<52:
                        xx,yy=(x+i//2+(y//6)*3)%7,y%6
                        spot=(xx==2 and yy==2) if species=='cheetah' else (xx in [1,3] and yy in [1,3]) or (xx==2 and yy in [0,4])
                        if spot:r,g,b=(73,58,32) if species!='jaguar' else (56,45,28)
                    im.putpixel((x,y),(r,g,b,a))
            row.append((im,rect))
        source={'creator':'Ilaria Lazzarotto / hello_tazzina','license':'Creator game-use/modification permission; credit; no standalone redistribution','source':'https://hello-tazzina.itch.io/animals','file':panther_path.name}
        register(species,{'idle':{'side':[row[0]]},'walk':{'side':row},'run':{'side':row}},source,'Florida panther cells adapted with species-specific coat/spot/rosette pixels; blue guide pixels removed. Side-view poses, not a four-direction pack.',facing='right')

    for species,folder,stem,count in [('monkey','Monkey','Monkey',9),('kangaroo','Kangaroo','kangaroo',9),('snake','Snake','snake',12),('zebra','Horse','Horse',10)]:
        row=[]
        for i in range(count):
            path=f'Animals/{folder}/{stem}{i+1}.png';im=load(stojkea,path)
            if species in ['snake','zebra']:
                for y in range(32):
                    for x in range(32):
                        r,g,b,a=im.getpixel((x,y))
                        if not a:continue
                        if species=='snake':
                            light=max(r,g,b);tone=(39,58,38) if light<60 else (111,137,65) if light<115 else (183,198,112)
                        else:
                            light=(r+g+b)/3;tone=(53,53,40) if light<55 or (x+y//3)%5<2 else (176,184,157) if light<105 else (232,230,202)
                        im.putpixel((x,y),(*tone,a))
            row.append((im,(0,0,32,32)))
        source={'creator':'Stojkea','license':'Creator personal/commercial game-use and edit permission; no resale/ownership claim','source':'https://stojkea.itch.io/pixel-art-animal','archive':stojkea_path.name,'inputFrames':[f'Animals/{folder}/{stem}{i+1}.png' for i in range(count)]}
        changes='Source idle animation reused during movement; no authored four-direction walk is claimed. '
        if species=='zebra':changes+='Horse adapted with ivory/charcoal striped zebra coat.'
        if species=='snake':changes+='Green snake shifted to muted olive scales.'
        register(species,{'idle':{'side':row},'walk':{'side':row},'run':{'side':row}},source,changes,facing='right')

    # Large orthogonal crocodile cells are reduced by an exact nearest 2:1
    # conversion before the established 2x display; no fractional filtering.
    path=ROOT/'crocodile.png';sheet=Image.open(path).convert('RGBA')
    rows=sheet_rows(sheet,128,96,['up','right','down','left'],3)
    for direction,row in rows.items():
        for i,(im,rect) in enumerate(row):
            im=im.resize((64,48),Image.Resampling.NEAREST)
            for y in range(im.height):
                for x in range(im.width):
                    r,g,b,a=im.getpixel((x,y))
                    if a and g>r and g>b:
                        light=(r+g+b)/3;tone=(45,60,34) if light<55 else (75,92,45) if light<95 else (112,128,62) if light<135 else (164,173,93)
                        im.putpixel((x,y),(*tone,a))
            row[i]=(im,rect)
    register('crocodile',{'idle':{d:[r[1]] for d,r in rows.items()},'walk':rows,'run':rows},{'creator':'bleutailfly','license':'OGA-BY 3.0','source':'https://opengameart.org/content/crocodile-1','file':'crocodile.png'},'Exact 2:1 nearest conversion to fit game scale; bright greens adapted to muted olive. Teeth/eyes/orthogonal poses retained.')

    Path('src/data/wildlifeSprites.js').write_text('// Generated selected animal rigs; reproduce with scripts/wildlife_sprites.py.\nexport const WILDLIFE_SPRITES='+json.dumps(rigs,indent=1)+';\n')
    return records
