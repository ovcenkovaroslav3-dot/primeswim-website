"""
Печатные материалы в CMYK для типографии: TIFF, ISO Coated v2 (FOGRA39), LZW.

Ролл-ап (make-rollup.mjs) и листовка A4 (make-flyer.mjs) собираются в RGB
PNG в натуральный размер; этот скрипт переводит такой PNG в CMYK.

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

ДВА ФАЙЛА. Типография принимает TIFF без слоёв или PDF/X-1a — пишутся оба.
PDF несёт тот же CMYK-растр без потерь (Flate, не JPEG), профиль FOGRA39
как OutputIntent и метки PDF/X-1a:2001; версия PDF 1.3, без прозрачностей.
Для PDF нужен pikepdf, без него пишется только TIFF.

ЗАПУСК (в окружении с Pillow; DPI — как у PNG, BLEED — вылет в мм, если есть):
  MOUNT=50 LIME=#accf11 DPI=150 node scripts/make-rollup.mjs
  DPI=150 python3 scripts/print-cmyk.py media-source/brand/rollup-85x205-print-150dpi.png

  BLEED=3 LIME=#accf11 DPI=300 node scripts/make-flyer.mjs
  DPI=300 BLEED=3 python3 scripts/print-cmyk.py media-source/brand/flyer-a4-bleed3-print-300dpi.png

С вылетом в PDF пишется TrimBox по чистому формату: типография видит, где резать.
"""

import hashlib
import io
import os
import sys
import time
import urllib.request
import zlib
from pathlib import Path

from PIL import Image, ImageCms

Image.MAX_IMAGE_PIXELS = None  # 5020×12106 — больше порога защиты Pillow

ICC_URL = (
    'https://raw.githubusercontent.com/scribusproject/scribus/'
    'master/resources/profiles/ISOcoated_v2_300_bas.icc'
)
ICC_MD5 = 'c8c55f9a599dfc08df0c71b0e460468f'
DPI = int(os.environ.get('DPI', 150))
BLEED_MM = float(os.environ.get('BLEED', 0))


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
    title = dst.stem
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

    try:
        import pikepdf
    except ImportError:
        print('pikepdf не установлен — PDF/X-1a не собран')
        return
    pdf_path = dst.with_suffix('.pdf')
    write_pdfx1a(pikepdf, out, icc, pdf_path, title)
    print(f'{pdf_path} — PDF/X-1a, {pdf_path.stat().st_size / 1024 / 1024:.0f} МБ')


def write_pdfx1a(pikepdf, img: Image.Image, icc: bytes, path: Path, title: str) -> None:
    """Одна страница: CMYK-растр без потерь, FOGRA39, TrimBox по чистому формату."""
    N = pikepdf.Name
    w, h = img.size
    w_pt, h_pt = w / DPI * 72, h / DPI * 72
    pdf = pikepdf.new()

    image = pikepdf.Stream(pdf, zlib.compress(img.tobytes(), 6))
    image.Type, image.Subtype = N.XObject, N.Image
    image.Width, image.Height = w, h
    image.ColorSpace, image.BitsPerComponent = N.DeviceCMYK, 8
    image.Filter = N.FlateDecode

    box = [0, 0, w_pt, h_pt]
    b = BLEED_MM / 25.4 * 72
    page = pikepdf.Dictionary(
        Type=N.Page,
        MediaBox=box,
        BleedBox=box,
        TrimBox=[b, b, w_pt - b, h_pt - b],
        Resources=pikepdf.Dictionary(XObject=pikepdf.Dictionary(Im0=image)),
        Contents=pikepdf.Stream(pdf, f'q {w_pt:.4f} 0 0 {h_pt:.4f} 0 0 cm /Im0 Do Q'.encode()),
    )
    pdf.pages.append(pikepdf.Page(page))

    profile = pikepdf.Stream(pdf, icc)
    profile.N = 4
    pdf.Root.OutputIntents = pikepdf.Array([pikepdf.Dictionary(
        Type=N.OutputIntent,
        S=N.GTS_PDFX,
        OutputConditionIdentifier='FOGRA39',
        OutputCondition='Coated FOGRA39 (ISO 12647-2:2004)',
        RegistryName='http://www.color.org',
        Info='ISO Coated v2 300% (basICColor)',
        DestOutputProfile=profile,
    )])

    stamp = time.strftime("D:%Y%m%d%H%M%S+00'00'", time.gmtime())
    pdf.docinfo[N.Title] = f'PRIME SWIM — {title}'
    pdf.docinfo[N.CreationDate] = stamp
    pdf.docinfo[N.ModDate] = stamp
    pdf.docinfo[N.Trapped] = N('/False')
    pdf.docinfo[N.GTS_PDFXVersion] = 'PDF/X-1:2001'
    pdf.docinfo[N.GTS_PDFXConformance] = 'PDF/X-1a:2001'

    pdf.save(
        path,
        force_version='1.3',
        object_stream_mode=pikepdf.ObjectStreamMode.disable,
    )


if __name__ == '__main__':
    main(sys.argv[1])
