import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { checkUserSession } from "../utils/stores/userSlice";

export default function AuthPrompt() {

    const [openAuth, setOpenAuth] = useState(false)
    const [action, setAction] = useState('Log In')
    const user = useSelector((state) => state.user.user) 
    const dispatch = useDispatch()

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
            {user ? <h5>Welcome, {user.email}!</h5> : <div><button onClick={() => loginPrep()}>Log In</button> or <button onClick={() => signUpPrep()}>Sign Up</button> to use this feature!</div>}

            <AuthModal show={openAuth} handleClose={() => setOpenAuth(false)} action={action} />
        </div>
    )
}