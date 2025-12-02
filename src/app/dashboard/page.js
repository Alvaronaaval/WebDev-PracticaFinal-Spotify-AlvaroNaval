'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import ArtistWidget from '@/components/widgets/ArtistWidget';
import GenreWidget from '@/components/widgets/GenreWidget'; // Importamos el nuevo widget

export default function Dashboard() {
    const router = useRouter();
    const [prefs, setPrefs] = useState({ artists: [], genres: [] });

    useEffect(() => { if (!isAuthenticated()) router.push('/'); }, [router]);

    return (
        <main className="min-h-screen bg-black p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-white mb-8">Spotify Taste Mixer 🎛️</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                {/* Widget 1: Artistas */}
                <ArtistWidget
                    selectedArtists={prefs.artists}
                    onSelect={(val) => setPrefs({ ...prefs, artists: val })}
                />

                {/* Widget 2: Géneros */}
                <GenreWidget
                    selectedGenres={prefs.genres}
                    onSelect={(val) => setPrefs({ ...prefs, genres: val })}
                />
            </div>

            {/* Debug: Ver estado actual */}
            <pre className="mt-8 text-green-500 text-xs bg-zinc-900 p-4 rounded w-full max-w-5xl border border-zinc-800">
                {JSON.stringify(prefs, null, 2)}
            </pre>
        </main>
    );
}