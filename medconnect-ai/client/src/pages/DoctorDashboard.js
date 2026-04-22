import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/axios';
import AppointmentCard from '../components/AppointmentCard';
import StatCards from '../components/StatCards';
import StatusFilter from '../components/StatusFilter';
import { PageSpinner } from '../components/Spinner';
import {
  fetchScheduleRequest,
  updateStatusRequest
} from '../store/slices/appointmentsSlice';

const PROFILE_INIT = {
  specialization: '',
  experience: '',
  qualification: '',
  bio: '',
  consultationFee: '',
  availableFrom: '09:00',
  availableTo: '17:00'
};

function ProfileForm({ onCreated }) {
  const [form, setForm] = useState(PROFILE_INIT);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setLoading(true);
    try {
      await api.post('/doctors/profile', form);
      setMsg({
        type: 'success',
        text: 'Profile created! Awaiting admin approval. Once approved, your appointments will appear here.'
      });
      onCreated();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-8 border-blue-100 bg-blue-50">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Complete Your Profile</h2>
      <p className="text-gray-500 text-sm mb-5">Fill in your details so patients can find and book with you.</p>

      {msg.text && (
        <div
          className={`text-sm rounded-lg px-4 py-3 mb-4 ${
            msg.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl p-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Specialization *</label>
            <input required type="text" value={form.specialization} onChange={set('specialization')} placeholder="e.g., Cardiologist" className="input" />
          </div>
          <div>
            <label className="label">Years of Experience</label>
            <input type="number" min="0" value={form.experience} onChange={set('experience')} placeholder="10" className="input" />
          </div>
          <div>
            <label className="label">Qualification</label>
            <input type="text" value={form.qualification} onChange={set('qualification')} placeholder="MBBS, MD" className="input" />
          </div>
          <div>
            <label className="label">Consultation Fee (₹)</label>
            <input type="number" min="0" value={form.consultationFee} onChange={set('consultationFee')} placeholder="500" className="input" />
          </div>
          <div>
            <label className="label">Available From</label>
            <input type="time" value={form.availableFrom} onChange={set('availableFrom')} className="input" />
          </div>
          <div>
            <label className="label">Available To</label>
            <input type="time" value={form.availableTo} onChange={set('availableTo')} className="input" />
          </div>
        </div>
        <div>
          <label className="label">Bio</label>
          <textarea value={form.bio} onChange={set('bio')} placeholder="Briefly describe your experience and approach…" rows={3} className="input resize-none" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

export default function DoctorDashboard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const {
    items: appointments,
    loading,
    error,
    hasProfile
  } = useSelector((s) => s.appointments);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchScheduleRequest());
  }, [dispatch]);

  const handleStatusUpdate = (id, status) => {
    dispatch(updateStatusRequest({ id, status }));
  };

  const filtered = useMemo(
    () => (filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)),
    [appointments, filter]
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome, Dr. {user?.name}</p>
      </div>

      {!hasProfile && <ProfileForm onCreated={() => dispatch(fetchScheduleRequest())} />}

      {hasProfile && (
        <>
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
                <p>No appointments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((a) => (
                  <AppointmentCard
                    key={a.id}
                    appointment={a}
                    onStatusUpdate={handleStatusUpdate}
                    isDoctor
                  />
                ))}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
