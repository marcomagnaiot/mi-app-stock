import { useState, useEffect } from 'react'
import { useNotas } from '../../hooks/useNotas'
import { useAuth } from '../../hooks/useAuth'

export function EstadisticasNotas() {
  const { notas, obtenerEstadisticas } = useNotas()
  const { user } = useAuth()
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('mes')

  useEffect(() => {
    if (user) {
      cargarEstadisticas()
    }
  }, [user, notas])

  const cargarEstadisticas = async () => {
    setLoading(true)
    try {
      const result = await obtenerEstadisticas()
      if (result.success) {
        setEstadisticas(result.data)
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular estadísticas adicionales basadas en las notas
  const calcularEstadisticasDetalladas = () => {
    if (!notas || notas.length === 0) return null

    const ahora = new Date()
    const hace7Dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
    const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000)

    const notasUltimos7Dias = notas.filter(nota => 
      new Date(nota.created_at) >= hace7Dias
    )
    const notasUltimos30Dias = notas.filter(nota => 
      new Date(nota.created_at) >= hace30Dias
    )

    // Calcular palabras totales
    const palabrasTotales = notas.reduce((total, nota) => {
      const palabras = (nota.titulo + ' ' + (nota.contenido || '')).split(/\s+/).filter(p => p.length > 0)
      return total + palabras.length
    }, 0)

    // Calcular promedio de palabras por nota
    const promedioPalabras = notas.length > 0 ? Math.round(palabrasTotales / notas.length) : 0

    // Encontrar la nota más larga
    const notaMasLarga = notas.reduce((max, nota) => {
      const palabras = (nota.titulo + ' ' + (nota.contenido || '')).split(/\s+/).filter(p => p.length > 0)
      return palabras.length > max.palabras ? { nota, palabras: palabras.length } : max
    }, { nota: null, palabras: 0 })

    // Actividad por día de la semana
    const actividadPorDia = Array(7).fill(0)
    notas.forEach(nota => {
      const dia = new Date(nota.created_at).getDay()
      actividadPorDia[dia]++
    })

    // Actividad por hora del día
    const actividadPorHora = Array(24).fill(0)
    notas.forEach(nota => {
      const hora = new Date(nota.created_at).getHours()
      actividadPorHora[hora]++
    })

    return {
      notasUltimos7Dias: notasUltimos7Dias.length,
      notasUltimos30Dias: notasUltimos30Dias.length,
      palabrasTotales,
      promedioPalabras,
      notaMasLarga,
      actividadPorDia,
      actividadPorHora
    }
  }

  // Obtener actividad por período
  const obtenerActividadPorPeriodo = (periodo) => {
    if (!notas || notas.length === 0) return []

    const ahora = new Date()
    const datos = []

    if (periodo === 'semana') {
      // Últimos 7 días
      for (let i = 6; i >= 0; i--) {
        const fecha = new Date(ahora.getTime() - i * 24 * 60 * 60 * 1000)
        const notasDelDia = notas.filter(nota => {
          const fechaNota = new Date(nota.created_at)
          return fechaNota.toDateString() === fecha.toDateString()
        })
        datos.push({
          fecha: fecha.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
          notas: notasDelDia.length
        })
      }
    } else if (periodo === 'mes') {
      // Últimos 30 días
      for (let i = 29; i >= 0; i--) {
        const fecha = new Date(ahora.getTime() - i * 24 * 60 * 60 * 1000)
        const notasDelDia = notas.filter(nota => {
          const fechaNota = new Date(nota.created_at)
          return fechaNota.toDateString() === fecha.toDateString()
        })
        datos.push({
          fecha: fecha.getDate().toString(),
          notas: notasDelDia.length
        })
      }
    }

    return datos
  }

  const estadisticasDetalladas = calcularEstadisticasDetalladas()
  const datosActividad = obtenerActividadPorPeriodo(selectedPeriod)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!estadisticas && !estadisticasDetalladas) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay estadísticas disponibles</h3>
          <p className="text-gray-500">Crea algunas notas para ver tus estadísticas</p>
        </div>
      </div>
    )
  }

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Notas</p>
              <p className="text-2xl font-semibold text-gray-900">{estadisticas?.total_notas || notas.length}</p>
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
              <p className="text-sm font-medium text-gray-500">Últimos 7 días</p>
              <p className="text-2xl font-semibold text-gray-900">{estadisticasDetalladas?.notasUltimos7Dias || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Palabras Totales</p>
              <p className="text-2xl font-semibold text-gray-900">{estadisticasDetalladas?.palabrasTotales || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Promedio por Nota</p>
              <p className="text-2xl font-semibold text-gray-900">{estadisticasDetalladas?.promedioPalabras || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Actividad */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Actividad de Notas</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedPeriod('semana')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedPeriod === 'semana'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              7 días
            </button>
            <button
              onClick={() => setSelectedPeriod('mes')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                selectedPeriod === 'mes'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              30 días
            </button>
          </div>
        </div>
        
        {datosActividad.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-end space-x-2 h-40">
              {datosActividad.map((dato, index) => {
                const maxNotas = Math.max(...datosActividad.map(d => d.notas))
                const altura = maxNotas > 0 ? (dato.notas / maxNotas) * 100 : 0
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gray-200 rounded-t-md relative" style={{ height: '120px' }}>
                      <div
                        className="bg-blue-500 rounded-t-md absolute bottom-0 w-full transition-all duration-300"
                        style={{ height: `${altura}%` }}
                      />
                      {dato.notas > 0 && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                          {dato.notas}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{dato.fecha}</div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay datos de actividad para mostrar</p>
          </div>
        )}
      </div>

      {/* Actividad por Día de la Semana */}
      {estadisticasDetalladas && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Actividad por Día de la Semana</h3>
          <div className="grid grid-cols-7 gap-4">
            {estadisticasDetalladas.actividadPorDia.map((cantidad, index) => {
              const maxActividad = Math.max(...estadisticasDetalladas.actividadPorDia)
              const porcentaje = maxActividad > 0 ? (cantidad / maxActividad) * 100 : 0
              
              return (
                <div key={index} className="text-center">
                  <div className="text-sm font-medium text-gray-900 mb-2">{diasSemana[index]}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{cantidad}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Información Adicional */}
      {estadisticasDetalladas && estadisticasDetalladas.notaMasLarga.nota && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Datos Destacados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-900">Nota más extensa</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                "{estadisticasDetalladas.notaMasLarga.nota.titulo}"
              </p>
              <p className="text-xs text-gray-500">
                {estadisticasDetalladas.notaMasLarga.palabras} palabras
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-900">Última actividad</span>
              </div>
              <p className="text-sm text-gray-600">
                {estadisticas?.nota_mas_reciente 
                  ? new Date(estadisticas.nota_mas_reciente).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'No hay actividad reciente'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
