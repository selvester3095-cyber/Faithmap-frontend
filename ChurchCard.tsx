import { Link } from 'react-router-dom'
import type { Church } from '@/types'

interface ChurchCardProps {
  church: Church
}

export const ChurchCard = ({ church }: ChurchCardProps) => {
  return (
    <div className="church-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-display font-bold text-xl text-faith-navy-900 mb-1">{church.church_name}</h3>
          <p className="text-gray-600 text-sm">N/A</p>
        </div>
        {/* verified badge would go here */}
      </div>

      <div className="space-y-3 text-sm mb-4">
        <div className="flex items-center gap-3 text-gray-600">
          <span>📍</span>
          {church.location}
        </div>
        {church.phone && (
          <div className="flex items-center gap-3 text-gray-600">
            <span>📱</span>
            {church.phone}
          </div>
        )}
      </div>

      {church.description && (
        <p className="text-gray-700 text-sm mb-4">{church.description}</p>
      )}

      <Link to={`/churches/${church.id}`} className="btn-primary">
        👁️ View Church Profile
      </Link>
    </div>
  )
}
