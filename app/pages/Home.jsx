import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { supabase } from "../utils/supabase";
import AuthPrompt from "../components/AuthPrompt";
import { useSelector, useDispatch } from "react-redux";
import { logOutUser } from "../utils/stores/userSlice";
import { setFood, setFoodImg } from "../utils/stores/foodSlice";
import FileUploader from "../components/FileUploader";
import { useNavigate } from "react-router-dom";

export default function Home() {

    const [caloriesConsumed, setCaloriesConsumed] = useState(0)
    const [file, setFile] = useState(null)
    const [image, setImage] = useState(null)
    const user = useSelector((state) => state.user.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    useEffect(() => {
        const convertBlobToBase64 = async (blob) => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => resolve(reader.result);
            });
        };

        const processImg = async () => {
            if(file) {
            console.log('Setting preview image.')
            const reader = new FileReader();
            const blob = new Blob([file], { type: file.type })
            const b64 = await convertBlobToBase64(blob)
            dispatch(setFoodImg(b64))
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(blob);
            }
        }

        processImg()
    }, [file])

    async function logOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Sign-out error:", error.message);
        } else {
            console.log("User signed out successfully.");
            dispatch(logOutUser())
        }
    }

    const handleUpload = async () => {
        if (!file) return;
    
        const formData = new FormData();
        formData.append("file", file);
    
        const API_URL = import.meta.env.VITE_API_URL;
        console.log('API URL = ', API_URL)
    
        try {
          const response = await fetch(API_URL, {
            method: "POST",
            body: formData,
          });
    
          const data = await response.json();
          dispatch(setFood(data.result))
          navigate('/uploader')
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }

    return (
        <div key={user}>
        <h1>CalorieCulator</h1>

        <h2>You have consumed {caloriesConsumed} kcal today!</h2>

        <AuthPrompt />

        {user ? <button onClick={async () => await logOut()}>Log Out</button> : <h5>Create an account and log in lil bro.</h5>}

        <FileUploader setFile={setFile} />
        
        {image && <img src={image} className="col-12" alt="Preview" style={{ width: "150px", height: "150px" }}/>}

        <button onClick={handleUpload}>
          Upload
        </button>

        <br />

        <Link to='/uploader'>Eat Something</Link>
        
        <br />

        <Link to='/history'>Consumption History</Link>

        </div>
    )
}