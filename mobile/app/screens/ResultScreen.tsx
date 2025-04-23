import React, { ReactNode, useState } from "react";
import { ScrollView, View, Image, StyleSheet } from "react-native";
import { Card, Text, Title, Divider } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";

export default function ResultScreen() {
  const { result, image } = useLocalSearchParams();
  const data = JSON.parse(result as string);

  return (
    <View>
      {image && <Image source={{ uri: image as string }} style={{
          width: 200,
          height: 200,
          alignSelf: "center",
          borderRadius: 10,
      }}/>}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card style={{ borderRadius: 12 }}>
          <Card.Content>
            <Title style={{ fontSize: 22, marginBottom: 10 }}>
              {data["result"]["Food Name"]?.toUpperCase()}
            </Title>
            <Divider style={{ marginBottom: 0 }} />

            <View style={{ gap: 5 }}>
              {Object.entries(data["result"]).map(([key, value]) => {
                if (key === "Food Name") return null; // Skip title duplicate
                return (
                  <View key={key}>
                    <Text variant="labelLarge">{key}</Text>
                    <Text variant="bodyMedium">{value as ReactNode}</Text>
                    <Divider style={{ marginTop: 8 }} />
                  </View>
                );
              })}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}