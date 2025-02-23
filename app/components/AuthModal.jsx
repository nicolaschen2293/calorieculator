import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { supabase } from "../utils/supabase";

function AuthModal({ show, handleClose, action }) {

    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

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
            <Modal.Title>{action}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={() => action == 'Log In' ? logInUser() : signUpUser()}>
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

                <button type="submit"> Confirm </button>
            </form> 
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