import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { supabase } from "../utils/supabase";

function AuthModal({ show, handleClose }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit() {
        console.log("Authentication form submitted.")
        console.log('Signing Up with = ')
        console.log('email = ', email)
        console.log('password = ', password)
        // if (action == "Log In") {
        //     await logInUser()
        // } else {
        //     await signUpUser()
        // }
        await signUpUser()
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
        }

        const { data: loggeduser } = await supabase.auth.getUser();
        if (loggeduser) {
        console.log("User is logged in:", loggeduser);
        handleClose()
        } else {
        console.log("No active session.");
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
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
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