import ProductRow from './ProductRow';

const ProductTable = ({ 
  products, 
  loading, 
  selectedProduct, 
  editId, 
  editFormData, 
  handlers 
}) => {

  // Unpack handlers for cleaner JSX
  const { 
    onRowClick, 
    onEditClick, 
    onDeleteClick, 
    onSave, 
    onCancelEdit, 
    onInputChange 
  } = handlers;

  return (
    <div className="p-6 pt-4">
      <div className="overflow-hidden bg-white border rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Header */}
            <thead className="text-xs font-medium text-gray-600 uppercase border-b bg-gray-50">
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

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No products found. Try importing a CSV.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    isEditing={editId === product.id}
                    isSelected={selectedProduct?.id === product.id}
                    editFormData={editFormData}
                    
                    // Pass handlers individually
                    onRowClick={onRowClick}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    onSave={onSave}
                    onCancel={onCancelEdit}
                    onInputChange={onInputChange}
                  />
                ))
              )}
            </tbody>
            
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;