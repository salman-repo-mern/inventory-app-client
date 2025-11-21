import { useRef } from 'react';
import { Upload, Download, Plus } from 'lucide-react';

const Header = ({ onImport, onExport, onAddClick }) => {
  const fileRef = useRef(null);

  // Simple wrapper to trigger the hidden input
  const handleImportClick = () => {
    fileRef.current?.click();
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b">
      
      {/* App Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Inventory Manager</h1>
        <p className="text-xs text-gray-500">Manage stock and track history</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        
        {/* Hidden input for file selection */}
        <input 
          ref={fileRef} 
          type="file" 
          accept=".csv" 
          onChange={onImport} 
          className="hidden" 
        />

        <button 
          onClick={handleImportClick}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 transition bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Upload size={16} /> 
          Import CSV
        </button>

        <button 
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 text-gray-700 transition bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Download size={16} /> 
          Export
        </button>

        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 text-white transition bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
        >
          <Plus size={16} /> 
          Add Product
        </button>
      </div>
    </header>
  );
};

export default Header;