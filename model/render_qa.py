"""Contact sheets for a complete rendered-PDF review; no report figures are raster."""
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
ROOT=Path(__file__).resolve().parents[1];F=ROOT/'tmp/pdfs/report'
F.mkdir(exist_ok=True)
files=sorted(F.glob('page-*.png'))
for start in range(0,len(files),12):
 rows=4;cols=3;thumbw=360;thumbh=510
 sheet=Image.new('RGB',(cols*thumbw,rows*(thumbh+24)),'#dedede');draw=ImageDraw.Draw(sheet)
 for j,path in enumerate(files[start:start+12]):
  im=Image.open(path).convert('RGB');im.thumbnail((thumbw-10,thumbh))
  x=(j%cols)*thumbw+(thumbw-im.width)//2;y=(j//cols)*(thumbh+24)+22
  sheet.paste(im,(x,y));draw.text(((j%cols)*thumbw+8,y-19),path.stem,fill='black')
 out=F/f'contact-{start//12+1:02d}.png';sheet.save(out)
 print(out)
