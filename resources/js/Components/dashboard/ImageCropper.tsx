// ImageUploader.tsx
import React, { useState, useCallback } from 'react';
import { Input } from '@/Components/ui/input';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';

const ImageUploader = ({ setCroppedArea, setPreview }) => {
  const [preview, setLocalPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalPreview(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, [setCroppedArea]);

  return (
    <div>
      <div className="image-preview h-[300px] overflow-hidden relative">
        {preview && (
          <Cropper
            image={preview}
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
        required
      />
    </div>
  );
};

export default ImageUploader;
