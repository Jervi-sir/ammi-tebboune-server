import React, { FormEventHandler, useState, useCallback, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Input } from '@/Components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Textarea } from '@/Components/ui/textarea';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { Loader2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Head } from '@inertiajs/react';

export default function EditArticle({ article, categories }) {
  const [preview, setPreview] = useState(article.thumbnail ? `/storage/${article.thumbnail}` : null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [data, setData] = useState({
    title: article.title,
    category: article.category.name,
    thumbnail: null,
    summary: article.summary,
    content: article.content,
  });

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    setErrorMessage('');

    // Validate if content is not empty
    if (!data.content || data.content.trim() === '') {
      setErrorMessage('Content is required');
      setIsFetching(false);
      return;
    }
    console.log('data.content: ', data.content);
    
    // Compress images inside the content
    const compressedContent = await compressBase64Images(data.content);
    const croppedImage = await getCroppedImg(preview, croppedArea);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('thumbnail', croppedImage);
    formData.append('summary', data.summary);
    formData.append('content', compressedContent);

    try {
      const response = await axios.post(route('article.update', { id: article.id }), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newUrl = response.data.url;
      window.location.replace(newUrl);

    } catch (error) {
      console.error('Error updating article:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setData((prevData) => ({
          ...prevData,
          thumbnail: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleEditorImageUpload = async (blobInfo, success, failure) => {
    try {
      const file = blobInfo.blob();
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        // success(reader.result.toString());
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      failure(error.message);
    }
  };

  const compressBase64Images = async (content) => {
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
    const file = await base64ToFile(base64, mimeType);
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
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSummaryChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setData((prevData) => ({ ...prevData, summary: value }));
    }
  };

  return (
    <DashboardLayout title='Edit Article'>
      <Head title="Edit Article" />
      <form onSubmit={handleSubmit} className='flex flex-1 flex-col'>
        <div className='flex flex-1 flex-col p-2 gap-3'>
          {/* Top */}
          <div className='flex flex-col md:flex-row justify-between gap-2'>
            <div className='flex-1 flex flex-col gap-2'>
              <Input
                type="text"
                placeholder="Title"
                value={data.title}
                onChange={(e) => setData((prevData) => ({ ...prevData, title: e.target.value }))}
                required
              />
              <Select value={data.category} onValueChange={(e) => setData((prevData) => ({ ...prevData, category: e }))} required>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {
                      categories.map((category, index) => (
                        <SelectItem value={category.name} key={index}>{category.name}</SelectItem>
                      ))
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className='flex-1 flex flex-col'>
                <Textarea
                  className='flex-1'
                  placeholder="Summary."
                  value={data.summary}
                  onChange={handleSummaryChange}
                  maxLength={100}
                  required
                />
                <span>{data.summary.length}/100</span>
              </div>
            </div>
            <div className=''>
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
              />
              {/* <button type="button" onClick={() => getCroppedImg(preview, croppedArea)}>Crop Image</button> */}
            </div>
          </div>
          <div className='flex-1'>
            <Editor
              initialValue={data.content}
              init={{
                min_height: 500,
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'wordcount',
                  'emoticons', 'help', 'quickbars', 'autoresize',
                  'codesample', 'directionality', 'importcss', 'nonbreaking',
                  'pagebreak', 'save'
                ],
                toolbar: 'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect formatselect | numlist bullist outdent indent | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview save print | insertfile image media template link anchor codesample | ltr rtl',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                images_upload_handler: handleEditorImageUpload,
                file_picker_types: 'image',
                file_picker_callback: (callback, value, meta) => {
                  if (meta.filetype === 'image') {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.onchange = function () {
                      const file = this.files[0];
                      const reader = new FileReader();
                      reader.onload = function () {
                        const id = 'blobid' + (new Date()).getTime();
                        const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                        const base64 = reader.result.split(',')[1];
                        const blobInfo = blobCache.create(id, file, base64);
                        blobCache.add(blobInfo);
                        callback(blobInfo.blobUri(), { title: file.name });
                      };
                      reader.readAsDataURL(file);
                    };
                    input.click();
                  }
                },
              }}
              onEditorChange={(newContent) => setData((prevData) => ({ ...prevData, content: newContent }))}
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
          {
            isFetching
            ?
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
            :
            <Button>Update Article</Button>
          }
        </div>
      </form>
    </DashboardLayout>
  );
}

async function getCroppedImg(imageSrc, pixelCrop: Area) {
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
      blob.name = 'cropped.jpeg';
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
