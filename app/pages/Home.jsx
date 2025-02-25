import React, { useState, useEffect } from "react";
// import SignUp from "../components/AuthModal";
import AuthModal from "../components/AuthModal";
import { Link } from 'react-router-dom'
import { supabase } from "../utils/supabase";
import { useDispatch, useSelector } from "react-redux";
import { checkUserSession, logOutUser } from "../utils/stores/userSlice";

export default function Home() {

    const [caloriesConsumed, setCaloriesConsumed] = useState(0)
    const [openAuth, setOpenAuth] = useState(false)
    const [action, setAction] = useState('Log In')
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user)

    useEffect(() => {
        dispatch(checkUserSession())
        console.log('user logged in: ', user)
    }, [dispatch])

    function signUpPrep() {
        setAction('Sign Up')
        console.log(action)
        setOpenAuth(true)
    }

    function loginPrep() {
        setAction('Log In')
        console.log(action)
        setOpenAuth(true)
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

        {user ? <h1>Welcome, {user.email}!</h1> : <div><button onClick={() => loginPrep()}>Log In</button> or <button onClick={() => signUpPrep()}>Sign Up</button> to view history</div>}

        <button onClick={async () => await logOut()}>Log Out</button>

        <AuthModal show={openAuth} handleClose={() => setOpenAuth(false)} action={action} />

        <Link to='/uploader'>Eat Something</Link>

        <Link to='/history'>Consumption History</Link>

        </div>
    )
}