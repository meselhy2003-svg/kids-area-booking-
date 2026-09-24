import os, base64
from PIL import Image

logo_path = 'photo/logo/logo nav bar and footer.png'
im = Image.open(logo_path).convert('RGBA')

# 1. Save ICO with multiple sizes (16, 32, 48, 64)
im.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

# 2. Save PNG favicon
fav32 = im.resize((32, 32), Image.Resampling.LANCZOS)
fav32.save('public/favicon.png')

# 3. Save Apple touch icon
fav180 = im.resize((180, 180), Image.Resampling.LANCZOS)
fav180.save('public/apple-touch-icon.png')

# 4. Save favicon.svg as valid SVG image
with open('public/favicon.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <image href="data:image/png;base64,{b64}" width="64" height="64" />
</svg>'''

with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print('Favicons created successfully!')
