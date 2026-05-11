import StatusBadge from '../common/StatusBadge.jsx';

const OrderTable = ({ orders = [], onStatusChange, showActions = true }) => (
  <div className="w-full overflow-x-auto">
    <table className="w-full border-separate border-spacing-y-4">
      <thead>
        <tr>
          <th className="px-8 pb-4 text-left text-muted uppercase text-[0.9rem] font-extrabold tracking-wider">Order ID</th>
          <th className="px-8 pb-4 text-left text-muted uppercase text-[0.9rem] font-extrabold tracking-wider">Table / Source</th>
          <th className="px-8 pb-4 text-left text-muted uppercase text-[0.9rem] font-extrabold tracking-wider">Guest Details</th>
          <th className="px-8 pb-4 text-left text-muted uppercase text-[0.9rem] font-extrabold tracking-wider">Menu Items</th>
          <th className="px-8 pb-4 text-left text-muted uppercase text-[0.9rem] font-extrabold tracking-wider">Total</th>
          <th className="px-8 pb-4 text-left text-muted uppercase text-[0.9rem] font-extrabold tracking-wider">Live Status</th>
          <th className="px-8 pb-4 text-left text-muted uppercase text-[0.9rem] font-extrabold tracking-wider">Quick Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => (
            <tr key={order._id} className="group">
              <td className="p-8 bg-bg-elevated border-y border-line rounded-l-[24px] font-black text-accent text-lg">
                 #{order._id?.slice(-4).toUpperCase() || 'MOCK'}
              </td>
              <td className="p-8 bg-bg-elevated border-y border-line">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-text">{order.tableName || 'Delivery'}</span>
                  <span className="text-[0.7rem] opacity-60 font-medium">{order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'Just now'}</span>
                </div>
              </td>
              <td className="p-8 bg-bg-elevated border-y border-line">
                 <div className="flex flex-col gap-1">
                    <strong className="font-bold text-text">{order.customerName || 'Walk-in Guest'}</strong>
                    <span className="text-[0.75rem] text-muted font-medium">{order.customerPhone || 'Direct'}</span>
                 </div>
              </td>
              <td className="p-8 bg-bg-elevated border-y border-line text-[0.85rem] text-muted max-w-[250px] font-medium">
                 {(order.items || []).map(i => `${i.name} x${i.quantity}`).join(', ')}
              </td>
              <td className="p-8 bg-bg-elevated border-y border-line font-black text-text text-lg">
                 Rs. {order.totalAmount}
              </td>
              <td className="p-8 bg-bg-elevated border-y border-line">
                <StatusBadge status={order.status} />
              </td>
              <td className="p-8 bg-bg-elevated border-y border-line rounded-r-[24px]">
                {showActions ? (
                  <div className="flex gap-2 whitespace-nowrap">
                    {['preparing', 'served', 'completed'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="btn-ghost !text-[0.7rem] !px-2.5 !py-1.5"
                        onClick={() => onStatusChange(order._id, status)}
                        disabled={order.status === status}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center p-14 text-muted font-bold text-lg bg-bg-elevated/50 rounded-[24px]">
               No orders in the queue.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default OrderTable;
