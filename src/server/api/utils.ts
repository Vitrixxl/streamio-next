import { mkdir, writeFile } from 'fs/promises';
import { extension } from 'mime-types';

function getExtensionFromMime(file: File): string | null {
  const mimeToExt: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/bmp': 'bmp',
    'image/svg+xml': 'svg',
  };

  return mimeToExt[file.type] || null;
}
export const writeImg = async (id: string, img: File) => {
  const imagesPath = `${process.cwd()}/images/room`;
  const ext = extension(img.type) || 'application/octet-stream';
  const imgPath = `${imagesPath}/${id}.${ext}`;
  await mkdir(imagesPath, { recursive: true });
  await writeFile(imgPath, await img.bytes());
  return ext;
};
