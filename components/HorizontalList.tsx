import React from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

interface HorizontalProps {
  title: string;
  content: Array<{ image: ImageSourcePropType; text: string }>;
}

const HorizontalList = ({ title, content }: HorizontalProps) => {
  return (
    <View className="my-5">
      <View className="mb-3">
        <Text className="text-2xl font-bold text-black">{title}</Text>
      </View>
      <View className="space-y-2">
        <FlatList
          data={content}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.text}
          renderItem={({ item }) => (
            <Pressable>
              <View className="h-24 w-24 rounded-md mr-2 mb-2">
                <Image
                  source={item.image}
                  resizeMode="cover"
                  className="w-16 h-16 rounded-full"
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
