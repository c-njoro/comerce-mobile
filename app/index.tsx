import AppGradient from "@/components/AppGradient";
import HorizontalList from "@/components/HorizontalList";
import useProducts from "@/hooks/GetProductsHook";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View } from "react-native";

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

  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();

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
        <Text>
          {products
            ? "products available"
            : productsLoading
            ? "products loading"
            : productsError
            ? "Error fetching"
            : "Fetch did not happen"}
        </Text>

        <StatusBar style="dark" />
      </AppGradient>
    </View>
  );
};

export default Home;
