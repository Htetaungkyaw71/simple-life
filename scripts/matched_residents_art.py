"""Adapt the already licensed farmer cells so every human shares its proportions.
Only hair/shirt/trouser palettes change; faces, silhouette and native pixels stay.
"""
from pathlib import Path
from PIL import Image

VARIANTS = [
    ('girl', (107,77,57), (126,149,83), (106,128,147)),
    ('girl', (155,111,67), (168,125,96), (108,130,125)),
    ('girl', (83,63,53), (159,163,107), (100,137,152)),
    ('boy', (127,87,53), (100,137,151), (112,121,104)),
    ('boy', (76,66,58), (152,118,93), (112,132,135)),
    ('boy', (159,145,116), (127,145,91), (109,126,151)),
    ('boy', (89,76,61), (169,148,100), (108,131,132)),
    ('girl', (118,100,83), (137,119,144), (107,133,144)),
]
HAIR = {'boy': [(126,37,34),(155,44,41),(176,50,47),(195,54,51)],
        'girl': [(129,44,41),(157,53,49),(193,63,59),(220,71,66),(243,77,73)]}
SHIRT = {'boy': [(157,161,100),(193,192,120),(220,215,136)],
         'girl': [(157,108,153),(193,128,184),(220,143,209)]}
PANTS = {'boy': [(111,139,176),(127,156,200),(140,170,220)],
         'girl': [(91,128,185),(100,146,210),(104,144,210),(110,159,231),(115,157,231)]}
def add_matched_residents_art(assets, folder=Path('public/assets/pixel/processed')):
    sheets = {n: Image.open(folder / (n + '.png')).convert('RGBA') for n in ['boy','girl']}
    for i, (body, hair, shirt, pants) in enumerate(VARIANTS):
        palette = {}
        for colors, target in [(HAIR[body],hair),(SHIRT[body],shirt),(PANTS[body],pants)]:
            for j,color in enumerate(colors):
                factor = .72 + j / max(1,len(colors)-1) * .43
                palette[color] = tuple(min(255,round(c*factor)) for c in target)
        for row, direction in enumerate(['down','up','left','right']):
            # Idle plus the same four authored walking cells as PlayerView.
            for frame in range(5):
                cell = sheets[body].crop((frame*24,row*32,frame*24+24,row*32+32))
                cell.putdata([(*palette.get(p[:3],p[:3]),p[3]) for p in cell.getdata()])
                assets[f'town-person-{i}-{direction}-{frame}'] = cell
    return {'creator':'Channeechan; underlying template Eris Esra',
            'source':'https://channeechan.itch.io/cute-farmer-character',
            'cells':[24,32], 'variants':8,
            'modifications':'Existing farmer idle/walk cells adapted with eight hair/clothing palettes; native silhouette, faces and body proportions retained.'}
