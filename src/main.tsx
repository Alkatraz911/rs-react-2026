import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx'
import './styles/main.css';
import './styles/layout.css';
import './styles/search.css';
import './styles/card.css';
import './styles/helpers.css';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
