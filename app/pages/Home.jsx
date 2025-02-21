import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'

export default function Home() {

    const caloriesConsumed = useState(0)

    return (
        <div>
        <h1>CalorieCulator</h1>

        <h2>You have eaten {caloriesConsumed} kcal today!</h2>

        <Link to='/uploader'>Eat Something</Link>

        <Link to='/history'>Consumption History</Link>

        </div>
    )
}