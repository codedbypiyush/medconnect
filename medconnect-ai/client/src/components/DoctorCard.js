import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  const { id, specialization, experience, qualification, consultationFee, availableFrom, availableTo, user } = doctor;

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 text-xl font-semibold">
            {user?.name?.[0]?.toUpperCase() || 'D'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{user?.name}</h3>
          <p className="text-blue-600 text-sm font-medium">{specialization}</p>
          {qualification && (
            <p className="text-gray-500 text-xs mt-0.5">{qualification}</p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {experience != null && (
          <div className="flex items-center gap-1.5 text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {experience} yrs exp
          </div>
        )}
        {consultationFee != null && (
          <div className="flex items-center gap-1.5 text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ₹{consultationFee}
          </div>
        )}
        {availableFrom && availableTo && (
          <div className="flex items-center gap-1.5 text-gray-600 col-span-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Available: {availableFrom} – {availableTo}
          </div>
        )}
      </div>

      <Link
        to={`/doctors/${id}`}
        className="mt-4 block text-center btn-primary text-sm"
      >
        View Profile & Book
      </Link>
    </div>
  );
}
