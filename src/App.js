import React, { useState, useEffect, useRef } from 'react';
import { Search, Upload, Download, Plus, X, Save, Trash2, Edit2, History, ChevronRight } from 'lucide-react';

// --- CONFIG ---
// Change this to your deployed backend URL when publishing
const API_BASE = 'http://localhost:5000/api/products';

const App = () => {
  // --- STATE ---
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ name: '', category: '' });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Sidebar / History State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', brand: '', unit: 'pcs', stock: 0, image: ''
  });

  const fileInputRef = useRef(null);

  // --- API CALLS ---

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE}?${query}`);
      const data = await res.json();
      setProducts(data);

      // Extract unique categories for dropdown
      const uniqueCats = [...new Set(data.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCats);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/import`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      alert(`Imported: ${result.added}, Skipped: ${result.skipped}, Duplicates: ${result.duplicates.length}`);
      fetchProducts();
    } catch (error) {
      alert("Import failed");
    }
  };

  const handleExport = () => {
    window.open(`${API_BASE}/export`, '_blank');
  };

  // Add Single Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewProduct({ name: '', category: '', brand: '', unit: 'pcs', stock: 0, image: '' });
        fetchProducts();
        alert("Product added successfully!");
      } else {
        alert(data.error || "Failed to add product");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  // --- INLINE EDITING ---

  const handleEditClick = (product, e) => {
    e.stopPropagation(); // Prevent opening sidebar
    setEditId(product.id);
    setEditFormData({ ...product });
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditId(null);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API_BASE}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editFormData, changedBy: 'AdminUser' }), // Hardcoded user for demo
      });

      if (res.ok) {
        setEditId(null);
        fetchProducts();
        // If sidebar is open for this product, refresh history
        if (selectedProduct && selectedProduct.id === editId) {
          fetchHistory(editId);
        }
      } else {
        alert("Update failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // --- HISTORY SIDEBAR ---

  const fetchHistory = async (id) => {
    const res = await fetch(`${API_BASE}/${id}/history`);
    const data = await res.json();
    setHistoryLogs(data);
  };

  const handleRowClick = (product) => {
    if (editId !== null) return; // Don't open sidebar if editing
    setSelectedProduct(product);
    setIsSidebarOpen(true);
    fetchHistory(product.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex text-sm">
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'mr-80' : ''}`}>

        <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Inventory Manager</h1>
            <p className="text-gray-500 text-xs">Manage stock and track history</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition"
            >
              <Upload size={16} /> Import CSV
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition"
            >
              <Download size={16} /> Export
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        </header>

        <div className="p-6 pb-2">
          <div className="flex gap-4 bg-white p-4 rounded-lg border shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by product name..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </div>
            <select
              className="w-48 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="p-6 pt-4">
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-medium border-b">
                  <tr>
                    <th className="px-6 py-3">Image</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Brand</th>
                    <th className="px-6 py-3">Stock</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">Loading inventory...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-500">No products found. Try importing a CSV.</td></tr>
                  ) : (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        onClick={() => handleRowClick(product)}
                        className={`group hover:bg-blue-50 cursor-pointer transition ${selectedProduct?.id === product.id ? 'bg-blue-50' : ''}`}
                      >
                        {editId === product.id ? (
                          <>
                            <td className="px-6 py-4">
                              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Img</div>
                            </td>
                            <td className="px-6 py-4">
                              <input name="name" value={editFormData.name} onChange={handleInputChange} className="w-full border rounded px-2 py-1" />
                            </td>
                            <td className="px-6 py-4">
                              <input name="category" value={editFormData.category} onChange={handleInputChange} className="w-full border rounded px-2 py-1" />
                            </td>
                            <td className="px-6 py-4">
                              <input name="brand" value={editFormData.brand} onChange={handleInputChange} className="w-full border rounded px-2 py-1" />
                            </td>
                            <td className="px-6 py-4">
                              <input type="number" name="stock" value={editFormData.stock} onChange={handleInputChange} className="w-20 border rounded px-2 py-1" />
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-gray-400 text-xs">Auto-calc</span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                              <button onClick={handleSave} className="text-green-600 hover:bg-green-100 p-1 rounded"><Save size={16} /></button>
                              <button onClick={handleCancelEdit} className="text-red-500 hover:bg-red-100 p-1 rounded"><X size={16} /></button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-6 py-4">
                              {product.image ? (
                                <img src={product.image} alt="" className="w-10 h-10 object-cover rounded border" />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">N/A</div>
                              )}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                            <td className="px-6 py-4 text-gray-600">{product.category}</td>
                            <td className="px-6 py-4 text-gray-600">{product.brand}</td>
                            <td className="px-6 py-4 font-mono">{product.stock} <span className="text-gray-400 text-xs">{product.unit}</span></td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {product.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => handleEditClick(product, e)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Product</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  required
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newProduct.brand}
                    onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    required
                    type="number"
                    min="0"
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newProduct.stock}
                    onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newProduct.unit}
                    onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                    placeholder="e.g., pcs, kg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newProduct.image}
                  onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Right Sidebar (History) */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 z-20 border-l ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="h-full flex flex-col">
          <div className="p-5 border-b flex justify-between items-start bg-gray-50">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Product History</h2>
              <p className="text-sm text-gray-500 truncate w-60">{selectedProduct?.name}</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
              <History size={14} /> Recent Changes
            </h3>

            {historyLogs.length === 0 ? (
              <p className="text-gray-400 text-center italic mt-10">No history records found.</p>
            ) : (
              <div className="space-y-6">
                {historyLogs.map((log, index) => (
                  <div key={log.id} className="relative pl-4 border-l-2 border-gray-200">
                    <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-gray-200 rounded-full"></div>
                    <div className="text-xs text-gray-400 mb-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">{log.changedBy}</span> updated stock.
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-sm font-mono bg-gray-50 p-2 rounded border">
                      <span className="text-red-500">{log.oldStock}</span>
                      <ChevronRight size={14} className="text-gray-400" />
                      <span className="text-green-600 font-bold">{log.newStock}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;