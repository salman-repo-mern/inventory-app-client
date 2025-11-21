import { useRef } from 'react';
import { Upload, Download, Plus } from 'lucide-react';

const Header = ({ onImport, onExport, onAddClick }) => {
  const fileRef = useRef(null);

  const handleImportClick = () => {
    fileRef.current?.click();
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b">
      
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Inventory Manager
        </h1>
        <p className="text-sm text-blue-600 font-medium">
          Manage stock and track history
        </p>
      </div>



      <div className="flex items-center gap-3">
        
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