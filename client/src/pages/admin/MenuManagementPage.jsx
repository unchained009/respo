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
    const [categoryList, menuItems] = await Promise.all([api.getCategories(), api.getMenu()]);
    setCategories(categoryList);
    setItems(menuItems);
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
    <div className="page-stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Menu studio</p>
          <h2>Menu & Category Management</h2>
        </div>
      </header>

      <div className="two-column-grid">
        <SectionCard title="Create Category" subtitle="Organize items for the customer menu.">
          <form className="stack-form" onSubmit={handleCategorySubmit}>
            <input
              placeholder="Category name"
              value={categoryForm.name}
              onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
            <textarea
              placeholder="Description"
              rows="3"
              value={categoryForm.description}
              onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))}
            />
            <input
              type="number"
              placeholder="Sort order"
              value={categoryForm.sortOrder}
              onChange={(event) => setCategoryForm((current) => ({ ...current, sortOrder: event.target.value }))}
            />
            <button type="submit" className="primary-button">
              Add Category
            </button>
          </form>

          <div className="chip-list">
            {categories.map((category) => (
              <span key={category._id} className="chip">
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
        <div className="menu-admin-grid">
          {items.map((item) => (
            <article key={item._id} className="menu-admin-card">
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <span>
                  {item.category?.name} • Rs. {item.price}
                </span>
              </div>
              <div className="action-row">
                <button type="button" className="ghost-button" onClick={() => setEditingItem(item)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="ghost-button danger"
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
