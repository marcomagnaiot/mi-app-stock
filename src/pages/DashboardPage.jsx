import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNotas } from '../hooks/useNotas'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { NotaCard } from '../components/notas/NotaCard'
import { CrearEditarNota } from '../components/notas/CrearEditarNota'

export function DashboardPage() {
  const { user, signOut, getUserData } = useAuth()
  const { notas, loading, eliminarNota, crearNotasPrueba, obtenerEstadisticas, cargarNotas } = useNotas()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredNotas, setFilteredNotas] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [notaToEdit, setNotaToEdit] = useState(null)
  const [stats, setStats] = useState(null)

  const userData = getUserData()

  // Filtrar notas basado en búsqueda
  useEffect(() => {
    if (!searchTerm) {
      setFilteredNotas(notas)
    } else {
      const filtered = notas.filter(nota =>
        nota.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nota.contenido.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredNotas(filtered)
    }
  }, [notas, searchTerm])

  // Cargar estadísticas
  useEffect(() => {
    if (user) {
      loadStats()
    }
  }, [user, notas])

  const loadStats = async () => {
    const result = await obtenerEstadisticas()
    if (result.success) {
      setStats(result.data)
    }
  }

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await signOut()
    }
  }

  const handleEditNota = (nota) => {
    setNotaToEdit(nota)
    setModalOpen(true)
  }

  const handleDeleteNota = async (id) => {
    await eliminarNota(id)
  }

  const handleCreateTestNotes = async () => {
    if (window.confirm('¿Quieres crear notas de prueba? (Solo si no tienes notas creadas)')) {
      await crearNotasPrueba()
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setNotaToEdit(null)
  }

  const handleNotaSuccess = async () => {
    // Recargar notas y estadísticas después de crear/editar
    await cargarNotas()
    await loadStats()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Cargando notas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Mis Notas</h1>
                <p className="text-sm text-gray-500">Bienvenido, {userData?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
                {userData?.provider === 'google' && (
                  <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    </svg>
                    Google
                  </span>
                )}
                {userData?.emailConfirmed && (
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verificado
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Notas</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.total_notas}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Última Actividad</p>
                  <p className="text-sm text-gray-900">
                    {stats.nota_mas_reciente 
                      ? new Date(stats.nota_mas_reciente).toLocaleDateString('es-ES')
                      : 'Sin actividad'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <p className="text-sm text-green-600 font-medium">Conectado</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Buscar notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex space-x-3">
            {notas.length === 0 && (
              <Button
                variant="outline"
                onClick={handleCreateTestNotes}
              >
                Crear Notas de Prueba
              </Button>
            )}
            <Button
              onClick={() => setModalOpen(true)}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Nota
            </Button>
          </div>
        </div>

        {/* Notas Grid */}
        {filteredNotas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotas.map((nota) => (
              <NotaCard
                key={nota.id}
                nota={nota}
                onEdit={handleEditNota}
                onDelete={handleDeleteNota}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron notas' : 'No tienes notas aún'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Comienza creando tu primera nota'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setModalOpen(true)}>
                Crear Primera Nota
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Modal para crear/editar notas */}
      <CrearEditarNota
        isOpen={modalOpen}
        onClose={handleModalClose}
        nota={notaToEdit}
        onSuccess={handleNotaSuccess}
      />
    </div>
  )
}
