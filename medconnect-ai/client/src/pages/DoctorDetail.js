import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import Spinner, { PageSpinner } from '../components/Spinner';

const today = () => new Date().toISOString().split('T')[0];

export default function DoctorDetail() {
  const { id } = useParams();
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ appointmentDate: '', appointmentTime: '', reason: '' });
  const [booking, setBooking] = useState(false);
  const [bookMsg, setBookMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    api
      .get(`/doctors/${id}`)
      .then((res) => setDoctor(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Doctor not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');

    setBookMsg({ type: '', text: '' });
    setBooking(true);
    try {
      await api.post('/appointments/book', { doctorId: id, ...form });
      setBookMsg({ type: 'success', text: 'Appointment booked! Check your dashboard for status updates.' });
      setForm({ appointmentDate: '', appointmentTime: '', reason: '' });
    } catch (err) {
      setBookMsg({ type: 'error', text: err.response?.data?.message || 'Booking failed. Please try again.' });
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <PageSpinner />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/doctors" className="btn-primary">Back to Doctors</Link>
      </div>
    );
  }

  const {
    specialization, experience, qualification, bio,
    consultationFee, availableFrom, availableTo, user: docUser
  } = doctor;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link to="/doctors" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to doctors
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card">
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-3xl font-bold">
                  {docUser?.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dr. {docUser?.name}</h1>
                <p className="text-blue-600 font-medium">{specialization}</p>
                {qualification && <p className="text-gray-500 text-sm mt-0.5">{qualification}</p>}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {experience != null && (
                <div className="text-center bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-bold text-gray-900">{experience}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Years Exp.</p>
                </div>
              )}
              {consultationFee != null && (
                <div className="text-center bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-bold text-gray-900">₹{consultationFee}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Consultation</p>
                </div>
              )}
              {availableFrom && availableTo && (
                <div className="text-center bg-gray-50 rounded-xl p-3 col-span-2">
                  <p className="text-sm font-semibold text-gray-900">{availableFrom} – {availableTo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Available Hours</p>
                </div>
              )}
            </div>

            {bio && (
              <div className="mt-5">
                <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{bio}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card h-fit">
          <h2 className="font-semibold text-gray-900 mb-4">Book Appointment</h2>

          {!user ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-4">Please login to book an appointment</p>
              <Link to="/login" className="btn-primary w-full block text-center">Login to Book</Link>
            </div>
          ) : user.role !== 'patient' ? (
            <p className="text-gray-500 text-sm">Only patients can book appointments.</p>
          ) : (
            <form onSubmit={handleBook} className="space-y-4">
              {bookMsg.text && (
                <div
                  className={`text-sm rounded-lg px-3 py-2 ${
                    bookMsg.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-700'
                      : 'bg-red-50 border border-red-200 text-red-600'
                  }`}
                >
                  {bookMsg.text}
                </div>
              )}

              <div>
                <label className="label">Date</label>
                <input
                  type="date"
                  value={form.appointmentDate}
                  min={today()}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="label">Time</label>
                <input
                  type="time"
                  value={form.appointmentTime}
                  onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })}
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="label">Reason (optional)</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Briefly describe your concern…"
                  rows={3}
                  className="input resize-none"
                />
              </div>

              <button type="submit" disabled={booking} className="btn-primary w-full py-2.5">
                {booking ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    Booking…
                  </span>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
