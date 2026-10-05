"""
Ролл-ап в CMYK для типографии: TIFF, ISO Coated v2 (FOGRA39), LZW.

Требования типографии к макету ролл-апа: CMYK Coated FOGRA39, 150–300 dpi,
шрифты в кривых, прозрачности разобраны или растрированы, TIFF без слоёв и
альфа-каналов, сжатие LZW (не JPEG), файл до 200 МБ, размер — ровно ролл-ап,
без вылетов и меток.

Растр закрывает сразу три пункта: текст в нём уже кривые, прозрачности и
градиенты сведены, слоёв нет. Остаётся перевести цвет и сохранить правильно.

ПРОФИЛЬ. ISO Coated v2 300% от basICColor — характеризация FOGRA39, лицензия
zlib. Лежит в исходниках Scribus; скачивается по закреплённому адресу и
сверяется по md5, чтобы чужой файл не подменил цвет молча. Интент —
относительный колориметрический с компенсацией точки чёрного: так плоские
фирменные цвета сохраняют оттенок, а не сжимаются к серому, как в
перцептивном.

ЛАЙМ. Растр на вход подаётся уже с печатным лаймом (LIME=#accf11 в
make-rollup.mjs) — иначе #c7fe03 уйдёт в жёлтый. Почему так — там же.

ЗАПУСК (в окружении с Pillow):
  MOUNT=50 LIME=#accf11 DPI=150 node scripts/make-rollup.mjs
  python3 scripts/rollup-cmyk.py media-source/brand/rollup-85x205-print-150dpi.png
"""

import hashlib
import io
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageCms

Image.MAX_IMAGE_PIXELS = None  # 5020×12106 — больше порога защиты Pillow

ICC_URL = (
    'https://raw.githubusercontent.com/scribusproject/scribus/'
    'master/resources/profiles/ISOcoated_v2_300_bas.icc'
)
ICC_MD5 = 'c8c55f9a599dfc08df0c71b0e460468f'
DPI = 150


def fogra39() -> bytes:
    data = urllib.request.urlopen(ICC_URL, timeout=60).read()
    got = hashlib.md5(data).hexdigest()
    if got != ICC_MD5:
        raise SystemExit(f'профиль не тот: md5 {got}, ждали {ICC_MD5}')
    return data


def main(src: str) -> None:
    icc = fogra39()
    cmyk = ImageCms.getOpenProfile(io.BytesIO(icc))
    srgb = ImageCms.createProfile('sRGB')

    rgb = Image.open(src).convert('RGB')
    out = ImageCms.profileToProfile(
        rgb,
        srgb,
        cmyk,
        renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC,
        outputMode='CMYK',
        flags=ImageCms.Flags.BLACKPOINTCOMPENSATION,
    )

    dst = Path(src).with_name(Path(src).stem.replace(f'-{DPI}dpi', '') + '-cmyk.tif')
    out.save(
        dst,
        compression='tiff_lzw',
        icc_profile=icc,
        dpi=(DPI, DPI),
    )

    w, h = out.size
    mm = lambda px: round(px / DPI * 25.4, 1)
    print(f'{dst} — {w}×{h} px = {mm(w)}×{mm(h)} мм при {DPI} dpi, '
          f'{dst.stat().st_size / 1024 / 1024:.0f} МБ')


if __name__ == '__main__':
    main(sys.argv[1])
