import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

const Editor = () => {
  const editor = useRef(null);

  return (
    <JoditEditor
      ref={editor}
      value={""}
      config={{
        readonly: false,
        toolbar: true,
        height: 400
      }}
      onBlur={newContent => {}} // preferred to use only this option to update the content for performance reasons
    />
  );
};

export default Editor;
