import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
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


  // Send to backend for processing
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
      setFoodName(data.result.food_name)
      setServingSize(data.result.serving_size)
      setNutrition({
        calories: data.result.nutrition.calories,
        carbohydrate: data.result.nutrition.carbohydrate,
        protein: data.result.nutrition.protein,
        fat: data.result.nutrition.fat,
        fiber: data.result.nutrition.fiber,
        sugar: data.result.nutrition.sugar,
        sodium: data.result.nutrition.sodium,
        cholesterol: data.result.nutrition.cholesterol,
        saturated_fat: data.result.nutrition.saturated_fat
      });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center'>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <input type="file" onChange={handleFileChange} className="col-10" />
        <br />
        {image && <img src={image} className="col-12" alt="Preview" style={{ width: "150px", height: "150px" }}/>}
        <br />
        <button onClick={handleUpload} className="col-12">
          Upload
        </button>
        <h1>{foodName}</h1>
        <h3>Nutrition Facts Per {servingSize}</h3>
        <p>Calories: {nutrition.calories}kcal</p>
        <p>Protein: {nutrition.carbohydrate}g</p>
        <p>Carbs: {nutrition.protein}g</p>
        <p>Fat: {nutrition.fat}g</p>
        <p>Fiber: {nutrition.fiber}g</p>
        <p>Sugar: {nutrition.sugar}g</p>
        <p>Sodium: {nutrition.sodium}g</p>
        <p>Cholesterol: {nutrition.cholesterol}g</p>
        <p>Saturated fat: {nutrition.saturated_fat}g</p>
      </div>
    </div>
  );
};

export default FileUpload;