export interface Product {
  _id: string; // Optional, since MongoDB auto-generates it
  name: string;
  description: string;
  price: number;
  images: {
    public_id: string;
    url: string;
  }[];
  category: string; // General type for category, without enum
  seller: string;
  stock: number;
  ratings: number;
  reviews: {
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
}
