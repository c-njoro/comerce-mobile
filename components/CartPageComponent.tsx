import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
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
  const segments = useSegments();
  const [cartLoading, setCartLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<ProductMap>({});
  const [currentIds, setCurrenIds] = useState<StringArray>([]);

  useEffect(() => {
    fetchUserCart();
  }, [segments]);

  const fetchUserCart = async () => {
    try {
      setCartLoading(true);
      const response = await axios.get(
        `http://192.168.100.6:5000/api/users/find?email=${user.email}`
      );

      const completeUser = response.data;
      const productIds: StringArray = completeUser.favoriteProducts;
      setCurrenIds(productIds);

      if (productIds.length > 0) {
        fetchCartProducts(productIds);
      } else {
        setCart([]);
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

  const reduceCount = async (id: string) => {
    try {
      let count = 0;
      const cartP = currentIds;

      for (let num of cartP) {
        if (num === id) {
          count++;
        }
      }

      if (count <= 1) {
        Toast.show({
          type: "info",
          text1: "Only one count remaining",
          text2: "Cannot reduce 1, either delete the item.",
          visibilityTime: 3000,
          position: "bottom",
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 14, color: "gray" },
        });
        return;
      }

      await axios.post(`http://192.168.100.6:5000/api/users/reduceFavorite`, {
        email: user.email,
        id,
      });
      fetchUserCart();
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const increaseCount = async (id: string) => {
    try {
      await axios.put(`http://192.168.100.6:5000/api/users/increaseFavorite`, {
        email: user.email,
        id,
      });
      fetchUserCart();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await axios.post(`http://192.168.100.6:5000/api/users/removeFavorite`, {
        email: user.email,
        id,
      });

      Toast.show({
        type: "info",
        text1: "Deleted from your cart",
        text2: "Product has been completely removed from your cart",
        visibilityTime: 3000,
        position: "bottom",
        text1Style: { fontSize: 18, fontWeight: "bold" },
        text2Style: { fontSize: 14, color: "gray" },
      });

      fetchUserCart();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

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
            <View className="w-full h-max flex flex-col justify-start items-start gap-3 mt-12 px-5">
              {Object.values(counts).map((pr) => (
                <View
                  key={pr._id}
                  className="bg-blue-50 h-max w-full flex flex-row justify-start items-start px-2 py-3 gap-2 rounded-lg shadow-md"
                >
                  <Toast />
                  <Image
                    source={{ uri: pr.images[0].url }}
                    resizeMode="cover"
                    className="h-full min-h-32 w-1/4 rounded-md shadow-md"
                  ></Image>

                  <View className="w-3/4 h-max flex flex-col justify-start items-start">
                    <View className="name-delete flex w-full flex-row justify-between items-center px-2 gap-5">
                      <Text className="font-bold text-2xl tracking-widest text-gray-600">
                        {pr.name}
                      </Text>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={`red`}
                        onPress={() => removeProduct(pr._id)}
                      />
                    </View>
                    <Text className="text-gray-400 font-bold text-xl tracking-widest mt-4 px-2">
                      @Ksh.{pr.price}
                    </Text>

                    <View className="flex flex-row-reverse w-full justify-between px-2">
                      <View className="flex flex-row gap-5 justify-start items-center">
                        <Ionicons
                          name="remove-outline"
                          size={30}
                          color={`red`}
                          className="bg-blue-100 rounded-lg shadow-md"
                          onPress={() => reduceCount(pr._id)}
                        />
                        <Text>{pr.count}</Text>
                        <Ionicons
                          name="add-outline"
                          size={30}
                          color={`green`}
                          className="bg-blue-100 rounded-lg shadow-md"
                          onPress={() => increaseCount(pr._id)}
                        />
                      </View>
                      <View className="flex flex-row justify-start items-center">
                        <Text className="font-bold tracking-widest ">
                          Total Ksh.{(pr.price * pr.count).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
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
