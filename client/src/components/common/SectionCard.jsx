import { motion } from 'framer-motion';

const SectionCard = ({ title, subtitle, action, children }) => (
  <motion.section 
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    className="glass p-10 lg:p-14 rounded-[56px] mb-12 shadow-premium border-none bg-bg-elevated/70"
  >
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl lg:text-4xl font-black text-text tracking-tight">{title}</h2>
        {subtitle ? <p className="text-muted text-lg font-medium max-w-[600px]">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex-shrink-0">{action}</div> : null}
    </div>
    <div className="relative z-10">
        {children}
    </div>
  </motion.section>
);

export default SectionCard;
