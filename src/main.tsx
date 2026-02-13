import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthContextProvider } from './contexts/AuthContext.tsx'
import SignIn from './pages/SignIn/SignIn.tsx'
import { Header } from './components/Header/Header.tsx'
import { GeminiContextProvider } from './contexts/GeminiContext.tsx'
import { Applications } from './pages/Applications/Applications.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <GeminiContextProvider>
        <Header />
        <SignIn />
        <Applications />
      </GeminiContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
