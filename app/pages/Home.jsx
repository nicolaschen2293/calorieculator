import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import { supabase } from "../utils/supabase";
import AuthPrompt from "../components/AuthPrompt";
import { useDispatch } from "react-redux";
import { logOutUser } from "../utils/stores/userSlice";

export default function Home() {

    const [caloriesConsumed, setCaloriesConsumed] = useState(0)
    const [user, setUser] = useState(null)
    const dispatch = useDispatch()
    
    const checkUser = (userData) => {
        setUser(userData)
    }

    async function logOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Sign-out error:", error.message);
        } else {
            console.log("User signed out successfully.");
            dispatch(logOutUser())
        }
    }

    return (
        <div>
        <h1>CalorieCulator</h1>

        <h2>You have consumed {caloriesConsumed} kcal today!</h2>

        <AuthPrompt setUser={checkUser} />

        {user ?  <button onClick={async () => await logOut()}>Log Out</button> : <h1>Create an account and log in lil bro.</h1>}

        <Link to='/uploader'>Eat Something</Link>

        <Link to='/history'>Consumption History</Link>

        </div>
    )
}