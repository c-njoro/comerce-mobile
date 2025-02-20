import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import AppGradient from "./AppGradient";

const ProfilePageComponent = () => {
  const { isLoading, isLoggedIn, user, logout } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1">
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <View className="flex-1 w-screen h-screen flex-col justify-center items-center">
            <Text>Loading....</Text>
          </View>
        </AppGradient>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View className="flex-1">
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <View className="flex-1 w-screen h-screen flex-col justify-center items-center">
            <Text>You are not Logged In</Text>
            <Pressable
              className="p-3 bg-blue-300 rounded-md mt-5"
              onPress={() => router.push("/login")}
            >
              <Text className="font-bold uppercase tracking-widest">
                Log In / Sign Up
              </Text>
            </Pressable>
          </View>
        </AppGradient>
      </View>
    );
  }
  return (
    <ScrollView className="flex-1">
      <AppGradient colors={["lightblue", "aliceblue"]}>
        <View className="flex-1 mt-8 w-screen min-h-screen px-5 flex-col justify-start items-start gap-5">
          <Text className="text-2xl font-bold tracking-widest text-gray-500">
            Hello, {user.username}
          </Text>
          <Image
            source={{
              uri: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
            }}
            resizeMode="cover"
            className="w-5/6 rounded-md shadow-md h-1/3"
          ></Image>
          <Text className="text-2xl font-bold tracking-widest text-gray-900 mt-5">
            {user.name}
          </Text>
          <View className="w-full flex flex-row justify-start items-center mb-8">
            {" "}
            <Ionicons
              name="mail-outline"
              size={20}
              color={`gray`}
              className="mr-5"
            />
            <Text className="text-gray-600 tracking-wider">{user.email}</Text>
          </View>

          <Pressable className="py-3 bg-blue-200 w-full px-12 rounded-full flex flex-row justify-start items-center">
            <Ionicons
              name="bag-outline"
              size={25}
              color={`black`}
              className="mr-5"
            />
            <Text className="font-bold text-xl capitalise tracking-widest">
              My Orders
            </Text>
          </Pressable>

          <Pressable className="py-3 bg-blue-200 w-full px-12 rounded-full flex flex-row justify-start items-center">
            <Ionicons
              name="arrow-back"
              size={25}
              color={`black`}
              className="mr-5"
            />
            <Text className="font-bold text-xl capitalise tracking-widest">
              Back to shop
            </Text>
          </Pressable>

          <Pressable
            className="py-3 bg-red-300 px-12 w-full rounded-full flex flex-row justify-start items-center"
            onPress={logout}
          >
            <Ionicons
              name="exit-outline"
              size={25}
              color={`white`}
              className="mr-5"
            />
            <Text className="font-bold text-xl capitalise tracking-widest text-white">
              Log out
            </Text>
          </Pressable>

          <Pressable
            className="py-3 bg-red-800 px-12 w-full rounded-full flex flex-row justify-start items-center"
            onPress={logout}
          >
            <Ionicons
              name="trash-outline"
              size={25}
              color={`white`}
              className="mr-5"
            />
            <Text className="font-bold text-xl capitalise tracking-widest text-white">
              Delete Account
            </Text>
          </Pressable>
        </View>
      </AppGradient>
    </ScrollView>
  );
};

export default ProfilePageComponent;
