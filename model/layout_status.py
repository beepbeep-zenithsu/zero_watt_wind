from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
for name in ['compile-pass1.txt','compile-pass2.txt','compile-pass3.txt']:
 p=root/'report'/name
 if p.exists():
  s=p.read_text(errors='replace')
  print(name,len(s),s[-1500:])
p=root/'report/main.log'
if p.exists():
 s=p.read_text(errors='replace').splitlines()
 for i,line in enumerate(s):
  if line.startswith(('Overfull','!')):print('\n'.join(s[max(0,i-2):i+7]))
