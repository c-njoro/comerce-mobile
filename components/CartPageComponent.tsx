import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import AppGradient from "./AppGradient";
import { Product } from "./Product";

type StringArray = string[];

interface ProductUpdate {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: {
    public_id: string;
    url: string;
    _id: string;
  }[];
  category: string;
  seller: string;
  stock: number;
  ratings: number;
  reviews: {
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  count: number;
}

interface ProductMap {
  [productId: string]: ProductUpdate;
}

const CartPageComponent = () => {
  const { isLoading, isLoggedIn, user } = useAuth();

  if (isLoading) {
    return (
      <ScrollView className="relative w-screen h-max">
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <View className="mt-5 flex-1 w-screen min-h-screen flex-col justify-center items-center">
            <Text className="text-3xl font-bold tracking-widest text-gray-800">
              Loading...
            </Text>
          </View>
        </AppGradient>
      </ScrollView>
    );
  }

  if (!isLoggedIn) {
    return (
      <ScrollView className="relative w-screen h-max">
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <View className="mt-5 flex-1 w-screen min-h-screen ">
            <View className="flex w-full h-max flex-row justify-between items-center px-5 fixed">
              <Ionicons
                name="arrow-back"
                size={30}
                color="black"
                onPress={() => router.back()}
              />
              <Text className="text-3xl font-bold tracking-widest text-gray-800">
                Shopping Cart
              </Text>
            </View>
            <View className="w-screen min-h-48 flex flex-col justify-center items-center">
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
          </View>
        </AppGradient>
      </ScrollView>
    );
  }

  //this to happen if user is there

  const [cartLoading, setCartLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<ProductMap>({});

  useEffect(() => {
    fetchUserCart();
  }, []);

  const fetchUserCart = async () => {
    try {
      setCartLoading(true);
      const response = await axios.get(
        `http://192.168.100.6:5000/api/users/find?email=${user.email}`
      );

      const completeUser = response.data;
      const productIds: StringArray = completeUser.favoriteProducts;
      console.log("ProductIds: ", productIds);

      if (productIds.length > 0) {
        fetchCartProducts(productIds);
      } else {
        setCartLoading(false);
      }
    } catch (error: any) {
      if ((error.response.status = 404)) {
        Alert.alert(
          "Cart Fetch Failed",
          "Your user information was not found. Log out and login then try again!!"
        );
      }

      Alert.alert(
        "User Info Fetch Failed",
        "Server ran to an error fetching your cart!! oN THE FETCH USER FUNCTION. Log out and login then try again!! "
      );
    }
  };

  const fetchCartProducts = async (ids: StringArray) => {
    try {
      const bulkResponse = await axios.post(
        `http://192.168.100.6:5000/api/products/bulk`,
        { ids }
      );
      const products = bulkResponse.data;
      setCart(products);
      setCartLoading(false);
    } catch (error) {
      Alert.alert(
        "User Info Fetch Failed",
        "Server ran to an error fetching your cart!! FETCH PRODUCTS FUNCTION. Log out and login then try again!! "
      );
      console.log("Error fetching cart products: ", error);
      setCartLoading(false);
    }
  };

  useEffect(() => {
    if (cart.length > 0) {
      const countOccurrences = () => {
        let tempCounts: ProductMap = {};
        cart.forEach((obj) => {
          if (tempCounts[obj._id]) {
            tempCounts[obj._id].count++;
          } else {
            tempCounts[obj._id] = { ...obj, count: 1 };
          }
        });
        setCounts(tempCounts);
      };

      countOccurrences();
    }
  }, [cart]);

  useEffect(() => {
    if (cart) {
      const productsWithTotal = cart.map((product) => ({
        ...product,
        total: product.price,
      }));
      const grandTotal = productsWithTotal.reduce(
        (sum, product) => sum + product.total,
        0
      );
      const rounded = parseFloat(grandTotal.toFixed(2));
      setTotal(rounded);
    }
  }, [cart]);

  if (cartLoading) {
    return (
      <ScrollView className="relative w-screen h-max">
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <View className="mt-5 flex-1 w-screen min-h-screen relative">
            <View className="flex w-full h-max flex-row justify-between items-center px-5 fixed">
              <Ionicons
                name="arrow-back"
                size={30}
                color="black"
                onPress={() => router.back()}
              />
              <Text className="text-3xl font-bold tracking-widest text-gray-800">
                Shopping Cart
              </Text>
            </View>

            <View>
              <Text>Loading cart ...</Text>
            </View>
          </View>
        </AppGradient>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="relative w-screen h-max">
      <AppGradient colors={["lightblue", "aliceblue"]}>
        <View className="mt-5 flex-1 w-screen min-h-screen">
          <View className="flex w-full h-max flex-row justify-between items-center px-5">
            <Ionicons
              name="arrow-back"
              size={30}
              color="black"
              onPress={() => router.back()}
            />
            <Text className="text-3xl font-bold tracking-widest text-gray-800">
              Shopping Cart
            </Text>
          </View>
          {cart.length > 0 ? (
            <View>
              {Object.values(counts).map((pr) => (
                <View key={pr._id}>
                  <Text>{pr.name}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View>
              <Text>Your cart is empty</Text>
            </View>
          )}
        </View>
      </AppGradient>
    </ScrollView>
  );
};

export default CartPageComponent;
