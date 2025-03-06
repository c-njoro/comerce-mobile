import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import AppGradient from "./AppGradient";
import { Order } from "./Order";

interface OrdersPageComponentProps {
  orders: Order[];
}

const OrdersPageComponent = ({ orders }: OrdersPageComponentProps) => {
  const [expandedOrder, setExpandedOrder] = useState("");
  const toggleOrder = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder("");
    } else {
      setExpandedOrder(orderId);
    }
  };
  return (
    <ScrollView className="flex-1 w-screen">
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
          <View className="w-full h-max flex flex-col justify-start items-start gap-3 mt-12">
            {orders.map((order, index) => (
              <Pressable
                key={order.orderId}
                className={`w-full h-max flex flex-col justify-start items-start px-2 py-3 gap-2 rounded-lg shadow-md  ${
                  expandedOrder === order.orderId ? "bg-blue-100" : "bg-blue-50"
                }`}
                onPress={() => toggleOrder(order.orderId)}
              >
                <View className="w-full flex flex-row justify-start items-center border-b border-gray-200">
                  <Text className="mr-4">{index + 1}.</Text>
                  <Text className="font-bold text-xl text-gray-600 tracking-widest">
                    {order.trackingNumber}
                  </Text>
                </View>

                <View className="w-full flex flex-row justify-between items-center">
                  <Text className="font-extralight text-xl tracking-wide text-gray-500 capitalize">
                    {order.shippingAddress}
                  </Text>
                  <Text className="font-extralight text-xl tracking-wide text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString("en-CA")}
                  </Text>
                </View>
                <Text
                  className={`w-full text-center text-blue-900 tracking-widest ${
                    expandedOrder === order.orderId ? "hidden" : ""
                  }`}
                >
                  View more order details...
                </Text>
                <View
                  className={`w-full flex flex-col justify-start items-start gap-2 ${
                    expandedOrder === order.orderId ? "" : "hidden"
                  }`}
                >
                  <View className="w-full flex flex-col justify-start items-start ">
                    <Text className="text-gray-700 uppercase tracking-widest mr-5 underline mt-3">
                      Order Items
                    </Text>
                    {order.products.map((pr) => (
                      <View
                        className="w-full flex flex-row justify-start items-center mt-1"
                        key={pr.productId}
                      >
                        <Text className="text-orange-700 uppercase tracking-widest mr-2">
                          X{pr.quantity}
                        </Text>
                        <Text className="text-gray-700  tracking-widest ">
                          {pr.productName}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View className="w-full flex flex-row justify-start items-center mt-4">
                    <Text className="text-green-700 uppercase tracking-widest mr-2">
                      Status:
                    </Text>
                    <Text className="text-gray-700 uppercase tracking-widest mr-5">
                      {order.orderStatus}
                    </Text>
                  </View>
                  <View className="w-full flex flex-row justify-start items-center mt-4">
                    <Text className="text-green-700 uppercase tracking-widest mr-2">
                      Order Totals:
                    </Text>
                    <Text className="text-gray-700 uppercase tracking-widest ">
                      {order.totalAmount}
                    </Text>
                  </View>
                  <View className="w-full flex flex-row justify-start items-center mt-4">
                    <Text className="text-green-700 uppercase tracking-widest mr-2">
                      Payment Status:
                    </Text>
                    <Text className="text-gray-700 uppercase tracking-widest ">
                      {order.paymentStatus}
                    </Text>
                  </View>
                  <View className="w-full flex flex-row justify-start items-center mt-4">
                    <Text className="text-green-700 uppercase tracking-widest mr-2">
                      Delivery Method:
                    </Text>
                    <Text className="text-gray-700 uppercase tracking-widest mr-5">
                      {order.shippingMethod}
                    </Text>
                  </View>

                  <View className="w-full flex flex-row justify-start items-center mt-4">
                    <Text className="text-green-700 uppercase tracking-widest mr-2">
                      Recipients Number:
                    </Text>
                    <Text className="text-gray-700 uppercase tracking-widest mr-5">
                      {order.contactInfo.phone}
                    </Text>
                  </View>
                  <View className="w-full flex flex-row justify-start items-center mt-4">
                    <Text className="text-green-700 uppercase tracking-widest mr-2">
                      Recipients email:
                    </Text>
                    <Text className="text-gray-700  tracking-widest mr-5">
                      {order.contactInfo.email}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </AppGradient>
    </ScrollView>
  );
};

export default OrdersPageComponent;
