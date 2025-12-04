'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

// -----------------------------------------------------------------------------
// Component Imports
// We assume the folder structure is: src/components/widgets/[WidgetName]/index.jsx
// -----------------------------------------------------------------------------
import ArtistWidget from '@/components/widgets/ArtistWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import TrackWidget from '@/components/widgets/TrackWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';

export default function Dashboard() {
    const router = useRouter();

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
                    onClick={() => console.log("Generating playlist with:", prefs)}
                >
                    Generate Playlist
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

                {/* 6. Popularity Widget (Placeholder) */}
                <div className="h-[400px] bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 border-dashed flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-900/80 transition-colors cursor-not-allowed">
                    <div className="w-12 h-12 rounded-full border-2 border-zinc-700 mb-4 flex items-center justify-center">
                        <span className="text-xl font-bold">?</span>
                    </div>
                    <span className="font-medium">Popularity Widget</span>
                    <span className="text-xs mt-1 text-zinc-600">Coming Soon</span>
                </div>

            </div>

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