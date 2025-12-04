'use client';

export default function MoodWidget({ mood, onChange }) {
    // Preset values for quick selection
    const presets = {
        happy: { energy: 80, valence: 90, danceability: 70, acousticness: 20 },
        sad: { energy: 30, valence: 20, danceability: 30, acousticness: 70 },
        energetic: { energy: 90, valence: 70, danceability: 90, acousticness: 10 },
        calm: { energy: 20, valence: 50, danceability: 20, acousticness: 80 },
    };

    const applyPreset = (presetName) => {
        onChange(presets[presetName]);
    };

    const handleSliderChange = (feature, value) => {
        onChange({ ...mood, [feature]: parseInt(value) });
    };

    return (
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                Mood & Energy
            </h2>

            {/* Preset Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                    onClick={() => applyPreset('happy')}
                    className="bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500/20 hover:scale-105 transition-all"
                >
                    Happy
                </button>
                <button
                    onClick={() => applyPreset('sad')}
                    className="bg-blue-500/10 text-blue-300 border border-blue-500/30 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/20 hover:scale-105 transition-all"
                >
                    Sad
                </button>
                <button
                    onClick={() => applyPreset('energetic')}
                    className="bg-red-500/10 text-red-300 border border-red-500/30 py-2 rounded-lg text-sm font-medium hover:bg-red-500/20 hover:scale-105 transition-all"
                >
                    Energetic
                </button>
                <button
                    onClick={() => applyPreset('calm')}
                    className="bg-green-500/10 text-green-300 border border-green-500/30 py-2 rounded-lg text-sm font-medium hover:bg-green-500/20 hover:scale-105 transition-all"
                >
                    Calm
                </button>
            </div>

            {/* Sliders Area */}
            <div className="space-y-5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                {/* Energy Slider */}
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-zinc-400 font-medium">Energy (Intensity)</span>
                        <span className="text-green-400 font-mono">{mood.energy}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100"
                        value={mood.energy}
                        onChange={(e) => handleSliderChange('energy', e.target.value)}
                        className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400"
                    />
                </div>

                {/* Valence Slider */}
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-zinc-400 font-medium">Valence (Positivity)</span>
                        <span className="text-blue-400 font-mono">{mood.valence}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100"
                        value={mood.valence}
                        onChange={(e) => handleSliderChange('valence', e.target.value)}
                        className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                    />
                </div>

                {/* Danceability Slider */}
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-zinc-400 font-medium">Danceability</span>
                        <span className="text-purple-400 font-mono">{mood.danceability}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100"
                        value={mood.danceability}
                        onChange={(e) => handleSliderChange('danceability', e.target.value)}
                        className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
                    />
                </div>

                {/* Acousticness Slider */}
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-zinc-400 font-medium">Acousticness</span>
                        <span className="text-orange-400 font-mono">{mood.acousticness}%</span>
                    </div>
                    <input
                        type="range" min="0" max="100"
                        value={mood.acousticness}
                        onChange={(e) => handleSliderChange('acousticness', e.target.value)}
                        className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400"
                    />
                </div>
            </div>
        </div>
    );
}