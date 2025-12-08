'use client';

import { useState, useEffect } from 'react';
import { searchArtists } from '@/lib/spotify';

export default function ArtistWidget({ selectedArtists, onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Logic: Wait 500ms after typing stops before searching (Debounce)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                setIsLoading(true);
                const artists = await searchArtists(query);
                setResults(artists);
                setIsLoading(false);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(timer); // Cleanup timer if user keeps typing
    }, [query]);

    // 2. Logic: Handle clicking an artist
    const handleSelect = (artist) => {
        // Check if already selected
        const isAlreadySelected = selectedArtists.some(a => a.id === artist.id);

        if (isAlreadySelected) {
            // Remove it
            onSelect(selectedArtists.filter(a => a.id !== artist.id));
        } else {
            // Add it (limit to 5)
            if (selectedArtists.length < 5) {
                onSelect([...selectedArtists, artist]);
            } else {
                alert("You can only select 5 artists!");
            }
        }
    };

    return (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">
                Select Artists ({selectedArtists.length}/5)
            </h2>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search for an artist..."
                className="w-full bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700 focus:border-green-500 outline-none mb-4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {/* Search Results Area */}
            <div className="space-y-2 mb-6 min-h-[100px]">
                {isLoading && <p className="text-zinc-500 text-sm">Searching...</p>}

                {results.map(artist => {
                    const isSelected = selectedArtists.some(a => a.id === artist.id);
                    return (
                        <div
                            key={artist.id}
                            onClick={() => handleSelect(artist)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-green-900/30 border border-green-500/50' : 'hover:bg-zinc-800'
                                }`}
                        >
                            {/* Artist Image */}
                            {artist.images[2] ? (
                                <img src={artist.images[2].url} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 bg-zinc-700 rounded-full" />
                            )}
                            <span className="text-white text-sm font-medium">{artist.name}</span>
                        </div>
                    );
                })}
            </div>

            {/* Selected Artists (Tags) */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800">
                {selectedArtists.map(artist => (
                    <span key={artist.id} className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                        {artist.name}
                        <button onClick={() => handleSelect(artist)} className="hover:text-white">×</button>
                    </span>
                ))}
            </div>
        </div>
    );
}