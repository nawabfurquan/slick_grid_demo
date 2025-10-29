import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Import SlickGrid styles
import '@slickgrid-universal/common/dist/styles/css/slickgrid-theme-material.css'

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import MockDataStoreProvider from './utils/MockDataStore.tsx';
    
ModuleRegistry.registerModules([ AllCommunityModule ]);


createRoot(document.getElementById('root')!).render(
    <MockDataStoreProvider>
    <App />
    </MockDataStoreProvider>
)
