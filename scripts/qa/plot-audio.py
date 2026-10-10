"""Static source waveform plots using bundled numpy/Pillow; no device-output claim."""
from pathlib import Path
import wave
import numpy as np
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parents[2]
im=Image.new('RGB',(1800,1580),'#faf8ee');draw=ImageDraw.Draw(im)
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',22);small=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',17)
draw.text((40,20),'Original score source waveforms — numerical inspection does not replace listening',font=font,fill='#29372b')
for row,name in enumerate(['title','farm','city','forest','night','completion']):
    with wave.open(str(root/'public/assets/audio'/f'{name}.wav')) as w:
        rate=w.getframerate();samples=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(float)/32767
    y=100+row*240;duration=len(samples)/rate
    draw.text((80,y-30),f'{name.capitalize()} / {duration:g} seconds / amplitude ±0.25',font=font,fill='#29372b')
    draw.text((1000,y-30),'End / beginning / ±60 ms / amplitude ±0.025'+(' (cue)' if name=='completion' else ''),font=small,fill='#29372b')
    for x,width in [(80,780),(1000,700)]:
        draw.rectangle((x,y,x+width,y+150),outline='#737e60');draw.line((x,y+75,x+width,y+75),fill='#ccd0c0')
        for j in range(5):draw.line((x+j*width/4,y,x+j*width/4,y+150),fill='#e0e2d5')
    indices=np.linspace(0,len(samples),781,dtype=int)
    for col in range(780):
        chunk=samples[indices[col]:indices[col+1]];draw.line((80+col,y+75-chunk.max()*300,80+col,y+75-chunk.min()*300),fill='#647641')
    n=int(rate*.06);edge=np.r_[samples[-n:],samples[:n]];indices=np.linspace(0,len(edge)-1,701,dtype=int)
    points=[(1000+j,y+75-edge[k]*3000) for j,k in enumerate(indices)];draw.line(points,fill='#98753d');draw.line((1350,y,1350,y+150),fill='#647641',width=2)
    for j in range(5):
        draw.text((80+j*780/4-10,y+158),f'{duration*j/4:g}s',font=small,fill='#29372b')
        draw.text((1000+j*700/4-10,y+158),f'{-60+j*30:g}ms',font=small,fill='#29372b')
draw.text((40,1540),'Source PCM only. Completion is not looped. Detailed peak/RMS/DC/clipping/frequency data: audio-report.json.',font=small,fill='#29372b')
im.save(root/'docs/verification/story-audio/score-waveforms.png')
