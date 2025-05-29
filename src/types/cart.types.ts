import { Product } from "./product.types";

// Model cho CartItem (giả định cấu trúc cơ bản)
export interface CartItem {
  _id: number;
  product: Product; // Quan hệ với Product (giả định có product trong CartItem)
  quantity: number;
  price: number; // Giá của một sản phẩm
  selectedSize?: string;
  selectedColor?: string;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// Model cho Cart
export interface Cart {
  _id: number; // Long trong Java ánh xạ thành number trong TypeScript
  items: CartItem[]; // Quan hệ OneToMany với CartItem, ánh xạ thành mảng
  total: number; // double trong Java ánh xạ thành number trong TypeScript
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
}

// Type cho response của giỏ hàng (thường chỉ trả về một giỏ hàng cho user)
export type CartResponse = Cart;
