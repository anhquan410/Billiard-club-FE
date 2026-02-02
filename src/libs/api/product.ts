import type {
  ProductCreateRequest,
  ProductItem,
} from "../types/warehouse.type";
import agent from "./agent";

export async function getAllProducts() {
  try {
    const response = await agent.get(`/products/all`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getProductsPagination(
  page: number,
  limit: number,
  category?: string,
) {
  try {
    let url = `/products?page=${page}&limit=${limit}`;
    if (category && category !== "all") {
      url += `&category=${category}`;
    }
    const response = await agent.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getProductById(id: string) {
  try {
    const response = await agent.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createProduct(productData: ProductCreateRequest) {
  try {
    const response = await agent.post<ProductCreateRequest>(
      `/products`,
      productData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateProductById(id: string, productData: ProductItem) {
  try {
    const response = await agent.patch<ProductItem>(
      `/products/${id}`,
      productData,
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteProductById(id: string) {
  try {
    const response = await agent.delete<ProductItem>(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
