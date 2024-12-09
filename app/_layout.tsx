import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router"; // If using Expo Router
import React from "react";
import "../global.css";

// Create a QueryClient instance
const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
