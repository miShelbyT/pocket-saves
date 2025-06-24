import { useState } from 'react'

function AddLink({ handleAdd, toggleForm }) {

  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    tags: []
  }) 

  const handleChange = (e) => {
    setNewLink(prev => ({...prev, [e.target.name]: e.target.value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      handleAdd(newLink)
      console.log("success!")
      toggleForm()
    }
    catch(e) {
      console.error(e)
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-4 p-4 border rounded-xl shadow bg-white space-y-3"
      >
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={newLink.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">URL</label>
          <input
            type="url"
            name="url"
            value={newLink.url}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={toggleForm}
            className="text-sm px-3 py-1 text-gray-600 hover:text-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddLink
