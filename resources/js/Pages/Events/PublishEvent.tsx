import React, { FormEventHandler, useState, useCallback } from 'react';
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
import ArticleEditor from '@/Components/dashboard/ArticleEditor';
import ImageUploader from '@/Components/dashboard/ImageCropper';
import { compressBase64Images, getCroppedImg } from '@/lib/ImageUtils';
import { Calendar } from '@/Components/ui/calendar';
import { DayPicker } from 'react-day-picker';
import "react-day-picker/style.css";
import LocationSelect from '@/Components/dashboard/LocationSelect';
import CalendarInput from '@/Components/dashboard/CalendarInput';


export default function PublishEvent() {
  const [preview, setPreview] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);

  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [wilaya, setWilaya] = useState('');
  const handleLocationChange = (value: string) => {
    setLocation(value);
  };
  const handleWilayaChange = (value: string) => {
    setWilaya(value);
  };


  const [data, setData] = useState({
    title: '',
    category: null,
    thumbnail: null,
    summary: '',
    content: '',
  });

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    setErrorMessage('');

    if (!data.content || data.content.trim() === '') {
      setErrorMessage('Content is required');
      setIsFetching(false);
      return;
    }

    const compressedContent = await compressBase64Images(data.content);
    // const croppedImage = await getCroppedImg(preview, croppedArea);
    const formData = new FormData();
    formData.append('title', data.title);
    // formData.append('thumbnail', croppedImage);
    formData.append('thumbnail', preview);
    formData.append('summary', data.summary);
    formData.append('content', compressedContent);
    formData.append('event_date', JSON.stringify(selectedDate, null, 2));
    formData.append('location', location);
    formData.append('wilaya', wilaya);

    try {
      const response = await axios.post(route('event.publish'), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newUrl = response.data.url;
      window.location.replace(newUrl);

    } catch (error) {
      console.error('Error publishing article:', error);
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
    <DashboardLayout title='Add Article'>
      <Head title="Create Article" />
      
      <form onSubmit={handleSubmit} className='flex flex-1 flex-col'>
        <div className='flex flex-1 flex-col p-2 gap-3'>
          <div className='flex flex-col md:flex-row justify-between gap-2'>
            <div className='flex-1 flex flex-col gap-2'>
              <Input
                type="text"
                placeholder="Title"
                onChange={(e) => setData((prevData) => ({ ...prevData, title: e.target.value }))}
                required
              />
              <div className=''>
                <CalendarInput
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  errorMessage={errorMessage}
                />
              </div>
              <div>
                <LocationSelect
                  location={location}
                  setLocation={handleLocationChange}
                  wilaya={wilaya}
                  setWilaya={handleWilayaChange}
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
                setCroppedArea={setCroppedArea}
                setPreview={setPreview}
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
            <Button>Button</Button>
          }
        </div>
      </form>
    </DashboardLayout>
  );
}
