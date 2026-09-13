/**
 * Петли гребка для секции техники: public/media/strokes/<id>.{webm,mp4}.
 *
 * Источники — media-source/brand/strokes/motion/<id>.mp4, по пять секунд
 * 720p от Seedance (промты — в docs/brand-prime-orca.md). Отдавать их как
 * есть нельзя: 1,1 МБ на стиль при показе в 420 пикселей.
 *
 * ПОЧЕМУ ВИДЕО, А НЕ ПОКАДРОВАЯ АНИМАЦИЯ. Кадры пробовали первыми: четыре
 * положения рук, снятые по отдельности, и смена по opacity. Не сложилось по
 * двум причинам сразу, и обе неустранимы на уровне промта. Каждый кадр —
 * отдельная генерация, поэтому вторая рука от кадра к кадру не менялась
 * (гребок читался одноруким), а фигура смещалась по кадру и «прыгала» при
 * перелистывании. Четыре кадра к тому же не бывают плавными: цикл кроля
 * около полутора секунд, это меньше трёх кадров в секунду.
 *
 * Видеомодель делает ровно то, чего не может модель картинок: непрерывное
 * движение обеих рук в одном и том же силуэте. Плоский стиль она удерживает,
 * если сказать об этом прямо и не один раз.
 *
 * ВЕС. Плоская заливка без градиентов сжимается прекрасно: 1 150 КБ исходника
 * превращаются примерно в 110 КБ при 840 пикселях ширины. Это дешевле, чем
 * четыре кадра в AVIF на тот же стиль, и несравнимо дешевле трёхмерной модели
 * с просмотрщиком.
 *
 * ДВА ФОРМАТА. VP9 в webm первым, H.264 в mp4 запасным: браузер берёт первый
 * поддержанный, а H.264 понимают все. Размер у них одинаковый до килобайта,
 * так что дело не в экономии — просто webm не требует лицензий на кодек.
 *
 * ЗАПУСК: node scripts/make-stroke-motion.mjs   (нужен ffmpeg в PATH)
 */

import { execFile } from 'node:child_process';
import { mkdir, readdir, rm, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import sharp from 'sharp';

const run = promisify(execFile);

const SRC = 'media-source/brand/strokes/motion';
const OUT = 'public/media/strokes';

/* Панель показывается примерно в 420 px; 840 — двойная плотность. */
const WIDTH = 840;

/* Фон панели — им же подкладываются поля, чтобы шва не было видно. */
const PANEL_BG = '0x180229';


await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => f.endsWith('.mp4'));
if (!files.length) {
  throw new Error(`В ${SRC} нет исходных роликов.`);
}

/**
 * Строка, на которой в кадре нарисована линия воды.
 *
 * ЗАЧЕМ. Стартовый кадр отдаётся модели в пропорциях панели, но ролик
 * возвращается в своих (4:3) — модель добавляет поля сверху и снизу, и линия
 * воды перестаёт проходить по центру. Если это не выправить, лаймовая волна
 * на панели ляжет мимо: две линии воды на расстоянии в палец друг от друга.
 *
 * КАК ИЩЕТСЯ. По ширине занятой строки, а не по яркости. Линия тянется от
 * края до края, то есть покрывает почти сто процентов кадра; самая широкая
 * строка фигуры — торс — покрывает заметно меньше. Проверка по яркости в
 * левой кромке, стоявшая здесь сначала, ловила не линию, а кончики пальцев:
 * у кроля вытянутая рука достаёт до самого края.
 */
async function waterLineRow(frame) {
  const { data, info } = await sharp(frame)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  /*
    ПОРОГ СЧИТАЕТСЯ ОТ САМОГО КАДРА, а не берётся числом. Фиксированные 90
    работали, пока все ролики были одной светлоты; стоило одному приехать
    темнее — и ни один пиксель порога не проходил, поиск возвращал нулевую
    строку, а кадр после подкладки полей уезжал вдвое. Теперь порог лежит
    посередине между самым тёмным и самым светлым в кадре: у плоской заливки
    это ровно граница между фоном и фигурой.
  */
  let min = 255;
  let max = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const v = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const threshold = min + (max - min) * 0.45;
  let best = { row: 0, count: -1 };
  for (let y = 0; y < info.height; y++) {
    let count = 0;
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      if ((data[i] + data[i + 1] + data[i + 2]) / 3 > threshold) count++;
    }
    if (count > best.count) best = { row: y, count };
  }
  return { row: best.row, height: info.height, width: info.width };
}

for (const file of files.sort()) {
  const name = file.replace(/\.mp4$/, '');
  const input = `${SRC}/${file}`;

  /*
    ПОЛЯ, А НЕ ОБРЕЗКА. Сначала кадр обрезался так, чтобы линия оказалась в
    середине, — и упирался в край: у кроля линия стояла на 613-й строке из
    834, а сдвинуть её требовалось на 250 пикселей при запасе в 108. Обрезка
    молча прижималась к краю, и линия оставалась не по центру.

    Подкладка полей работает всегда: добавляем прозрачного цвета фона с той
    стороны, где короче, — и линия оказывается ровно посередине кадра любой
    высоты. Цвет тот же, что у панели, так что шва не видно.
  */
  const probeFrame = `${SRC}/.probe-${name}.png`;
  await run('ffmpeg', ['-v', 'error', '-y', '-i', input, '-frames:v', '1', probeFrame]);
  const line = await waterLineRow(probeFrame);
  await rm(probeFrame, { force: true });

  const above = line.row;
  const below = line.height - line.row;
  const padded = 2 * Math.max(above, below);
  const offsetY = Math.max(0, below - above);
  const pad = `pad=${line.width}:${padded}:0:${offsetY}:${PANEL_BG}`;

  /*
    `scale=840:-2` — высота считается сама и округляется до чётного: H.264 с
    нечётной высотой в yuv420p просто не собирается.

    `+faststart` переносит заголовок в начало файла, иначе браузер ждёт
    загрузки целиком, прежде чем показать первый кадр.
  */
  await run('ffmpeg', [
    '-v', 'error', '-y', '-i', input,
    '-vf', `${pad},scale=${WIDTH}:-2`,
    '-c:v', 'libx264', '-crf', '30', '-preset', 'slow',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an',
    `${OUT}/${name}.mp4`,
  ]);

  await run('ffmpeg', [
    '-v', 'error', '-y', '-i', input,
    '-vf', `${pad},scale=${WIDTH}:-2`,
    '-c:v', 'libvpx-vp9', '-crf', '38', '-b:v', '0', '-row-mt', '1', '-an',
    `${OUT}/${name}.webm`,
  ]);

  const src = (await stat(input)).size / 1024;
  const mp4 = (await stat(`${OUT}/${name}.mp4`)).size / 1024;
  const webm = (await stat(`${OUT}/${name}.webm`)).size / 1024;
  console.log(
    `${name.padEnd(13)} вода ${line.row}/${line.height} → центр, ${src.toFixed(0)} KB → mp4 ${mp4.toFixed(0)} KB, webm ${webm.toFixed(0)} KB`,
  );
}
