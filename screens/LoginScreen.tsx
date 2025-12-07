// File: screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../firebase";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Fungsi Login
  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Isi email dan password!");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigasi otomatis diurus oleh App.tsx
    } catch (error: any) {
      Alert.alert("Login Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Register (Tugas Pengembangan)
  const handleRegister = async () => {
    if (!email || !password) return Alert.alert("Error", "Isi email dan password!");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Sukses", "Akun dibuat! Anda otomatis login.");
    } catch (error: any) {
      Alert.alert("Register Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Welcome Back!</Text>
      <Text style={styles.subTitle}>Silakan masuk untuk mulai chat</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleRegister} style={{ marginTop: 20 }}>
            <Text style={styles.linkText}>Belum punya akun? Daftar disini</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 30, backgroundColor: "#f5f5f5" },
  headerTitle: { fontSize: 32, fontWeight: "bold", color: "#333", marginBottom: 5 },
  subTitle: { fontSize: 16, color: "#666", marginBottom: 40 },
  inputContainer: { marginBottom: 20 },
  input: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, alignItems: "center", elevation: 3 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkText: { color: "#007bff", textAlign: "center", fontWeight: "600" }
});