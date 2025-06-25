import { createContext, useContext, useEffect, useState } from 'react'
import {
  fetchLinks,
  addLink,
  deleteLink,
  updateLink,
} from '../services/linkService'

const LinksContext = createContext()

export function LinksProvider({ children }) {
  const [allLinks, setAllLinks] = useState([])

  useEffect(() => {
    fetchLinks()
      .then((data) => {
        const updatedData = data.map(({ id, title, url, tags }) => {
          if (title === url) return { id, title: '(No Title)', url, tags }
          else return { id, title, url, tags }
        })
        setAllLinks(updatedData)
      })
      .catch((err) => console.error('Error fetching links:', err))
  }, [])

  // Optional: wrap service methods with state updates
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

  const handleUpdate = async (id, data) => {
    try {
      const updated = await updateLink(id, data)
      updated.title = (updated.title === updated.url) ? "(No Title)" : updated.title
      setAllLinks((prev) =>
        prev.map((link) => (link.id === id ? updated : link))
      )
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <LinksContext.Provider
      value={{
        allLinks,
        setAllLinks,
        handleAdd,
        handleDelete,
        handleUpdate,
      }}
    >
      {children}
    </LinksContext.Provider>
  )
}

// Hook for easy use
export function useLinks() {
  return useContext(LinksContext)
}
