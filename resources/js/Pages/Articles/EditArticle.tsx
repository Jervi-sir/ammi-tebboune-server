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
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { Loader2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Head } from '@inertiajs/react';
import ImageUploader from '@/Components/dashboard/ImageCropper';
import ArticleEditor from '@/Components/dashboard/ArticleEditor';
import { compressBase64Images, getCroppedImg } from '@/lib/ImageUtils';
import { isBase64 } from '@/lib/processImageUrlToBase64';

export default function EditArticle({ article, categories }) {
  const [preview, setPreview] = useState(article.thumbnail ? `${article.thumbnail}` : null);
  const [croppedArea, setCroppedArea] = useState(null);

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
    
    // Compress images inside the content
    const compressedContent = await compressBase64Images(data.content);
    // const croppedImage = await getCroppedImg(preview, croppedArea);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    // formData.append('thumbnail', croppedImage);
    if(data.thumbnail !== null) {
      formData.append('thumbnail', data.thumbnail);
    }
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
              <ImageUploader 
                initialPreview={preview}
                setCroppedArea={setCroppedArea}
                setPreview={(preview) => setData((prevData) => ({ ...prevData, thumbnail: preview }))}
              />
            </div>
          </div>
          <div className='flex-1'>
            <ArticleEditor
              initialContent={data.content}
              onContentChange={(newContent) => setData((prevData) => ({ ...prevData, content: newContent }))}
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

