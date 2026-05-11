import { motion } from 'framer-motion';

const MetricCard = ({ label, value, helper, primary = false }) => (
  <motion.article 
    whileHover={{ y: -20, scale: 1.03 }}
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className={`p-12 rounded-[56px] flex flex-col gap-4 transition-all duration-500 text-left relative overflow-hidden group ${
      primary 
        ? 'bg-gradient-to-br from-accent to-accent-strong text-white border-none shadow-premium' 
        : 'glass hover:border-accent'
    }`}
  >
    <p className={`text-[0.95rem] font-extrabold uppercase tracking-[0.15em] ${primary ? 'text-white/80' : 'text-muted'}`}>
      {label}
    </p>
    <h3 className={`font-black leading-none ${primary ? 'text-6xl lg:text-7xl' : 'text-5xl lg:text-6xl'}`}>
      {value}
    </h3>
    <span className={`text-base font-medium ${primary ? 'text-white/80' : 'text-muted'}`}>
      {helper}
    </span>
    {!primary && (
      <div className="absolute bottom-0 left-0 w-full h-2 bg-accent transform translate-y-full transition-transform duration-300 group-hover:translate-y-0" />
    )}
  </motion.article>
);

export default MetricCard;
