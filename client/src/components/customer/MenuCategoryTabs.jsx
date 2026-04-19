const MenuCategoryTabs = ({ categories, activeCategoryId, onChange }) => (
  <div className="category-tabs">
    <button
      type="button"
      className={!activeCategoryId ? 'category-tab active' : 'category-tab'}
      onClick={() => onChange('')}
    >
      All
    </button>
    {categories.map((category) => (
      <button
        key={category._id}
        type="button"
        className={activeCategoryId === category._id ? 'category-tab active' : 'category-tab'}
        onClick={() => onChange(category._id)}
      >
        {category.name}
      </button>
    ))}
  </div>
);

export default MenuCategoryTabs;
