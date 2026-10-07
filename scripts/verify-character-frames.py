"""Native sprite integrity/gallery QA, never included in production."""
from pathlib import Path
from PIL import Image, ImageDraw
import io, os, subprocess
OUT=Path('docs/verification/supplied-art'); OUT.mkdir(parents=True,exist_ok=True)
archive=os.environ.get('SIMPLE_LIFE_FARMER_RAR',str(Path.home()/'Downloads/Cute Farmer Character by Channeechan.rar'))
for character,number in [('boy','001'),('girl','002')]:
    sheet=Image.open(f'public/assets/pixel/processed/{character}.png').convert('RGBA')
    assert sheet.size==(216,128)
    gallery=Image.new('RGB',(9*104,4*154),'#849497'); draw=ImageDraw.Draw(gallery)
    sources={action:Image.open(io.BytesIO(subprocess.check_output(['bsdtar','-xOf',archive,f'Cute Farmer Character by Channeechan/Farmer{number}-{action}.png']))).convert('RGBA') for action in ['Idle','Walk']}
    for row,direction in enumerate(['down','up','left','right']):
        sr=[0,2,3,1][row]
        for col in range(9):
            im=sheet.crop((col*24,row*32,col*24+24,row*32+32))
            assert im.getbbox() is not None
            if col<6:
                action='Walk' if 1<=col<=4 else 'Idle'; n=col-1 if action=='Walk' else 2 if col==5 else 0
                source=sources[action].crop((n*64+20,sr*64+18,n*64+44,sr*64+50))
                assert im.tobytes()==source.tobytes(),(character,direction,col,'source pixels changed')
            else:assert im.getbbox()[3]<=30
            scaled=im.resize((96,128),Image.Resampling.NEAREST); gallery.paste(scaled,(col*104,row*154+22),scaled)
            draw.text((col*104+2,row*154+3),direction+' '+str(col)+(' idle' if col in [0,5] else ' jump' if col>5 else ' walk'),fill='white')
    gallery.save(OUT/f'{character}-all-frames.png')
print('PASS: 72 native frames; all 48 idle/walk cells preserve exact supplied pixels and correct direction rows.')
