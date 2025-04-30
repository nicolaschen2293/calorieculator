import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { AppProvider } from "../context/AppProvider";

export default function RootLayout() {
  return (
    <PaperProvider>
      <AppProvider>
        <Stack />
      </AppProvider>
    </PaperProvider>
  );
}
