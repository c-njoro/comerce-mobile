// app/login.tsx
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.replace("/"); // Navigate to home screen after login
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <TextInput
        className="border p-2 rounded-lg mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="border p-2 rounded-lg mb-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-500 p-3 rounded-lg"
      >
        <Text className="text-white text-center font-bold">Login</Text>
      </TouchableOpacity>
    </View>
  );
}
