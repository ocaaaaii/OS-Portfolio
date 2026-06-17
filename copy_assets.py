"""
Copies updated assets to public/ folder.
Run: python copy_assets.py
"""
import shutil, os

BASE = r'C:\Users\ACER\Documents\Claude\Projects\OS-Style-Portfolio'

copies = [
    (r'img\Stock.png',  r'public\Stock.png'),
    (r'CA.CV.pdf',      r'public\CA.CV.pdf'),
]

for src_rel, dst_rel in copies:
    src = os.path.join(BASE, src_rel)
    dst = os.path.join(BASE, dst_rel)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f'  copied: {src_rel} -> {dst_rel}')
    else:
        print(f'  SKIP (not found): {src_rel}')

print('Done!')
