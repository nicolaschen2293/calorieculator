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

    // const formData = new FormData();
    // formData.append("file", file); // "file" is the key your backend will expect

    // try {
    //   const response = await axios.post("http://localhost:5000/upload", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data", // Set correct content type
    //     },
    //   });
    //   console.log("File uploaded successfully:", response.data);
    // } catch (error) {
    //   console.error("Error uploading file:", error);
    // }
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