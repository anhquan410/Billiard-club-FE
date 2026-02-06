/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getAllProducts,
  getProductById,
  getProductsPagination,
  updateProductById as updateProductByIdApi,
  createProduct as createProductApi,
  deleteProductById as deleteProductByIdApi,
} from "../api/product";
import type {
  ProductCreateRequest,
  ProductItem,
} from "../types/warehouse.type";

export const PRODUCTS_QUERY_KEY = {
  all: ["products"],
  pagination: (page?: number, limit?: number, category?: string) => [
    ...PRODUCTS_QUERY_KEY.all,
    page,
    limit,
    category,
  ],
  product: (id?: string) => [...PRODUCTS_QUERY_KEY.all, id],
} as const;

export const useProductPagination = (
  page: number = 1,
  limit: number = 10,
  category: string = "",
  id?: string,
) => {
  // const queryClient = useQueryClient();

  const { data: paginatedProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY.pagination(page, limit, category),
    queryFn: () => getProductsPagination(page, limit, category),
  });

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY.product(id as string),
    queryFn: () => getProductById(id as string),
    enabled: !!id,
  });

  return { paginatedProducts, product, isLoadingProducts, isLoadingProduct };
};

export const useProduct = (id?: string) => {
  const queryClient = useQueryClient();

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY.all,
    queryFn: getAllProducts,
  });

  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: PRODUCTS_QUERY_KEY.product(id as string),
    queryFn: () => getProductById(id as string),
    enabled: !!id,
  });

  const { mutate: createProduct, isPending: isCreatingProduct } = useMutation({
    mutationFn: ({ product }: { product: ProductCreateRequest }) => {
      return createProductApi(product);
    },
    onSuccess: (_, _variables) => {
      // Invalidate all queries related to products
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEY.all,
        refetchType: "all",
      });
    },
  });

  const { mutate: updateProduct, isPending: isUpdatingProduct } = useMutation({
    mutationFn: ({ id, product }: { id: string; product: ProductItem }) => {
      return updateProductByIdApi(id, product);
    },
    onSuccess: (_, _variables) => {
      // Invalidate all queries related to products
      queryClient.invalidateQueries({
        queryKey: PRODUCTS_QUERY_KEY.all,
        refetchType: "all",
      });
    },
  });

  const { mutate: deleteProductById, isPending: isDeletingProduct } =
    useMutation({
      mutationFn: (id: string) => {
        return deleteProductByIdApi(id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: PRODUCTS_QUERY_KEY.all,
          refetchType: "all",
        });
      },
    });

  return {
    products,
    product,
    updateProduct,
    isLoadingProducts,
    isLoadingProduct,
    isUpdatingProduct,
    createProduct,
    isCreatingProduct,
    deleteProductById,
    isDeletingProduct,
  };
};
