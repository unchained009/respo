import { motion } from 'framer-motion';

const LoadingScreen = ({ title = 'Loading respo...', message = 'Preparing your experience.', compact = false }) => (
  <div className={`flex items-center justify-center bg-bg min-h-screen ${compact ? 'h-auto py-12' : 'fixed inset-0 z-[9999]'}`}>
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass p-14 rounded-[56px] text-center flex flex-col items-center gap-8 shadow-premium border-none bg-bg-elevated"
    >
      <div className="relative">
        <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-16 border-4 border-accent/10 border-t-accent rounded-full shadow-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-text tracking-tight">{title}</h2>
        <p className="text-muted font-medium">{message}</p>
      </div>
    </motion.div>
  </div>
);

export default LoadingScreen;
