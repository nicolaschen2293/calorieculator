import React, { useState } from "react";
import axios from "axios";
import { UTF8_GENERAL_MYSQL500_CI } from "mysql/lib/protocol/constants/charsets";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null)

  // Handle file selection
  const handleFileChange = (e) => {
    console.log('handling file upload')
    const selectedFile = e.target.files[0]
    setFile(selectedFile);

    if (selectedFile) {
      console.log('setting preview image')
      const reader = new FileReader();
      const blob = new Blob([selectedFile], { type: selectedFile.type })
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(blob);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    } else {
      alert('File ready to upload!')
    }

    // Send to backend for processing
    const handleUpload = async () => {
      if (!file) return;
  
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await fetch("http://127.0.0.1:8000/upload/", {
          method: "POST",
          body: formData,
        });
  
        const data = await response.json();
        setResult(data.predictions);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <input type="file" onChange={handleFileChange} />
      {image && <img src={image} alt="Preview"/>}
      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default FileUpload;