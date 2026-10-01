import { AlertCircle } from 'lucide-react'

interface ErrorProps {
  message: string
  onRetry?: () => void
}

export const Error = ({ message, onRetry }: ErrorProps) => {
  return (
    <div className="empty-state px-6 py-12 max-w-md mx-auto">
      <div className="bg-red-50 rounded-lg p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-semibold text-faith-navy-900 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            🔄 Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export const EmptyState = ({ message, icon = '📭' }: { message: string; icon?: string }) => {
  return (
    <div className="empty-state px-6 py-12">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-semibold text-faith-navy-900 mb-2">No results found</h3>
      <p className="text-gray-600">{message}</p>
    </div>
  )
}
