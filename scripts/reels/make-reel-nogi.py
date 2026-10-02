"""Рилс «Скорость начинается с ног»: работа ногами с доской и в ластах.

Сборка: титры рисуются Pillow в прозрачные PNG 1080x1920, ffmpeg кладёт их
на ролик, в конце — заставка с логотипом PRIME SWIM без кнопок.

    pip install pillow fonttools
    python3 scripts/reels/make-reel-nogi.py <исходник.mp4> [папка-вывода]

Исходник — вертикальное видео 15 с с телефона, без звука. Звук в ролике
пустой: музыку ставят в Instagram/VK из их библиотеки, она там лицензирована.
Шрифты сайта (Unbounded, Inter) скачиваются из npm @fontsource при первом запуске.
"""
import io
import json
import subprocess
import sys
import tarfile
import urllib.request
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else sys.exit(__doc__)
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("reel-out")
OUT.mkdir(parents=True, exist_ok=True)
LOGO = ROOT / "public/media/brand/prime-swim-logo.jpg"
FONTS = OUT / "fonts"


def fetch_font(family, weight):
    """Собирает TTF из латинского и кириллического подмножеств @fontsource."""
    ttf = FONTS / f"{family}-{weight}.ttf"
    if ttf.exists():
        return str(ttf)
    from fontTools.merge import Merger
    from fontTools.ttLib import TTFont
    FONTS.mkdir(parents=True, exist_ok=True)
    meta = json.load(urllib.request.urlopen(f"https://registry.npmjs.org/@fontsource/{family}/latest"))
    tgz = tarfile.open(fileobj=io.BytesIO(urllib.request.urlopen(meta["dist"]["tarball"]).read()))
    parts = []
    for sub in ("latin", "cyrillic"):
        f = TTFont(tgz.extractfile(f"package/files/{family}-{sub}-{weight}-normal.woff"))
        f.flavor = None
        p = FONTS / f"_{family}-{sub}-{weight}.ttf"
        f.save(p)
        parts.append(str(p))
    Merger().merge(parts).save(ttf)
    return str(ttf)

W, H = 1080, 1920
PURPLE = (79, 1, 123)  # фон логотипа, brand-600
LIME = (199, 254, 3)  # lime-400
WHITE = (255, 255, 255)
INK = (11, 1, 20)  # abyss-950

UNB = fetch_font("unbounded", 800)
UNB6 = fetch_font("unbounded", 600)
INTER = fetch_font("inter", 800)

SPEED_IN = 2.0  # заход над водой ускорен, нырок камеры наступает раньше
CUT_IN = 1.75  # секунда исходника, где камера уходит под воду
CARD = 2.6  # заставка с логотипом
XF = 0.4  # переход в заставку


def font(path, size):
    return ImageFont.truetype(path, size)


def canvas():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))


def shadowed(img, blur=14, alpha=150):
    """Мягкая тень под непрозрачными пикселями — текст читается на бликах воды."""
    a = img.split()[3]
    sh = Image.new("RGBA", img.size, (0, 0, 0, 0))
    sh.putalpha(a.point(lambda v: v * alpha // 255).filter(ImageFilter.GaussianBlur(blur)))
    sh = sh.transform(sh.size, Image.AFFINE, (1, 0, 0, 0, 1, -6))
    return Image.alpha_composite(sh, img)


def hook():
    img = canvas()
    # затемнение сверху: под заголовком светлый потолок бассейна
    grad = Image.new("L", (1, H))
    for y in range(H):
        grad.putpixel((0, y), int(150 * max(0.0, 1 - y / 1050) ** 1.4))
    shade = Image.new("RGBA", (W, H), (*INK, 0))
    shade.putalpha(grad.resize((W, H)))
    img = Image.alpha_composite(img, shade)

    layer = canvas()
    d = ImageDraw.Draw(layer)
    lines = [("СКОРОСТЬ", WHITE), ("НАЧИНАЕТСЯ", WHITE), ("С НОГ", LIME)]
    f = font(UNB, 92)
    y = 300
    for text, col in lines:
        w = d.textlength(text, font=f)
        d.text(((W - w) / 2, y), text, font=f, fill=col)
        y += 122
    return Image.alpha_composite(img, shadowed(layer, blur=18, alpha=170))


def chip(text, num, y=330):
    """Подпись упражнения: фиолетовая плашка, лаймовый номер."""
    img = canvas()
    d = ImageDraw.Draw(img)
    f = font(INTER, 60)
    fn = font(UNB, 44)
    tw = d.textlength(text, font=f)
    nw = d.textlength(num, font=fn)
    pad, gap = 40, 26
    bw = pad + nw + gap + tw + pad
    x0 = (W - bw) / 2
    box = (x0, y, x0 + bw, y + 124)
    d.rounded_rectangle(box, radius=30, fill=(*PURPLE, 238))
    d.text((x0 + pad, y + 62), num, font=fn, fill=LIME, anchor="lm")
    d.text((x0 + pad + nw + gap, y + 64), text, font=f, fill=WHITE, anchor="lm")
    return shadowed(img, blur=20, alpha=110)


def coach(y=1250):
    img = canvas()
    d = ImageDraw.Draw(img)
    x = 64
    ft = font(UNB6, 30)
    tag = "ТРЕНЕР"
    tw = d.textlength(tag, font=ft)
    d.rounded_rectangle((x, y, x + tw + 44, y + 58), radius=16, fill=LIME)
    d.text((x + 22, y + 29), tag, font=ft, fill=INK, anchor="lm")
    fn = font(INTER, 60)
    lines = ["Овченков", "Ярослав Сергеевич"]
    lw = max(d.textlength(t, font=fn) for t in lines)
    top = y + 74
    d.rounded_rectangle((x, top, x + lw + 64, top + 32 + 74 * len(lines)), radius=26, fill=(*PURPLE, 240))
    for i, t in enumerate(lines):
        d.text((x + 32, top + 16 + i * 74), t, font=fn, fill=WHITE)
    return shadowed(img, blur=20, alpha=110)


def end_card():
    logo = Image.open(LOGO).convert("RGB")
    # логотип занимает середину квадрата 1400; поле вокруг — тот же фиолетовый
    crop = logo.crop((250, 380, 1150, 1080)).resize((1000, 778), Image.LANCZOS)
    card = Image.new("RGB", (W, H), PURPLE)
    card.paste(crop, ((W - 1000) // 2, (H - 778) // 2 - 60))
    return card


def run(cmd):
    print(" ".join(map(str, cmd))[:300], "...")
    subprocess.run(cmd, check=True)


def main():
    dur_src = float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", SRC]))
    foot = CUT_IN / SPEED_IN + (dur_src - CUT_IN)
    total = foot + CARD - XF

    # (картинка, начало, конец) — время итогового ролика
    caps = [
        (hook(), 0.0, 2.7),
        (chip("Работа ногами с доской", "01"), 3.0, 5.9),
        (chip("В ластах толчок мощнее", "02"), 6.4, 9.0),
        (chip("Удар идёт от бедра", "03"), 9.4, 11.5),
        (coach(), 11.7, foot - 0.1),
    ]
    for i, (im, *_ ) in enumerate(caps):
        im.save(OUT / f"cap{i}.png")
    end_card().save(OUT / "card.png")

    inputs = ["-i", SRC]
    for i, (_, t0, t1) in enumerate(caps):
        inputs += ["-loop", "1", "-framerate", "30", "-t", f"{t1 - t0:.3f}", "-i", OUT / f"cap{i}.png"]
    inputs += ["-loop", "1", "-framerate", "30", "-t", f"{CARD:.3f}", "-i", OUT / "card.png"]
    card_idx = len(caps) + 1

    grade = "eq=contrast=1.06:saturation=1.18:gamma=0.98,unsharp=5:5:0.5"
    fc = [
        f"[0:v]split[a][b]",
        f"[a]trim=0:{CUT_IN},setpts=(PTS-STARTPTS)/{SPEED_IN}[a1]",
        f"[b]trim={CUT_IN},setpts=PTS-STARTPTS[b1]",
        f"[a1][b1]concat=n=2:v=1,fps=30,scale={W}:{H}:flags=lanczos,{grade},format=yuv420p[v0]",
    ]
    prev = "v0"
    for i, (_, t0, t1) in enumerate(caps, start=1):
        d = t1 - t0
        fc.append(
            f"[{i}:v]format=rgba,fade=in:st=0:d=0.25:alpha=1,fade=out:st={d - 0.25:.3f}:d=0.25:alpha=1,"
            f"setpts=PTS-STARTPTS+{t0}/TB[c{i}]")
        # выезд снизу на 36 px за 0.3 с
        y = f"if(lt(t-{t0},0.3),36*(1-(t-{t0})/0.3),0)"
        fc.append(f"[{prev}][c{i}]overlay=x=0:y='{y}':eof_action=pass:format=auto[v{i}]")
        prev = f"v{i}"
    # заставка: медленный наезд на логотип
    zoom = f"zoompan=z='1+0.0009*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s={W}x{H}:fps=30"
    fc.append(f"[{card_idx}:v]scale={W * 2}:{H * 2},{zoom},format=yuv420p[card]")
    fc.append(f"[{prev}]trim=0:{foot:.3f},setpts=PTS-STARTPTS,format=yuv420p[foot]")
    fc.append(f"[foot][card]xfade=transition=smoothup:duration={XF}:offset={foot - XF:.3f},format=yuv420p[vout]")

    out = OUT / "prime-swim-reel-nogi.mp4"
    run(["ffmpeg", "-v", "error", "-y", *inputs,
         "-f", "lavfi", "-t", f"{total:.3f}", "-i", "anullsrc=r=48000:cl=stereo",
         "-filter_complex", ";".join(fc),
         "-map", "[vout]", "-map", f"{card_idx + 1}:a",
         "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-profile:v", "high", "-pix_fmt", "yuv420p",
         "-r", "30", "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", out])
    print("ok", out, f"{total:.2f}s")


if __name__ == "__main__":
    main()
