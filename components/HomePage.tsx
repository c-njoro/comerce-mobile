import useProducts from "@/hooks/GetProductsHook";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import AppGradient from "./AppGradient";
import HorizontalList from "./HorizontalList";

const HomePage = () => {
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

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (products) {
      setFilteredProducts(products);
    }
  }, [products]);

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
        <View>
          <View>
            <Text className="text-xl text-gray-700 uppercase font-bold tracking-wider">
              {products
                ? "Products"
                : productsLoading
                ? "products loading"
                : productsError
                ? "Error fetching"
                : "Fetch did not happen"}
            </Text>
          </View>
          <View className="mt-3">
            {products ? (
              filteredProducts.length > 0 ? (
                <View>
                  <FlatList
                    data={products}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    className=""
                    renderItem={({ item }) => (
                      <Pressable className="flex-1 my-4">
                        <View className="w-32 h-32 ">
                          <Image
                            source={{ uri: `${item.images[0].url}` }}
                            resizeMode="cover"
                            className="w-28 h-28 rounded-lg shadow-lg"
                          ></Image>
                          <Text className="text-gray-700 font-bold mt-1">
                            {item.name}
                          </Text>
                        </View>
                      </Pressable>
                    )}
                  ></FlatList>
                </View>
              ) : (
                <View>
                  <Text>Please wait a second...</Text>
                </View>
              )
            ) : productsLoading ? (
              <Text className="text-green-500">Loading products...</Text>
            ) : productsError ? (
              <Text className="text-red-500">Error fetching products</Text>
            ) : (
              <Text className="text-red-500">
                System did not fetch products.
              </Text>
            )}
          </View>
        </View>

        <StatusBar style="dark" />
      </AppGradient>
    </View>
  );
};

export default HomePage;
