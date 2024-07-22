import React, { useState, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';

interface ImageUploaderProps {
  setCroppedArea: (area: Area) => void;
  setPreview?: (preview: string | ArrayBuffer | null) => void;
  initialPreview?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setCroppedArea, setPreview, initialPreview = null }) => {
  const [preview, setLocalPreview] = useState<string | ArrayBuffer | null>(initialPreview);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalPreview(reader.result);
        if (setPreview) {
          setPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, [setCroppedArea]);

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
      <Input
        id="thumbnail"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        required={!initialPreview}
      />
    </div>
  );
};

export default ImageUploader;
