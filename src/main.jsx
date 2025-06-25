import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LinksProvider } from './context/LinksContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LinksProvider>
      <App />
    </LinksProvider>
  </StrictMode>
)
