'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { generatePlaylist } from '@/lib/spotify';

// -----------------------------------------------------------------------------
// Component Imports
// We assume the folder structure is: src/components/widgets/[WidgetName]/index.jsx
// -----------------------------------------------------------------------------
import ArtistWidget from '@/components/widgets/ArtistWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import TrackWidget from '@/components/widgets/TrackWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
// IMPORTE NUEVO AÑADIDO AQUI:
import PopularityWidget from '@/components/widgets/PopularityWidget';

export default function Dashboard() {
    const router = useRouter();

    const [playlist, setPlaylist] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    // ---------------------------------------------------------------------------
    // Centralized Application State
    // This object holds all the user preferences selected across different widgets.
    // ---------------------------------------------------------------------------
    const [prefs, setPrefs] = useState({
        artists: [],      // Array of artist objects
        genres: [],       // Array of genre strings
        tracks: [],       // Array of track objects
        decades: [],      // Array of strings (e.g., ['1980', '1990'])
        popularity: [0, 100], // Range [min, max]
        mood: {           // Object with audio features (0-100)
            energy: 50,
            valence: 50,
            danceability: 50,
            acousticness: 50
        }
    });

    // ---------------------------------------------------------------------------
    // Authentication Guard
    // Redirects users to the login page if no valid token is found.
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/');
        }
    }, [router]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = localStorage.getItem('favorite_tracks');
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (err) {
                console.error('Error parsing favorites', err);
            }
        }
    }, []);

    const persistFavorites = (updated) => {
        setFavorites(updated);
        if (typeof window !== 'undefined') {
            localStorage.setItem('favorite_tracks', JSON.stringify(updated));
        }
    };

    const toggleFavorite = (track) => {
        const exists = favorites.some((fav) => fav.id === track.id);
        if (exists) {
            persistFavorites(favorites.filter((fav) => fav.id !== track.id));
        } else {
            persistFavorites([...favorites, track]);
        }
    };

    const removeTrack = (trackId) => {
        setPlaylist((prev) => prev.filter((track) => track.id !== trackId));
    };

    const mergeUniqueTracks = (current, incoming) => {
        const map = new Map(current.map((track) => [track.id, track]));
        incoming.forEach((track) => {
            if (!map.has(track.id)) {
                map.set(track.id, track);
            }
        });
        return Array.from(map.values());
    };

    const handleGenerate = async (options = { mode: 'replace' }) => {
        setIsGenerating(true);
        setError('');
        try {
            const tracks = await generatePlaylist(prefs);
            if (options.mode === 'append') {
                setPlaylist((prev) => mergeUniqueTracks(prev, tracks));
            } else {
                setPlaylist(tracks);
            }
        } catch (err) {
            console.error('Error generating playlist', err);
            setError('Failed to generate playlist. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
    return (
        <main className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center font-sans">

            {/* Header Section */}
            <header className="w-full max-w-7xl mb-10 flex flex-col md:flex-row justify-between items-center border-b border-zinc-800 pb-6">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent tracking-tight">
                        Spotify Taste Mixer
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2 font-medium">
                        Curate your perfect playlist by mixing artists, genres, eras, and moods.
                    </p>
                </div>

                {/* Main Action Button (Placeholder for future logic) */}
                <button
                    className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-lg"
                    onClick={() => handleGenerate()}
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Generating...' : 'Generate Playlist'}
                </button>
            </header>

            {/* Main Grid Layout 
        Responsive behavior:
        - Mobile: 1 column
        - Tablet (md): 2 columns
        - Large Desktop (xl): 3 columns
      */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-7xl">

                {/* 1. Artists Selection */}
                <div className="h-[450px]">
                    <ArtistWidget
                        selectedArtists={prefs.artists}
                        onSelect={(newArtists) => setPrefs({ ...prefs, artists: newArtists })}
                    />
                </div>

                {/* 2. Genres Selection */}
                <div className="h-[450px]">
                    <GenreWidget
                        selectedGenres={prefs.genres}
                        onSelect={(newGenres) => setPrefs({ ...prefs, genres: newGenres })}
                    />
                </div>

                {/* 3. Tracks Selection 
            Note: We pass 'selectedDecades' here to enable filtering tracks by year 
            within the widget itself.
        */}
                <div className="h-[450px]">
                    <TrackWidget
                        selectedTracks={prefs.tracks}
                        onSelect={(newTracks) => setPrefs({ ...prefs, tracks: newTracks })}
                        selectedDecades={prefs.decades}
                    />
                </div>

                {/* 4. Decades Selection */}
                <div className="h-[400px]">
                    <DecadeWidget
                        selectedDecades={prefs.decades}
                        onSelect={(newDecades) => setPrefs({ ...prefs, decades: newDecades })}
                    />
                </div>

                {/* 5. Mood & Energy (New Widget) */}
                <div className="h-[400px]">
                    <MoodWidget
                        mood={prefs.mood}
                        onChange={(newMood) => setPrefs({ ...prefs, mood: newMood })}
                    />
                </div>

                {/* 6. Popularity Widget (YA NO ES PLACEHOLDER) */}
                <div className="h-[400px]">
                    <PopularityWidget
                        popularity={prefs.popularity}
                        onChange={(newRange) => setPrefs({ ...prefs, popularity: newRange })}
                    />
                </div>

            </div>

            <section className="mt-12 w-full max-w-7xl bg-[#0f172a] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Playlist Generator</h2>
                        <p className="text-sm text-zinc-400">Curated results based on your widget selections.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleGenerate()}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Refreshing...' : 'Regenerate'}
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg border border-zinc-700 font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleGenerate({ mode: 'append' })}
                            disabled={isGenerating || playlist.length === 0}
                        >
                            Add More Songs
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                {playlist.length === 0 && !isGenerating && (
                    <div className="text-center text-zinc-400 py-10">
                        <p>No playlist generated yet. Use the widgets above and click Generate.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {playlist.map((track) => {
                        const isFavorite = favorites.some((fav) => fav.id === track.id);
                        return (
                            <div key={track.id} className="flex gap-4 items-center bg-black/40 border border-zinc-800 rounded-xl p-4">
                                <img
                                    src={track.album?.images?.[0]?.url || '/placeholder.png'}
                                    alt={track.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-white leading-tight">{track.name}</p>
                                    <p className="text-sm text-zinc-400">{track.artists?.map((a) => a.name).join(', ')}</p>
                                    <p className="text-xs text-zinc-500">Popularity: {track.popularity ?? 'N/A'}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => toggleFavorite(track)}
                                        className={`px-3 py-1 rounded-full text-sm border ${isFavorite ? 'bg-yellow-400 text-black border-yellow-300' : 'border-zinc-700 hover:bg-zinc-800'}`}
                                    >
                                        {isFavorite ? '★ Favorite' : '☆ Favorite'}
                                    </button>
                                    <button
                                        onClick={() => removeTrack(track.id)}
                                        className="px-3 py-1 rounded-full text-sm border border-red-500 text-red-400 hover:bg-red-500/10"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Debug Console / State Viewer
        This section helps visualize the state changes in real-time.
        It mimics a code terminal style.
      */}
            <div className="mt-12 w-full max-w-7xl bg-[#0d1117] p-6 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                    {/* Mac-style window controls (CSS only, no emojis) */}
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold ml-3 font-mono">
                        Application State Debugger
                    </p>
                </div>
                <pre className="text-green-400 font-mono text-xs overflow-auto max-h-60 whitespace-pre-wrap">
                    {JSON.stringify(prefs, null, 2)}
                </pre>
            </div>
        </main>
    );
}