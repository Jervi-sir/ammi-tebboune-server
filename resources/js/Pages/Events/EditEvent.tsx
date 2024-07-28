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
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Head } from '@inertiajs/react';
import CalendarInput from '@/Components/dashboard/CalendarInput';
import LocationSelect from '@/Components/dashboard/LocationSelect';
import ImageUploader from '@/Components/dashboard/ImageCropper';
import ArticleEditor from '@/Components/dashboard/ArticleEditor';
import { compressBase64Images, getCroppedImg } from '@/lib/ImageUtils';
import { format } from 'date-fns';
import processImageUrlToBase64, { isBase64 } from '@/lib/processImageUrlToBase64';

export default function EditEvent({ event }) {
  const [preview, setPreview] = useState(event.thumbnail ? `${event.thumbnail}` : null);
  const [croppedArea, setCroppedArea] = useState(null);

  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [data, setData] = useState({
    title: event.title,
    thumbnail: null,
    summary: event.summary,
    content: event.content,
    location: event.location,
    wilaya: event.wilaya,
    event_date: event.event_date
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

    const formattedDate = data.event_date ? format(data.event_date, 'yyyy-MM-dd') : null;

    // Compress images inside the content
    const compressedContent = await compressBase64Images(data.content);
    // const croppedImage = await getCroppedImg(preview, croppedArea);
    const formData = new FormData();
    formData.append('title', data.title);
    // formData.append('thumbnail', croppedImage);
    if(data.thumbnail !== null) {
      formData.append('thumbnail', data.thumbnail);
    }
    formData.append('summary', data.summary);
    formData.append('content', compressedContent);
    formData.append('wilaya', data.wilaya);
    formData.append('location', data.location);
    formData.append('event_date', formattedDate);

    try {
      const response = await axios.post(route('event.update', { id: event.id }), formData, {
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
    <DashboardLayout title='Edit Event'>
      <Head title="Edit Event" />

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
              <div className=''>
                <CalendarInput
                  selectedDate={data.event_date}
                  setSelectedDate={(e) => setData((prevData) => ({ ...prevData, event_date: e }))}
                  errorMessage={errorMessage}
                />
              </div>
              <div>
                <LocationSelect
                  location={data.location}
                  setLocation={(e) => setData((prevData) => ({ ...prevData, location: e }))}
                  wilaya={data.wilaya}
                  setWilaya={(e) => setData((prevData) => ({ ...prevData, wilaya: e }))}
                />
              </div>
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
            <Button>Update Event</Button>
          }
        </div>
      </form>
    </DashboardLayout>
  );
}


function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });
}
