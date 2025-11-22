import { useState } from 'react';
import { X } from 'lucide-react';

const AddProductModal = ({ isOpen, onClose, onRefresh }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    brand: '',
    unit: 'pcs',
    stock: 0,
    image: ''
  });

  if (!isOpen) return null;

  // Humans usually write a generic handler to avoid repeating code 6 times
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'stock' ? (parseInt(value) || 0) : value
    }));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('https://inventory-app-server-k5t8.onrender.com/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Clear form and close
        setForm({ name: '', category: '', brand: '', unit: 'pcs', stock: 0, image: '' });
        onRefresh();
        onClose();
        alert("Product added!");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      alert("Server error, check console");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={saveProduct} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Product Name</label>
            <input 
              required
              name="name"
              type="text" 
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={handleInput}
            />
          </div>
          
          {/* Category & Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
              <input 
                name="category"
                type="text" 
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                value={form.category}
                onChange={handleInput}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Brand</label>
              <input 
                name="brand"
                type="text" 
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                value={form.brand}
                onChange={handleInput}
              />
            </div>
          </div>

          {/* Stock & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Stock</label>
              <input 
                required
                name="stock"
                type="number" 
                min="0"
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                value={form.stock}
                onChange={handleInput}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
              <input 
                name="unit"
                type="text" 
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                value={form.unit}
                onChange={handleInput}
                placeholder="e.g. pcs"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Image URL</label>
            <input 
              name="image"
              type="text" 
              className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={form.image}
              onChange={handleInput}
              placeholder="https://..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 transition rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-white transition bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;