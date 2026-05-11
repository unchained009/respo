import { useEffect, useState } from 'react';
import MenuItemForm from '../../components/admin/MenuItemForm.jsx';
import SectionCard from '../../components/common/SectionCard.jsx';
import { api } from '../../services/api.js';

const MenuManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', sortOrder: 0 });
  const [editingItem, setEditingItem] = useState(null);

  const loadData = async () => {
    try {
      const [categoryList, menuItems] = await Promise.all([api.getCategories(), api.getMenu()]);
      setCategories(categoryList);
      setItems(menuItems);
    } catch (error) {
      console.warn('Failed to load menu data, using mock defaults.', error);
      setCategories([
        { _id: 'cat1', name: 'Main Course' },
        { _id: 'cat2', name: 'Beverages' }
      ]);
      setItems([
        { _id: 'item1', name: 'Signature Burger', description: 'Juicy beef patty with secret sauce.', price: 450, category: { name: 'Main Course' }, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
        { _id: 'item2', name: 'Vanilla Milkshake', description: 'Creamy vanilla goodness.', price: 250, category: { name: 'Beverages' }, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500' }
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    await api.createCategory({
      ...categoryForm,
      sortOrder: Number(categoryForm.sortOrder)
    });
    setCategoryForm({ name: '', description: '', sortOrder: 0 });
    await loadData();
  };

  const handleMenuSubmit = async (payload) => {
    if (editingItem) {
      await api.updateMenuItem(editingItem._id, payload);
      setEditingItem(null);
    } else {
      await api.createMenuItem(payload);
    }

    await loadData();
  };

  return (
    <div className="grid gap-8">
      <header className="mb-8">
        <div>
          <p className="text-[0.75rem] font-extrabold text-accent uppercase tracking-[0.2em] mb-4 block">Menu studio</p>
          <h2 className="text-4xl font-bold">Menu & Category Management</h2>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <SectionCard title="Create Category" subtitle="Organize items for the customer menu.">
          <form className="grid gap-4" onSubmit={handleCategorySubmit}>
            <input
              className="input-base"
              placeholder="Category name"
              value={categoryForm.name}
              onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
            <textarea
              className="input-base h-auto py-4"
              placeholder="Description"
              rows="3"
              value={categoryForm.description}
              onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))}
            />
            <input
              className="input-base"
              type="number"
              placeholder="Sort order"
              value={categoryForm.sortOrder}
              onChange={(event) => setCategoryForm((current) => ({ ...current, sortOrder: event.target.value }))}
            />
            <button type="submit" className="btn-primary">
              Add Category
            </button>
          </form>

          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((category) => (
              <span key={category._id} className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-bold">
                {category.name}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={editingItem ? 'Edit Item' : 'Add Menu Item'} subtitle="Manage names, prices, images, and availability.">
          <MenuItemForm
            categories={categories}
            editingItem={editingItem}
            onSubmit={handleMenuSubmit}
            onCancel={() => setEditingItem(null)}
          />
        </SectionCard>
      </div>

      <SectionCard title="Current Menu" subtitle="Tap edit to refine any item.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <article key={item._id} className="glass p-6 rounded-3xl flex flex-col gap-4">
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-2xl" />
              <div>
                <h4 className="font-bold text-lg m-0">{item.name}</h4>
                <p className="text-sm text-muted m-0 line-clamp-2">{item.description}</p>
                <span className="text-xs text-accent uppercase font-bold tracking-widest">
                  {item.category?.name} • Rs. {item.price}
                </span>
              </div>
              <div className="flex gap-2 mt-auto">
                <button type="button" className="btn-ghost flex-1" onClick={() => setEditingItem(item)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-ghost text-danger hover:bg-danger/10 hover:text-danger flex-1"
                  onClick={async () => {
                    await api.deleteMenuItem(item._id);
                    await loadData();
                  }}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>

  );
};

export default MenuManagementPage;
