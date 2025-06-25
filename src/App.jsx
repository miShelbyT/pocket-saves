import { useEffect, useState, useRef } from 'react'
import { useDebounce } from './hooks/useDebounce'
import LinkGrid from './components/LinkGrid'
import Header from './components/Header'
import AddLink from './components/AddLink'
import Pagination from './components/Pagination'
import { useLinks } from "./context/LinksContext";

function App() {
  
  const [filteredLinks, setFilteredLinks] = useState([])
  const [visibleLinks, setVisibleLinks] = useState([])

  const [showForm, setShowForm] = useState(false)

  const [searchQuery, setSearchQuery] = useState(
    localStorage.getItem('searchQuery' || '')
  )
  const debouncedSearchTerm = useDebounce(searchQuery, 300) // 300ms delay

  const [currentPage, setCurrentPage] = useState(
    () => Number(localStorage.getItem('currentPage')) || 1
  )
  const [linksPerPage, setLinksPerPage] = useState(
    () => Number(localStorage.getItem('linksPerPage')) || 10
  )

  const { allLinks } = useLinks()

  const toggleForm = () => {
    setShowForm((prev) => !prev)
  }

  const prevLPP = useRef(linksPerPage)

  const totalPages = Math.ceil(filteredLinks.length / linksPerPage)

  // setting up links setter function to send to Pagination component
  const updateLinksPerPage = (x) => {
    localStorage.setItem('linksPerPage', x)
    setLinksPerPage(x)
  }

  // current page setter function to send to Pagination component
  const updateCurrentPage = (x) => {
    localStorage.setItem('currentPage', x)
    setCurrentPage(x)
  }


  // setting and clearing local storage
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim() === '') {
      localStorage.removeItem('searchQuery')
    } else {
      localStorage.setItem('searchQuery', debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  //filter
  useEffect(() => {
    const query = debouncedSearchTerm.toLowerCase()

    const filtered = allLinks.filter(
      ({ title = '', url = '', tags = [] }) =>
        title.toLowerCase().includes(query) ||
        url.toLowerCase().includes(query) ||
        tags.some((tag) => tag.toLowerCase().includes(query))
    )

    setFilteredLinks(filtered)
    setCurrentPage(1) // reset pagination when search changes
  }, [debouncedSearchTerm, allLinks])

  // slicing visible links array
useEffect(() => {
  const previous = prevLPP.current;
  const current = linksPerPage;

  const maxIndex = filteredLinks.length - 1;
  const start = Math.min((currentPage - 1) * current, maxIndex);
  const end = Math.min(currentPage * current, filteredLinks.length);

  const safeSlice = (arr, s, e) => arr.slice(s, e).filter(Boolean);

  if (current < previous) {
    const temp = safeSlice(filteredLinks, start, start + previous);
    const marked = temp.map((link, idx) =>
      idx >= current ? { ...link, fadingOut: true } : link
    );
    setVisibleLinks(marked);
    setTimeout(() => {
      setVisibleLinks(safeSlice(filteredLinks, start, end));
    }, 300);
  } else {
    const base = safeSlice(filteredLinks, start, start + previous);
    const incoming = safeSlice(filteredLinks, start + previous, end);
    const animated = [
      ...base,
      ...incoming.map((link) => ({ ...link, animate: "fadeIn" })),
    ];
    setVisibleLinks(animated);
  }

  prevLPP.current = current;
}, [filteredLinks, linksPerPage, currentPage]);


  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <Header toggleForm={toggleForm} />

      {showForm && <AddLink toggleForm={toggleForm} />}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title or URL, or tags..."
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <LinkGrid links={visibleLinks} />

      <Pagination
        currentPage={currentPage}
        onPageChange={updateCurrentPage}
        totalPages={totalPages}
        linksPerPage={linksPerPage}
        updateLinksPerPage={updateLinksPerPage}
      />
    </main>
  )
}

export default App
