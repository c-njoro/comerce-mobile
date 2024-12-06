import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchProducts = async () => {
  const response = await axios.get("http://192.168.100.6:3000/api/products");
  const products = response.data;
  console.log("Products", products);
  return products;
};

const useProducts = () => {
  return useQuery({
    queryKey: ["products"], // Unique key for the query
    queryFn: fetchProducts, // The function that fetches the data
    staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
  });
};

export default useProducts;
