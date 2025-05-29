import { Pagination } from "./pagination.types";

export interface Tag {
  _id: number;
  name: string;
}

export interface TagListResponse {
  status: string;
  message: string;
  data: Tag[];
  pagination: Pagination;
}
