import { createContext, useContext, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "./apiClient";

const ProductContext = createContext(null);

const resolveProductImageUrl = (img) => {
  if (!img) return null;
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }

  const customStorageUrl = import.meta.env.VITE_STORAGE_URL;
  if (customStorageUrl) {
    return `${customStorageUrl.replace(/\/+$/, "")}/${img.replace(/^\/+/, "")}`;
  }

  const rawApiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
  const backendBaseUrl = rawApiUrl.replace(/\/api\/?$/, "");
  return `${backendBaseUrl}/storage/${img.replace(/^\/+/, "")}`;
};

const normalizeProduct = (product) => ({
  ...product,
  id: product.product_id,
  category_name: product.category,
  img: resolveProductImageUrl(product.img),
});

const getProducts = async (params) => {
  const response = await apiClient.get("/products", {
    params: {
      page: params.page,
      limit: params.limit,
      keyword: params.keyword || undefined,
      category_id: params.categoryId || undefined,
    },
  });

  return {
    products: (response.data.data || []).map(normalizeProduct),
    pagination: response.data.meta || {},
  };
};

export function ProductProvider({ children }) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", page, limit, keyword, categoryId],
    queryFn: () =>
      getProducts({
        page,
        limit,
        keyword,
        categoryId,
      }),
    placeholderData: (previousData) => previousData,
  });

  const products = data?.products || [];
  const pagination = data?.pagination || {};

  const applyFilters = ({ keyword: newKeyword, categoryId: newCategoryId }) => {
    setKeyword(newKeyword ?? "");
    setCategoryId(newCategoryId ?? "");
    setPage(1);
  };

  const resetFilters = () => {
    setKeyword("");
    setCategoryId("");
    setPage(1);
  };

  const addMutation = useMutation({
    mutationFn: async (product) => {
      const formData = new FormData();

      Object.entries(product).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          key !== "category_name"
        ) {
          formData.append(
            key === "category" ? "category_id" : key,
            value
          );
        }
      });

      const response = await apiClient.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil ditambahkan");
    },
    onError: () => {
      toast.error("Gagal menambahkan produk");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, product }) => {
      const formData = new FormData();

      Object.entries(product).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          key !== "category_name"
        ) {
          formData.append(
            key === "category" ? "category_id" : key,
            value
          );
        }
      });

      const response = await apiClient.post(
        `/products/${id}?_method=PUT`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil diperbarui");
    },
    onError: () => {
      toast.error("Gagal memperbarui produk");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiClient.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil dihapus");
    },
    onError: () => {
      toast.error("Gagal menghapus produk");
    },
  });

  const addProduct = (product) => addMutation.mutateAsync(product);

  const updateProduct = (id, product) =>
    updateMutation.mutateAsync({ id, product });

  const deleteProduct = (id) => deleteMutation.mutateAsync(id);

  const reduceStock = async (cartItems) => {
    await Promise.all(
      cartItems.map((item) => {
        const currentProduct = products.find(
          (product) => product.id === item.id
        );

        if (!currentProduct) return Promise.resolve();

        return updateProduct(item.id, {
          stock: Math.max(0, currentProduct.stock - item.qty),
        });
      })
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        pagination,
        page,
        limit,
        keyword,
        categoryId,
        setPage,
        setLimit,
        setKeyword,
        setCategoryId,
        applyFilters,
        resetFilters,
        addProduct,
        updateProduct,
        deleteProduct,
        reduceStock,
        isLoading,
        isError,
        error,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProduct harus digunakan di dalam ProductProvider"
    );
  }

  return context;
}
