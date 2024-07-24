import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface ArticleEditorProps {
  initialContent: string;
  onContentChange: (content: string) => void;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ initialContent, onContentChange }) => {
  const [content, setContent] = useState(initialContent);

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
          'pagebreak', 'save', 
          'editimage', 
        ],
        toolbar: `undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify |
         fontselect fontsizeselect formatselect | numlist bullist outdent indent |
          forecolor backcolor removeformat ltr rtl | pagebreak | charmap emoticons |
           fullscreen preview save print | insertfile image media template link anchor codesample |
          `,
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
        file_picker_types: 'image',
        image_advtab: true,
        language:'ar' //fr_FR, ar, en

      }}
      onEditorChange={(newContent) => {
        setContent(newContent);
        onContentChange(newContent);
      }}
    />
  );
};

export default ArticleEditor;

/*
|--------------------------------------------------------------------------
| I should Always compress the content with compressImagesInContent() 
| when I upload the content to backend 
|--------------------------------------------------------------------------
*/