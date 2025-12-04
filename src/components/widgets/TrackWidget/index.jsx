'use client';

import { useState, useEffect } from 'react';
import { searchTracks } from '@/lib/spotify';

export default function TrackWidget({ selectedTracks, onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Debouncing para búsqueda
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                setIsLoading(true);
                const tracks = await searchTracks(query);
                setResults(tracks);
                setIsLoading(false);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const toggleTrack = (track) => {
        const isSelected = selectedTracks.some(t => t.id === track.id);
        if (isSelected) {
            onSelect(selectedTracks.filter(t => t.id !== track.id));
        } else {
            // Límite opcional (ej. 5 canciones)
            if (selectedTracks.length < 5) {
                onSelect([...selectedTracks, track]);
            } else {
                alert("Máximo 5 canciones");
            }
        }
    };

    return (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                🎵 Canciones ({selectedTracks.length}/5)
            </h2>

            <input
                type="text"
                placeholder="Buscar canción (ej. Blinding Lights)..."
                className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-green-500 outline-none mb-4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <div className="flex-1 overflow-y-auto pr-2 max-h-[300px] space-y-2">
                {isLoading && <p className="text-zinc-500 text-sm">Buscando...</p>}

                {results.map(track => {
                    const isSelected = selectedTracks.some(t => t.id === track.id);
                    return (
                        <div
                            key={track.id}
                            onClick={() => toggleTrack(track)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-green-900/30 border border-green-500/50' : 'hover:bg-zinc-800'
                                }`}
                        >
                            {track.album.images[2] && (
                                <img
                                    src={track.album.images[2].url}
                                    alt={track.name}
                                    className="w-10 h-10 rounded object-cover"
                                />
                            )}
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-white text-sm font-medium truncate">{track.name}</span>
                                <span className="text-zinc-400 text-xs truncate">
                                    {track.artists.map(a => a.name).join(', ')}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Lista de seleccionados (Tags) */}
            <div className="flex flex-wrap gap-2 pt-4 mt-2 border-t border-zinc-800">
                {selectedTracks.map(track => (
                    <span key={track.id} className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        {track.name}
                        <button onClick={() => toggleTrack(track)} className="hover:text-red-300 font-bold">×</button>
                    </span>
                ))}
            </div>
        </div>
    );
}