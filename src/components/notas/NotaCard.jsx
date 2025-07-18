import { useState } from 'react'
import { useNotas } from '../../hooks/useNotas'
import { Button } from '../ui/Button'

export function NotaCard({ nota, onEdit, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { formatearFecha, obtenerResumen } = useNotas()

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
      setIsDeleting(true)
      await onDelete(nota.id)
      setIsDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {nota.titulo}
        </h3>
        <div className="flex space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(nota)}
            className="text-blue-600 hover:text-blue-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            loading={isDeleting}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        {nota.contenido ? (
          <p className="text-gray-700 text-sm whitespace-pre-wrap">
            {obtenerResumen(nota.contenido, 150)}
          </p>
        ) : (
          <p className="text-gray-400 text-sm italic">
            Sin contenido
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-gray-100">
        <span>
          Creado: {formatearFecha(nota.created_at)}
        </span>
        {nota.updated_at !== nota.created_at && (
          <span>
            Editado: {formatearFecha(nota.updated_at)}
          </span>
        )}
      </div>
    </div>
  )
}
