import React, { ReactNode, useState } from "react";
import { ScrollView, View, Image, StyleSheet } from "react-native";
import { Card, Text, Title, Divider, Avatar, TouchableRipple, Snackbar } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/AppProvider";
import { useRouter } from "expo-router";

export default function ResultScreen() {
  const { result, image } = useLocalSearchParams();
  const { user, loading } = useAuth();
  const foodData = JSON.parse(result as string);
  const router = useRouter();

  const [uploadFeedback, setUploadFeedback] = useState('');

  const unitsMap: Record<string, string> = {
    "Calories": "kcal",
    "Total Fat": "g",
    "Saturated Fat": "g",
    "Cholesterol": "mg",
    "Sodium": "mg",
    "Total Carbohydrates": "g",
    "Dietary Fiber": "g",
    "Sugars": "g",
    "Protein": "g",
    "Serving Size": "", // No unit, just text
  };

  const highlightColors: Record<string, string> = {
    "Calories": "#4CAF50",          // Green
    "Protein": "#F44336",           // Red
    "Total Fat": "#FFEB3B",       // Yellow
    "Cholesterol": "#FF9800",       // Orange
    "Sugars": "#03A9F4",            // Blue
  };

  const orderedKeys = [
    "Calories",
    "Serving Size",
    "Total Fat",
    "Saturated Fat",
    "Cholesterol",
    "Sodium",
    "Total Carbohydrates",
    "Dietary Fiber",
    "Sugars",
    "Protein"
  ];

  const addFoodEntry = async() => {
    console.log('Adding food entry to: ', user?.email);
    const { data, error } = await supabase
      .from('food_entries')
      .insert([
        {
          user_id: user?.id,
          food_name: foodData["result"]['Food Name'],
          serving_size: foodData["result"]['Serving Size'],
          calories: foodData["result"]['Calories'],
          fat: foodData["result"]['Total Fat'],
          saturated_fat: foodData["result"]['Saturated Fat'],
          cholesterol: foodData["result"]['Cholesterol'],
          sodium: foodData["result"]['Sodium'],
          carbohydrate: foodData["result"]['Total Carbohydrates'],
          fiber: foodData["result"]['Dietary Fiber'],
          sugar: foodData["result"]['Sugars'],
          protein: foodData["result"]['Protein'],
        }
      ]);

      if (error) {
        setUploadFeedback('Food entry failed!');
        console.error('Error adding food entry: ', error)
      } else {
        setUploadFeedback('Food entry success!');
        console.log(data)
      }
  }

  const handleClose = () => {
    setUploadFeedback('');
    router.push('/');
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#6c443c' }}>
      {image && <Image source={{ uri: image as string }} style={{
        marginTop: 18,
        width: 200,
        height: 200,
        alignSelf: "center",
        borderRadius: 10,
      }}/>}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card style={{ borderRadius: 12, gap: 10, backgroundColor: '#cfb2b0' }}>
        <Card.Content>
          <Title style={{ fontSize: 22, marginBottom: 10, textAlign: 'center' }}>
            {foodData["result"]["Food Name"]?.toUpperCase()}
          </Title>
          <Divider style={{ marginBottom: 10 }} />

          {orderedKeys.map((key) => {
            const value = foodData["result"][key];
            if (value == null) return null;
            return (
              <View key={key} style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 6 }}>
                <Text style={{ fontWeight: "bold", width: 150, color: highlightColors[key] || "#000", fontSize: 16 }}>
                  {key}
                </Text>
                <Text style={{ textAlign: "right", color: highlightColors[key] || "#000", fontSize: 16 }}>
                  {`${value} ${unitsMap[key] || ""}`}
                </Text>
              </View>
            );
          })}
        </Card.Content>
        </Card>
      </ScrollView>

      {loading ? (
          <Text>Loading...</Text>
      ) : user ? (
          <>
            <TouchableRipple onPress={addFoodEntry} borderless rippleColor="rgba(0, 0, 0, .32)">
              <Avatar.Icon size={60} icon="upload" style={{ alignSelf: 'center', marginBottom: 5 }} />
            </TouchableRipple>
          </>
      ) : (
          <>
            <Text>Please log in or sign up to upload food entries.</Text>
          </>
      )}
      
      <Text variant="titleMedium" style={{ alignSelf: 'center', marginBottom: 20, color: 'white', fontWeight: "bold", fontSize: 20 }}>Eat</Text>

      <Snackbar visible={uploadFeedback != ''} onDismiss={handleClose} action={{
          label: "X",
          onPress: handleClose,
        }}>
          {uploadFeedback}
      </Snackbar>
    </View>
  );
}