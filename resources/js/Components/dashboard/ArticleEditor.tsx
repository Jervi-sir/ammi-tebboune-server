import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import imageCompression from 'browser-image-compression';

interface ArticleEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ initialContent, onContentChange }) => {
  const [content, setContent] = useState(initialContent);

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

  return (
    <Editor
      value={content}
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
      onEditorChange={(newContent) => {
        setContent(newContent);
        onContentChange(newContent);
      }}
    />
  );
};

export default ArticleEditor;
