'use client';

export default function DecadeWidget({ selectedDecades, onSelect }) {
  const decades = [
    { label: '60s', value: '1960' },
    { label: '70s', value: '1970' },
    { label: '80s', value: '1980' },
    { label: '90s', value: '1990' },
    { label: '00s', value: '2000' },
    { label: '10s', value: '2010' },
    { label: '20s', value: '2020' },
  ];

  const toggleDecade = (value) => {
    if (selectedDecades.includes(value)) {
      onSelect(selectedDecades.filter(d => d !== value));
    } else {
      onSelect([...selectedDecades, value]);
    }
  };

  return (
    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        Décadas
      </h2>
      <p className="text-zinc-400 text-xs mb-4">Filtrar resultado final por era:</p>

      <div className="grid grid-cols-3 gap-2 overflow-y-auto">
        {decades.map((decade) => {
          const isSelected = selectedDecades.includes(decade.value);
          return (
            <button
              key={decade.value}
              onClick={() => toggleDecade(decade.value)}
              className={`p-2 rounded text-sm font-bold border transition-all ${isSelected
                ? 'bg-purple-600 text-white border-purple-500'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
            >
              {decade.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}