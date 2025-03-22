import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
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
  const [ordering, setOrdering] = useState(false);
  const toggleOrdering = () => setOrdering(!ordering);

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

  //making order stuff

  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(0);

  const submitOrder = async () => {
    if (
      !shippingAddress.trim() ||
      !phoneNumber.trim() ||
      !paymentMethod.trim() ||
      !shippingMethod.trim() ||
      !note.trim() ||
      quantity === 0
    ) {
      Alert.alert(
        "Some data is missing!!!",
        "Ensure you have filled the form correctly"
      );
      return;
    }

    try {
      const order = await axios.post(`http://192.168.100.6:5000/api/orders`, {
        customerId: user._id,
        shippingAddress: shippingAddress,
        contactInfo: {
          phone: phoneNumber,
          email: user.email,
        },
        paymentMethod: paymentMethod,
        transactionId: "TEST_ID",
        totalAmount: data.price * quantity,
        products: [
          {
            productId: data._id,
            quantity: quantity,
            productName: data.name,
            unitPrice: data.price,
            totalPrice: data.price * quantity,
          },
        ],
        shippingMethod: shippingMethod,
        shippingCost: 5,
        taxRate: 0.123,
        taxAmount: 10.08,
        orderNotes: note,
        internalNotes: "New customer, verify address first.",
      });

      setShippingAddress("");
      setShippingMethod("");
      setPhoneNumber("");
      setNote("");
      setPaymentMethod("");
      setQuantity(0);

      Alert.alert(
        "Your Order was places successfully",
        "Track your order from the orders page, visit profile to see the orders page."
      );

      toggleOrdering();
    } catch (error) {
      Alert.alert(
        "There was an error creating your order!!!",
        "The server ran to an error while creating the order. Please try again."
      );
      console.log("Error placing order", error);
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
        <View
          className={`details flex-1 flex-col gap-2 justify-start items-start mt-5 p-5 ${
            ordering ? "hidden" : ""
          }`}
        >
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
            <Pressable
              onPress={toggleOrdering}
              className="w-4/5 py-4 flex flex-col justify-center items-center rounded-lg shadow-md bg-green-500"
            >
              <Text className="font-bold text-xl tracking-wider text-gray-700">
                Buy Now
              </Text>
            </Pressable>
            <Toast />
          </View>
        </View>
        <View
          className={`${
            ordering ? "" : "hidden"
          } flex-1 flex-col gap-2 justify-start items-start mt-5 p-5`}
        >
          <View className="w-full flex flex-row justify-end items-center">
            <Pressable
              onPress={toggleOrdering}
              className="w-1/2 py-3 bg-red-200 rounded-md shadow-md flex flex-row justify-center items-center"
            >
              <Text>Quit Order</Text>
            </Pressable>
          </View>
          <View className="w-full h-max flex flex-col justify-start items-start gap-2">
            <Text>Quantity</Text>
            <TextInput
              className="bg-gray-100 pl-8 shadow-md h-14 mb-4 w-full"
              placeholder="Enter quantity"
              value={quantity.toString()} // Convert number to string for TextInput
              onChangeText={(text) => setQuantity(Number(text))} // Convert string back to number
              keyboardType="numeric" // Restrict input to numeric values
              autoCapitalize="none"
            />
          </View>
          <View className="w-full h-max flex flex-col justify-start items-start gap-2">
            <Text>Shipping Address</Text>
            <TextInput
              className="bg-gray-100 pl-8  shadow-md h-14  mb-4 w-full"
              placeholder="Shipping Address"
              value={shippingAddress}
              onChangeText={setShippingAddress}
              autoCapitalize="none"
            />
          </View>
          <View className="w-full h-max flex flex-col justify-start items-start gap-2">
            <Text>Phone Number</Text>
            <TextInput
              className="bg-gray-100 pl-8  shadow-md h-14  mb-4 w-full"
              placeholder="Phone number..."
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              autoCapitalize="none"
            />
          </View>
          <View className="w-full h-max flex flex-col justify-start items-start gap-2">
            <Text>Payment Method</Text>
            <View className="w-full flex flex-row justify-between items-center gap-3">
              <Pressable
                className={`w-1/2 flex flex-row justify-center items-center py-3 ${
                  paymentMethod === "mpesa" ? "bg-green-500" : "bg-gray-100"
                }`}
                onPress={() => setPaymentMethod("mpesa")}
              >
                <Text>M-Pesa</Text>
              </Pressable>
              <Pressable
                className={`w-1/2 flex flex-row justify-center items-center py-3 ${
                  paymentMethod === "onDelivery"
                    ? "bg-green-500"
                    : "bg-gray-100"
                }`}
                onPress={() => setPaymentMethod("onDelivery")}
              >
                <Text>Pay On Delivery</Text>
              </Pressable>
            </View>
          </View>
          <View className="w-full h-max flex flex-col justify-start items-start gap-2">
            <Text>Shipping Method</Text>
            <View className="w-full flex flex-row justify-between items-center gap-3">
              <Pressable
                className={`w-1/2 flex flex-row justify-center items-center py-3 ${
                  shippingMethod === "To be delivered at your home address"
                    ? "bg-green-500"
                    : "bg-gray-100"
                }`}
                onPress={() =>
                  setShippingMethod("To be delivered at your home address")
                }
              >
                <Text>Door Delivery</Text>
              </Pressable>
              <Pressable
                className={`w-1/2 flex flex-row justify-center items-center py-3 ${
                  shippingMethod === "To be collected at pickup station"
                    ? "bg-green-500"
                    : "bg-gray-100"
                }`}
                onPress={() =>
                  setShippingMethod("To be collected at pickup station")
                }
              >
                <Text>Pick Up Station</Text>
              </Pressable>
            </View>
          </View>
          <View className="w-full h-max flex flex-col justify-start items-start gap-2">
            <Text>Note for delivery personnel</Text>
            <TextInput
              className="bg-gray-100 pl-8  shadow-md h-14  mb-4 w-full"
              placeholder="Note.."
              value={note}
              onChangeText={setNote}
              autoCapitalize="none"
            />
          </View>

          <Pressable
            className="w-full h-max py-5 bg-blue-200 rounded-md shadow-md flex flex-row justify-center items-center"
            onPress={submitOrder}
          >
            <Text>Make Order</Text>
          </Pressable>
        </View>
      </AppGradient>
    </ScrollView>
  );
};

export default OneProductComponent;
