import React, { useState, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
  setCroppedArea: (area) => void;
  setPreview?: (preview: string | ArrayBuffer | null) => void;
  initialPreview?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setCroppedArea, setPreview, initialPreview = null }) => {
  const [preview, setLocalPreview] = useState<string | ArrayBuffer | null>(initialPreview);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 480,
          useWebWorker: true,
          maxIteration: 10,
          initialQuality: 0.6,
        });

        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalPreview(reader.result);
          if (setPreview) {
            setPreview(reader.result);
          }
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const onCropComplete = useCallback(
    async (croppedArea, croppedAreaPixels) => {
      setCroppedArea(croppedAreaPixels);
      try {
        const croppedImage = await getCroppedImg(preview as string, croppedAreaPixels);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (setPreview) {
            setPreview(reader.result);
          }
        };
        reader.readAsDataURL(croppedImage as Blob);
      } catch (error) {
        console.error('Error cropping image:', error);
      }
    },
    [preview, setCroppedArea, setPreview]
  );

  return (
    <div>
      <div className="image-preview h-[300px] overflow-hidden relative">
        {preview && (
          <Cropper
            image={preview as string}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        )}
      </div>
      <Input id="thumbnail" type="file" accept="image/*" onChange={handleImageChange} />
    </div>
  );
};

export default ImageUploader;

// Helper function to create an image from a URL
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // to avoid CORS issues, if needed
    image.src = url;
  });
}

// Function to get the cropped image
async function getCroppedImg(imageSrc: string, pixelCrop: any) {
  const image = await createImage(imageSrc);
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
      //blob.name = 'cropped.jpeg';
      const file = new File([blob], 'cropped.jpeg', { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg');
  });
}
