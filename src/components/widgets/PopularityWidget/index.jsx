import React, { useState, useEffect, useMemo } from 'react';

// --- Iconos SVG en línea (Sin instalar librerías externas) ---
// Definimos los componentes de icono aquí mismo para que el archivo sea portable
const Icons = {
    TrendingUp: ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    ),
    Disc: ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    Gem: ({ className }) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M6 3h12l4 6-10 13L2 9z" />
        </svg>
    )
};

export default function PopularityWidget({ popularity, onChange }) {
    // Estado local para la posición visual del slider (0-100)
    const [sliderValue, setSliderValue] = useState(50);

    // Sincronizar estado visual cuando el padre cambia los props
    // Esto es útil si el dashboard carga preferencias guardadas
    useEffect(() => {
        // Protección contra valores nulos o indefinidos
        const currentPop = popularity || [0, 100];
        const [min, max] = currentPop;

        // Configuramos el slider visual basado en los rangos lógicos
        if (min === 0 && max === 100) setSliderValue(50); // Default
        else if (min >= 80) setSliderValue(90); // Mainstream
        else if (min >= 50) setSliderValue(65); // Popular
        else setSliderValue(25); // Underground
    }, [popularity]); // Se ejecuta cuando 'popularity' cambia

    // Lógica de visualización (Memoizada para rendimiento)
    const category = useMemo(() => {
        if (sliderValue >= 80) return {
            label: "Mainstream",
            Icon: Icons.TrendingUp,
            color: "text-rose-500",
            bg: "bg-rose-500",
            rangeLabel: "80% - 100%",
            desc: "Top Global & Viral Hits"
        };
        if (sliderValue >= 50) return {
            label: "Popular",
            Icon: Icons.Disc,
            color: "text-violet-500",
            bg: "bg-violet-500",
            rangeLabel: "50% - 79%",
            desc: "Trending & Established"
        };
        return {
            label: "Underground",
            Icon: Icons.Gem,
            color: "text-emerald-500",
            bg: "bg-emerald-500",
            rangeLabel: "0% - 49%",
            desc: "Hidden Gems & Niche"
        };
    }, [sliderValue]);

    // Manejar el movimiento del slider
    const handleSliderChange = (e) => {
        const val = parseInt(e.target.value);
        setSliderValue(val);

        let newRange;
        // Lógica para convertir la posición del slider en rangos de API [min, max]
        if (val >= 80) newRange = [80, 100];
        else if (val >= 50) newRange = [50, 79];
        else newRange = [0, 49];

        // Solo notificamos al componente padre si el rango ha cambiado realmente
        // Esto evita renderizados innecesarios en la app principal
        if (popularity && (newRange[0] !== popularity[0] || newRange[1] !== popularity[1])) {
            onChange(newRange);
        }
    };

    const { Icon } = category;

    return (
        <div className="h-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col relative overflow-hidden group hover:border-zinc-700 transition-colors">

            {/* Efecto de Glow de fondo dinámico según la categoría */}
            <div className={`absolute top-0 right-0 w-64 h-64 ${category.bg} opacity-5 blur-[100px] rounded-full pointer-events-none transition-all duration-500 translate-x-1/2 -translate-y-1/2`}></div>

            {/* Header del Widget */}
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <h3 className="font-bold text-lg text-zinc-100 flex items-center gap-2">
                        Popularity
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">Target audience reach</p>
                </div>
                {/* Icono de categoría */}
                <div className={`p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 ${category.color} w-10 h-10 flex items-center justify-center transition-colors duration-300`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="flex-1 flex flex-col justify-center relative z-10">

                {/* Texto de Categoría y Rango */}
                <div className="text-center mb-10">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-zinc-950 border border-zinc-800 mb-3 ${category.color} transition-colors duration-300`}>
                        {category.label}
                    </span>
                    <h2 className="text-4xl font-black text-white tracking-tight mb-2 transition-all duration-300">
                        {category.rangeLabel}
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium transition-all duration-300">
                        {category.desc}
                    </p>
                </div>

                {/* Control Slider Personalizado */}
                <div className="relative w-full h-12 flex items-center justify-center">
                    {/* Fondo del track del slider */}
                    <div className="absolute w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-r from-emerald-500 via-violet-500 to-rose-500 opacity-20"></div>
                    </div>

                    {/* Input Range (Invisible pero interactivo para el usuario) */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        className="absolute w-full h-full opacity-0 cursor-pointer z-20"
                        aria-label="Popularity Range Selector"
                    />

                    {/* Indicador Visual (Thumb) que sigue al valor */}
                    <div
                        className="absolute h-6 w-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] border-2 border-zinc-200 pointer-events-none transition-all duration-200 z-10 flex items-center justify-center"
                        style={{ left: `calc(${sliderValue}% - 12px)` }}
                    >
                        <div className={`w-2 h-2 rounded-full ${category.bg} transition-colors duration-300`}></div>
                    </div>
                </div>

                {/* Etiquetas inferiores de guía */}
                <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-zinc-600 mt-4 px-1">
                    <span>Niche</span>
                    <span>Mainstream</span>
                </div>
            </div>
        </div>
    );
}