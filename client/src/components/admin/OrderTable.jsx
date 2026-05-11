import StatusBadge from '../common/StatusBadge.jsx';

const OrderTable = ({ orders = [], onStatusChange, showActions = true }) => (
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Table / Source</th>
          <th>Guest Details</th>
          <th>Menu Items</th>
          <th>Total</th>
          <th>Live Status</th>
          <th>Quick Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => (
            <tr key={order._id}>
              <td style={{ fontWeight: 800, color: 'var(--accent)' }}>
                 #{order._id?.slice(-4).toUpperCase() || 'MOCK'}
              </td>
              <td>
                <div className="data-stack">
                  <span style={{ fontWeight: 700 }}>{order.tableName || 'Delivery'}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{order.createdAt ? new Date(order.createdAt).toLocaleTimeString() : 'Just now'}</span>
                </div>
              </td>
              <td>
                 <div className="data-stack">
                    <strong>{order.customerName || 'Walk-in Guest'}</strong>
                    <span style={{ fontSize: '0.75rem' }}>{order.customerPhone || 'Direct'}</span>
                 </div>
              </td>
              <td style={{ fontSize: '0.85rem', color: 'var(--muted)', maxWidth: '250px' }}>
                 {(order.items || []).map(i => `${i.name} x${i.quantity}`).join(', ')}
              </td>
              <td style={{ fontWeight: 800 }}>
                 Rs. {order.totalAmount}
              </td>
              <td>
                <StatusBadge status={order.status} />
              </td>
              <td>
                {showActions ? (
                  <div className="action-row" style={{ flexWrap: 'nowrap' }}>
                    {['preparing', 'served', 'completed'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        className="ghost-button"
                        style={{ fontSize: '0.7rem', padding: '6px 10px' }}
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
            <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
               No orders in the queue.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default OrderTable;
