import { useOrder } from "../../utils/OrderContext";

export default function OrderManagement() {
  const { orders, updateOrderStatus } = useOrder();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Order Management
        </h1>

        <p className="text-gray-500 mt-1">
          Kelola pesanan pelanggan
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">
            Belum ada pesanan.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                <div>
                  <h2 className="font-bold text-lg">
                    Pesanan #{order.id}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {order.orderDate}
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrderStatus(
                      order.id,
                      e.target.value
                    )
                  }
                  className="border rounded-lg px-3 py-2"
                >
                  <option>Diproses</option>
                  <option>Dikemas</option>
                  <option>Dikirim</option>
                  <option>Selesai</option>
                </select>
              </div>

              <div className="border-t pt-4">
                <p>
                  <span className="font-semibold">
                    Pembeli:
                  </span>{" "}
                  {order.customerName}
                </p>

                <p>
                  <span className="font-semibold">
                    Alamat:
                  </span>{" "}
                  {order.address}
                </p>

                <p>
                  <span className="font-semibold">
                    Pembayaran:
                  </span>{" "}
                  {order.payment}
                </p>
              </div>

              <div className="border-t mt-4 pt-4">
                <h3 className="font-semibold mb-3">
                  Produk
                </h3>

                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between bg-gray-50 p-3 rounded"
                    >
                      <span>
                        {item.name} × {item.qty}
                      </span>

                      <span>
                        Rp{" "}
                        {(
                          item.price * item.qty
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                <span>Total</span>

                <span>
                  Rp {order.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}