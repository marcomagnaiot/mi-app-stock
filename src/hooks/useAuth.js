import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Obtener sesión actual
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
        setLoading(false)
      } catch (error) {
        console.error('Error al obtener sesión:', error)
        setError(error.message)
        setLoading(false)
      }
    }

    getSession()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setUser(session?.user || null)
        setLoading(false)
        setError(null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Registro con email y contraseña
  const signUpWithEmail = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Revisa tu email para confirmar tu cuenta'
      }
    } catch (error) {
      console.error('Error en registro:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    } finally {
      setLoading(false)
    }
  }

  // Login con email y contraseña
  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Sesión iniciada correctamente'
      }
    } catch (error) {
      console.error('Error en login:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    } finally {
      setLoading(false)
    }
  }

  // Login con Google
  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      return {
        success: true,
        data,
        message: 'Redirigiendo a Google...'
      }
    } catch (error) {
      console.error('Error en login con Google:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    } finally {
      setLoading(false)
    }
  }

  // Cerrar sesión
  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      return {
        success: true,
        message: 'Sesión cerrada correctamente'
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    } finally {
      setLoading(false)
    }
  }

  // Reset de contraseña
  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      return {
        success: true,
        message: 'Revisa tu email para restablecer tu contraseña'
      }
    } catch (error) {
      console.error('Error en reset de contraseña:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    } finally {
      setLoading(false)
    }
  }

  // Reenviar email de confirmación
  const resendConfirmation = async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      return {
        success: true,
        message: 'Email de confirmación reenviado'
      }
    } catch (error) {
      console.error('Error al reenviar confirmación:', error)
      setError(error.message)
      return {
        success: false,
        error: error.message
      }
    } finally {
      setLoading(false)
    }
  }

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user
  }

  // Verificar si el email está confirmado
  const isEmailConfirmed = () => {
    return user?.email_confirmed_at !== null
  }

  // Obtener datos del usuario
  const getUserData = () => {
    if (!user) return null
    
    return {
      id: user.id,
      email: user.email,
      emailConfirmed: isEmailConfirmed(),
      createdAt: user.created_at,
      lastSignIn: user.last_sign_in_at,
      provider: user.app_metadata?.provider || 'email'
    }
  }

  return {
    user,
    loading,
    error,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    resendConfirmation,
    isAuthenticated,
    isEmailConfirmed,
    getUserData
  }
}
