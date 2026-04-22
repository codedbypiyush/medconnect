const TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function StatusFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
            value === tab
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
