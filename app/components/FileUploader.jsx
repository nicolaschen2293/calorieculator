import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

export default function FileUploader({ setFile }) {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile);
  };

  // Function to open the camera
  const openCamera = () => {
    setIsCameraOn(true);
    setCapturedImage(null); // Reset captured image
  };

  // Function to close the camera
  const closeCamera = () => {
    setIsCameraOn(false);
  };

  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(",")[1]); // Decode Base64
    const mimeString = base64.split(",")[0].split(":")[1].split(";")[0]; // Get MIME type
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  };

  // Function to capture an image
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const imageBlob = base64ToBlob(imageSrc);
      setFile(imageBlob)
      closeCamera(); // Close camera after capturing
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center pb-2 gap-3">
        <input type="file" onChange={handleFileChange} className="col-10" />

        {!isCameraOn && !capturedImage && (
            <button onClick={openCamera} className="">
            Open Camera
            </button>
        )}

        {isCameraOn && (
            <div className="d-flex flex-column justify-content-center align-items-center pb-2">
            <Webcam
                ref={webcamRef}
                screenshotFormat="image/png"
                className="pb-2"
            />
            <button onClick={captureImage} className="">
                Capture Photo
            </button>
            <br />
            <button onClick={closeCamera} className="">
                Close Camera
            </button>
            </div>
        )}

        {capturedImage && (
            <div>
            <h3 className="text-lg font-bold">Captured Image</h3>
            <img src={capturedImage} alt="Captured" className="border rounded-lg w-80" />
            </div>
        )}
    </div>
  );
}
