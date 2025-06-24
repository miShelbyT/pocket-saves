const BASE_URL = 'http://localhost:4000/links'

// GET all links
export async function fetchLinks() {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Failed to fetch links')
  return res.json()
}

// POST new link
export async function addLink(newLink) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newLink),
  })
  return res.json()
}

// DELETE link
export async function deleteLink(id) {
  return fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
}
