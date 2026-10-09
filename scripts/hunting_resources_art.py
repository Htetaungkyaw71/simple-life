"""Original small food/resource pixels in the existing olive/stone palette."""
from PIL import Image, ImageDraw

def add_hunting_resources_art(assets):
    meat = Image.new('RGBA', (16, 16)); d = ImageDraw.Draw(meat)
    d.line((8, 8, 13, 13), fill='#50473b', width=5)
    d.line((9, 9, 13, 13), fill='#eee3bf', width=3)
    d.ellipse((11, 11, 15, 14), fill='#fff5d7')
    d.ellipse((2, 1, 11, 11), fill='#493b2d')
    d.ellipse((3, 2, 10, 10), fill='#99643b')
    d.ellipse((3, 3, 8, 7), fill='#c49259')
    d.line((4, 3, 7, 3), fill='#e0b77a')
    d.line((6, 9, 9, 8), fill='#704629')
    assets['meat-item'] = meat
    def stones(size, points):
        im = Image.new('RGBA', size); d = ImageDraw.Draw(im)
        for x, y, w, h in points:
            d.polygon([(x,y+2),(x+3,y),(x+w-2,y+1),(x+w,y+h-2),(x+w-2,y+h),(x+1,y+h-1)],fill='#41483d')
            d.polygon([(x+1,y+2),(x+3,y+1),(x+w-2,y+2),(x+w-1,y+h-2),(x+2,y+h-2)],fill='#979c8d')
            d.line((x+3,y+1,x+w-3,y+2),fill='#d0cdb8')
            d.line((x+w-2,y+3,x+w-1,y+h-2),fill='#6b7366')
        return im
    assets['stone-item'] = stones((16,16), [(2,6,9,7),(7,2,7,7),(8,9,6,5)])
    assets['loose-stones'] = stones((24,16), [(2,9,8,5),(10,4,9,9),(17,10,5,4)])
