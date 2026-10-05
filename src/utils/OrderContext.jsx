import { createContext, useContext, useEffect, useState } from "react";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem("myshop_orders");

    if (savedOrders) {
      return JSON.parse(savedOrders);
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      "myshop_orders",
      JSON.stringify(orders)
    );
  }, [orders]);

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Date.now(),
      orderDate: new Date().toLocaleString("id-ID"),
      status: "Diproses",
    };

    setOrders((currentOrders) => [
      ...currentOrders,
      newOrder,
    ]);
  };

  const updateOrderStatus = (id, status) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
            }
          : order
      )
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error(
      "useOrder harus digunakan di dalam OrderProvider"
    );
  }

  return context;
}