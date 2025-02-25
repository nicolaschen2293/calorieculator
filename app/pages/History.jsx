import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthModal from "../components/AuthModal";
import { checkUserSession } from "../utils/stores/userSlice";
import { Link } from 'react-router-dom'

export default function History() {

    const [openAuth, setOpenAuth] = useState(false)
    const [action, setAction] = useState('Log In')
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user)

    useEffect(() => {
        dispatch(checkUserSession())
        if (user) {
            console.log('User logged in: ', user)
        } else {
            console.log('No user logon')
        }
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

    return (
        <div>
        <h1>Food Consumption History</h1>

        {user ? <h1>Welcome, {user.email}!</h1> : <div><button onClick={() => loginPrep()}>Log In</button> or <button onClick={() => signUpPrep()}>Sign Up</button> to view history</div>}

        <AuthModal show={openAuth} handleClose={() => setOpenAuth(false)} action={action} />

        <h2>Coming Soon!</h2>

        <Link to='/'>Home</Link>
        </div>
    )
}