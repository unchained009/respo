import { motion } from 'framer-motion';

const SectionCard = ({ title, subtitle, action, children }) => (
  <motion.section 
    initial={{ y: 10, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    className="section-card"
  >
    <div className="section-card__header">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </motion.section>
);

export default SectionCard;
