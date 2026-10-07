"""Original native-pixel palms and willows for Simple Life; no reference pixels."""
from PIL import Image, ImageDraw
import math, random

def add_forest_trees(assets):
    im=Image.new('RGBA',(64,96));d=ImageDraw.Draw(im)
    d.polygon([(28,93),(39,93),(36,78),(35,57),(33,25),(28,25),(31,56),(31,77)],fill='#493d36')
    d.polygon([(30,91),(36,91),(33,74),(32,50),(30,26),(28,26),(30,56),(31,78)],fill='#a66b45')
    d.line([(29,30),(31,54),(32,78),(31,90)],fill='#c59158',width=2)
    for y in range(39,90,7):d.line((31,y,34,y+1),fill='#714834');d.point((30,y-1),fill='#dcc087')
    # Curved fronds with individually stepped leaflets, rather than thin spokes.
    for n,(tx,ty) in enumerate([(4,50),(58,55),(14,63),(61,28),(3,27),(51,9),(17,4),(37,3)]):
        points=[]
        for k in range(13):
            t=k/12;points.append((round(31+(tx-31)*t),round(27+(ty-27)*t-11*math.sin(math.pi*t))))
        d.line(points,fill='#354b32',width=3)
        for k in range(1,11):
            x,y=points[k];px,py=points[k+1];vx,vy=px-x,py-y;length=math.hypot(vx,vy) or 1
            blade=round(7*(1-k/14))+1
            for side in [-1,1]:
                tip=(round(x-side*vy/length*blade+vx),round(y+side*vx/length*blade+vy+2))
                d.polygon([(x-1,y),(px,py),tip],fill=['#7e914d','#a2ad64','#5b713d'][(n+k+(side==1))%3])
        d.line(points,fill='#bcc477' if n>3 else '#8b9d59',width=1)
    d.ellipse((27,25,36,33),fill='#493d36');d.ellipse((27,26,31,30),fill='#b09255');d.ellipse((32,28,35,32),fill='#7c5c3d')
    assets['palm-tree']=im

    im=Image.new('RGBA',(72,96));d=ImageDraw.Draw(im);rng=random.Random(874)
    d.polygon([(28,94),(43,94),(38,86),(38,58),(46,38),(42,34),(35,49),(28,35),(24,39),(32,59),(32,85)],fill='#493d36')
    d.polygon([(31,92),(37,92),(35,79),(35,54),(30,39),(28,40),(33,59),(33,84)],fill='#956841');d.line((33,63,33,86),fill='#c3935b',width=2)
    clusters=[(5,21,31,46),(18,8,47,37),(37,18,65,47),(2,32,24,54),(20,25,55,54),(47,33,69,56)]
    for x,y,x2,y2 in clusters:
        d.ellipse((x,y,x2,y2),fill='#354b32');d.ellipse((x+2,y+1,x2-2,y2-5),fill='#5b713d');d.ellipse((x+3,y+2,x2-6,y2-12),fill='#7e914d')
        for n in range(6):
            xx=rng.randrange(x+4,x2-3);yy=rng.randrange(y+4,y2-6);d.rectangle((xx,yy,xx+2,yy+1),fill='#a2ad64')
    for n in range(21):
        x=5+n*3;y=37+(n*7)%13;bottom=y+12+(n*5)%18
        d.line([(x,y),(x-1,y+11),(x+1,bottom)],fill='#354b32',width=2)
        for yy in range(y+2,bottom,4):d.rectangle((x-1,yy,x+1,yy+2),fill=['#7e914d','#a2ad64','#5b713d'][n%3])
    assets['willow-tree']=im
