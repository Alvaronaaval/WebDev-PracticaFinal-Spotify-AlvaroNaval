'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya tiene token, lo mandamos directo al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    // Redirige a Spotify para iniciar sesión
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="text-center space-y-6 max-w-lg">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#1DB954] to-blue-500 bg-clip-text text-transparent">
          Spotify Taste Mixer
        </h1>

        <p className="text-zinc-400 text-lg">
          Crea playlists únicas mezclando tus artistas favoritos, géneros y décadas.
        </p>

        <button
          onClick={handleLogin}
          className="bg-[#1DB954] text-black font-bold py-4 px-8 rounded-full text-xl hover:bg-[#1ed760] transition-transform hover:scale-105 shadow-lg shadow-green-900/20"
        >
          Iniciar Sesión con Spotify
        </button>
      </div>
    </main>
  );
}