import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import AppGradient from "./AppGradient";

const ProfilePageComponent = () => {
  const { isLoading, isLoggedIn, user, logout } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 flex-col justify-center items-center">
        <Text>Loading....</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View className="flex-1 flex-col justify-center items-center">
        <Text>You are not Logged In</Text>
        <Pressable
          className="p-3 bg-blue-300 rounded-md"
          onPress={() => router.push("/login")}
        >
          <Text>Log In </Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View className="flex-1">
      <AppGradient colors={["lightblue", "aliceblue"]}>
        <View className="flex-1 mt-8">
          <Text>{user.name}</Text>
          <Pressable className="p-3 bg-blue-300" onPress={logout}>
            <Text>Log Out</Text>
          </Pressable>
        </View>
      </AppGradient>
    </View>
  );
};

export default ProfilePageComponent;
