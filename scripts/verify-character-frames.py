"""Development-only sprite gallery and facial-pixel regression check; not shipped."""
from pathlib import Path
from PIL import Image, ImageDraw
OUT=Path('docs/verification/stabilization');OUT.mkdir(parents=True,exist_ok=True)
ink=(52,52,79,255)
for gender in ['boy','girl']:
 sheet=Image.open(f'public/assets/pixel/processed/{gender}.png').convert('RGBA')
 assert sheet.size==(144,128)
 gallery=Image.new('RGB',(6*104,4*154),'#849497');draw=ImageDraw.Draw(gallery)
 for row,direction in enumerate(['down','up','left','right']):
  for frame in range(6):
   im=sheet.crop((frame*24,row*32,frame*24+24,row*32+32));bob=1 if frame in [2,4] else 0
   eyes=[9,15] if direction=='down' else [9] if direction=='left' else [15] if direction=='right' else []
   for x in eyes:assert im.getpixel((x,10+bob))==ink,(gender,direction,frame,x,'missing eye')
   scaled=im.resize((96,128),Image.Resampling.NEAREST);gallery.paste(scaled,(frame*104,row*154+22),scaled)
   draw.text((frame*104+2,row*154+3),direction+' '+str(frame)+(' idle' if frame in [0,5] else ' walk'),fill='white')
 gallery.save(OUT/f'{gender}-all-frames.png')
print('PASS: all 48 frames have valid dimensions; every front/side frame has its expected eye pixels.')
