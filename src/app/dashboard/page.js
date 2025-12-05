'use client'; // Indica que este es un componente del lado del cliente (React estándar)

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth'; // Tu lógica de protección de rutas
import { generatePlaylist } from '@/lib/spotify'; // La función que llama a la API

// --- Importación de Widgets ---
// Cada uno de estos es un componente visual que permite al usuario seleccionar algo.
import ArtistWidget from '@/components/widgets/ArtistWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import TrackWidget from '@/components/widgets/TrackWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import MoodWidget from '@/components/widgets/MoodWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';

// --- Importación del Componente de Resultados ---
// Hemos separado la lista de canciones en su propio archivo para mantener este limpio.
import PlaylistResults from '@/components/PlaylistResults';

export default function Dashboard() {
    const router = useRouter();

    // -------------------------------------------------------------------------
    // 1. ESTADO DE LA INTERFAZ (UI STATE)
    // Variables para controlar qué se muestra en la pantalla
    // -------------------------------------------------------------------------
    const [playlist, setPlaylist] = useState([]);       // La lista de canciones generadas
    const [favorites, setFavorites] = useState([]);     // Canciones guardadas por el usuario
    const [isGenerating, setIsGenerating] = useState(false); // Spinner de carga (true/false)
    const [error, setError] = useState('');             // Mensajes de error si falla la API

    // -------------------------------------------------------------------------
    // 2. ESTADO CENTRALIZADO DE PREFERENCIAS (CORE STATE)
    // Aquí guardamos TODAS las decisiones que el usuario toma en los widgets.
    // Este objeto 'prefs' es lo que enviaremos a la función generatePlaylist.
    // -------------------------------------------------------------------------
    const [prefs, setPrefs] = useState({
        artists: [],      // Array de objetos artista (id, nombre, imagen)
        genres: [],       // Array de strings (ej: ['pop', 'rock'])
        tracks: [],       // Array de objetos canción (semillas)
        decades: [],      // Array de años inicio (ej: ['1980', '1990'])
        popularity: [0, 100], // Rango [mínimo, máximo]
        mood: {           // Valores de 0 a 100 para las características de audio
            energy: 50,
            valence: 50,     // Felicidad/Positividad
            danceability: 50,
            acousticness: 50
        }
    });

    // -------------------------------------------------------------------------
    // 3. EFECTOS (SIDE EFFECTS)
    // Cosas que ocurren automáticamente al cargar la página
    // -------------------------------------------------------------------------

    // A. Protección de Ruta: Si no hay token, mandar al login
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/');
        }
    }, [router]);

    // B. Cargar Favoritos: Leer de localStorage al iniciar para no perderlos al recargar
    useEffect(() => {
        // Verificamos 'window' para evitar errores en el servidor (SSR)
        if (typeof window === 'undefined') return;

        const stored = localStorage.getItem('favorite_tracks');
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (err) {
                console.error("Error cargando favoritos:", err);
            }
        }
    }, []);

    // -------------------------------------------------------------------------
    // 4. FUNCIONES MANEJADORAS (HANDLERS)
    // Lógica que responde a las acciones del usuario
    // -------------------------------------------------------------------------

    // Guarda o quita una canción de favoritos y actualiza localStorage
    const toggleFavorite = (track) => {
        let updated;
        // Si ya existe, la filtramos (quitamos). Si no, la añadimos.
        if (favorites.some((fav) => fav.id === track.id)) {
            updated = favorites.filter((fav) => fav.id !== track.id);
        } else {
            updated = [...favorites, track];
        }
        setFavorites(updated);
        // Persistencia: Guardar en el navegador
        localStorage.setItem('favorite_tracks', JSON.stringify(updated));
    };

    // Elimina una canción de la lista de resultados actual (solo visualmente)
    const removeTrack = (trackId) => {
        setPlaylist((prev) => prev.filter((track) => track.id !== trackId));
    };

    /**
     * Lógica principal para llamar a la API
     * @param {Object} options - { mode: 'replace' | 'append' }
     * 'replace': Borra la lista actual y pone nuevas (Botón Regenerar)
     * 'append': Mantiene las actuales y añade nuevas al final (Botón Add More)
     */
    const handleGenerate = async (options = { mode: 'replace' }) => {
        setIsGenerating(true); // Activar spinner
        setError('');          // Limpiar errores previos

        try {
            // Llamamos a nuestra librería (src/lib/spotify.js) pasando las preferencias
            const tracks = await generatePlaylist(prefs);

            // Si la API no devuelve nada (filtros muy estrictos)
            if (tracks.length === 0) {
                if (options.mode === 'replace') setPlaylist([]);
                // Si es 'append', simplemente no hacemos nada para no borrar lo que ya hay
            }
            // Si el modo es 'append' (añadir más)
            else if (options.mode === 'append') {
                // Creamos un Set con los IDs actuales para evitar duplicados
                const currentIds = new Set(playlist.map(t => t.id));
                // Solo añadimos las canciones que NO estén ya en la lista
                const newTracks = tracks.filter(t => !currentIds.has(t.id));
                setPlaylist(prev => [...prev, ...newTracks]);
            }
            // Si el modo es 'replace' (regenerar todo)
            else {
                setPlaylist(tracks);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to generate playlist.');
        } finally {
            setIsGenerating(false); // Apagar spinner siempre, haya error o no
        }
    };

    // -------------------------------------------------------------------------
    // 5. RENDERIZADO (JSX)
    // Lo que ve el usuario
    // -------------------------------------------------------------------------
    return (
        <main className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center font-sans">

            {/* --- ENCABEZADO --- */}
            <header className="w-full max-w-7xl mb-10 flex flex-col md:flex-row justify-between items-center border-b border-zinc-800 pb-6">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                        Spotify Taste Mixer
                    </h1>
                    <p className="text-zinc-400 text-sm mt-2 font-medium">
                        Crea tu playlist perfecta mezclando artistas, géneros, épocas y estados de ánimo.
                    </p>
                </div>
                {/* Botón principal de generar (visible en escritorio) */}
                <button
                    className="mt-4 md:mt-0 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                    onClick={() => handleGenerate()}
                    disabled={isGenerating}
                >
                    {isGenerating ? 'Procesando...' : 'Generar Playlist'}
                </button>
            </header>

            {/* --- GRID DE WIDGETS --- */}
            {/* Aquí es donde "levantamos el estado" (State Lifting).
                Pasamos una parte de 'prefs' y la función para actualizarla (setPrefs) a cada hijo. */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full max-w-7xl">

                {/* 1. Artistas */}
                <div className="h-[450px]">
                    <ArtistWidget
                        selectedArtists={prefs.artists}
                        // Cuando el widget dice "cambió la selección", actualizamos solo 'artists' en prefs
                        onSelect={(v) => setPrefs({ ...prefs, artists: v })}
                    />
                </div>

                {/* 2. Géneros */}
                <div className="h-[450px]">
                    <GenreWidget
                        selectedGenres={prefs.genres}
                        onSelect={(v) => setPrefs({ ...prefs, genres: v })}
                    />
                </div>

                {/* 3. Canciones Específicas */}
                <div className="h-[450px]">
                    <TrackWidget
                        selectedTracks={prefs.tracks}
                        onSelect={(v) => setPrefs({ ...prefs, tracks: v })}
                        selectedDecades={prefs.decades} // Pasamos décadas para filtrar búsqueda interna
                    />
                </div>

                {/* 4. Décadas */}
                <div className="h-[400px]">
                    <DecadeWidget
                        selectedDecades={prefs.decades}
                        onSelect={(v) => setPrefs({ ...prefs, decades: v })}
                    />
                </div>

                {/* 5. Mood (Energía, etc.) */}
                <div className="h-[400px]">
                    <MoodWidget
                        mood={prefs.mood}
                        onChange={(v) => setPrefs({ ...prefs, mood: v })}
                    />
                </div>

                {/* 6. Popularidad */}
                <div className="h-[400px]">
                    <PopularityWidget
                        popularity={prefs.popularity}
                        onChange={(v) => setPrefs({ ...prefs, popularity: v })}
                    />
                </div>
            </div>

            {/* --- COMPONENTE DE RESULTADOS --- */}
            {/* Le pasamos toda la data necesaria para mostrar la lista y los botones de acción */}
            <PlaylistResults
                playlist={playlist}
                favorites={favorites}
                isGenerating={isGenerating}
                error={error}
                onGenerate={handleGenerate}
                onToggleFavorite={toggleFavorite}
                onRemove={removeTrack}
            />

            {/* --- DEBUGGER (Solo para desarrollo) --- */}
            {/* Muestra el objeto JSON en tiempo real para ver qué está seleccionado */}
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