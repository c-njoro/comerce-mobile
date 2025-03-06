export interface Order {
  orderStatus: string;
  customerId: string;
  shippingAddress: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  totalAmount: number;
  products: OrderProducts[];
  shippingMethod: string;
  shippingCost: number;
  taxRate: number;
  taxAmount: number;
  orderNotes?: string; // Optional
  internalNotes?: string; // Optional
  orderId: string;
  orderDate: string;
  trackingNumber: string;
  __v: number;
}

export interface OrderProducts {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  _id: string;
}
