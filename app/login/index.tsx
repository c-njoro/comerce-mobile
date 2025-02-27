// app/login.tsx
import AppGradient from "@/components/AppGradient";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(false);

  //login data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //sign up data
  const [signName, setSignName] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [signUsername, setSignUsername] = useState("");
  const [signPassword, setSignPassword] = useState("");

  //function to sign up
  const handleSignUp = async () => {
    try {
      if (
        !signEmail.trim() ||
        !signPassword.trim() ||
        !signUsername.trim() ||
        !signName.trim()
      ) {
        Alert.alert("Sign Up Failed", "Fill the form correctly!");
        return;
      }

      const res = await axios.post(
        `http://192.168.100.6:5000/api/users/mobileUser`,
        {
          name: signName,
          email: signEmail,
          username: signUsername,
          password: signPassword,
          dateOfBirth: "29/09/2001",
          profilePicture: "",
        }
      );

      Alert.alert(
        `${signUsername}'s accout created succesfully`,
        "Now use your email and password to log in."
      );

      toggleIsLogin();

      setSignEmail("");
      setSignName("");
      setSignUsername("");
      setSignPassword("");
    } catch (error: any) {
      Alert.alert(
        "SignUp Failed",
        `Something went wrong while creating your account.${
          error.response.status === 422
            ? "Username already taken"
            : error.response.status === 409
            ? "Email already has an account"
            : "Server ran to an error, try again later"
        }`
      );
      console.log("Error while creating user: ", error);
    }
  };

  //function to login
  const handleLogin = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        Alert.alert("Login Failed", "Fill the form correctly!");
        return;
      }
      await login(email, password);
      router.back();
      setEmail("");
      setPassword("");
    } catch (error: any) {
      Alert.alert("Login Failed", "Wrong Credentials");
    }
  };

  const toggleIsLogin = () => {
    setIsLogin(!isLogin);
  };

  return (
    <ScrollView className="flex-1 max-h-screen">
      <AppGradient colors={["lightblue", "aliceblue"]}>
        <View className="main-component w-screen min-h-screen flex flex-col justify-center items-center p-3 gap-2">
          <View className="login w-full h-max flex justify-start items-start p-4 bg-gray-300 rounded-lg overflow-hidden">
            <Pressable className="m-3 flex flex-row justify-between items-center w-full px-2">
              <Text className="font-bold text-2xl uppercase ">Login</Text>
              {isLogin ? (
                ""
              ) : (
                <Ionicons
                  name="chevron-down-outline"
                  size={25}
                  color={`black`}
                  onPress={toggleIsLogin}
                />
              )}
            </Pressable>
            <View className={`${isLogin ? "" : "hidden"} w-full py-5`}>
              <TextInput
                className="bg-gray-100 pl-8 rounded-full shadow-md h-14  mb-4 w-full"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                className="bg-gray-100 pl-8 rounded-full shadow-md h-14  mb-4 w-full"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity
                onPress={handleLogin}
                className="bg-gray-400 p-3 rounded-lg w-full"
              >
                <Text className="text-white text-center font-bold uppercase text-xl tracking-widest">
                  Log in
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="sign w-full h-max flex justify-start items-start p-4 bg-gray-300 rounded-lg overflow-hidden">
            <Pressable className="m-3 flex flex-row justify-between items-center w-full px-2">
              <Text className="font-bold text-2xl uppercase ">Sign Up</Text>
              {!isLogin ? (
                ""
              ) : (
                <Ionicons
                  name="chevron-up-outline"
                  size={25}
                  color={`black`}
                  onPress={toggleIsLogin}
                />
              )}
            </Pressable>
            <View className={`${!isLogin ? "" : "hidden"} w-full py-5`}>
              <TextInput
                className="bg-gray-100 pl-8 rounded-full shadow-md h-14  mb-4 w-full"
                placeholder="Full Name"
                value={signName}
                onChangeText={setSignName}
                autoCapitalize="none"
                keyboardType="default"
              />
              <TextInput
                className="bg-gray-100 pl-8 rounded-full shadow-md h-14  mb-4 w-full"
                placeholder="Username"
                value={signUsername}
                onChangeText={setSignUsername}
                autoCapitalize="none"
                keyboardType="default"
              />
              <TextInput
                className="bg-gray-100 pl-8 rounded-full shadow-md h-14  mb-4 w-full"
                placeholder="Email"
                value={signEmail}
                onChangeText={setSignEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                className="bg-gray-100 pl-8 rounded-full shadow-md h-14  mb-4 w-full"
                placeholder="Password"
                value={signPassword}
                onChangeText={setSignPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <TouchableOpacity
                className="bg-gray-400 p-3 rounded-lg w-full"
                onPress={handleSignUp}
              >
                <Text className="text-white text-center font-bold uppercase text-xl tracking-widest">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </AppGradient>
    </ScrollView>
  );
}
