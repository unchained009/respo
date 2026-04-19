import StatusBadge from '../common/StatusBadge.jsx';

const OrderTable = ({ orders, onStatusChange, showActions = true }) => (
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Source</th>
          <th>Customer</th>
          <th>Items</th>
          <th>Total</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order._id}>
            <td>{order._id.slice(-6)}</td>
            <td>
              <div className="data-stack">
                <strong>{order.sourceLabel || (order.tableName ? `Table ${order.tableNumber}` : 'Home Delivery')}</strong>
                <span>{order.orderType === 'delivery' ? 'Delivery order' : 'Dine-in order'}</span>
              </div>
            </td>
            <td>
              {order.orderType === 'delivery' ? (
                <div className="data-stack">
                  <strong>{order.customerName || 'Guest'}</strong>
                  <span>{order.customerPhone || 'No phone provided'}</span>
                  <span>{order.deliveryAddress || 'No address provided'}</span>
                </div>
              ) : (
                <div className="data-stack">
                  <strong>{order.tableName || 'Table order'}</strong>
                  <span>{order.tableNumber ? `Table #${order.tableNumber}` : 'Restaurant floor'}</span>
                </div>
              )}
            </td>
            <td>{order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}</td>
            <td>Rs. {order.totalAmount}</td>
            <td>
              <StatusBadge status={order.status} />
            </td>
            <td>
              {showActions ? (
                <div className="action-row">
                  {['accepted', 'rejected', 'preparing', 'served', 'completed'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      className="ghost-button"
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
        ))}
      </tbody>
    </table>
  </div>
);

export default OrderTable;
