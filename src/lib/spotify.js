import { getAccessToken } from "./auth";

/**
 * Genera una playlist utilizando la estrategia de "Búsqueda + Filtrado".
 * Reemplaza al endpoint deprecado /recommendations.
 * * Estrategia:
 * 1. Obtener Top Tracks de los artistas seleccionados.
 * 2. Buscar tracks por los géneros seleccionados (con offset aleatorio).
 * 3. Enriquecer con Audio Features para soportar Moods.
 * 4. Filtrar y Ordenar manualmente por Popularidad, Década y Mood.
 */
export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity, mood } = preferences;
  const token = getAccessToken();

  if (!token) {
    console.error("No access token available");
    return [];
  }

  let candidates = [];
  const limitPerSource = 10; // Canciones a pedir por cada artista/género

  try {
    // 1. OBTENER TRACKS DE ARTISTAS (Top Tracks)
    // Hacemos peticiones en paralelo para mayor velocidad
    if (artists && artists.length > 0) {
      const artistPromises = artists.map(artist =>
        fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { tracks: [] })
      );

      const artistResults = await Promise.all(artistPromises);
      artistResults.forEach(data => {
        if (data.tracks) candidates.push(...data.tracks);
      });
    }

    // 2. BUSCAR TRACKS POR GÉNERO (CON VARIACIÓN ALEATORIA)
    if (genres && genres.length > 0) {
      const genrePromises = genres.map(genre => {
        // Generamos un offset aleatorio para que "Regenerar" traiga canciones diferentes
        // Limitamos a 50 para asegurar relevancia (Spotify permite hasta 1000, pero la calidad baja)
        const randomOffset = Math.floor(Math.random() * 50);

        return fetch(`https://api.spotify.com/v1/search?type=track&q=genre:${encodeURIComponent(genre)}&limit=${limitPerSource}&offset=${randomOffset}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.ok ? res.json() : { tracks: { items: [] } });
      });

      const genreResults = await Promise.all(genrePromises);
      genreResults.forEach(data => {
        if (data.tracks?.items) candidates.push(...data.tracks.items);
      });
    }

    // Fallback: Si no hay candidatos (ej. solo seleccionó mood), buscamos algo genérico
    if (candidates.length === 0) {
      // También añadimos offset aquí para variar el fallback
      const randomOffset = Math.floor(Math.random() * 100);
      const fallback = await fetch(`https://api.spotify.com/v1/search?type=track&q=year:2023&limit=50&offset=${randomOffset}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await fallback.json();
      if (data.tracks?.items) candidates.push(...data.tracks.items);
    }

    // Eliminar duplicados por ID
    let uniqueTracks = Array.from(new Map(candidates.map(t => [t.id, t])).values());

    // MEZCLAR CANDIDATOS (Shuffle)
    // Esto es crucial para que si hay > 100 candidatos, el slice(0, 100) tome un subconjunto diferente cada vez
    uniqueTracks.sort(() => Math.random() - 0.5);

    // 3. ENRIQUECER CON AUDIO FEATURES (Para el Mood Widget)
    // Esto es necesario porque el endpoint /search no devuelve 'energy', 'valence', etc.
    if (mood && uniqueTracks.length > 0) {
      // La API de audio-features acepta máximo 100 IDs
      const trackIds = uniqueTracks.map(t => t.id).slice(0, 100);
      const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (featuresRes.ok) {
        const featuresData = await featuresRes.json();
        const featuresMap = new Map(featuresData.audio_features.filter(f => f).map(f => [f.id, f]));

        // Calculamos un "score" de distancia al mood deseado
        // (Menor score = mejor coincidencia)
        uniqueTracks = uniqueTracks.slice(0, 100).map(track => {
          const f = featuresMap.get(track.id);
          if (!f) return { ...track, moodScore: 100 }; // Penalizamos si no hay features

          // Convertimos sliders (0-100) a 0.0-1.0
          const targetEnergy = mood.energy / 100;
          const targetValence = mood.valence / 100;
          const targetDance = mood.danceability / 100;
          const targetAcoustic = mood.acousticness / 100;

          // Distancia Euclideana simple
          const distance =
            Math.abs(targetEnergy - f.energy) +
            Math.abs(targetValence - f.valence) +
            Math.abs(targetDance - f.danceability) +
            Math.abs(targetAcoustic - f.acousticness);

          return { ...track, moodScore: distance };
        });

        // Ordenamos: primero los que mejor encajen con el mood
        uniqueTracks.sort((a, b) => (a.moodScore || 0) - (b.moodScore || 0));
      }
    }

    // 4. FILTRADO FINAL (Década y Popularidad)
    const finalTracks = uniqueTracks.filter(track => {
      let keep = true;

      // Filtro de Popularidad
      if (popularity) {
        const [min, max] = popularity;
        if (track.popularity < min || track.popularity > max) keep = false;
      }

      // Filtro de Década
      if (keep && decades && decades.length > 0 && track.album.release_date) {
        const year = parseInt(track.album.release_date.substring(0, 4));
        const matchDecade = decades.some(d => {
          const start = parseInt(d);
          return year >= start && year < start + 10;
        });
        if (!matchDecade) keep = false;
      }

      return keep;
    });

    // Devolvemos los mejores 30 resultados
    return finalTracks.slice(0, 30);

  } catch (error) {
    console.error("Error en generatePlaylist (Estrategia Search):", error);
    return [];
  }
}

// --- Funciones auxiliares (Sin cambios) ---

export async function searchArtists(query) {
  const token = getAccessToken();
  if (!token) return [];

  const response = await fetch(
    `https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&limit=5`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  if (!response.ok) return [];
  const data = await response.json();
  return data.artists.items;
}

export async function getGenres() {
  return [
    'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient',
    'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova',
    'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house',
    'children', 'chill', 'classical', 'club', 'comedy',
    'country', 'dance', 'dancehall', 'death-metal', 'deep-house',
    'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
    'dubstep', 'edm', 'electro', 'electronic', 'emo',
    'folk', 'forro', 'french', 'funk', 'garage',
    'german', 'gospel', 'goth', 'grindcore', 'groove',
    'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore',
    'hardstyle', 'heavy-metal', 'hip-hop', 'holidays', 'honky-tonk',
    'house', 'idm', 'indian', 'indie', 'indie-pop',
    'industrial', 'iranian', 'j-dance', 'j-idol', 'j-pop',
    'j-rock', 'jazz', 'k-pop', 'kids', 'latin',
    'latino', 'malay', 'mandopop', 'metal', 'metal-misc',
    'metalcore', 'minimal-techno', 'movies', 'mpb', 'new-age',
    'new-release', 'opera', 'pagode', 'party', 'philippines-opm',
    'piano', 'pop', 'pop-film', 'post-dubstep', 'power-pop',
    'progressive-house', 'psych-rock', 'punk', 'punk-rock', 'r-n-b',
    'rainy-day', 'reggae', 'reggaeton', 'road-trip', 'rock',
    'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa',
    'samba', 'sertanejo', 'show-tunes', 'singer-songwriter', 'ska',
    'sleep', 'songwriter', 'soul', 'soundtracks', 'spanish',
    'study', 'summer', 'swedish', 'synth-pop', 'tango',
    'techno', 'trance', 'trip-hop', 'turkish', 'work-out',
    'world-music'
  ];
}

export async function searchTracks(query) {
  const token = getAccessToken();
  if (!token) return [];

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}&limit=5`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.tracks?.items || [];
  } catch (error) {
    console.error("Error buscando canciones:", error);
    return [];
  }
}