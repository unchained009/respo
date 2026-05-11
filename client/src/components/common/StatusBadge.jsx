const STATUS_STYLES = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  accepted: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  preparing: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  served: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-[0.75rem] font-black border tracking-wider shadow-sm transition-all duration-300 ${STATUS_STYLES[status] || 'bg-slate-500/10 text-slate-600 border-slate-500/20'}`}>
    {status?.toUpperCase()}
  </span>
);

export default StatusBadge;
