'use client';

import { useState, useEffect } from 'react';
import { getGenres } from '@/lib/spotify';

export default function GenreWidget({ selectedGenres, onSelect }) {
    const [availableGenres, setAvailableGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('');

    // Cargar géneros al inicio
    useEffect(() => {
        async function load() {
            const genres = await getGenres();
            setAvailableGenres(genres);
            setIsLoading(false);
        }
        load();
    }, []);

    // Seleccionar/Deseleccionar
    const toggle = (genre) => {
        if (selectedGenres.includes(genre)) {
            onSelect(selectedGenres.filter(g => g !== genre));
        } else {
            if (selectedGenres.length < 5) onSelect([...selectedGenres, genre]);
            else alert("Máximo 5 géneros");
        }
    };

    // Filtrar lista visualmente
    const filtered = availableGenres.filter(g => g.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-white"> Géneros ({selectedGenres.length}/5)</h2>

            <input
                className="w-full bg-zinc-800 text-white p-2 rounded mb-4 border border-zinc-700 focus:border-green-500 outline-none"
                placeholder="Filtrar géneros..."
                onChange={(e) => setFilter(e.target.value)}
            />

            <div className="flex-1 overflow-y-auto pr-2 max-h-[300px]">
                <div className="flex flex-wrap gap-2">
                    {isLoading ? <p className="text-zinc-500">Cargando...</p> : filtered.map(g => (
                        <button
                            key={g}
                            onClick={() => toggle(g)}
                            className={`px-3 py-1 rounded-full text-xs capitalize border transition-all ${selectedGenres.includes(g)
                                ? 'bg-green-500 text-black border-green-500 font-bold'
                                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                                }`}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}