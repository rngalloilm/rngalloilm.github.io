import React from 'react';

function FileUpload(props) {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    props.onFileSelect(selectedFile);
  };

  return (
    <div>
      <h1>File Upload</h1>
      <input className='input-text' type="file" accept = ".csv, .xlsx, .pdf" onChange={handleFileChange} />
    </div>
  );
}

export default FileUpload;
