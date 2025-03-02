import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthPrompt from "../components/AuthPrompt";
import { useNavigate } from "react-router-dom";

export default function Uploader() {
    const user = useSelector((state) => state.user.user)
    const food = useSelector((state) => state.food.food)
    const image = useSelector((state) => state.food.foodImg)
    const navigate = useNavigate()

    const addFoodEntry = async() => {
      console.log('Adding food entry to: ', user.id)
      const { data, error } = await supabase
        .from('food_entries')
        .insert([
          {
            user_id: user.id,
            food_name: food['Food Name'],
            serving_size: food['Serving Size'],
            calories: food['Calories'],
            fat: food['Total Fat'],
            saturated_fat: food['Saturated Fat'],
            cholesterol: food['Cholesterol'],
            sodium: food['Sodium'],
            carbohydrate: food['Total Carbohydrates'],
            fiber: food['Dietary Fiber'],
            sugar: food['Sugars'],
            protein: food['Protein'],
          }
        ]);

        if (error) {
          console.error('Error adding food entry: ', error)
        }

        console.log(data)
        alert('Food entry added successfully!')
        navigate('/')
    }
  
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 gap-10">
        <h2>Nutrition Facts</h2>

        {image && <img src={image} className="col-12" alt="Preview" style={{ width: "150px", height: "150px" }}/>}

        <h3>{food['Food Name']}</h3>
        <h4>Nutrition Facts Per {food['Serving Size']}</h4>
        <p>Calories: {food['Calories']}kcal</p>
        <p>Protein: {food['Protein']}g</p>
        <p>Carbohydrate: {food['Total Carbohydrates']}g</p>
        <p>Fat: {food['Total Fat']}g</p>
        <p>Fiber: {food['Dietary Fiber']}g</p>
        <p>Sugar: {food['Sugars']}g</p>
        <p>Sodium: {food['Sodium']}g</p>
        <p>Cholesterol: {food['Cholesterol']}g</p>
        <p>Saturated fat: {food['Saturated Fat']}g</p>

        <AuthPrompt />

        {user && food ? <button onClick={addFoodEntry}>Consume</button> : <h6>Log in and scan foods to create food entries and track your food consumption!</h6>}

        <Link to='/'>Home</Link>

      </div>
    );
  }