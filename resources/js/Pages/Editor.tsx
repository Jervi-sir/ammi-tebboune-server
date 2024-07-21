import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce';
import DashboardLayout from '@/Layouts/DashboardLayout';


export default function EditorDashboard() {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Inertia.post('/posts', { content });
    console.log(e)
  };

  return (
    <DashboardLayout title='Add Article'>
      <div className='flex-1 p-2'>
        <Editor
          initialValue={""}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help'
          }}
          onEditorChange={(newContent) => setContent(newContent)}
        />
      </div>
   </DashboardLayout>
  )

}