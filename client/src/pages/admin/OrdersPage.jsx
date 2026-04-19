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
    const orderList = await api.getOrders();
    setOrders(orderList);
  };

  useEffect(() => {
    if (!restaurant?._id) {
      return undefined;
    }

    loadOrders();

    const socket = createSocket();
    socket.emit('join:admin', restaurant._id);
    socket.on('order:new', loadOrders);
    socket.on('order:updated', loadOrders);

    return () => {
      socket.disconnect();
    };
  }, [restaurant?._id]);

  const handleStatusChange = async (orderId, status) => {
    await api.updateOrderStatus(orderId, status);
    await loadOrders();
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Live orders</p>
          <h2>Incoming Order Queue</h2>
        </div>
      </header>

      <SectionCard title="All Orders" subtitle="Accept, reject, or progress orders as the kitchen updates.">
        <OrderTable orders={orders} onStatusChange={handleStatusChange} />
      </SectionCard>
    </div>
  );
};

export default OrdersPage;
