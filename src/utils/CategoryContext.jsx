
import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "./apiClient";

const CategoryContext = createContext(null);

const getCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data.data || [];
};

export function CategoryProvider({ children }) {
  const queryClient = useQueryClient();

  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const addMutation = useMutation({
    mutationFn: async (category) => {
      const response = await apiClient.post("/categories", {
        category,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil ditambahkan");
    },
    onError: () => {
      toast.error("Gagal menambahkan kategori");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, category }) => {
      const response = await apiClient.put(`/categories/${id}`, {
        category,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil diperbarui");
    },
    onError: () => {
      toast.error("Gagal memperbarui kategori");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiClient.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Kategori berhasil dihapus");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Gagal menghapus kategori"
      );
    },
  });

  return (
    <CategoryContext.Provider
      value={{
        categories,
        addCategory: (category) => addMutation.mutateAsync(category),
        updateCategory: (id, category) =>
          updateMutation.mutateAsync({ id, category }),
        deleteCategory: (id) => deleteMutation.mutateAsync(id),
        isLoading,
        isError,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error("useCategory harus digunakan di dalam CategoryProvider");
  }

  return context;
}