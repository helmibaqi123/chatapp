// File: App.tsx
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import ChatScreen from "./screens/ChatScreen";
import { auth, onAuthStateChanged } from "./firebase";
import { User } from "firebase/auth";

// Tipe data navigasi
export type RootStackParamList = {
  Login: undefined;
  Chat: { email: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener ini otomatis mengecek apakah user sudah login (Auto-login)
    const unsubscribe = onAuthStateChanged(auth, (authenticatedUser) => {
      setUser(authenticatedUser);
      setLoading(false);
    });

    // Membersihkan listener saat aplikasi ditutup
    return () => unsubscribe();
  }, []);

  // Tampilkan loading spinner saat mengecek status login
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Jika user ada, langsung masuk ke Chat (Skip Login)
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen} 
            initialParams={{ email: user.email || "User" }}
            options={{ headerShown: true, title: "Ruang Chat" }}
          />
        ) : (
          // Jika user tidak ada, masuk ke Login
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}