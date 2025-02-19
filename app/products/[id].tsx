import OneProductComponent from "@/components/OneProductComponent";
import { Product } from "@/components/Product";
import ProductSkin from "@/components/ProductSkin";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

const ProductDetails = () => {
  const { id } = useLocalSearchParams();

  const [currentProduct, setCurrentProduct] = useState<Product>();

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `http://192.168.100.6:5000/api/products/findbyid/${id}`
      );
      const fetchedProduct = response.data;
      setCurrentProduct(fetchedProduct);
    } catch (error) {
      console.log("Could not fetch the product: ", error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  if (!currentProduct) {
    return (
      <View className="flex-1">
        <ProductSkin />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <OneProductComponent data={currentProduct} />
    </View>
  );
};

export default ProductDetails;
