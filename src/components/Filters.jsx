import { Search } from 'lucide-react';

const Filters = ({ filters, setFilters, categories }) => {
  
  // Helper to avoid repeating the spread syntax in the JSX
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 pb-2">
      <div className="flex gap-4 p-4 bg-white border rounded-lg shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute text-gray-400 left-3 top-2.5" size={18} />
          <input
            type="text"
            placeholder="Search by product name..."
            className="w-full py-2 pl-10 pr-4 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filters.name}
            onChange={(e) => updateFilter('name', e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <select 
          className="w-48 px-3 py-2 bg-white border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

      </div>
    </div>
  );
};

export default Filters;