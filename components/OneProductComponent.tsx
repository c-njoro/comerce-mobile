import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, View } from "react-native";
import AppGradient from "./AppGradient";
import ImageSlider from "./ImageSlider";
import { Product } from "./Product"; // Adjust the import according to your project structure

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
          <Ionicons name="arrow-back" size={30} color="black" />
          <Ionicons name="heart-outline" size={30} color="red" />
        </View>
        <View className="flex-1">
          <ImageSlider images={data.images} />
        </View>
      </AppGradient>
    </ScrollView>
  );
};

export default OneProductComponent;
