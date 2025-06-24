import { useEffect, useState, useRef } from 'react'
import { useDebounce } from './hooks/useDebounce'
import LinkGrid from './components/LinkGrid'
import Header from './components/Header'
import AddLink from './components/AddLink'
import Pagination from './components/Pagination'
import {
  fetchLinks,
  addLink,
  deleteLink,
  editLink,
} from './services/linkService.js'

function App() {
  const [allLinks, setAllLinks] = useState([])
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

  // Fetch all links on component mount
  useEffect(() => {
    fetchLinks()
      .then((data) => {
        const updatedData = data.map(({ id, title, url, tags }) => {
          if (title === url) return { id, title: '(No Title)', url, tags }
          else return { id, title, url, tags }
        })
        setAllLinks(updatedData)
      })
      .catch(console.error)
  }, [])

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
      ({ title, url, tags }) =>
        title.toLowerCase().includes(query) ||
        url.toLowerCase().includes(query) ||
        tags.includes(query)
    )

    setFilteredLinks(filtered)
    setCurrentPage(1) // reset pagination when search changes
  }, [debouncedSearchTerm, allLinks])

  // slicing visible links array
  useEffect(() => {
    if (!filteredLinks.length) {
      setVisibleLinks(filteredLinks)
      return
    }

    const previous = prevLPP.current
    const current = linksPerPage

    const start = (currentPage - 1) * current
    const end = currentPage * current

    if (current < previous) {
      // Step 1: Keep all previous tiles temporarily
      const temp = filteredLinks.slice(start, start + previous)

      // Step 2: Mark the *extra* tiles with `fadingOut: true`
      const marked = temp.map((link, idx) =>
        idx >= current ? { ...link, fadingOut: true } : link
      )

      setVisibleLinks(marked)

      // Step 3: After animation delay, remove extra tiles
      setTimeout(() => {
        setVisibleLinks(filteredLinks.slice(start, end))
      }, 300) // fadeOut duration
    } else {
      const base = filteredLinks.slice(start, start + previous)
      const incoming = filteredLinks.slice(start + previous, end)
      const animated = [
        ...base,
        ...incoming.map((link) => ({ ...link, animate: 'fadeIn' })),
      ]
      setVisibleLinks(animated)
    }

    prevLPP.current = current
  }, [filteredLinks, linksPerPage, currentPage])

  // Create a new link
  const handleAdd = async (link) => {
    try {
      const created = await addLink(link)
      setAllLinks((prev) => [...prev, created])
    } catch (e) {
      console.error(e)
    }
  }

  // Delete a link by id
  const handleDelete = async (id) => {
    try {
      await deleteLink(id)
      setAllLinks((prev) => prev.filter((link) => link.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  // add tags to an existing link
  const handleUpdate = async (id, newTags) => {
    try {
      const updated = await editLink(id, newTags)
      setAllLinks((prev) =>
        prev.map((link) => {
          if (link.id === id) return updated
          else return link
        })
      )
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <Header toggleForm={toggleForm} />

      {showForm && <AddLink handleAdd={handleAdd} toggleForm={toggleForm}/>}

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title or URL, or tags..."
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <LinkGrid
        links={visibleLinks}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />

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
