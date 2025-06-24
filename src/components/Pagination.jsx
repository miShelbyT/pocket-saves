export default function Pagination({ currentPage, totalPages, onPageChange, linksPerPage, updateLinksPerPage }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  
  return (
    <>
      {/* Customize pagination */}

      <div className="flex items-center justify-end gap-2 p-4">
        <label htmlFor="linksPerPage" className="text-sm text-gray-600">
          Links per page:
        </label>
        <select
          id="linksPerPage"
          value={linksPerPage}
          onChange={(e) => {
            const updatedLPP = Number(e.target.value)
            updateLinksPerPage(updatedLPP) 
            onPageChange(1) // reset to first page when page size changes
          }}
          className="border border-gray-300 rounded px-2 py-1 text-sm shadow-sm hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {[10, 15, 20, 25].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <nav className="flex flex-wrap justify-center space-x-2 py-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
        >
          Previous
        </button>
        {pages.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-1 rounded ${
              currentPage === num
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
        >
          Next
        </button>
      </nav>
    </>
  )
}
