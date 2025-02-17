import useProducts from "@/hooks/GetProductsHook";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import AppGradient from "./AppGradient";
import HorizontalList from "./HorizontalList";

const ProductsComponent = () => {
  const categories = [
    {
      image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg",
      text: "Electronics",
    },
    {
      image: "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg",
      text: "Sports",
    },
    {
      image: "https://images.pexels.com/photos/354103/pexels-photo-354103.jpeg",
      text: "Accessories",
    },
    {
      image: "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg",
      text: "Laptops",
    },
    {
      image:
        "https://images.pexels.com/photos/4523006/pexels-photo-4523006.jpeg",
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
    <ScrollView className="flex-1 ">
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
                    scrollEnabled={false}
                    data={products}
                    keyExtractor={(item) => item._id}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    className=""
                    contentContainerStyle={{
                      paddingHorizontal: 8,
                      paddingBottom: 16,
                    }}
                    renderItem={({ item }) => (
                      <Pressable className="h-full w-full flex-1 my-4 mx-2">
                        <View className="w-32 h-max ">
                          <Image
                            source={{ uri: `${item.images[0].url}` }}
                            resizeMode="cover"
                            className="w-28 h-28 rounded-lg shadow-lg"
                          ></Image>
                          <Text className="text-gray-700 font-bold mt-1">
                            {item.name}
                          </Text>
                          <Text className="font-bold text-gray-900 text-xl pt-2">
                            Ksh. {item.price}
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
        <View className="h-2/3">
          <Text>Test if it is scrolling</Text>
        </View>
        <StatusBar style="dark" />
      </AppGradient>
    </ScrollView>
  );
};

export default ProductsComponent;
