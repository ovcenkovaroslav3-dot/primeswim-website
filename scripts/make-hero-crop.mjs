/**
 * Фото первого экрана из выбранного владельцем оригинала.
 * Запуск: node scripts/make-hero-crop.mjs
 * Оригинал остаётся в media-source; JPEG и AVIF создаются без увеличения.
 */
import sharp from 'sharp';

const source = 'media-source/hero/owner-selected-2026-11-02.jpg';
const base = 'public/media/pool/mgik-training-hero';
const { width, height } = await sharp(source).metadata();
if (width !== 960 || height !== 1280) {
  throw new Error('Размер исходного фото изменился: проверьте кадрирование hero.');
}

const write = async (image, output) => {
  await image.clone().jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(`${output}.jpg`);
  await image.clone().avif({ quality: 62 }).toFile(`${output}.avif`);
};

await write(sharp(source).rotate(), base);
// На 960×1280: окно 960×720, верх 493. В кадре лица и руки у бортика.
const cropHeight = 720;
const top = Math.round((height - cropHeight) * 0.88);
await write(sharp(source).rotate().extract({ left: 0, top, width, height: cropHeight }), `${base}-4x3`);
console.log(`Hero: ${width}×${height}; mobile: ${width}×${cropHeight}, top ${top}px`);
