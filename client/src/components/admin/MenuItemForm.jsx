import { useEffect, useState } from 'react';

const initialState = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: '',
  isAvailable: true
};

const MenuItemForm = ({ categories = [], editingItem, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
        image: editingItem.image,
        category: editingItem.category?._id || editingItem.category || '',
        isAvailable: editingItem.isAvailable
      });
    } else {
      setFormData(initialState);
    }
  }, [editingItem]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price)
    });
    setFormData(initialState);
  };

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
            <label className="text-[0.75rem] font-extrabold text-accent uppercase tracking-widest">Item Name</label>
            <input name="name" className="input-base" placeholder="e.g. Signature Burger" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="grid gap-2">
            <label className="text-[0.75rem] font-extrabold text-accent uppercase tracking-widest">Category</label>
            <select name="category" className="input-base" value={formData.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
      </div>

      <div className="grid gap-2">
          <label className="text-[0.75rem] font-extrabold text-accent uppercase tracking-widest">Description</label>
          <textarea
            name="description"
            className="input-base"
            placeholder="Describe your delicious item..."
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
            <label className="text-[0.75rem] font-extrabold text-accent uppercase tracking-widest">Price (Rs.)</label>
            <input name="price" className="input-base" type="number" placeholder="450" value={formData.price} onChange={handleChange} required />
        </div>
        <div className="grid gap-2">
            <label className="text-[0.75rem] font-extrabold text-accent uppercase tracking-widest">Image URL</label>
            <input name="image" className="input-base" placeholder="https://images.unsplash.com/..." value={formData.image} onChange={handleChange} />
        </div>
      </div>

      <div className="flex items-center gap-3 py-2">
        <input
          name="isAvailable"
          type="checkbox"
          className="w-6 h-6 rounded-lg accent-accent border-black/5"
          checked={formData.isAvailable}
          onChange={handleChange}
        />
        <label className="font-bold text-text">Item is available for ordering</label>
      </div>

      <div className="flex gap-4 pt-2">
        <button type="submit" className="btn-primary flex-1 h-[60px] text-lg">
          {editingItem ? 'Update Item' : 'Add Menu Item'}
        </button>
        {editingItem && (
          <button type="button" className="btn-secondary flex-1 h-[60px] text-lg" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default MenuItemForm;
