import { Ionicons } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import React from "react";
import "../global.css";

// Create a QueryClient instance
const queryClient = new QueryClient();

export default function Layout() {
  // const [fontsLoaded] = useFonts({
  //   Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
  //   Nunito: require("../assets/fonts/Nunito-Regular.ttf"),
  // });

  // if (!fontsLoaded) {
  //   return (
  //     <View>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          headerShown: false, // This hides the header for all tabs
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: "Products",
            tabBarLabel: "Products",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="storefront-outline" size={size} color={color} />
            ),
            href: "/products",
          }}
        />

        <Tabs.Screen
          name="cart/index"
          options={{
            title: "Cart",
            tabBarLabel: "Cart",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}
