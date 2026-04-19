import { useEffect, useState } from 'react';

const initialState = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: '',
  isAvailable: true
};

const MenuItemForm = ({ categories, editingItem, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
        image: editingItem.image,
        category: editingItem.category?._id || editingItem.category,
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
    <form className="stack-form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Item name" value={formData.name} onChange={handleChange} required />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        rows="3"
      />
      <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
      <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
      <select name="category" value={formData.category} onChange={handleChange} required>
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <label className="checkbox-row">
        <input
          name="isAvailable"
          type="checkbox"
          checked={formData.isAvailable}
          onChange={handleChange}
        />
        Available for ordering
      </label>
      <div className="action-row">
        <button type="submit" className="primary-button">
          {editingItem ? 'Update Item' : 'Add Item'}
        </button>
        {editingItem ? (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default MenuItemForm;
