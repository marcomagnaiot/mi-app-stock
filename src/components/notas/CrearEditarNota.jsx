import { useState, useEffect } from 'react'
import { useNotas } from '../../hooks/useNotas'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

export function CrearEditarNota({ isOpen, onClose, nota = null, onSuccess }) {
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { crearNota, actualizarNota } = useNotas()

  const isEditing = !!nota

  useEffect(() => {
    if (isOpen) {
      if (nota) {
        setFormData({
          titulo: nota.titulo || '',
          contenido: nota.contenido || ''
        })
      } else {
        setFormData({
          titulo: '',
          contenido: ''
        })
      }
      setErrors({})
    }
  }, [isOpen, nota])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido'
    } else if (formData.titulo.trim().length < 3) {
      newErrors.titulo = 'El título debe tener al menos 3 caracteres'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      let result
      
      if (isEditing) {
        result = await actualizarNota(nota.id, formData.titulo, formData.contenido)
      } else {
        result = await crearNota(formData.titulo, formData.contenido)
      }

      if (result.success) {
        onSuccess && onSuccess(result.data)
        onClose()
      } else {
        setErrors({ submit: result.error })
      }
    } catch (error) {
      setErrors({ submit: 'Error inesperado. Intenta nuevamente.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Editar Nota' : 'Nueva Nota'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Título"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            error={errors.titulo}
            placeholder="Título de la nota"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Textarea
            label="Contenido"
            name="contenido"
            value={formData.contenido}
            onChange={handleChange}
            error={errors.contenido}
            placeholder="Escribe el contenido de tu nota..."
            rows={8}
            disabled={isLoading}
          />
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            {isEditing ? 'Actualizar' : 'Crear'} Nota
          </Button>
        </div>
      </form>
    </Modal>
  )
}
