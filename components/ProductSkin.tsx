import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import AppGradient from "./AppGradient";

const ProductSkin = () => {
  return (
    <View className="flex-1">
      <AppGradient colors={["lightblue", "aliceblue"]}>
        <View className="w-screen h-max flex flex-row justify-between items-center mt-8 px-5">
          <Ionicons
            name="arrow-back"
            size={30}
            color="black"
            onPress={() => router.back()}
          />
          <Ionicons name="refresh" size={30} color="black" />
        </View>
        <View className="w-screen h-screen flex flex-col justify-start items-start mt-5 p-5 opacity-60">
          <View className="w-full h-1/2 bg-gray-300 rounded-lg shadow-md "></View>
          <View className="mt-5 w-5/6 h-16 bg-gray-400 rounded-full shadow-md"></View>
          <View className="mt-5 w-4/6 h-14 bg-gray-300 rounded-full shadow-md"></View>
          <View className="mt-5 w-full h-6 bg-gray-200 rounded-full shadow-md"></View>
          <View className="mt-5 w-full h-6 bg-gray-200 rounded-full shadow-md"></View>
          <View className="mt-5 w-full h-6 bg-gray-200 rounded-full shadow-md"></View>
          <View className="mt-5 w-full h-6 bg-gray-200 rounded-full shadow-md"></View>
        </View>
      </AppGradient>
    </View>
  );
};

export default ProductSkin;
