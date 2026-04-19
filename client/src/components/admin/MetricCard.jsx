const MetricCard = ({ label, value, helper }) => (
  <article className="metric-card">
    <p>{label}</p>
    <h3>{value}</h3>
    <span>{helper}</span>
  </article>
);

export default MetricCard;
