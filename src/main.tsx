import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Import SlickGrid styles
import '@slickgrid-universal/common/dist/styles/css/slickgrid-theme-material.css'


createRoot(document.getElementById('root')!).render(
    <App />
)
