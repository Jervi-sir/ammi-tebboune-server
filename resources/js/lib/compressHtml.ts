import imageCompression from 'browser-image-compression';

const getBase64 = (file: Blob): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const compressImagesInContent = async (htmlContent: string): Promise<string> => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const images = doc.querySelectorAll('img');

  for (let img of images) {
    try {
      const imageUrl = img.src;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Adjust compression options for better results
      const compressedBlob = await imageCompression(blob, { 
        maxSizeMB: 0.5, // Reduced max size
        maxWidthOrHeight: 480, 
        useWebWorker: true, // Use web worker for better performance
        maxIteration: 10, // Increase iterations for better quality
        initialQuality: 0.6 // Adjust initial quality
      });

      const base64 = await getBase64(compressedBlob);
      img.src = base64;
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  }

  return doc.documentElement.outerHTML;
};
