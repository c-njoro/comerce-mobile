import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import AppGradient from "./AppGradient";
import { Product } from "./Product";

type StringArray = string[];

interface ProductUpdate {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: {
    public_id: string;
    url: string;
    _id: string;
  }[];
  category: string;
  seller: string;
  stock: number;
  ratings: number;
  reviews: {
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  count: number;
}

interface ProductMap {
  [productId: string]: ProductUpdate;
}

interface refinedProducts {
  productId: String;
  productName: String;
  quantity: Number;
  unitPrice: Number;
  totalPrice: Number;
}

const CartPageComponent = () => {
  const { isLoading, isLoggedIn, user } = useAuth();

  if (isLoading) {
    return (
      <ScrollView className="relative w-screen h-max">
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <View className="mt-5 flex-1 w-screen min-h-screen flex-col justify-center items-center">
            <Text className="text-3xl font-bold tracking-widest text-gray-800">
              Loading...
            </Text>
          </View>
        </AppGradient>
      </ScrollView>
    );
  }

  if (!isLoggedIn) {
    return (
      <ScrollView className="relative w-screen h-max">
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <View className="mt-5 flex-1 w-screen min-h-screen ">
            <View className="flex w-full h-max flex-row justify-between items-center px-5 fixed">
              <Ionicons
                name="arrow-back"
                size={30}
                color="black"
                onPress={() => router.back()}
              />
              <Text className="text-3xl font-bold tracking-widest text-gray-800">
                Shopping Cart
              </Text>
            </View>
            <View className="w-screen min-h-48 flex flex-col justify-center items-center">
              <Text>You are not Logged In</Text>
              <Pressable
                className="p-3 bg-blue-300 rounded-md mt-5"
                onPress={() => router.push("/login")}
              >
                <Text className="font-bold uppercase tracking-widest">
                  Log In / Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </AppGradient>
      </ScrollView>
    );
  }

  //this to happen if user is there
  const segments = useSegments();
  const [cartLoading, setCartLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<ProductMap>({});
  const [currentIds, setCurrenIds] = useState<StringArray>([]);
  const [checkOut, setCheckOut] = useState(false);

  useEffect(() => {
    fetchUserCart();
  }, [segments]);

  const fetchUserCart = async () => {
    try {
      setCartLoading(true);
      const response = await axios.get(
        `http://192.168.100.6:5000/api/users/find?email=${user.email}`
      );

      const completeUser = response.data;
      const productIds: StringArray = completeUser.favoriteProducts;
      setCurrenIds(productIds);

      if (productIds.length > 0) {
        fetchCartProducts(productIds);
      } else {
        setCart([]);
        setCartLoading(false);
      }
    } catch (error: any) {
      if ((error.response.status = 404)) {
        Alert.alert(
          "Cart Fetch Failed",
          "Your user information was not found. Log out and login then try again!!"
        );
      }

      Alert.alert(
        "User Info Fetch Failed",
        "Server ran to an error fetching your cart!! oN THE FETCH USER FUNCTION. Log out and login then try again!! "
      );
    }
  };

  const fetchCartProducts = async (ids: StringArray) => {
    try {
      const bulkResponse = await axios.post(
        `http://192.168.100.6:5000/api/products/bulk`,
        { ids }
      );
      const products = bulkResponse.data;
      setCart(products);
      setCartLoading(false);
    } catch (error) {
      Alert.alert(
        "User Info Fetch Failed",
        "Server ran to an error fetching your cart!! FETCH PRODUCTS FUNCTION. Log out and login then try again!! "
      );
      console.log("Error fetching cart products: ", error);
      setCartLoading(false);
    }
  };

  useEffect(() => {
    if (cart.length > 0) {
      const countOccurrences = () => {
        let tempCounts: ProductMap = {};
        cart.forEach((obj) => {
          if (tempCounts[obj._id]) {
            tempCounts[obj._id].count++;
          } else {
            tempCounts[obj._id] = { ...obj, count: 1 };
          }
        });
        setCounts(tempCounts);
      };

      countOccurrences();
    }
  }, [cart]);

  useEffect(() => {
    if (cart) {
      const productsWithTotal = cart.map((product) => ({
        ...product,
        total: product.price,
      }));
      const grandTotal = productsWithTotal.reduce(
        (sum, product) => sum + product.total,
        0
      );
      const rounded = parseFloat(grandTotal.toFixed(2));
      setTotal(rounded);
    }
  }, [cart]);

  const reduceCount = async (id: string) => {
    try {
      let count = 0;
      const cartP = currentIds;

      for (let num of cartP) {
        if (num === id) {
          count++;
        }
      }

      if (count <= 1) {
        Toast.show({
          type: "info",
          text1: "Only one count remaining",
          text2: "Cannot reduce 1, either delete the item.",
          visibilityTime: 3000,
          position: "bottom",
          text1Style: { fontSize: 18, fontWeight: "bold" },
          text2Style: { fontSize: 14, color: "gray" },
        });
        return;
      }

      await axios.post(`http://192.168.100.6:5000/api/users/reduceFavorite`, {
        email: user.email,
        id,
      });
      fetchUserCart();
      setOrderProducts([]);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  const increaseCount = async (id: string) => {
    try {
      await axios.put(`http://192.168.100.6:5000/api/users/increaseFavorite`, {
        email: user.email,
        id,
      });
      fetchUserCart();
      setOrderProducts([]);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await axios.post(`http://192.168.100.6:5000/api/users/removeFavorite`, {
        email: user.email,
        id,
      });

      Toast.show({
        type: "info",
        text1: "Deleted from your cart",
        text2: "Product has been completely removed from your cart",
        visibilityTime: 3000,
        position: "bottom",
        text1Style: { fontSize: 18, fontWeight: "bold" },
        text2Style: { fontSize: 14, color: "gray" },
      });
      setOrderProducts([]);
      fetchUserCart();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  //making order stuff
  const [orderProducts, setOrderProducts] = useState<refinedProducts[]>([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [note, setNote] = useState("");

  const createProducts = () => {
    Object.values(counts).map((co) => {
      setOrderProducts((previousState) => [
        ...previousState,
        {
          productId: co._id,
          productName: co.name,
          quantity: co.count,
          unitPrice: co.price,
          totalPrice: co.price * co.count,
        },
      ]);
    });
  };

  const clearCart = async () => {
    try {
      const order = await axios.put(
        `http://192.168.100.6:5000/api/users/update/${user._id}`,
        {
          favoriteProducts: [],
        }
      );
      console.log("Cart cleared after making order!");
      fetchUserCart();
    } catch (error) {
      Alert.alert(
        "Order was created but cart not cleared!!!",
        "There was an error while crearing the cart."
      );
    }
  };

  const submitOrder = async () => {
    if (
      !shippingAddress.trim() ||
      !phoneNumber.trim() ||
      !paymentMethod.trim() ||
      !shippingMethod.trim() ||
      !note.trim()
    ) {
      Alert.alert(
        "Some data is missing!!!",
        "Ensure you have filled the form correctly"
      );
      return;
    }

    if (orderProducts.length < 1) {
      Alert.alert(
        "Seems products are not confirmed!!",
        "Go back to cart and press checkout then confirm again"
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
        totalAmount: total,
        products: orderProducts,
        shippingMethod: shippingMethod,
        shippingCost: 5,
        taxRate: 0.123,
        taxAmount: 10.08,
        orderNotes: note,
        internalNotes: "New customer, verify address first.",
      });

      setOrderProducts([]);
      setShippingAddress("");
      setShippingMethod("");
      setPhoneNumber("");
      setNote("");
      setPaymentMethod("");
      setCheckOut(false);

      Alert.alert(
        "Your Order was places successfuly",
        "Track your order from the orders page, visit profile to see the orders page."
      );
      clearCart();
      router.push("/");
    } catch (error) {
      Alert.alert(
        "There was an error creating your order!!!",
        "The server ran to an error while creating the order. Please try again."
      );
      console.log("Error placing order", error);
    }
  };

  //this is when the cart is loading
  if (cartLoading) {
    return (
      <ScrollView className="relative w-screen h-max">
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <View className="mt-5 flex-1 w-screen min-h-screen relative">
            <View className="flex w-full h-max flex-row justify-between items-center px-5 fixed">
              <Ionicons
                name="arrow-back"
                size={30}
                color="black"
                onPress={() => router.back()}
              />
              <Text className="text-3xl font-bold tracking-widest text-gray-800">
                Shopping Cart
              </Text>
            </View>

            <View className="w-screen">
              <Text className="w-full text-center mt-12">Loading cart ...</Text>
            </View>
          </View>
        </AppGradient>
      </ScrollView>
    );
  }

  //when cart is loaded and user wants to checkout

  if (checkOut) {
    return (
      <ScrollView className="relative w-screen h-max">
        <AppGradient colors={["lightblue", "aliceblue"]}>
          <View className="mt-5 flex-1 w-screen min-h-screen relative">
            <View className="flex w-full h-max flex-row justify-between items-center px-5 fixed">
              <Ionicons
                name="arrow-back"
                size={30}
                color="black"
                onPress={() => setCheckOut(false)}
              />
              <Text className="text-3xl font-bold tracking-widest text-gray-800">
                Check Out
              </Text>
            </View>

            {cart.length > 0 ? (
              <View className="w-screen flex flex-col justify-start items-start gap-3 mt-5 px-5">
                <View className="w-full flex flex-row justify-between items-center">
                  <Text className="font-bold text-xl text-gray-500">Item</Text>
                  <Text className="font-bold text-xl text-gray-500">
                    Quantity
                  </Text>
                  <Text className="font-bold text-xl text-gray-500">Total</Text>
                </View>
                {Object.values(counts).map((pr) => (
                  <View
                    className="w-full flex flex-row justify-between items-center"
                    key={pr._id}
                  >
                    <Text className="font-bold  text-gray-700 w-1/3 text-start text-wrap">
                      {pr.name}
                    </Text>
                    <Text className="font-bold  text-gray-700 w-1/3 text-center">
                      {pr.count}
                    </Text>
                    <Text className="font-bold  text-gray-700 w-1/3 text-right">
                      {(pr.price * pr.count).toFixed(2)}
                    </Text>
                  </View>
                ))}

                <View className="w-full flex flex-row justify-end items-center mt-2">
                  <Text className="font-bold tracking-wider text-xl text-green-800">
                    Ksh. {total}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="w-full h-max mt-12 flex flex-col justify-center items-center">
                <Text className="font-bold text-xl text-gray-500">
                  No Items to Checkout, Add some items to cart
                </Text>
              </View>
            )}

            {orderProducts.length < 1 ? (
              <View className="w-screen h-max">
                <Pressable
                  className="flex flex-row justify-center items-center w-full py-5 rounded-full bg-blue-100"
                  onPress={createProducts}
                >
                  <Text>Confirm Product(s)</Text>
                </Pressable>
              </View>
            ) : (
              <View className="w-full px-5 flex flex-col justify-start items-start gap-3 mt-8">
                <View className="w-full flex flex-row justify-center items-center">
                  <Text className="font-bold tracking-widest text-xl text-gray-600">
                    Fill In To Order
                  </Text>
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
                        paymentMethod === "mpesa"
                          ? "bg-green-500"
                          : "bg-gray-100"
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
                        shippingMethod ===
                        "To be delivered at your home address"
                          ? "bg-green-500"
                          : "bg-gray-100"
                      }`}
                      onPress={() =>
                        setShippingMethod(
                          "To be delivered at your home address"
                        )
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
            )}
          </View>
        </AppGradient>
      </ScrollView>
    );
  }

  //this displays the cart items now that all ifs are not met
  return (
    <ScrollView className="relative w-screen h-max">
      <AppGradient colors={["lightblue", "aliceblue"]}>
        <View className="mt-5 flex-1 w-screen min-h-screen">
          <View className="flex w-full h-max flex-row justify-between items-center px-5">
            <Ionicons
              name="arrow-back"
              size={30}
              color="black"
              onPress={() => router.back()}
            />
            <Text className="text-3xl font-bold tracking-widest text-gray-800">
              Shopping Cart
            </Text>
          </View>
          {cart.length > 0 ? (
            <View className="w-full h-max flex flex-col justify-start items-start gap-3 mt-12 px-5">
              {Object.values(counts).map((pr) => (
                <View
                  key={pr._id}
                  className="bg-blue-50 h-max w-full flex flex-row justify-start items-start px-2 py-3 gap-2 rounded-lg shadow-md"
                >
                  <Toast />
                  <Image
                    source={{ uri: pr.images[0].url }}
                    resizeMode="cover"
                    className="h-full min-h-32 w-1/4 rounded-md shadow-md"
                  ></Image>

                  <View className="w-3/4 h-max flex flex-col justify-start items-start">
                    <View className="name-delete flex w-full flex-row justify-between items-center px-2 gap-5">
                      <Text className="font-bold text-2xl tracking-widest text-gray-600">
                        {pr.name}
                      </Text>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={`red`}
                        onPress={() => removeProduct(pr._id)}
                      />
                    </View>
                    <Text className="text-gray-400 font-bold text-xl tracking-widest mt-4 px-2">
                      @Ksh.{pr.price}
                    </Text>

                    <View className="flex flex-row-reverse w-full justify-between px-2">
                      <View className="flex flex-row gap-5 justify-start items-center">
                        <Ionicons
                          name="remove-outline"
                          size={30}
                          color={`red`}
                          className="bg-blue-100 rounded-lg shadow-md"
                          onPress={() => reduceCount(pr._id)}
                        />
                        <Text>{pr.count}</Text>
                        <Ionicons
                          name="add-outline"
                          size={30}
                          color={`green`}
                          className="bg-blue-100 rounded-lg shadow-md"
                          onPress={() => increaseCount(pr._id)}
                        />
                      </View>
                      <View className="flex flex-row justify-start items-center">
                        <Text className="font-bold tracking-widest ">
                          Total Ksh.{(pr.price * pr.count).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              <View className="w-full h-max flex flex-row justify-between items-center">
                <Pressable
                  className="bg-green-200 p-3 rounded-md flex flex-row justify-center items-center"
                  onPress={() => setCheckOut(true)}
                >
                  <Text>Check Out</Text>
                </Pressable>

                <Text className="tracking-wide font-bold text-green-700 text-xl">
                  Total: {total}
                </Text>
              </View>
            </View>
          ) : (
            <View className="w-full h-max mt-12">
              <Text className="w-full text-center fonr-bold tracking-widest text-xl text-gray-600">
                Your cart is empty
              </Text>
            </View>
          )}
        </View>
      </AppGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { margin: 10 },
  picker: { height: 50, width: "100%" },
});

export default CartPageComponent;
