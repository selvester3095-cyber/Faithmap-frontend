export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-4 border-faith-blue-200 border-t-faith-green-400 rounded-full animate-spin"></div>
    </div>
  )
}

export const LoadingSkeletons = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="loading-skeleton h-24 rounded-lg"></div>
      ))}
    </div>
  )
}

export const LoadingCard = () => {
  return (
    <div className="card">
      <div className="loading-skeleton h-6 w-2/3 rounded mb-4"></div>
      <div className="loading-skeleton h-4 w-1/2 rounded mb-6"></div>
      <div className="space-y-2">
        <div className="loading-skeleton h-4 w-full rounded"></div>
        <div className="loading-skeleton h-4 w-4/5 rounded"></div>
      </div>
    </div>
  )
}
