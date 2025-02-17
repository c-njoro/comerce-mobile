import ProductsComponent from "@/components/ProductsComponent";
import React from "react";
import { View } from "react-native";

const ProductsPage = () => {
  return (
    <View className="flex-1">
      <ProductsComponent />
    </View>
  );
};

export default ProductsPage;
