import React, { ReactNode, useState } from "react";
import { ScrollView, View, Image, StyleSheet } from "react-native";
import { Card, Text, Title, Divider } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";

export default function ResultScreen() {
  const { result, image } = useLocalSearchParams();
  const data = JSON.parse(result as string);

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
        <Card style={{ borderRadius: 12, gap: 10, backgroundColor: '#e4b48c' }}>
        <Card.Content>
          <Title style={{ fontSize: 22, marginBottom: 10, textAlign: 'center' }}>
            {data["result"]["Food Name"]?.toUpperCase()}
          </Title>
          <Divider style={{ marginBottom: 10 }} />

          {orderedKeys.map((key) => {
            const value = data["result"][key];
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
    </View>
  );
}