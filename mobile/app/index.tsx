import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { Text, Snackbar, Button, Avatar, TouchableRipple, TextInput, Portal, Dialog, } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router"
import Constants from 'expo-constants';
import { supabase } from "@/utils/supabase";
import { useAuth } from "../context/AppProvider";

// Home Screen and Entry Point
export default function Index() {
    const [file, setFile] = useState<any>(null);
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);

    // Supabase and auth modal attributes
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [login, setLogin] = useState(true);

    // Stored sessions
    const { user, loading } = useAuth();

    const handleSignUp = async () => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
      
        if (error) {
            console.error("Sign up error:", error.message);
        } else {
            console.log("User signed up:", data);
            setVisible(false);
        }

        setEmail('');
        setPassword('');
    };

    const handleLogin = async () => {
        console.log('logging in... ')
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (error) {
            console.error('Login error:', error.message);
        } else {
            console.log('User logged in:', data);
            setVisible(false);
        }
        
        setEmail('');
        setPassword('');
    }

    const handleLogOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Log out error:", error.message);
        } else {
            console.log("User logged out successfully.");
        }
    }

    const router = useRouter()

    // Select image from camera
    const pickImage = async () => {
        // Ask for permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
    
        // Launch image picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            quality: 1,
            base64: true, // Optional: useful for uploading directly as base64
        });
    
        // Assign selected image to variables
        if (!result.canceled) {
            const asset = result.assets[0];

            const fileType = asset.uri.split('.').pop();

            const fileToUpload = {
                uri: asset.uri,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            };

            setFile(fileToUpload);
            setImage(asset.uri); // to preview or display the image
        }
    };

    // Send to server for processing
    const handleUpload = async () => {
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        const API_URL = Constants.expoConfig?.extra?.API_URL;
        console.log("uploading to ", API_URL);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = await response.json();
            if (data['error']) {
                setUploadError(true);
            } else {
                router.push({
                  pathname: "/screens/ResultScreen",
                  params: {
                    result: JSON.stringify(data), // Serialize if it's an object
                    image: encodeURIComponent(image),
                  },
                });
            }
        } catch (err) {
            console.log(err);
            setErrorVisible(true);
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>CalorieCulator</Text>
            <Text variant="titleMedium" style={styles.title}>You have consumed 0 kcal today!</Text>

            <View style={styles.buttonGroup}>
            <TouchableRipple onPress={pickImage} borderless rippleColor="rgba(0, 0, 0, .32)">
                <Avatar.Icon size={60} icon="image" />
            </TouchableRipple>
                <Avatar.Icon size={60} icon="camera" />
                <Avatar.Icon size={60} icon="qrcode-scan" />
            </View>

            {image && <Image source={{ uri: image }} style={styles.image} />}
            
            <Button mode="contained" onPress={handleUpload} loading={uploading} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </Button>

            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                {loading ? (
                    <Text>Loading...</Text>
                ) : user ? (
                    <>
                        <Text>Welcome, {user.email}!</Text>
                        <TouchableOpacity onPress={handleLogOut}>
                            <Text style={{ color: 'blue', margin: 10, alignSelf: 'center' }}>Log Out</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity onPress={() => { setVisible(true); setLogin(true); }}>
                            <Text style={{ color: 'blue', margin: 10, alignSelf: 'center' }}>Log In</Text>
                        </TouchableOpacity>

                        <Text style={{ alignSelf: 'center' }}>or</Text>

                        <TouchableOpacity onPress={() => { setVisible(true); setLogin(false); }}>
                            <Text style={{ color: 'blue', margin: 10, alignSelf: 'center' }}>Sign Up</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* <Button onPress={() => navigation.navigate('History')}>View History</Button> */}

            <Snackbar visible={errorVisible || uploadError} onDismiss={() => setErrorVisible(false)}>
                Image recognition failed.
            </Snackbar>

            <Portal>
                <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                    <Dialog.Title>{ login ? 'Log In' : 'Sign Up' }</Dialog.Title>
                    <Dialog.Content>
                        <TextInput label="Email" value={email} onChangeText={setEmail} />
                        <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={login ? handleLogin : handleSignUp}>{ login ? 'Log In' : 'Sign Up' }</Button>
                        <Button onPress={() => setVisible(false)}>Cancel</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
    }

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: "center",
        gap: 20,
        flex: 1,
    },
    title: {
        textAlign: "center",
        marginBottom: 10,
    },
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    image: {
        width: 200,
        height: 200,
        alignSelf: "center",
        borderRadius: 10,
    },
});