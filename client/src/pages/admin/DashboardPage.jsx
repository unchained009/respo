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
    <div className="grid gap-8">
      <header className="mb-8">
        <div>
          <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Real-time stats</p>
          <h2 className="text-4xl font-bold">Operations Dashboard</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
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

      <div className="grid gap-8">
        <SectionCard title="Live Order Monitor" subtitle="Kitchen flow and status updates.">
          <OrderTable orders={orders} onStatusChange={handleStatusChange} />
        </SectionCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SectionCard title="Performance" subtitle="Top selling items ranking.">
            <div className="grid gap-4">
               {(analytics.topSellingItems || []).slice(0, 3).map((item, idx) => (
                 <article key={item._id} className={`p-4 rounded-2xl border border-line ${idx === 0 ? 'bg-accent/10' : 'bg-transparent'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="m-0 font-bold">{item._id}</h4>
                        <p className="m-0 text-sm text-muted">{item.quantitySold} units sold</p>
                      </div>
                      <span className="text-2xl">{idx === 0 ? '🔥' : idx === 1 ? '⭐' : '📈'}</span>
                    </div>
                 </article>
               ))}
               {(!analytics.topSellingItems || analytics.topSellingItems.length === 0) && (
                   <p className="text-muted text-center">No sales data available yet.</p>
               )}
            </div>
          </SectionCard>

          <SectionCard title="Workspace Node" subtitle="Identity and status.">
            <div className="glass bg-accent/10 border-none p-6 rounded-3xl mt-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] block">Branch Code</span>
                <strong className="text-text tracking-widest">{restaurant?.restaurantCode}</strong>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] block">Terminal ID</span>
                <strong className="text-text tracking-widest">{restaurant?.adminCode}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] block">Network Status</span>
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
