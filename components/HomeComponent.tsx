import useProducts from "@/hooks/GetProductsHook";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppGradient from "./AppGradient";
import CardHorizontalList from "./CardHorizontalList";
import HorizontalList from "./HorizontalList";
import { Product } from "./Product";

const HomeComponent = () => {
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();
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
  const [focused, setFocused] = useState(false);
  const [lastFive, setLastFive] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    if (products) {
      const lastFiveProducts = products.slice(-5).reverse();
      const newArrivalProducts = products.slice(0, 7);
      setLastFive(lastFiveProducts);
      setNewArrivals(newArrivalProducts);
    }
  }, [products]);
  return (
    <ScrollView className="flex-1">
      <AppGradient colors={["lightblue", "aliceblue"]}>
        <View className="top-tab flex flex-row justify-between items-center px-5 mt-5">
          <View>
            <Text className="font-semibold tracking-wider text-gray-500">
              Welcome back,
            </Text>
            <Text className="font-bold text-2xl tracking-widest text-gray-600">
              Charles.
            </Text>
          </View>
          <View className="relative flex flex-row justify-end items-center">
            <TextInput
              className={`bg-gray-300 ${
                focused ? "w-3/4" : "w-1/3"
              } rounded-full shadow-md px-4`}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            <Ionicons
              name="search"
              size={20}
              color="gray"
              className="absolute right-2"
            />
          </View>
        </View>

        <View className="list-last mt-8 flex-1 px-1">
          {lastFive.length < 1 ? (
            <View>
              <Text>Last five not loaded yet</Text>
            </View>
          ) : (
            <FlatList
              data={lastFive}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item: Product) => item._id}
              renderItem={({ item }: { item: Product }) => (
                <Pressable className="mx-5">
                  <View className="h-80 w-96 rounded-2xl drop-shadow-lg mr-2 mb-2 overflow-hidden">
                    <ImageBackground
                      source={{ uri: item.images[0].url }}
                      resizeMode="cover"
                      className="w-full h-full "
                    >
                      <LinearGradient
                        colors={[
                          "rgba(0, 0, 0, 0.3333)",
                          "rgba(0, 0, 0, 0.3333)",
                        ]}
                      >
                        <View className="h-full flex flex-col justify-between items-start p-5">
                          <Text className="font-bold text-3xl tracking-widest text-white h-1/4">
                            {item.name}
                          </Text>
                          <Text className="mt-3 text-slate-100 fonr-semi-bold tracking-wider leading-relaxed h-1/2">
                            {item.description}
                          </Text>
                          <TouchableOpacity className="bg-slate-300 w-max h-max py-3 px-8 flex flex-row justify-center items-center rounded-full">
                            <Ionicons
                              name="gift"
                              color="green"
                              className="mr-2"
                            />
                            <Text className="uppercase tracking-wide font-bold">
                              Buy Now
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </LinearGradient>
                    </ImageBackground>
                  </View>
                </Pressable>
              )}
              horizontal
            ></FlatList>
          )}
        </View>

        <View className="categories pl-5 mt-5 ">
          <HorizontalList
            content={categories}
            title="Categories"
          ></HorizontalList>
        </View>

        <View className="newArrivals mt-5 ">
          <CardHorizontalList
            content={newArrivals}
            title="New Arrivals"
            tailwindHeight="h-72"
            tailwindWidth="w-48"
          ></CardHorizontalList>
        </View>

        <View className="newArrivals mt-5 ">
          <CardHorizontalList
            content={lastFive}
            title="Recomended For You"
            tailwindHeight="h-72"
            tailwindWidth="w-48"
          ></CardHorizontalList>
        </View>

        <StatusBar style="dark" />
      </AppGradient>
    </ScrollView>
  );
};

export default HomeComponent;
