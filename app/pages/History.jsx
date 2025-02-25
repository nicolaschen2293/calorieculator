import React, { useState, useEffect } from "react";
import AuthPrompt from "../components/AuthPrompt";
import { Link } from 'react-router-dom'

export default function History() {

    const [user, setUser] = useState(null)

    const checkUser = (userData) => {
        setUser(userData)
    }

    return (
        <div>
        <h1>Food Consumption History</h1>

        <AuthPrompt setUser={checkUser} />

        <h2>Coming Soon!</h2>

        <Link to='/'>Home</Link>
        </div>
    )
}