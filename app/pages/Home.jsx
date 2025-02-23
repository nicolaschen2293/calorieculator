import React, { useState, useEffect } from "react";
import SignUp from "../components/AuthModal";
import { Link } from 'react-router-dom'

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

    return (
        <div>
        <h1>CalorieCulator</h1>

        <h2>You have consumed {caloriesConsumed} kcal today!</h2>

        <button onClick={() => signUpPrep()}>Sign Up</button>

        <button onClick={() => loginPrep()}>Log In</button>

        <SignUp show={openSignUp} handleClose={() => setOpenSignUp(false)} action={action} />

        <Link to='/uploader'>Eat Something</Link>

        <Link to='/history'>Consumption History</Link>

        </div>
    )
}