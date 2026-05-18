import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx'
// import './App.css'
import './styles/main.css';
import './styles/layout.css';
import './styles/search.css';
import './styles/card.css';
import './styles/helpers.css';
import './styles/pagination.css';
import './styles/navbar.css';
import './styles/notFoundPage.css';
import './styles/aboutPage.css';

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
)
