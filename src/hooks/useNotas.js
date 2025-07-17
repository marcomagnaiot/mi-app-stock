import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './useAuth'

export function useNotas() {
  const { user } = useAuth()
  const [notas, setNotas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar notas del usuario
  const cargarNotas = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('notas_usuario')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error

      setNotas(data || [])
    } catch (error) {
      console.error('Error al cargar notas:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Crear nueva nota
  const crearNota = async (titulo, contenido = '') => {
    if (!user) return { success: false, error: 'No hay usuario autenticado' }

    try {
      setError(null)

      const { data, error } = await supabase
        .from('notas_usuario')
        .insert([
          {
            user_id: user.id,
            titulo: titulo.trim(),
            contenido: contenido.trim()
          }
        ])
        .select()

      if (error) throw error

      // Agregar la nueva nota al estado local
      setNotas(prev => [data[0], ...prev])

      return {
        success: true,
        data: data[0],
        message: 'Nota creada exitosamente'
      }
    } catch (error) {
      console.error('Error al crear nota:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Actualizar nota existente
  const actualizarNota = async (id, titulo, contenido = '') => {
    if (!user) return { success: false, error: 'No hay usuario autenticado' }

    try {
      setError(null)

      const { data, error } = await supabase
        .from('notas_usuario')
        .update({
          titulo: titulo.trim(),
          contenido: contenido.trim()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()

      if (error) throw error

      if (data.length === 0) {
        throw new Error('No se pudo actualizar la nota')
      }

      // Actualizar la nota en el estado local
      setNotas(prev => prev.map(nota => 
        nota.id === id ? data[0] : nota
      ))

      return {
        success: true,
        data: data[0],
        message: 'Nota actualizada exitosamente'
      }
    } catch (error) {
      console.error('Error al actualizar nota:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Eliminar nota
  const eliminarNota = async (id) => {
    if (!user) return { success: false, error: 'No hay usuario autenticado' }

    try {
      setError(null)

      const { error } = await supabase
        .from('notas_usuario')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      // Eliminar la nota del estado local
      setNotas(prev => prev.filter(nota => nota.id !== id))

      return {
        success: true,
        message: 'Nota eliminada exitosamente'
      }
    } catch (error) {
      console.error('Error al eliminar nota:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Buscar notas por texto
  const buscarNotas = async (textoBusqueda) => {
    if (!user) return { success: false, error: 'No hay usuario autenticado' }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .rpc('buscar_notas', {
          usuario_id: user.id,
          texto_busqueda: textoBusqueda
        })

      if (error) throw error

      return {
        success: true,
        data: data || [],
        message: `Se encontraron ${data?.length || 0} notas`
      }
    } catch (error) {
      console.error('Error al buscar notas:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    } finally {
      setLoading(false)
    }
  }

  // Obtener una nota específica
  const obtenerNota = async (id) => {
    if (!user) return { success: false, error: 'No hay usuario autenticado' }

    try {
      setError(null)

      const { data, error } = await supabase
        .from('notas_usuario')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Nota obtenida exitosamente'
      }
    } catch (error) {
      console.error('Error al obtener nota:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Obtener estadísticas del usuario
  const obtenerEstadisticas = async () => {
    if (!user) return { success: false, error: 'No hay usuario autenticado' }

    try {
      setError(null)

      const { data, error } = await supabase
        .rpc('obtener_estadisticas_usuario', {
          usuario_id: user.id
        })

      if (error) throw error

      return {
        success: true,
        data: data[0] || {
          total_notas: 0,
          nota_mas_reciente: null,
          nota_mas_antigua: null
        },
        message: 'Estadísticas obtenidas exitosamente'
      }
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Crear notas de prueba
  const crearNotasPrueba = async () => {
    if (!user) return { success: false, error: 'No hay usuario autenticado' }

    try {
      setError(null)

      const { error } = await supabase
        .rpc('crear_notas_prueba', {
          usuario_id: user.id
        })

      if (error) throw error

      // Recargar notas después de crear las de prueba
      await cargarNotas()

      return {
        success: true,
        message: 'Notas de prueba creadas exitosamente'
      }
    } catch (error) {
      console.error('Error al crear notas de prueba:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Obtener resumen de contenido
  const obtenerResumen = (contenido, maxLength = 100) => {
    if (!contenido) return ''
    if (contenido.length <= maxLength) return contenido
    return contenido.substring(0, maxLength) + '...'
  }

  // Cargar notas cuando el usuario cambie
  useEffect(() => {
    if (user) {
      cargarNotas()
    } else {
      setNotas([])
      setLoading(false)
    }
  }, [user])

  return {
    notas,
    loading,
    error,
    cargarNotas,
    crearNota,
    actualizarNota,
    eliminarNota,
    buscarNotas,
    obtenerNota,
    obtenerEstadisticas,
    crearNotasPrueba,
    formatearFecha,
    obtenerResumen
  }
}
