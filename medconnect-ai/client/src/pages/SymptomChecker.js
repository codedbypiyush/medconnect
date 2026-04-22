import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';

const URGENCY = {
  low: { badge: 'bg-green-100 text-green-800', label: 'Low Urgency' },
  medium: { badge: 'bg-yellow-100 text-yellow-800', label: 'Medium Urgency' },
  high: { badge: 'bg-red-100 text-red-800', label: 'High Urgency' }
};

const MAX_HISTORY = 3;

function ResultCard({ result }) {
  const urgency = URGENCY[result.data.urgencyLevel] || URGENCY.medium;

  return (
    <div className="card border-l-4 border-blue-500">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">{result.timestamp}</p>
          <p className="text-sm text-gray-600 italic">"{result.symptoms}"</p>
        </div>
        <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${urgency.badge}`}>
          {urgency.label}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Possible Conditions</h4>
          <ul className="space-y-1">
            {result.data.possibleConditions?.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-4 h-4 mt-0.5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs flex-shrink-0">
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Recommended Specialist</p>
            <p className="font-semibold text-gray-900">{result.data.recommendedSpecialist}</p>
          </div>
          <Link
            to={`/doctors?specialization=${encodeURIComponent(result.data.recommendedSpecialist || '')}`}
            className="text-sm text-blue-600 font-medium hover:underline whitespace-nowrap"
          >
            Find Doctor →
          </Link>
        </div>

        {result.data.advice && (
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-blue-600 mb-1">Advice</p>
            <p className="text-sm text-gray-700">{result.data.advice}</p>
          </div>
        )}

        <p className="text-xs text-gray-400 border-t border-gray-100 pt-3">
          This is an AI-generated suggestion and does not constitute medical advice. Always consult a licensed healthcare professional.
        </p>
      </div>
    </div>
  );
}

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = symptoms.trim();
    if (!trimmed) return;

    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/symptom-check', { symptoms: trimmed });
      setHistory((prev) =>
        [{
          id: Date.now(),
          symptoms: trimmed,
          data,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev].slice(0, MAX_HISTORY)
      );
      setSymptoms('');
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Symptom Checker</h1>
        <p className="text-gray-500 text-sm">Powered by GPT-3.5</p>

        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl px-4 py-3 mt-4">
          This tool provides general guidance only. It is <strong>not a substitute</strong> for professional medical diagnosis or treatment.
        </div>
      </div>

      <div className="card mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label text-base">Describe your symptoms</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., I've had a persistent headache for 3 days, mild fever, and a sore throat…"
              rows={4}
              className="input resize-none text-sm"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1">Be as specific as possible for better results.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !symptoms.trim()}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                Analyzing symptoms…
              </>
            ) : (
              'Analyze Symptoms'
            )}
          </button>
        </form>
      </div>

      {history.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">
              Recent Analyses
              <span className="ml-2 text-xs text-gray-400 font-normal">(last {history.length})</span>
            </h2>
            <button onClick={() => setHistory([])} className="text-xs text-gray-400 hover:text-gray-600">
              Clear all
            </button>
          </div>
          {history.map((r) => (
            <ResultCard key={r.id} result={r} />
          ))}
        </div>
      )}
    </div>
  );
}
