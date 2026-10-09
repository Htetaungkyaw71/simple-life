"""Original cream/terracotta home furnishings drawn at native pixel size."""
from PIL import Image,ImageDraw
INK='#493d38';DARK='#724e40';WOOD='#9c6650';LIGHT='#e4b08c';CREAM='#f4ddbb';ROSE='#cc8b75'
def add_home_interior_art(assets):
 def canvas(name,size):
  im=Image.new('RGBA',size);assets[name]=im;return ImageDraw.Draw(im)
 d=canvas('home-floor',(32,32));d.rectangle((0,0,31,31),fill='#d4957c')
 for cx,cy in [(0,0),(32,0),(16,16),(0,32),(32,32)]:
  d.polygon([(cx,cy-15),(cx+15,cy),(cx,cy+15),(cx-15,cy)],outline='#f1caaa');d.line((cx-13,cy+1,cx,cy+14,cx+13,cy+1),fill='#bb7864');d.rectangle((cx-1,cy-1,cx+1,cy+1),fill='#eed0ad')
 d=canvas('home-wall',(32,32));d.rectangle((0,0,31,31),fill='#f1d5b4');d.rectangle((0,0,31,3),fill=DARK);d.line((0,5,31,5),fill=LIGHT);d.rectangle((0,23,31,31),fill='#e7bca0');d.line((0,24,31,24),fill=CREAM);d.line((15,25,15,30),fill='#c39279');d.line((0,31,31,31),fill=DARK)
 d=canvas('home-window',(32,28));d.polygon([(1,5),(16,0),(30,5),(29,27),(2,27)],fill=INK);d.polygon([(3,6),(16,2),(28,6),(27,25),(4,25)],fill=WOOD);d.polygon([(6,8),(15,5),(15,23),(6,23)],fill='#bcc88a');d.polygon([(17,5),(25,8),(25,23),(17,23)],fill='#b1c3a1');d.line((16,4,16,25),fill=DARK);d.line((3,7,16,3,28,7),fill=LIGHT);d.line((3,26,29,26),fill=LIGHT)
 d=canvas('home-fireplace',(40,60));d.rectangle((13,1,26,18),fill=INK);d.rectangle((15,3,24,17),fill='#bd9279');d.rectangle((16,4,23,7),fill='#412f29')
 d.polygon([(12,16),(27,16),(31,25),(31,37),(8,37),(8,25)],fill='#a78670')
 for y in range(18,36,5):
  d.line((12,y,27,y),fill='#735e52');d.line((19+(y%2)*4,y,19+(y%2)*4,y+4),fill='#735e52')
 d.rectangle((3,32,36,58),fill=INK);d.rectangle((5,34,34,55),fill='#ae7761');d.pieslice((10,36,29,55),180,360,fill=INK);d.rectangle((10,46,29,51),fill='#3c302c');d.rectangle((11,49,28,51),fill='#ae6748');d.polygon([(17,50),(15,45),(18,46),(20,40),(23,48),(25,45),(26,50)],fill='#e9a65f');d.rectangle((8,52,31,56),fill='#77685c');d.line((5,57,34,57),fill=LIGHT)
 d=canvas('home-logs',(28,24));
 for x,y in [(2,7),(10,3),(17,8),(8,12),(17,16)]:
  d.rectangle((x,y,x+6,y+6),fill=INK);d.rectangle((x+1,y,x+5,y+5),fill=WOOD);d.ellipse((x,y+4,x+6,y+10),fill=LIGHT,outline=DARK);d.point((x+3,y+7),fill=WOOD)
 d=canvas('home-rug',(96,64));d.rectangle((0,0,95,63),fill='#f1ce9c');d.rectangle((2,2,93,61),fill=DARK);d.rectangle((4,4,91,59),fill='#b77462');d.rectangle((8,8,87,55),fill='#df9f78');d.rectangle((9,9,86,54),outline='#eac098')
 for x in range(5,93,5):d.rectangle((x,2,x+2,5),fill=CREAM);d.rectangle((x,58,x+2,61),fill=CREAM)
 for y in range(13,53,12):
  for x in range(15,85,14):d.polygon([(x,y-3),(x+3,y),(x,y+3),(x-3,y)],fill='#efc893')
 def pottery(d,x,y,color):
  d.rectangle((x+2,y,x+7,y+2),fill=INK);d.ellipse((x,y+2,x+9,y+12),fill=INK);d.ellipse((x+1,y+3,x+8,y+11),fill=color);d.line((x+2,y+4,x+3,y+7),fill=CREAM)
 d=canvas('home-pottery',(36,36));d.rectangle((0,9,35,35),fill=INK);d.rectangle((2,11,33,33),fill=WOOD)
 for y in [10,20,30]:
  d.line((2,y,33,y),fill=LIGHT)
  for x in [3,14,25]:pottery(d,x,y-9,['#90a296','#c08c67','#ba765d'][(x+y)%3])
 d=canvas('home-counter',(48,24));d.rectangle((0,7,47,23),fill=INK);d.rectangle((2,9,45,21),fill=WOOD);d.line((1,7,46,7),fill=LIGHT);d.line((16,9,16,21),fill=DARK);d.line((31,9,31,21),fill=DARK);d.line((19,13,28,13),fill=LIGHT);d.point((10,16),fill=CREAM);d.point((36,16),fill=CREAM);pottery(d,4,0,'#99a18b');pottery(d,32,0,'#d79770')
 d=canvas('home-table',(64,40));d.rectangle((8,28,13,39),fill=DARK);d.rectangle((50,28,55,39),fill=DARK);d.rounded_rectangle((1,1,62,33),8,fill=INK);d.rounded_rectangle((3,2,60,30),7,fill=WOOD)
 for y in [8,15,22,29]:d.line((5,y,58,y),fill=DARK)
 for x,y in [(13,8),(43,8),(13,23),(43,23)]:d.ellipse((x,y,x+9,y+6),fill=CREAM,outline=LIGHT)
 pottery(d,28,10,'#a79680');d.line((34,9,36,4),fill='#718347')
 d=canvas('home-bench',(32,12));d.rectangle((3,7,6,11),fill=DARK);d.rectangle((25,7,28,11),fill=DARK);d.rectangle((0,0,31,8),fill=INK);d.rectangle((2,2,29,6),fill=WOOD);d.line((2,2,29,2),fill=LIGHT)
 d=canvas('home-bed',(24,40));d.rectangle((0,0,23,39),fill=INK);d.rectangle((2,2,21,37),fill=WOOD);d.rectangle((3,5,20,12),fill=CREAM);d.line((4,7,19,7),fill=LIGHT);d.rectangle((3,14,20,34),fill='#b97563');d.rectangle((5,16,18,32),outline='#e8b990');d.line((3,14,20,14),fill=CREAM);d.line((2,36,21,36),fill=LIGHT)
 d=canvas('home-pot',(16,24));pottery(d,3,10,'#c39065');d.line((8,11,8,4),fill='#53643c')
 for x,y in [(3,5),(9,2),(10,7)]:d.polygon([(x,y),(x+4,y-1),(x+3,y+3),(x,y+2)],fill='#83934f')
