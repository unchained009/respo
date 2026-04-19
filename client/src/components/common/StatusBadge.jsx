const STATUS_COLORS = {
  pending: 'status pending',
  accepted: 'status accepted',
  preparing: 'status preparing',
  served: 'status served',
  completed: 'status completed',
  rejected: 'status rejected'
};

const StatusBadge = ({ status }) => <span className={STATUS_COLORS[status] || 'status'}>{status}</span>;

export default StatusBadge;
