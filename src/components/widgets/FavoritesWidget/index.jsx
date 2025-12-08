import React from 'react';

export default function FavoritesWidget({ favorites, onRemove }) {
    return (
        <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col relative overflow-hidden group hover:border-zinc-700 transition-colors">

            {/* Cabecera del Widget */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="font-bold text-lg text-zinc-100 flex items-center gap-2">
                        Favoritos
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Tus canciones guardadas ({favorites.length})</p>
                </div>
                <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                    {/* Icono de Estrella */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="drop-shadow-sm">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                </div>
            </div>

            {/* Lista de Favoritos con Scroll */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar relative z-10">
                {favorites.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-center opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <p className="text-sm">Sin favoritos aún</p>
                        <p className="text-[10px] mt-1">Guarda canciones de los resultados</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {favorites.map((track) => (
                            <div key={track.id} className="flex items-center gap-3 p-2 rounded-lg bg-black/20 border border-transparent hover:border-zinc-700 hover:bg-black/40 transition-all group/item">
                                {/* Imagen del álbum */}
                                <img
                                    src={track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || '/placeholder.png'}
                                    alt={track.name}
                                    className="w-10 h-10 rounded object-cover shadow-sm bg-zinc-800"
                                />

                                {/* Info Canción */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate leading-tight">{track.name}</p>
                                    <p className="text-xs text-zinc-400 truncate">{track.artists?.[0]?.name}</p>
                                </div>

                                {/* Botón Eliminar (aparece al hacer hover) */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); onRemove(track); }}
                                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover/item:opacity-100 focus:opacity-100"
                                    title="Eliminar de favoritos"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Estilos para la barra de scroll personalizada dentro del widget */}
            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }
      `}</style>
        </div>
    );
}