import { useState, useRef, useEffect } from 'react'
import { Tag } from 'lucide-react'
import { useLinks } from "../context/LinksContext";

export default function LinkTile({ link }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [newTags, setNewTags] = useState(link.tags.join(", "))

  const { handleDelete, handleUpdate } = useLinks()
  const inputRef = useRef(null);
  const imgUrl = `https://picsum.photos/seed/${link.id}/600/400`

  useEffect(() => {
  if (showTagModal && inputRef.current) {
    inputRef.current.focus();
  }
}, [showTagModal]);

  const handleTagSubmit = (e) => {
    e.preventDefault()
    const tagsToAdd = newTags
      .split(',')
      .map((tag) => tag.toLowerCase().trim())
      .filter(Boolean) // remove empty strings

    const updatedTags = Array.from(
      new Set(tagsToAdd)
    )
    try {
      handleUpdate(link.id, updatedTags)
      setNewTags(updatedTags.join(", "))
      setShowTagModal(false)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div
      className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl duration-300 border border-gray-200 transition"
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '200px',
      }}
    >
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition" />

      {/* Text overlay */}
      <div className="relative z-10 p-4 flex flex-col justify-end h-full text-white">
        <h2 className="text-lg font-semibold drop-shadow">{link.title}</h2>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm  mt-3 text-blue-300 underline break-words hover:text-blue-100"
        >
          {link.url}
        </a>
        <div className="text-sm mt-3 text-purple-200">
          {link.tags.join(" | ")}
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="absolute top-2 right-2 z-30 bg-white/70 hover:bg-red-100 text-red-600 border border-red-200 rounded-full p-2 shadow-md transition duration-200"
        aria-label="Delete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M3 6h18v2H3V6zm2 3h14l-1.5 12.5a1.5 1.5 0 01-1.5 1.5H8a1.5 1.5 0 01-1.5-1.5L5 9zM10 4h4v2h-4V4z" />
        </svg>
      </button>

      {/* Add tags */}
      <button
        onClick={() => setShowTagModal(true)}
        className="absolute z-30 bottom-2 right-2 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-all duration-150 text-sm font-medium"
      >
        <Tag size={16} className="stroke-[2]" />
        <span>Edit Tags</span>
      </button>

      {showTagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4">
              Add tags for: <span className="text-blue-600">{link.title}</span>
            </h2>
            <form onSubmit={handleTagSubmit} className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="e.g. vegan, recipes, dinner"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTagModal(false)}
                  className="text-gray-600 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Tags
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-xs text-center">
            <p className="mb-4 text-gray-800 font-semibold">
              Are you sure you want to delete this link?
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => {
                  handleDelete(link.id)
                  setShowConfirm(false)
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
