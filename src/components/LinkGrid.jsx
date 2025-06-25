import LinkTile from './LinkTile'

const LinkGrid = ({ links }) => {
  if (links.length === 0) {
    return <p className="text-gray-500 text-center">No links to display</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {links.map((link, idx) => {
        const classes = [
          'transition-opacity duration-300',
          link.animate === 'fadeIn' ? 'animate-fadeIn' : '',
          link.fadingOut ? 'opacity-0 animate-fadeOut' : 'opacity-100',
        ].join(' ')

        return (
          <div key={link.id} className={classes}>
            <LinkTile link={link}/>
          </div>
        )
      })}
    </div>
  )
}

export default LinkGrid
