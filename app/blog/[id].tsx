import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";

interface BlogInterface {
  id: Number;
  title: string;
  content: string;
  image: string;
}

const BlogPage = () => {
  const { id } = useLocalSearchParams();
  const blogs: BlogInterface[] = require("../../assets/data/blogs.json");
  const blog = blogs.find((b) => b.id === Number(id));

  if (!blog) {
    <View>
      <Text className="font-bold text-5xl">Blog could not be found</Text>
    </View>;
  }

  return (
    <View className="flex-1">
      <LinearGradient colors={["lightblue", "aliceblue"]}>
        {blog ? (
          <View className="w-screen h-screen ">
            <ImageBackground
              source={{ uri: blog.image }}
              resizeMode="cover"
              className="w-full h-full"
            >
              <LinearGradient
                colors={["rgba(0,0,0, 0.433)", "rgba(0,0,0, 0.433)"]}
              >
                <SafeAreaView className="w-full h-full flex flex-col justify-center items-center gap-8 px-3">
                  <Text className="text-white font-bold text-3xl tracking-widest  ">
                    {blog.title}
                  </Text>
                  <Text className="text-white text-xl font-extralight tracking-widest leading-loose">
                    {blog.content}
                  </Text>
                  <Text className="font-bold text-white w-full tracking-wide border-b pb-3 border-white mt-3 pt-3">
                    😊 I hope this was useful
                  </Text>
                  <Pressable
                    className="mt-5 w-full h-max py-5 rounded-full bg-blue-100 flex flex-row justify-center items-center"
                    onPress={() => router.back()}
                  >
                    <Text className="tracking-widest uppercase font-bold ">
                      Back
                    </Text>
                  </Pressable>
                </SafeAreaView>
              </LinearGradient>
            </ImageBackground>
          </View>
        ) : (
          <View className="w-screen h-screen flex-1 flex-col justify-center items-center">
            <Text>Cannot display the blog at the moment</Text>
            <Pressable
              onPress={() => router.back()}
              className="mt-5 w-full h-max py-2 rounded-full bg-blue-100 flex flex-row justify-center items-center"
            >
              <Text>Back</Text>
            </Pressable>
          </View>
        )}

        <StatusBar style="light" />
      </LinearGradient>
    </View>
  );
};

export default BlogPage;
