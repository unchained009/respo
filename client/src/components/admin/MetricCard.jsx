import { motion } from 'framer-motion';

const MetricCard = ({ label, value, helper, primary = false }) => (
  <motion.article 
    whileHover={{ y: -8, scale: 1.02 }}
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={`metric-card ${primary ? 'metric-card--primary' : ''}`}
  >
    <p>{label}</p>
    <h3>{value}</h3>
    <span>{helper}</span>
  </motion.article>
);

export default MetricCard;
