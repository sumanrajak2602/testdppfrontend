import React from 'react';

const FileUploader = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  return (
    <input
      type="file"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          onFileSelect(e.target.files[0]);
        }
      }}
    />
  );
};

export default FileUploader;
