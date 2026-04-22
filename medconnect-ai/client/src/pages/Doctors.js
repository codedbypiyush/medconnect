import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DoctorCard from '../components/DoctorCard';
import { PageSpinner } from '../components/Spinner';
import { fetchDoctorsRequest } from '../store/slices/doctorsSlice';

const SPECIALIZATIONS = [
  'All',
  'Cardiologist',
  'Dermatologist',
  'General Practitioner',
  'Neurologist',
  'Orthopedic',
  'Pediatrician',
  'Psychiatrist',
  'Pulmonologist',
  'Urologist'
];

export default function Doctors() {
  const dispatch = useDispatch();
  const { items: doctors, loading, error } = useSelector((s) => s.doctors);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('All');

  useEffect(() => {
    dispatch(fetchDoctorsRequest());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return doctors.filter((d) => {
      const matchesSpec =
        specialization === 'All' ||
        d.specialization?.toLowerCase().includes(specialization.toLowerCase());
      const matchesSearch =
        !q ||
        d.user?.name?.toLowerCase().includes(q) ||
        d.specialization?.toLowerCase().includes(q);
      return matchesSpec && matchesSearch;
    });
  }, [doctors, search, specialization]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Find a Doctor</h1>
        <p className="text-gray-500 text-sm">Browse our verified medical specialists</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or specialization…"
          className="input flex-1"
        />
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="input sm:w-56"
        >
          {SPECIALIZATIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading && <PageSpinner />}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} found
          </p>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>No doctors found matching your criteria</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((d) => (
                <DoctorCard key={d.id} doctor={d} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
