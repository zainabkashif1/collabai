import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { AuthProvider } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import { ProjectsProvider } from './context/ProjectsContext'
import { ApplicationsProvider } from './context/ApplicationsContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* reducedMotion="user" makes every Motion animation in the app
        automatically respect the OS-level "reduce motion" accessibility
        setting — one line here instead of a manual check in every
        component that animates. */}
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            {/* ProfileProvider reads accessToken from AuthContext, so it
                has to nest inside AuthProvider, not beside it. */}
            <ProfileProvider>
              <ProjectsProvider>
                <ApplicationsProvider>
                  <App />
                </ApplicationsProvider>
              </ProjectsProvider>
            </ProfileProvider>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </MotionConfig>
  </StrictMode>,
)
