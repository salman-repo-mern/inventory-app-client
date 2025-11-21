import { X, Save, Trash2, Edit2 } from 'lucide-react';

const ProductRow = ({ 
  product, 
  isEditing, 
  isSelected, 
  editFormData, 
  onRowClick, 
  onEditClick, 
  onDeleteClick, 
  onSave, 
  onCancel, 
  onInputChange 
}) => {

  // Extract these to keep the return block clean and readable
  const handleEdit = (e) => {
    e.stopPropagation(); // Stop the row click from firing
    onEditClick(product);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteClick(product.id);
  };

  // --- EDIT MODE ---
  if (isEditing) {
    return (
      <tr className="bg-blue-50">
        <td className="px-6 py-4">
          <div className="flex items-center justify-center w-10 h-10 text-xs text-gray-500 bg-gray-200 rounded">
            Img
          </div>
        </td>
        <td className="px-6 py-4">
          <input 
            name="name" 
            value={editFormData.name} 
            onChange={onInputChange} 
            className="w-full px-2 py-1 border rounded outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </td>
        <td className="px-6 py-4">
          <input 
            name="category" 
            value={editFormData.category} 
            onChange={onInputChange} 
            className="w-full px-2 py-1 border rounded outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </td>
        <td className="px-6 py-4">
          <input 
            name="brand" 
            value={editFormData.brand} 
            onChange={onInputChange} 
            className="w-full px-2 py-1 border rounded outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </td>
        <td className="px-6 py-4">
          <input 
            type="number" 
            name="stock" 
            value={editFormData.stock} 
            onChange={onInputChange} 
            className="w-24 px-2 py-1 border rounded outline-none focus:ring-1 focus:ring-blue-500" 
          />
        </td>
        <td className="px-6 py-4">
          <span className="text-xs text-gray-400">Auto-calc</span>
        </td>
        <td className="px-6 py-4 space-x-2 text-right">
          <button onClick={onSave} className="p-1 text-green-600 rounded hover:bg-green-100">
            <Save size={16} />
          </button>
          <button onClick={onCancel} className="p-1 text-red-500 rounded hover:bg-red-100">
            <X size={16} />
          </button>
        </td>
      </tr>
    );
  }

  // --- VIEW MODE ---
  const statusColor = product.status === 'In Stock' 
    ? 'bg-green-100 text-green-700' 
    : 'bg-red-100 text-red-700';

  return (
    <tr 
      onClick={() => onRowClick(product)}
      className={`group hover:bg-blue-50 cursor-pointer transition border-b last:border-b-0 ${
        isSelected ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <td className="px-6 py-4">
        {product.image ? (
          <img src={product.image} alt={product.name} className="object-cover w-10 h-10 border rounded" />
        ) : (
          <div className="flex items-center justify-center w-10 h-10 text-xs text-gray-400 bg-gray-100 rounded">
            N/A
          </div>
        )}
      </td>
      
      <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
      <td className="px-6 py-4 text-gray-600">{product.category}</td>
      <td className="px-6 py-4 text-gray-600">{product.brand}</td>
      
      <td className="px-6 py-4 font-mono text-gray-700">
        {product.stock} <span className="text-xs text-gray-400">{product.unit}</span>
      </td>
      
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {product.status}
        </span>
      </td>
      
      {/* Actions (Hidden until hover) */}
      <td className="px-6 py-4 text-right transition-opacity opacity-0 group-hover:opacity-100">
        <div className="flex justify-end gap-2">
          <button 
            onClick={handleEdit}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductRow;