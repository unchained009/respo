const MenuCategoryTabs = ({ categories = [], activeCategory, onCategoryChange }) => (
  <div className="flex gap-4 overflow-x-auto pb-6 px-2 no-scrollbar">
    <button
      onClick={() => onCategoryChange(null)}
      className={`px-8 py-4 rounded-2xl font-extrabold whitespace-nowrap transition-all duration-300 border-2 shadow-sm ${
        activeCategory === null
          ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20 scale-105'
          : 'bg-bg-elevated border-line text-muted hover:border-accent/30 hover:text-accent'
      }`}
    >
      All Items
    </button>
    {categories.map((category) => (
      <button
        key={category._id}
        onClick={() => onCategoryChange(category._id)}
        className={`px-8 py-4 rounded-2xl font-extrabold whitespace-nowrap transition-all duration-300 border-2 shadow-sm ${
          activeCategory === category._id
            ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20 scale-105'
            : 'bg-bg-elevated border-line text-muted hover:border-accent/30 hover:text-accent'
        }`}
      >
        {category.name}
      </button>
    ))}
  </div>
);

export default MenuCategoryTabs;
