import { useEffect, useState } from 'react';
import MetricCard from '../../components/admin/MetricCard.jsx';
import OrderTable from '../../components/admin/OrderTable.jsx';
import SectionCard from '../../components/common/SectionCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
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
    try {
      const [summary, orderList] = await Promise.all([
        api.getAnalyticsSummary().catch(() => ({})),
        api.getOrders().catch(() => [])
      ]);
      
      setAnalytics({
        salesToday: summary.salesToday || 0,
        allTimeSales: summary.allTimeSales || 0,
        orderCount: summary.orderCount || 0,
        menuItemCount: summary.menuItemCount || 0,
        tableCount: summary.tableCount || 0,
        topSellingItems: summary.topSellingItems || []
      });
      setOrders(Array.isArray(orderList) ? orderList.slice(0, 6) : []);
    } catch (error) {
      console.error('Dashboard data load failed', error);
    }
  };

  useEffect(() => {
    const restaurantId = restaurant?.id || restaurant?._id;
    if (!restaurantId) return;

    loadData();

    // Fallback data for demo if stats are empty
    if (restaurant?.restaurantCode === 'RESPO-DEMO') {
        setAnalytics({
            salesToday: 12450,
            allTimeSales: 450000,
            orderCount: 1240,
            menuItemCount: 42,
            tableCount: 15,
            topSellingItems: [
              { _id: 'Classic Burger', quantitySold: 150, revenue: 45000 },
              { _id: 'Pasta Carbonara', quantitySold: 120, revenue: 38000 },
              { _id: 'Iced Latte', quantitySold: 200, revenue: 30000 }
            ]
        });
        setOrders([
            { _id: 'mock1', customerName: 'John Doe', totalAmount: 1200, status: 'completed', createdAt: new Date().toISOString(), items: [{ name: 'Burger', quantity: 2 }] },
            { _id: 'mock2', customerName: 'Jane Smith', totalAmount: 850, status: 'preparing', createdAt: new Date().toISOString(), items: [{ name: 'Pizza', quantity: 1 }] }
        ]);
    }

    const socket = createSocket();
    socket.emit('join:admin', restaurantId);
    socket.on('order:new', loadData);
    socket.on('order:updated', loadData);

    return () => { socket.disconnect(); };
  }, [restaurant]);

  const handleStatusChange = async (orderId, status) => {
    try {
        await api.updateOrderStatus(orderId, status);
        await loadData();
    } catch (e) {
        console.error('Status change failed', e);
    }
  };

  return (
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Real-time stats</p>
          <h2 style={{ fontSize: '2.5rem' }}>Operations Dashboard</h2>
        </div>
      </header>

      <div className="metric-grid">
        <MetricCard 
          label="Revenue Today" 
          value={`Rs. ${analytics.salesToday}`} 
          helper="Live kitchen sales" 
          primary={true}
        />
        <MetricCard 
          label="Total Volume" 
          value={`Rs. ${analytics.allTimeSales}`} 
          helper="Lifetime workspace revenue" 
        />
        <MetricCard 
          label="Active Orders" 
          value={Array.isArray(orders) ? orders.filter(o => o.status !== 'completed' && o.status !== 'rejected').length : 0} 
          helper="Orders in progress" 
        />
        <MetricCard 
          label="Inventory" 
          value={`${analytics.menuItemCount} Items`} 
          helper="Live menu items" 
        />
      </div>

      <div className="page-stack">
        <SectionCard title="Live Order Monitor" subtitle="Kitchen flow and status updates.">
          <OrderTable orders={orders} onStatusChange={handleStatusChange} />
        </SectionCard>

        <div className="two-column-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <SectionCard title="Performance" subtitle="Top selling items ranking.">
            <div className="top-item-list" style={{ gridTemplateColumns: '1fr', display: 'grid', gap: '16px' }}>
               {(analytics.topSellingItems || []).slice(0, 3).map((item, idx) => (
                 <article key={item._id} className="top-item-card" style={{ background: idx === 0 ? 'var(--accent-soft)' : 'transparent', border: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: 0 }}>{item._id}</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>{item.quantitySold} units sold</p>
                      </div>
                      <span style={{ fontSize: '1.5rem' }}>{idx === 0 ? '🔥' : idx === 1 ? '⭐' : '📈'}</span>
                    </div>
                 </article>
               ))}
               {(!analytics.topSellingItems || analytics.topSellingItems.length === 0) && (
                   <p style={{ color: 'var(--muted)', textAlign: 'center' }}>No sales data available yet.</p>
               )}
            </div>
          </SectionCard>

          <SectionCard title="Workspace Node" subtitle="Identity and status.">
            <div className="admin-user-card" style={{ background: 'var(--accent-soft)', border: 'none', padding: '24px' }}>
              <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="eyebrow" style={{ margin: 0 }}>Branch Code</span>
                <strong style={{ letterSpacing: '0.05em' }}>{restaurant?.restaurantCode}</strong>
              </div>
              <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="eyebrow" style={{ margin: 0 }}>Terminal ID</span>
                <strong style={{ letterSpacing: '0.05em' }}>{restaurant?.adminCode}</strong>
              </div>
              <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="eyebrow" style={{ margin: 0 }}>Network Status</span>
                <StatusBadge status="completed" />
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
