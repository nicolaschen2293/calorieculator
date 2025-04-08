import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../utils/supabase";
import AuthPrompt from "../components/AuthPrompt";
import { useSelector, useDispatch } from "react-redux";
import { logOutUser } from "../utils/stores/userSlice";
import { setFood, setFoodImg } from "../utils/stores/foodSlice";
import FileUploader from "../components/FileUploader";

export default function Home() {
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const convertBlobToBase64 = async (blob) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
      });
    };

    const processImg = async () => {
      if (file) {
        setUploadError(false);
        console.log('Setting preview image.');
        const reader = new FileReader();
        const blob = new Blob([file], { type: file.type });
        const b64 = await convertBlobToBase64(blob);
        dispatch(setFoodImg(b64));
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(blob);
      }
    };

    processImg();
  }, [file]);

  async function logOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign-out error:", error.message);
    } else {
      console.log("User signed out successfully.");
      dispatch(logOutUser());
    }
  }

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const API_URL = import.meta.env.VITE_API_URL;
    console.log('API URL = ', API_URL);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data['error']) {
        setUploadError(true);
      } else {
        dispatch(setFood(data.result));
        navigate('/uploader');
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div key={user} className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 text-center">
      <h1 className="text-4xl font-bold">CalorieCulator</h1>

      <h2 className="text-xl">You have consumed {caloriesConsumed} kcal today!</h2>

      <AuthPrompt />

      {user ? (
        <button
          onClick={logOut}
          disabled={loading}
          className="px-4 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Log Out
        </button>
      ) : (
        <h5 className="text-md text-gray-600">Create an account and log in lil bro.</h5>
      )}

      <FileUploader setFile={setFile} />

      {image && (
        <img
          src={image}
          alt="Preview"
          className="w-36 h-36 object-cover rounded shadow"
        />
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-6 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {loading && <h4 className="text-yellow-600">Uploading image... </h4>}
      {uploadError && <h4 className="text-red-600">Image recognition failed.</h4>}

      <Link to='/history' className="mt-4 text-blue-600 underline hover:text-blue-800">
        Consumption History
      </Link>
    </div>
  );
}