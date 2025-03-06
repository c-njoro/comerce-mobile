import AppGradient from "@/components/AppGradient";
import { Order } from "@/components/Order";
import OrdersPageComponent from "@/components/OrdersPageComponent";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState("");
  const { isLoading, isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (isLoading || !isLoggedIn || !user) {
      return;
    }
    const fetchOrders = async () => {
      setError("");
      setOrdersLoading(true);
      try {
        const response = await fetch(
          `http://192.168.100.6:5000/api/orders?customerId=${user._id}`,
          {}
        );
        const data = await response.json();
        setOrders(data);
        setOrdersLoading(false);
      } catch (error) {
        setError("An error occurred. Please try again later.");
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1">
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <Text>Loading user details...</Text>
        </AppGradient>
      </View>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <View className="flex-1">
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <Text>Seems you are not logged in</Text>
        </AppGradient>
      </View>
    );
  }

  if (ordersLoading) {
    <View className="flex-1">
      <AppGradient colors={["lightblue", "aliceblue"]}>
        <Text>Loading your orders...</Text>
      </AppGradient>
    </View>;
  }

  if (error) {
    <View className="flex-1">
      <AppGradient colors={["lightblue", "aliceblue"]}>
        <Text>There was an error while loading your orders</Text>
        <Text>{error}</Text>
      </AppGradient>
    </View>;
  }
  return (
    <View className="flex-1">
      {orders.length > 0 ? (
        <OrdersPageComponent orders={orders} />
      ) : (
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <View className="flex-1 w-screen min-h-screen mt-5 px-3">
            <View className="flex w-full h-max flex-row justify-between items-center px-5">
              <Ionicons
                name="arrow-back"
                size={30}
                color="black"
                onPress={() => router.back()}
              />
              <Text className="text-3xl font-bold tracking-widest text-gray-800">
                Orders
              </Text>
            </View>
            <Text className="text-center w-full mt-8">
              You do not have any orders
            </Text>
          </View>
        </AppGradient>
      )}
    </View>
  );
};

export default OrdersPage;
