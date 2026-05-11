import { useEffect, useState } from 'react';
import OrderTable from '../../components/admin/OrderTable.jsx';
import SectionCard from '../../components/common/SectionCard.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { api } from '../../services/api.js';
import { createSocket } from '../../services/socket.js';

const OrdersPage = () => {
  const { restaurant } = useAdmin();
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const orderList = await api.getOrders();
      setOrders(orderList);
    } catch (error) {
      console.warn('Failed to load orders, using mock data.', error);
      setOrders([
        { _id: 'mock1', customerName: 'John Doe', totalAmount: 1200, status: 'completed', createdAt: new Date(), items: [{ name: 'Burger', quantity: 2 }] },
        { _id: 'mock2', customerName: 'Jane Smith', totalAmount: 850, status: 'preparing', createdAt: new Date(), items: [{ name: 'Pizza', quantity: 1 }] }
      ]);
    }
  };

  useEffect(() => {
    const restaurantId = restaurant?.id || restaurant?._id;
    if (!restaurantId) {
      return undefined;
    }

    loadOrders();

    const socket = createSocket();
    socket.emit('join:admin', restaurantId);
    socket.on('order:new', loadOrders);
    socket.on('order:updated', loadOrders);

    return () => {
      socket.disconnect();
    };
  }, [restaurant]);

  const handleStatusChange = async (orderId, status) => {
    await api.updateOrderStatus(orderId, status);
    await loadOrders();
  };

  return (
    <div className="grid gap-8">
      <header className="mb-8">
        <div>
          <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Live orders</p>
          <h2 className="text-4xl font-bold">Incoming Order Queue</h2>
        </div>
      </header>

      <SectionCard title="All Orders" subtitle="Accept, reject, or progress orders as the kitchen updates.">
        <OrderTable orders={orders} onStatusChange={handleStatusChange} />
      </SectionCard>
    </div>

  );
};

export default OrdersPage;
