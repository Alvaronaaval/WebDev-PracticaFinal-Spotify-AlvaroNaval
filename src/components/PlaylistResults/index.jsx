import React from 'react';

// You can use the inline SVGs or standard text here. 
// Using the text stars you already had for simplicity.

export default function PlaylistResults({
    playlist,
    favorites,
    isGenerating,
    error,
    onGenerate,
    onToggleFavorite,
    onRemove
}) {
    return (
        <section className="mt-12 w-full max-w-7xl bg-[#0f172a] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Playlist Generator</h2>
                    <p className="text-sm text-zinc-400">Curated results based on your widget selections.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={() => onGenerate({ mode: 'replace' })}
                        disabled={isGenerating}
                    >
                        {isGenerating ? 'Refreshing...' : 'Regenerate'}
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg border border-zinc-700 font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={() => onGenerate({ mode: 'append' })}
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
                        <div key={track.id} className="flex gap-4 items-center bg-black/40 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-colors group">
                            <img
                                src={track.album?.images?.[0]?.url || '/placeholder.png'}
                                alt={track.name}
                                className="w-16 h-16 rounded-lg object-cover shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white leading-tight truncate">{track.name}</p>
                                <p className="text-sm text-zinc-400 truncate">{track.artists?.map((a) => a.name).join(', ')}</p>
                                <p className="text-xs text-zinc-500 mt-1">Pop: {track.popularity ?? 'N/A'}%</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => onToggleFavorite(track)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${isFavorite
                                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                                            : 'border-zinc-700 hover:bg-zinc-800 text-zinc-400'
                                        }`}
                                >
                                    {isFavorite ? '★ SAVED' : '☆ SAVE'}
                                </button>
                                <button
                                    onClick={() => onRemove(track.id)}
                                    className="px-3 py-1 rounded-full text-xs font-bold border border-transparent text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    REMOVE
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}