import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppointmentCard from '../components/AppointmentCard';
import StatCards from '../components/StatCards';
import StatusFilter from '../components/StatusFilter';
import { PageSpinner } from '../components/Spinner';
import {
  fetchMyRequest,
  cancelRequest
} from '../store/slices/appointmentsSlice';

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { items: appointments, loading, error } = useSelector((s) => s.appointments);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchMyRequest());
  }, [dispatch]);

  const handleCancel = (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    dispatch(cancelRequest(id));
  };

  const filtered = useMemo(
    () => (filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)),
    [appointments, filter]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name}</p>
        </div>
        <Link to="/doctors" className="btn-primary text-sm whitespace-nowrap">
          + Book Appointment
        </Link>
      </div>

      <StatCards appointments={appointments} />
      <StatusFilter value={filter} onChange={setFilter} />

      {loading && <PageSpinner />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="mb-4">No appointments found</p>
            <Link to="/doctors" className="btn-primary text-sm">Find a Doctor</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((a) => (
              <AppointmentCard key={a.id} appointment={a} onCancel={handleCancel} isDoctor={false} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
