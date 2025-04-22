import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, Platform } from "react-native";
import { Text, Snackbar, Button, Avatar, TouchableRipple, ActivityIndicator } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';

export default function HomeScreen() {
    const [file, setFile] = useState<any>(null);
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const navigation = useNavigation();

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
            // setFile(result.assets[0].file);
            // setImage(result.assets[0].uri); // Save image URI
        }
    };

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
                console.log("upload success, data retreived: ");
                console.log(data);
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
            <Text variant="titleMedium">You have consumed 0 kcal today!</Text>

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

            {/* <Button onPress={() => navigation.navigate('History')}>View History</Button> */}

            <Snackbar visible={errorVisible} onDismiss={() => setErrorVisible(false)}>
                Image recognition failed.
            </Snackbar>
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