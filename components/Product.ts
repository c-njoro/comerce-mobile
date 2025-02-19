export interface Product {
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
}
