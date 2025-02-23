import React, { useState, useEffect } from "react";
import SignUp from "../components/AuthModal";
import { Link } from 'react-router-dom'
import { supabase } from "../utils/supabase";

export default function Home() {

    const [caloriesConsumed, setCaloriesConsumed] = useState(0)
    const [openSignUp, setOpenSignUp] = useState(false)
    const [action, setAction] = useState('Log In')

    function signUpPrep() {
        setAction('Sign Up')
        setOpenSignUp(true)
    }

    function loginPrep() {
        setAction('Log In')
        setOpenSignUp(true)
    }

    async function logOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Sign-out error:", error.message);
        } else {
            console.log("User signed out successfully.");
        }
    }

    return (
        <div>
        <h1>CalorieCulator</h1>

        <h2>You have consumed {caloriesConsumed} kcal today!</h2>

        <button onClick={() => signUpPrep()}>Sign Up</button>

        <button onClick={() => loginPrep()}>Log In</button>

        <button onClick={async () => await logOut()}>Log Out</button>

        <SignUp show={openSignUp} handleClose={() => setOpenSignUp(false)} />

        <Link to='/uploader'>Eat Something</Link>

        <Link to='/history'>Consumption History</Link>

        </div>
    )
}