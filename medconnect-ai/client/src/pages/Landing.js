import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Easy Appointment Booking',
    desc: 'Browse verified doctors by specialization and book appointments in seconds.'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI Symptom Checker',
    desc: 'Describe your symptoms and get instant AI-powered specialist recommendations.'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Verified Doctors',
    desc: 'All doctors are manually reviewed and approved before appearing on the platform.'
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: 'Real-time Updates',
    desc: 'Track appointment status from pending to confirmed and completed in real time.'
  }
];

const steps = [
  { step: '01', title: 'Create an Account', desc: 'Sign up as a patient or doctor in under a minute.' },
  { step: '02', title: 'Find Your Doctor', desc: 'Browse specialists, check availability and consultation fees.' },
  { step: '03', title: 'Book & Confirm', desc: 'Book your slot instantly and track your appointment status.' }
];

export default function Landing() {
  const user = useSelector((s) => s.auth.user);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <span className="inline-block bg-blue-50 text-blue-600 text-sm font-medium px-3 py-1 rounded-full mb-6">
            AI-Powered Healthcare
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Healthcare at Your<br />
            <span className="text-blue-600">Fingertips</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Book appointments with top doctors instantly and get AI-powered symptom analysis.
            Your health, simplified.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/doctors" className="btn-primary px-6 py-3 text-base">
              Find a Doctor
            </Link>
            {user ? (
              <Link to="/symptom-checker" className="btn-secondary px-6 py-3 text-base">
                Check Symptoms
              </Link>
            ) : (
              <Link to="/register" className="btn-secondary px-6 py-3 text-base">
                Get Started Free
              </Link>
            )}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <span>✓ Free to join</span>
            <span>✓ Verified doctors</span>
            <span>✓ AI symptom analysis</span>
            <span>✓ Instant booking</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need</h2>
            <p className="text-gray-500">A complete platform for patients and doctors</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500">Get started in three simple steps</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-blue-600 text-white text-xl font-bold rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16 bg-blue-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to take control of your health?</h2>
            <p className="text-blue-100 mb-8">Join thousands of patients and doctors on MedConnect AI.</p>
            <Link to="/register" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Create Free Account
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-center text-gray-400 text-sm">
        <p>© 2026 MedConnect AI · Built by Piyush Agnihotri</p>
      </footer>
    </div>
  );
}
