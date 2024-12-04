import AppGradient from "@/components/AppGradient";
import HorizontalList from "@/components/HorizontalList";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";

const Home = () => {
  const categories = [
    {
      image: require("@/assets/images/profilegithub.jpg"),
      text: "Electronics",
    },
    {
      image: require("@/assets/images/profilegithub.jpg"),
      text: "Sports",
    },
    {
      image: require("@/assets/images/profilegithub.jpg"),
      text: "Accessories",
    },
    {
      image: require("@/assets/images/profilegithub.jpg"),
      text: "Laptops",
    },
    {
      image: require("@/assets/images/profilegithub.jpg"),
      text: "Consoles",
    },
  ];
  return (
    <View className="flex-1">
      <AppGradient colors={["lightblue", "aliceblue"]}>
        <View>
          <View>
            <HorizontalList
              title="Categories"
              content={categories}
            ></HorizontalList>
          </View>
        </View>

        <StatusBar style="dark" />
      </AppGradient>
    </View>
  );
};

export default Home;
