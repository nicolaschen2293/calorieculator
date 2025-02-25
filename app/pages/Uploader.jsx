import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase"
import FileUploader from "../components/FileUploader";
import { Link } from "react-router-dom";
import { checkUserSession } from "../utils/stores/userSlice";
import { useDispatch, useSelector } from "react-redux";
import AuthPrompt from "../components/AuthPrompt";

export default function Uploader() {
    const [file, setFile] = useState(null); // Store file object here
    const [image, setImage] = useState(null)
    const [foodName, setFoodName] = useState(null)
    const [servingSize, setServingSize] = useState(null)
    const [nutrition, setNutrition] = useState({
      calories: null,
      carbohydrate: null,
      protein: null,
      fat: null,
      fiber: null,
      sugar: null,
      sodium: null,
      cholesterol: null,
      saturated_fat: null
    });

    const [user, setUser] = useState(null)

    // When file is set, display preview image
    useEffect(() => {
      if(file) {
        console.log('Setting preview image.')
        const reader = new FileReader();
        const blob = new Blob([file], { type: file.type })
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(blob);
      }
    }, [file])

    const checkUser = (userData) => {
      setUser(userData)
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
          console.log('result = ', data);
          setFoodName(data.result['Food Name'])
          setServingSize(data.result['Serving Size'])
          setNutrition({
            calories: data.result['Calories'],
            carbohydrate: data.result['Total Carbohydrates'],
            protein: data.result['Protein'],
            fat: data.result['Total Fat'],
            fiber: data.result['Dietary Fiber'],
            sugar: data.result['Sugars'],
            sodium: data.result['Sodium'],
            cholesterol: data.result['Cholesterol'],
            saturated_fat: data.result['Saturated Fat']
          });
        } catch (error) {
          console.error("Upload failed:", error);
        }
      }

      const addFoodEntry = async() => {
        console.log('Adding food entry to: ', user.id)
        const { data, error } = await supabase
          .from('food_entries')
          .insert([
            {
              user_id: user.id,
              food_name: foodName,
              serving_size: servingSize,
              calories: nutrition.calories,
              fat: nutrition.fat,
              saturated_fat: nutrition.saturated_fat,
              cholesterol: nutrition.cholesterol,
              sodium: nutrition.sodium,
              carbohydrate: nutrition.carbohydrate,
              fiber: nutrition.fiber,
              sugar: nutrition.sugar,
              protein: nutrition.protein,
            }
          ]);

          if (error) {
            console.error('Error adding food entry: ', error)
          }

          console.log(data)
      }
  
    return (
      <div>
        <h1>CalorieCulator</h1>

        <FileUploader setFile={setFile} />

        {image && <img src={image} className="col-12" alt="Preview" style={{ width: "150px", height: "150px" }}/>}

        <button onClick={handleUpload} className="col-12">
          Upload
        </button>

        <h1>{foodName}</h1>
        <h3>Nutrition Facts Per {servingSize}</h3>
        <p>Calories: {nutrition.calories}kcal</p>
        <p>Protein: {nutrition.protein}g</p>
        <p>Carbohydrate: {nutrition.carbohydrate}g</p>
        <p>Fat: {nutrition.fat}g</p>
        <p>Fiber: {nutrition.fiber}g</p>
        <p>Sugar: {nutrition.sugar}g</p>
        <p>Sodium: {nutrition.sodium}g</p>
        <p>Cholesterol: {nutrition.cholesterol}g</p>
        <p>Saturated fat: {nutrition.saturated_fat}g</p>

        <AuthPrompt setUser={checkUser} />

        {user && foodName ? <button onClick={addFoodEntry}>Consume</button> : <h6>Log in and scan foods to create food entries and track your food consumption!</h6>}

        <Link to='/'>Home</Link>

      </div>
    );
  }