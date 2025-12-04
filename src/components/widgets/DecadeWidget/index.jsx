'use client';

export default function DecadeWidget({ selectedDecades, onSelect }) {
    // Definimos las décadas con su valor inicial (año de inicio)
    const decades = [
        { label: '60s', value: '1960', fullLabel: '1960-1969' },
        { label: '70s', value: '1970', fullLabel: '1970-1979' },
        { label: '80s', value: '1980', fullLabel: '1980-1989' },
        { label: '90s', value: '1990', fullLabel: '1990-1999' },
        { label: '00s', value: '2000', fullLabel: '2000-2009' },
        { label: '10s', value: '2010', fullLabel: '2010-2019' },
        { label: '20s', value: '2020', fullLabel: '2020-Present' },
    ];

    const toggleDecade = (value) => {
        if (selectedDecades.includes(value)) {
            // Si ya está seleccionada, la quitamos
            onSelect(selectedDecades.filter(d => d !== value));
        } else {
            // Si no está, la añadimos
            onSelect([...selectedDecades, value]);
        }
    };

    return (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                📅 Décadas ({selectedDecades.length})
            </h2>

            <p className="text-zinc-400 text-xs mb-4">
                Filtra tu mezcla por eras musicales. Se usarán para filtrar los resultados finales.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto custom-scrollbar flex-1 content-start">
                {decades.map((decade) => {
                    const isSelected = selectedDecades.includes(decade.value);
                    return (
                        <button
                            key={decade.value}
                            onClick={() => toggleDecade(decade.value)}
                            className={`
                p-3 rounded-lg text-sm font-bold transition-all border flex flex-col items-center justify-center gap-1
                ${isSelected
                                    ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40 scale-105'
                                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-500 hover:text-white'}
              `}
                        >
                            <span className="text-lg">{decade.label}</span>
                            <span className={`text-[10px] font-normal ${isSelected ? 'text-purple-200' : 'text-zinc-500'}`}>
                                {decade.fullLabel}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}