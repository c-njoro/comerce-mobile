import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
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
              <Ionicons name="cart-outline" size={30} color={`black`} />
            </View>
            <Pressable className="w-4/5 py-4 flex flex-col justify-center items-center rounded-lg shadow-md bg-green-500">
              <Text className="font-bold text-xl tracking-wider text-gray-700">
                Buy Now
              </Text>
            </Pressable>
          </View>
        </View>
      </AppGradient>
    </ScrollView>
  );
};

export default OneProductComponent;
