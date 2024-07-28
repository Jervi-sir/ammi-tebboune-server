import { Area } from "react-easy-crop";
import imageCompression from 'browser-image-compression';

export async function getCroppedImg(imageSrc, pixelCrop: Area) {
  const image = await createImage(imageSrc) as CanvasImageSource; //HTMLImageElement;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Canvas is empty');
        return;
      }
      // blob.name = 'cropped.jpeg';
      const file = new File([blob], 'cropped.jpeg', { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg');
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}

export const compressBase64Images = async (content) => {
  const imgRegex = /<img src="data:image\/(png|jpeg|jpg);base64,([^"]+)"/g;
  let match;
  const promises = [];

  while ((match = imgRegex.exec(content)) !== null) {
    const base64 = match[2];
    const mimeType = match[1];
    const promise = compressBase64Image(base64, mimeType).then((compressedBase64) => {
      content = content.replace(base64, compressedBase64);
    });
    promises.push(promise);
  }

  await Promise.all(promises);
  return content;
};

const compressBase64Image = async (base64, mimeType) => {
  const file = await base64ToFile(base64, mimeType) as any; //added any here
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
  });
  return fileToBase64(compressedFile);
};

const base64ToFile = (base64, mimeType) => {
  const byteString = atob(base64);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: `image/${mimeType}` });
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64array = reader.result as any; //added any here
      const base64String = base64array.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

