import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";

interface HorizontalProps {
  title: string;
  content: Array<{ image: string; text: string }>;
}

const HorizontalList = ({ title, content }: HorizontalProps) => {
  return (
    <View className="my-5">
      <View className="mb-3 flex flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-black">{title}</Text>
        <Text className="mr-3 text-gray-500">See all</Text>
      </View>
      <View className="space-y-2">
        <FlatList
          data={content}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.text}
          renderItem={({ item }) => (
            <Pressable className="">
              <View className="h-28 w-28 rounded-md mr-2 mb-2">
                <Image
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  className="w-20 h-20 rounded-full "
                />
                <Text className="w-full text-left mt-2 capitalize text-gray-700 font-rmono tracking-wide">
                  {item.text}
                </Text>
              </View>
            </Pressable>
          )}
          horizontal
        ></FlatList>
      </View>
    </View>
  );
};

export default HorizontalList;
