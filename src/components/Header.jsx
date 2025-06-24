import { Link as LinkIcon } from 'lucide-react'

function Header({ toggleForm }) {
  return (
    <div className="flex justify-around">
      <h1 className="text-3xl font-bold text-center text-purple-600">
        📚 Saved Pocket Links
      </h1>

      <button
        onClick={() => toggleForm()}
        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline transition-all duration-150 text-sm font-medium"
      >
        <LinkIcon size={18} className="stroke-[2]" />
        <span>Add Link</span>
      </button>
    </div>
  )
}

export default Header
