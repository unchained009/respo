import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = ({ cart = [], onRemove, onClear, onSubmit, total = 0, isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000]"
        />
        <motion.aside 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-full max-w-[480px] bg-bg shadow-2xl z-[2001] flex flex-col"
        >
          <div className="p-8 border-b border-black/5 flex items-center justify-between bg-bg-elevated/50 backdrop-blur-md">
            <div>
                <h2 className="text-3xl font-black tracking-tight">Your Order</h2>
                <p className="text-sm text-muted font-bold uppercase tracking-widest mt-1">{cart.length} Items Selected</p>
            </div>
            <button onClick={onClose} className="btn-ghost !p-3">
               <span className="text-2xl">✕</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6">
            {cart.length > 0 ? (
              cart.map((item, idx) => (
                <div key={`${item._id}-${idx}`} className="flex items-center gap-4 bg-bg-elevated p-4 rounded-2xl border border-line shadow-sm">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-text">{item.name}</h4>
                    <p className="text-sm text-muted">Rs. {item.price} x {item.quantity}</p>
                  </div>
                  <button onClick={() => onRemove(idx)} className="text-danger p-2 hover:bg-danger/10 rounded-lg transition-colors">
                     🗑️
                  </button>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 opacity-40">
                <span className="text-6xl">🛒</span>
                <p className="text-xl font-bold">Your cart is empty.</p>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-8 bg-bg-elevated border-t border-line flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-muted uppercase tracking-widest">Total Amount</span>
                <span className="text-4xl font-black text-accent">Rs. {total}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={onClear} className="btn-secondary flex-1 py-5">Clear</button>
                <button onClick={onSubmit} className="btn-primary flex-[2] py-5 text-lg">Send to Kitchen</button>
              </div>
            </div>
          )}
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);

export default CartDrawer;
