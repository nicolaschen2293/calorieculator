import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { supabase } from "../utils/supabase";
import { useDispatch } from "react-redux";
import { setUser } from "../utils/stores/userSlice";

function AuthModal({ show, handleClose, action }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    async function handleSubmit() {
        if (action == "Log In") {
            console.log('User Log In')
            await logInUser()
        } else {
            console.log('New User Sign Up')
            await signUpUser()
        }
    }

    async function signUpUser() {
        const { user, error } = await supabase.auth.signUp({
            email,
            password,
        });
        
        if (error) {
            console.error('Sign-up error:', error.message);
        } else {
            console.log('User signed up:', user);
            dispatch(setUser(user))
            handleClose()
        }
    }

    async function logInUser() {
        const { user, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (error) {
            console.error('Login error:', error.message);
        } else {
            console.log('User logged in:', user);
            dispatch(setUser(user))
            handleClose()
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>{action}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
                <h6>Test User: </h6>
                <h6>email: testemail@testmail.com</h6>
                <h6>password: test123</h6>
                <label>Email:</label>
                <input 
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                />
            </div> 

            <div>
                <label>Password:</label>
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Strong Password"
                    required
                />
            </div>

            <button onClick={handleSubmit}> Confirm </button>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            Close
            </Button>
        </Modal.Footer>
        </Modal>
    );
}

export default AuthModal;