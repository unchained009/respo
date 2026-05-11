import { motion } from 'framer-motion';

const LoadingScreen = ({ title = 'Loading respo...', message = 'Preparing your experience.', compact = false }) => (
  <div className={compact ? 'loading-screen loading-screen--compact' : 'loading-screen'}>
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="loading-screen__panel"
    >
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        className="loading-spinner" 
        aria-hidden="true" 
      />
      <h2>{title}</h2>
      <p>{message}</p>
    </motion.div>
  </div>
);

export default LoadingScreen;
