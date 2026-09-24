import os
from PIL import Image, ImageFilter, ImageEnhance

def enhance_and_save(src_path, dst_paths):
    try:
        im = Image.open(src_path)
    except Exception as e:
        print(f"Skipping {src_path}: {e}")
        return

    orig_w, orig_h = im.size
    mode = im.mode

    # Calculate optimal upscale factor
    max_dim = max(orig_w, orig_h)
    if max_dim < 200:
        factor = 4.0
    elif max_dim < 400:
        factor = 3.0
    elif max_dim < 800:
        factor = 2.5
    elif max_dim < 1400:
        factor = 2.0
    else:
        factor = 1.5

    new_w = int(orig_w * factor)
    new_h = int(orig_h * factor)

    # Perform high quality Lanczos resampling
    if mode == 'RGBA':
        # Separate alpha
        r, g, b, a = im.split()
        rgb = Image.merge('RGB', (r, g, b))
        
        # Subtle smoothing on low-res sources to remove compression blocks before upscale
        if max_dim < 300:
            rgb = rgb.filter(ImageFilter.SMOOTH_MORE)
        
        rgb_up = rgb.resize((new_w, new_h), Image.Resampling.LANCZOS)
        a_up = a.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Sharpen RGB
        rgb_sharp = rgb_up.filter(ImageFilter.UnsharpMask(radius=2.0, percent=140, threshold=2))
        rgb_sharp = ImageEnhance.Sharpness(rgb_sharp).enhance(1.2)
        rgb_sharp = ImageEnhance.Contrast(rgb_sharp).enhance(1.04)
        
        sr, sg, sb = rgb_sharp.split()
        result = Image.merge('RGBA', (sr, sg, sb, a_up))
    else:
        im_rgb = im.convert('RGB')
        if max_dim < 300:
            im_rgb = im_rgb.filter(ImageFilter.SMOOTH_MORE)
        up = im_rgb.resize((new_w, new_h), Image.Resampling.LANCZOS)
        sharp = up.filter(ImageFilter.UnsharpMask(radius=2.0, percent=140, threshold=2))
        sharp = ImageEnhance.Sharpness(sharp).enhance(1.2)
        sharp = ImageEnhance.Contrast(sharp).enhance(1.04)
        result = sharp

    for dst in dst_paths:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        result.save(dst, optimize=True)

    print(f"Enhanced: {os.path.basename(src_path):45} ({orig_w}x{orig_h}) -> ({new_w}x{new_h})")

def process_directory(src_dir, public_dirs):
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                src_file = os.path.join(root, f)
                rel_path = os.path.relpath(src_file, src_dir)
                dst_list = [src_file]
                for p_dir in public_dirs:
                    dst_list.append(os.path.join(p_dir, rel_path))
                enhance_and_save(src_file, dst_list)

if __name__ == '__main__':
    print("Enhancing kid area pic images...")
    process_directory(
        'photo/kid area pic',
        ['public/photo/kid area pic', 'public/photo/kid-area-pic']
    )
    
    print("\nEnhancing logo images...")
    process_directory(
        'photo/logo',
        ['public/photo/logo']
    )

    print("\nProcessing completed successfully!")
