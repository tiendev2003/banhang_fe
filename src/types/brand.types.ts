import { Pagination } from "./pagination.types";

export interface Brand {
    _id: number; // Long trong Java ánh xạ thành number trong TypeScript
    name: string;
    description: string;
    logo: string;
    active: boolean;
    createdDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
    updatedDate: string; // LocalDateTime ánh xạ thành string do định dạng JSON
}

 

export interface BrandListResponse {
  status: string;
  message: string;
  data: Brand[];
  pagination: Pagination;
}


export interface BrandRequest {
  name: string;
  description: string;
  image: File | string;
  active: boolean;
}