import React, { useRef, useState } from "react";
import { Camera } from "react-camera-pro";

export default function FileUploader({ setFile }) {
  const camera = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleFileChange = (e) => {
    closeCamera();
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  // Function to open the camera
  const openCamera = async () => {
    setIsCameraOn(true);
    setCapturedImage(null); // Reset captured image
  };

  // Function to close the camera
  const closeCamera = () => {
    setIsCameraOn(false);
  };

  // Function to capture an image
  const captureImage = () => {
    const image = camera.current.takePhoto();
    fetch(image)
      .then(res => res.blob())
      .then(blob => setFile(blob));
    closeCamera();
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
            <div className="w-100 d-flex flex-column justify-content-center" style={{ maxWidth: "600px" }}>
              <Camera
                  ref={camera}
                  aspectRatio={4 / 3}
                  facingMode="environment"
                  className="w-100 mb-3 border rounded"
                  style={{ height: "auto" }}
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
