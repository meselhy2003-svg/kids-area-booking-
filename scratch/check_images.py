import os, re
from PIL import Image

components_dir = 'src/components'
files = [f for f in os.listdir(components_dir) if f.startswith('Desktop') and f.endswith('.jsx')]
used = {}
for f in files:
    with open(os.path.join(components_dir, f), 'r', encoding='utf-8') as fh:
        text = fh.read()
        matches = re.findall(r'src=["\']([^"\']+\.(?:png|jpg|jpeg|webp))["\']', text)
        for m in matches:
            if m not in used:
                used[m] = []
            used[m].append(f)

print(f"Total unique images referenced: {len(used)}")
for img_path, refs in sorted(used.items()):
    local_path = img_path.lstrip('/')
    exists = os.path.exists(os.path.join('public', local_path)) or os.path.exists(local_path)
    real_path = os.path.join('public', local_path) if os.path.exists(os.path.join('public', local_path)) else local_path
    
    dims = "MISSING"
    if os.path.exists(real_path):
        try:
            im = Image.open(real_path)
            dims = f"{im.size[0]}x{im.size[1]}"
        except:
            dims = "ERR"
    
    print(f"{img_path:55} | Dims: {dims:10} | In: {', '.join(set(refs))}")
