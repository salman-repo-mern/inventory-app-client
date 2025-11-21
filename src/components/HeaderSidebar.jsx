import { History, ChevronRight, X } from 'lucide-react';

const HistorySidebar = ({ isOpen, onClose, product, logs = [] }) => {

  // Helper to keep the JSX clean and consistent
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div 
      className={`fixed inset-y-0 right-0 z-20 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out border-l ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        
        {/* Sidebar Header */}
        <div className="flex items-start justify-between p-5 border-b bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Product History</h2>
            <p className="text-sm text-gray-500 truncate w-60">
              {product?.name || 'Select a product'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 p-5 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6 text-xs font-bold tracking-wider text-gray-400 uppercase">
            <History size={14} /> 
            Recent Activity
          </div>

          {logs.length === 0 ? (
            <div className="mt-8 text-sm italic text-center text-gray-400">
              No history records found.
            </div>
          ) : (
            <div className="space-y-6">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-4 border-l-2 border-gray-200">
                  
                  {/* Timeline Dot */}
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 bg-gray-300 rounded-full" />
                  
                  {/* Timestamp */}
                  <div className="mb-1 text-xs text-gray-400">
                    {formatDate(log.timestamp)}
                  </div>
                  
                  {/* Action Text */}
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{log.changedBy}</span> updated stock.
                  </div>

                  {/* Old vs New Stock */}
                  <div className="flex items-center gap-3 p-2 mt-2 text-sm font-mono border rounded bg-gray-50">
                    <span className="text-red-500">{log.oldStock}</span>
                    <ChevronRight size={14} className="text-gray-400" />
                    <span className="font-bold text-green-600">{log.newStock}</span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorySidebar;