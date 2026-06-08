import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx'
import { ThemeProvider } from './context/ThemeContext';
import { Provider } from 'react-redux';
import { store } from './store/store';
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
import './styles/theme.css'
import './styles/flyout.css'
import './styles/modal.css'
import './styles/forms.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
