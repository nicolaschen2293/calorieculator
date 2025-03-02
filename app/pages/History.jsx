import React, { useState, useEffect } from "react";
import AuthPrompt from "../components/AuthPrompt";
import { Link } from 'react-router-dom'
import { supabase } from "../utils/supabase";
import { useSelector } from "react-redux";

export default function History() {

    const user = useSelector((state) => state.user.user)
    const [foodEntries, setFoodEntries] = useState([])

    useEffect(() => {
        const fetchFoodEntries = async () => {
            if (!user) {
                console.log('user not found, returning')
                return; // Ensure userId is available
            }
        
            let { data, error } = await supabase
                .from("food_entries") // Your table name
                .select("*") // Select all columns
                .eq("user_id", user.id); // Filter where user_id matches
        
            if (error) {
                console.error("Error fetching food history:", error);
            } else {
                console.log('Food Entries Received:')
                console.log(data)
                setFoodEntries(data); // Store fetched data
            }
        };
    
        fetchFoodEntries();
      }, [user]);

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 gap-3">
        <h1>Food Consumption History</h1>

        <AuthPrompt />

        {foodEntries ? 
                <div>
                    <h5>Food Entries:</h5>
                    <ul>
                    {foodEntries.map((food) => (
                    <li key={food.id}>
                        {food.food_name} - {food.calories} Kcal
                    </li>
                    ))}
                    </ul>
                </div> 
            : 
                <div>Eat something, lil bro.</div>}

        <Link to='/'>Home</Link>
        </div>
    )
}