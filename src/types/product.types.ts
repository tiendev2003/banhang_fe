import { Brand } from "./brand.types";
import { Category } from "./category.types";
import { Pagination } from "./pagination.types";
import { Review } from "./review.types";

 

// Model cho Product
export interface Product {
  status: any;
  _id: number; // Long trong Java ánh xạ thành number trong TypeScript
  name: string;
  description: string;
  price: number; // BigDecimal ánh xạ thành number trong TypeScript
  salePrice: number | null; // Có thể null nếu không có giá giảm
  sale: boolean;
  stock: number;
  ingredients: string;
  productUsage: string;
  productImages: string[]; // Quan hệ OneToMany với ProductImage
  category: Category; // Quan hệ ManyToOne với Category
  brand: Brand; // Quan hệ ManyToOne với Brand
  reviews: Review[]; // Quan hệ OneToMany với Review
  isActive: boolean;
  createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
  // New fields
  sizes?: string[];
  colors?: string[];
  material?: string;
  gender?: string;
  style?: string;
  season?: string;
}

export interface ProductRequest {
  _id?: number | null; // Có thể null nếu không có id (thêm mới)
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  isSale?: boolean;
  sizes?: string[];    // Available sizes (XS, S, M, L, XL, etc.)
  colors?: string[];   // Available colors
  material?: string;   // Fabric material (Cotton, Polyester, etc.)
  gender?: string;     // Target gender (Men, Women, Unisex, Children)
  style?: string;      // Clothing style (Casual, Formal, Sports, etc.)
  season?: string;     // Season appropriateness (Summer, Winter, etc.)
  category: string;    // category ID
  brand?: string;      // brand ID
  stock: number;
  productImages?: string[]; // array of image URLs
  isActive?: boolean;
  ingredients?: string;
  productUsage?: string;
}

export interface ProductListResponse {
  status: string;
  message: string;
  data: Product[];
  pagination: Pagination;
}

// Type cho chi tiết sản phẩm
export type ProductDetailsResponse = Product;

// Type cho danh sách đánh giá theo sản phẩm

export interface ProductDetailResponse {
  status: string;
  message: string;
  data: Product;
}
