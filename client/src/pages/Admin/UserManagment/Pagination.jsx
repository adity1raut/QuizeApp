import React from 'react';

const Pagination = ({ currentPage, totalPages, totalUsers, setCurrentPage }) => {
  return (
    <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Showing page <span className="font-medium text-white">{currentPage}</span> of{' '}
              <span className="font-medium text-white">{totalPages}</span>
              {totalUsers > 0 && (
                <span> ({totalUsers} total users)</span>
              )}
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-2 border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-600 bg-gray-800 text-sm font-medium text-gray-300">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-3 py-2 border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-600 bg-gray-700 text-xs font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Last
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;