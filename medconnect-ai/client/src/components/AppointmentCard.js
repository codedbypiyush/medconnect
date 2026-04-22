import StatusBadge from './StatusBadge';

export default function AppointmentCard({ appointment, onCancel, onStatusUpdate, isDoctor }) {
  const { id, appointmentDate, appointmentTime, reason, notes, status, doctor, patient } = appointment;

  const canCancel = !isDoctor && ['pending', 'confirmed'].includes(status);
  const canUpdate = isDoctor && !['cancelled', 'completed'].includes(status);

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {isDoctor ? (
            <p className="font-semibold text-gray-900">{patient?.name}</p>
          ) : (
            <p className="font-semibold text-gray-900">Dr. {doctor?.user?.name}</p>
          )}
          {!isDoctor && doctor?.specialization && (
            <p className="text-blue-600 text-sm">{doctor.specialization}</p>
          )}
          {isDoctor && patient?.email && (
            <p className="text-gray-500 text-sm">{patient.email}</p>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {appointmentDate}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {appointmentTime}
        </span>
      </div>

      {reason && (
        <p className="mt-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
          <span className="font-medium text-gray-600">Reason:</span> {reason}
        </p>
      )}

      {notes && (
        <p className="mt-2 text-sm text-gray-500 bg-blue-50 rounded-lg p-2">
          <span className="font-medium text-blue-600">Doctor notes:</span> {notes}
        </p>
      )}

      {(canCancel || canUpdate) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {canCancel && (
            <button
              onClick={() => onCancel(id)}
              className="text-sm px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
          )}
          {canUpdate && (
            <>
              {status === 'pending' && (
                <button
                  onClick={() => onStatusUpdate(id, 'confirmed')}
                  className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm
                </button>
              )}
              {status !== 'completed' && (
                <button
                  onClick={() => onStatusUpdate(id, 'completed')}
                  className="text-sm px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => onStatusUpdate(id, 'cancelled')}
                className="text-sm px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
