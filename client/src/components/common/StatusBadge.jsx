const STATUS_COLORS = {
  pending: 'status pending',
  accepted: 'status accepted',
  preparing: 'status preparing',
  served: 'status served',
  completed: 'status completed',
  rejected: 'status rejected'
};

const StatusBadge = ({ status }) => (
  <span className={STATUS_COLORS[status] || 'status'} style={{ fontWeight: 700, letterSpacing: '0.02em' }}>
    {status?.toUpperCase()}
  </span>
);

export default StatusBadge;
