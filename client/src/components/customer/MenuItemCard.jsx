import { motion, AnimatePresence } from 'framer-motion';

const MenuItemCard = ({ item, onAdd, quantity = 0 }) => (
  <motion.article 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8 }}
    className="glass bg-bg-elevated p-6 rounded-[32px] flex flex-col gap-4 shadow-premium border-none relative group"
  >
    <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-2">
      <img 
        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'} 
        alt={item.name} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-4 right-4 bg-bg-elevated/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm">
        <span className="font-black text-accent">Rs. {item.price}</span>
      </div>
    </div>
    
    <div className="flex flex-col gap-2">
      <h4 className="text-xl font-bold text-text">{item.name}</h4>
      <p className="text-sm text-muted line-clamp-2 min-h-[40px] font-medium">{item.description}</p>
    </div>

    <div className="flex items-center justify-between mt-2 pt-4 border-t border-black/5">
      <div className="flex items-center gap-3">
        {quantity > 0 && (
          <span className="bg-accent text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-lg shadow-accent/20 animate-bounce">
            {quantity}
          </span>
        )}
      </div>
      <button 
        onClick={() => onAdd(item)}
        className="btn-primary !p-3 !rounded-xl !h-12 !w-12 !gap-0"
      >
        <span className="text-2xl">+</span>
      </button>
    </div>
  </motion.article>
);

export default MenuItemCard;
