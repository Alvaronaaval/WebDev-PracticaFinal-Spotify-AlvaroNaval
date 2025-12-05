'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

// Widgets
import ArtistWidget from '@/components/widgets/ArtistWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import TrackWidget from '@/components/widgets/TrackWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';

// NEW: Results Component
import PlaylistResults from '@/components/PlaylistResults';

export default function Dashboard() {
    const router = useRouter();

<<<<<<< Updated upstream
    // ---------------------------------------------------------------------------
    // Centralized Application State
    // This object holds all the user preferences selected across different widgets.
    // ---------------------------------------------------------------------------
=======
    // --- State Management ---
    const [playlist, setPlaylist] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

>>>>>>> Stashed changes
    const [prefs, setPrefs] = useState({
        artists: [],
        genres: [],
        tracks: [],
        decades: [],
        popularity: [0, 100],
        mood: { energy: 50, valence: 50, danceability: 50, acousticness: 50 }
    });

    // --- Authentication ---
    useEffect(() => {
        if (!isAuthenticated()) router.push('/');
    }, [router]);

<<<<<<< Updated upstream
    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------
=======
    // --- Favorites Logic ---
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const stored = localStorage.getItem('favorite_tracks');
        if (stored) {
            try { setFavorites(JSON.parse(stored)); }
            catch (err) { console.error(err); }
        }
    }, []);

    const toggleFavorite = (track) => {
        let updated;
        if (favorites.some((fav) => fav.id === track.id)) {
            updated = favorites.filter((fav) => fav.id !== track.id);
        } else {
            updated = [...favorites, track];
        }
        setFavorites(updated);
        localStorage.setItem('favorite_tracks', JSON.stringify(updated));
    };

    // --- Playlist Logic ---
    const removeTrack = (trackId) => {
        setPlaylist((prev) => prev.filter((track) => track.id !== trackId));
    };

    const handleGenerate = async (options = { mode: 'replace' }) => {
        setIsGenerating(true);
        setError('');
        try {
            const tracks = await generatePlaylist(prefs);
            if (options.mode === 'append') {
                // Logic to merge unique tracks
                const currentIds = new Set(playlist.map(t => t.id));
                const newTracks = tracks.filter(t => !currentIds.has(t.id));
                setPlaylist(prev => [...prev, ...newTracks]);
            } else {
                setPlaylist(tracks);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate playlist.');
        } finally {
            setIsGenerating(false);
        }
    };

    // --- Render ---
>>>>>>> Stashed changes
    return (
        <main className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center font-sans">

            {/* Header */}
            <header className="w-full max-w-7xl mb-10 flex flex-col md:flex-row justify-between items-center border-b border-zinc-800 pb-6">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                        Spotify Taste Mixer
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2 font-medium">
                        Curate your perfect playlist by mixing artists, genres, eras, and moods.
                    </p>
                </div>
                {/* Main "Generate" CTA can live here too, or just inside the results */}
                <button
<<<<<<< Updated upstream
                    className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-lg"
                    onClick={() => console.log("Generating playlist with:", prefs)}
                >
                    Generate Playlist
=======
                    className="mt-4 md:mt-0 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                    onClick={() => handleGenerate()}
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Processing...' : 'Generate Playlist'}
>>>>>>> Stashed changes
                </button>
            </header>

            {/* Widget Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-7xl">
                <div className="h-[450px]">
                    <ArtistWidget selectedArtists={prefs.artists} onSelect={(v) => setPrefs({ ...prefs, artists: v })} />
                </div>
                <div className="h-[450px]">
                    <GenreWidget selectedGenres={prefs.genres} onSelect={(v) => setPrefs({ ...prefs, genres: v })} />
                </div>
                <div className="h-[450px]">
                    <TrackWidget selectedTracks={prefs.tracks} onSelect={(v) => setPrefs({ ...prefs, tracks: v })} selectedDecades={prefs.decades} />
                </div>
                <div className="h-[400px]">
                    <DecadeWidget selectedDecades={prefs.decades} onSelect={(v) => setPrefs({ ...prefs, decades: v })} />
                </div>
                <div className="h-[400px]">
                    <MoodWidget mood={prefs.mood} onChange={(v) => setPrefs({ ...prefs, mood: v })} />
                </div>
                <div className="h-[400px]">
                    <PopularityWidget popularity={prefs.popularity} onChange={(v) => setPrefs({ ...prefs, popularity: v })} />
                </div>
            </div>

<<<<<<< Updated upstream
            {/* Debug Console / State Viewer
        This section helps visualize the state changes in real-time. 
        It mimics a code terminal style.
      */}
=======
            {/* NEW: Clean Playlist Results Component */}
            <PlaylistResults
                playlist={playlist}
                favorites={favorites}
                isGenerating={isGenerating}
                error={error}
                onGenerate={handleGenerate}
                onToggleFavorite={toggleFavorite}
                onRemove={removeTrack}
            />

            {/* Debugger */}
>>>>>>> Stashed changes
            <div className="mt-12 w-full max-w-7xl bg-[#0d1117] p-6 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold font-mono">Debug State</p>
                </div>
                <pre className="text-green-400 font-mono text-xs overflow-auto max-h-60 whitespace-pre-wrap">
                    {JSON.stringify(prefs, null, 2)}
                </pre>
            </div>
        </main>
    );
}