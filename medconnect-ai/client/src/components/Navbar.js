import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { clearAppointments } from '../store/slices/appointmentsSlice';

const navLinks = (user) => [
  { to: '/doctors', label: 'Find Doctors' },
  user && { to: '/symptom-checker', label: 'Symptom Checker' },
  user?.role === 'patient' && { to: '/dashboard', label: 'My Appointments' },
  user?.role === 'doctor' && { to: '/doctor-dashboard', label: 'My Schedule' }
].filter(Boolean);

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearAppointments());
    setOpen(false);
    navigate('/');
  };

  const links = navLinks(user);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-gray-900 text-lg">
            MedConnect AI
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-gray-600 hover:text-blue-600 font-medium">
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <span className="text-sm text-gray-500">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-600 font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                {l.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg">Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
