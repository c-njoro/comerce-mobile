import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { runOnJS } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import AppGradient from "./AppGradient";
import ImageSlider from "./ImageSlider";
import { Product } from "./Product";

interface OneProductComponentProps {
  data: Product;
}

interface ImageType {
  public_id: string;
  url: string;
  _id: string;
}

const OneProductComponent: React.FC<OneProductComponentProps> = ({ data }) => {
  const { isLoggedIn, user } = useAuth();

  const addToCart = async (objectId: string) => {
    console.log("Add cart clicked");
    if (!isLoggedIn) {
      console.log("Login first");
      runOnJS(() => {
        Toast.show({
          type: "info",
          text1: "You have to login to use cart.",
          text2: "Click on the profile icon and login .",
          visibilityTime: 3000,
          position: "bottom",
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 14, color: "gray" },
        });
      });

      return;
    }
    try {
      const response = await axios.put(
        `http://192.168.100.6:5000/api/users/addFavorite`,
        {
          email: user.email,
          id: objectId,
        }
      );
      console.log("added to cart");
      runOnJS(() => {
        Toast.show({
          type: "success",
          text1: "Added to Cart!",
          text2: "Check your cart for details.",
          visibilityTime: 3000,
          position: "bottom",
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 14, color: "gray" },
        });
      });
    } catch (error: any) {
      if (error.response.status == 408) {
        console.log("Item already in cart");
      } else {
        console.log("Error while adding to cart");
        runOnJS(() => {
          Toast.show({
            type: "error",
            text1: "There was an error in adding item.",
            text2: "Please try again!",
            visibilityTime: 3000,
            position: "bottom",
            text1Style: { fontSize: 18, fontWeight: "bold" },
            text2Style: { fontSize: 14, color: "gray" },
          });
        });

        console.log(error);
      }
    }
  };
  return (
    <ScrollView className="flex-1">
      <AppGradient colors={["lightblue", "aliceblue"]}>
        <View className="flex w-full h-max flex-row justify-between items-center px-5 mt-8">
          <Ionicons
            name="arrow-back"
            size={30}
            color="black"
            onPress={() => router.back()}
          />
          <Ionicons name="heart-outline" size={30} color="red" />
        </View>
        <View className="flex-1">
          <ImageSlider images={data.images} />
        </View>
        <View className="details flex-1 flex-col gap-2 justify-start items-start mt-5 p-5">
          <Text className="text-gray-500 uppercase text-sm tracking-wider">
            {data.category}
          </Text>
          <Text className="font-bold text-3xl text-black tracking-widest">
            {data.name}
          </Text>
          <View className="flex flex-row justify-start items-center gap-1">
            <Ionicons name="star" size={15} color="orange" className="mb-1" />
            <Text className="font-bold tracking-wide">{data.ratings}</Text>
            <Text className="font-bold tracking-wide">(+500 Reviews)</Text>
          </View>
          <View className="flex flex-row justify-start items-center gap-4 mt-2">
            <Text className="font-bold text-black text-2xl tracking-widest">
              ${data.price} KSH
            </Text>
            <Text className="font-bold text-gray-500 line-through text-xl tracking-widest">
              ${((data.price * 90) / 100).toFixed(2)} KSH
            </Text>
            <Text className="bg-green-200 py-1 px-2 font-bold text-green-700 rounded-md shadow-md">
              -10%
            </Text>
          </View>
          <View className="flex flex-row justify-start items-center mt-1">
            <Ionicons
              name="checkmark-circle"
              size={20}
              color="green"
              className="mr-3"
            />
            <Text className="font-bold tracking-wider text-green-700">
              In stock: {data.stock}
            </Text>
          </View>
          <View className="flex flex-row justify-start items-center mt-1">
            <Ionicons
              name="car-outline"
              size={20}
              color="gray"
              className="mr-3"
            />
            <Text className="font-bold tracking-wider text-gray-500">
              Free Deliverly
            </Text>
          </View>
          <View className="flex flex-row justify-start items-center mt-1">
            <Ionicons
              name="storefront-outline"
              size={20}
              color="green"
              className="mr-3"
            />
            <Text className="font-bold tracking-wider text-gray-600">
              Available in the nearest store
            </Text>
          </View>

          <Text className="mt-5 text-gray-600 font-bold tracking-widest leading-relaxed">
            {data.description}
          </Text>

          <View className="w-full flex flex-row justify-between items-center mt-5 pr-5">
            <View className="bg-blue-100 w-1/6 shadow-lg rounded-xl flex flex-col justify-center items-center py-3">
              <Ionicons
                name="cart-outline"
                size={30}
                color={`black`}
                onPress={() => addToCart(data._id)}
              />
            </View>
            <Pressable className="w-4/5 py-4 flex flex-col justify-center items-center rounded-lg shadow-md bg-green-500">
              <Text className="font-bold text-xl tracking-wider text-gray-700">
                Buy Now
              </Text>
            </Pressable>
            <Toast />
          </View>
        </View>
      </AppGradient>
    </ScrollView>
  );
};

export default OneProductComponent;
