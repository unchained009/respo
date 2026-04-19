import { useEffect, useState } from 'react';
import MetricCard from '../../components/admin/MetricCard.jsx';
import OrderTable from '../../components/admin/OrderTable.jsx';
import SectionCard from '../../components/common/SectionCard.jsx';
import { useAdmin } from '../../context/AdminContext.jsx';
import { api } from '../../services/api.js';
import { createSocket } from '../../services/socket.js';

const DashboardPage = () => {
  const { restaurant } = useAdmin();
  const [analytics, setAnalytics] = useState({
    salesToday: 0,
    allTimeSales: 0,
    orderCount: 0,
    menuItemCount: 0,
    tableCount: 0,
    topSellingItems: []
  });
  const [orders, setOrders] = useState([]);

  const loadData = async () => {
    const [summary, orderList] = await Promise.all([api.getAnalyticsSummary(), api.getOrders()]);
    setAnalytics(summary);
    setOrders(orderList.slice(0, 6));
  };

  useEffect(() => {
    if (!restaurant?._id) {
      return undefined;
    }

    loadData();

    const socket = createSocket();
    socket.emit('join:admin', restaurant._id);

    socket.on('order:new', loadData);
    socket.on('order:updated', loadData);

    return () => {
      socket.disconnect();
    };
  }, [restaurant?._id]);

  const handleStatusChange = async (orderId, status) => {
    await api.updateOrderStatus(orderId, status);
    await loadData();
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Live overview</p>
          <h2>Operations Dashboard</h2>
        </div>
      </header>

      <div className="metric-grid">
        <MetricCard label="Sales Today" value={`Rs. ${analytics.salesToday}`} helper="Accepted and completed orders" />
        <MetricCard label="All-Time Sales" value={`Rs. ${analytics.allTimeSales}`} helper="Revenue across all orders" />
        <MetricCard label="Total Orders" value={analytics.orderCount} helper="Orders in this restaurant workspace" />
        <MetricCard label="Menu Items" value={analytics.menuItemCount} helper="Live items currently sellable" />
        <MetricCard
          label="Top Item"
          value={analytics.topSellingItems[0]?._id || 'No sales yet'}
          helper={analytics.topSellingItems[0] ? `${analytics.topSellingItems[0].quantitySold} sold` : 'Waiting for orders'}
        />
      </div>

      <SectionCard title="Workspace Snapshot" subtitle="Credentials and tenant details for this restaurant.">
        <div className="top-item-list">
          <article className="top-item-card">
            <h4>{restaurant?.restaurantCode}</h4>
            <p>Restaurant code</p>
            <span>Plan: {restaurant?.subscriptionPlan?.replace('_', ' ')}</span>
          </article>
          <article className="top-item-card">
            <h4>{restaurant?.adminCode}</h4>
            <p>Admin ID</p>
            <span>Use this ID to sign in securely</span>
          </article>
          <article className="top-item-card">
            <h4>{analytics.tableCount}</h4>
            <p>Tables configured</p>
            <span>Every table has its own secure QR access token</span>
          </article>
        </div>
      </SectionCard>

      <SectionCard title="Recent Orders" subtitle="New orders appear here in real time.">
        <OrderTable orders={orders} onStatusChange={handleStatusChange} />
      </SectionCard>

      <SectionCard title="Top Selling Items" subtitle="Simple sales ranking from completed order data.">
        <div className="top-item-list">
          {analytics.topSellingItems.map((item) => (
            <article key={item._id} className="top-item-card">
              <h4>{item._id}</h4>
              <p>{item.quantitySold} sold</p>
              <span>Revenue: Rs. {item.revenue}</span>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default DashboardPage;
