import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Product } from "./Product";

interface HorizontalProps {
  title: string;
  content: Array<Product>;
  tailwindWidth: string;
  tailwindHeight: string;
}

const CardHorizontalList = ({
  title,
  content,
  tailwindHeight,
  tailwindWidth,
}: HorizontalProps) => {
  return (
    <View className="my-2">
      <View className="mb-3 flex flex-row justify-between items-center mx-5">
        <Text className="text-2xl font-bold text-black">{title}</Text>
        <Text className="mr-3 text-gray-500">See all</Text>
      </View>
      <View className="space-y-2">
        <FlatList
          data={content}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: Product) => item._id}
          renderItem={({ item }: { item: Product }) => (
            <Pressable
              className="mx-3"
              onPress={() => router.push(`/products/${item._id}`)}
            >
              <View
                className={`${tailwindHeight} ${tailwindWidth} shadow-lg rounded-2xl drop-shadow-lg overflow-hidden relative flex flex-col justify-start items-start`}
              >
                <Image
                  source={{ uri: item.images[0].url }}
                  resizeMode="cover"
                  className="w-full h-2/3 "
                ></Image>
                <View className="w-full h-1/3 bg-blue-100">
                  <View className="h-full flex flex-col justify-between items-start p-5 gap-2">
                    <Text className="text-gray-500">The Ordinary</Text>
                    <Text className="font-bold  tracking-widest  truncate">
                      {item.name}
                    </Text>

                    <View className="w-full flex flex-row justify-between items-center">
                      <Text>Ksh{item.price}</Text>
                    </View>
                  </View>
                </View>
                <Ionicons
                  name="heart-outline"
                  color="green"
                  size={30}
                  className="absolute top-2 left-2"
                />
                <TouchableOpacity className=" absolute top-2 right-2 rounded-lg">
                  <Ionicons
                    name="cart"
                    color="green"
                    size={25}
                    className="w-8"
                  />
                </TouchableOpacity>
              </View>
            </Pressable>
          )}
          horizontal
        ></FlatList>
      </View>
    </View>
  );
};

export default CardHorizontalList;
