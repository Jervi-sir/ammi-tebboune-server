import imageCompression from 'browser-image-compression';

export const isBase64 = (str) => {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};

const urlToBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return await blobToBase64(blob);
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const compressImage = async (base64) => {
  const blob = await fetch(base64).then(res => res.blob()) as any;  // added any herer
  const compressedBlob = await imageCompression(blob, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 480,
    useWebWorker: true,
    maxIteration: 10,
    initialQuality: 0.6,
  });
  return await blobToBase64(compressedBlob);
};

const processImageUrlToBase64 = async (url) => {
  if (isBase64(url)) {
    return url; // Already a Base64 string
  }

  const base64Image = await urlToBase64(url);
  const compressedImage = await compressImage(base64Image);
  return compressedImage;
};

export default processImageUrlToBase64;
