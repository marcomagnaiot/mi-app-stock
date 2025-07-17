import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import './index.css'

function AuthCallback() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [showMessage, setShowMessage] = React.useState('Procesando autenticación...')
  
  React.useEffect(() => {
    let mounted = true
    
    const processAuth = async () => {
      // SI AÚN ESTÁ CARGANDO, NO HACER NADA
      if (loading) {
        setShowMessage('Procesando autenticación...')
        return
      }
      
      // AHORA SÍ, loading = false, podemos procesar
      if (user) {
        // USUARIO AUTENTICADO ✅
        console.log('Usuario autenticado correctamente:', user.email)
        setShowMessage('¡Autenticación exitosa! Accediendo al sistema...')
        
        // Pequeña pausa para mostrar el mensaje de éxito
        await new Promise(resolve => setTimeout(resolve, 800))
        
        if (mounted) {
          console.log('Redirigiendo al dashboard...')
          navigate('/dashboard', { replace: true })
        }
      } else {
        // NO HAY USUARIO ❌
        console.log('No se pudo autenticar el usuario')
        setShowMessage('Error de autenticación. Redirigiendo...')
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (mounted) {
          navigate('/login', { replace: true })
        }
      }
    }
    
    processAuth()
    
    return () => {
      mounted = false
    }
  }, [user, loading, navigate]) // Se ejecuta cuando user o loading cambian

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {loading ? (
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : user ? (
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
        </div>
        <p className="text-lg font-medium text-gray-900 mb-2">{showMessage}</p>
        <p className="text-sm text-gray-500">
          {loading ? 'Verificando credenciales...' : 
           user ? 'Acceso confirmado' : 'Verifica tu conexión'}
        </p>
      </div>
    </div>
  )
}

function AppRouter() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Inicializando aplicación...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route 
        path="/login" 
        element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/register" 
        element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirecciones */}
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
      
      {/* Ruta 404 */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">404 - Página No Encontrada</h1>
              <p className="text-gray-600 mb-6">La página que buscas no existe.</p>
              <a 
                href="/dashboard" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Volver al Dashboard
              </a>
            </div>
          </div>
        } 
      />
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
)
