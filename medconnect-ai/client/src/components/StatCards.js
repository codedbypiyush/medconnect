export default function StatCards({ appointments }) {
  const counts = appointments.reduce(
    (acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }),
    {}
  );

  const stats = [
    { label: 'Total', value: appointments.length, color: 'text-gray-900' },
    { label: 'Pending', value: counts.pending || 0, color: 'text-yellow-600' },
    { label: 'Confirmed', value: counts.confirmed || 0, color: 'text-blue-600' },
    { label: 'Completed', value: counts.completed || 0, color: 'text-green-600' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="card text-center py-4">
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
