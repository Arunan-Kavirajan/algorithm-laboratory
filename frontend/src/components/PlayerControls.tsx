import React, { useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

export const PlayerControls: React.FC = () => {
    const { 
        isPlaying, play, pause, stepForward, stepBackward, 
        currentStepIndex, events, playbackSpeed, setPlaybackSpeed 
    } = usePlayerStore();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying) {
            interval = setInterval(() => {
                if (currentStepIndex >= events.length - 1) {
                    pause();
                } else {
                    stepForward();
                }
            }, playbackSpeed);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStepIndex, events.length, playbackSpeed, stepForward, pause]);

    const isAtEnd = currentStepIndex >= events.length - 1;
    const isAtStart = currentStepIndex === 0;

    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-4">
            <div className="flex items-center gap-2">
                <button 
                    onClick={stepBackward} 
                    disabled={isAtStart || isPlaying}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SkipBack size={20} className="text-gray-700" />
                </button>
                
                {isPlaying ? (
                    <button onClick={pause} className="p-2 rounded bg-red-100 hover:bg-red-200 text-red-700">
                        <Pause size={24} />
                    </button>
                ) : (
                    <button 
                        onClick={play} 
                        disabled={isAtEnd || events.length === 0}
                        className="p-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play size={24} />
                    </button>
                )}

                <button 
                    onClick={stepForward} 
                    disabled={isAtEnd || isPlaying}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SkipForward size={20} className="text-gray-700" />
                </button>
                
                <button 
                    onClick={() => usePlayerStore.getState().goToStep(0)} 
                    disabled={isAtStart || events.length === 0}
                    className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                >
                    <RotateCcw size={18} className="text-gray-700" />
                </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
                <label className="flex items-center gap-2">
                    Speed:
                    <select 
                        value={playbackSpeed} 
                        onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                        className="p-1 border rounded"
                    >
                        <option value={1000}>Slow (1s)</option>
                        <option value={500}>Normal (0.5s)</option>
                        <option value={150}>Fast (0.15s)</option>
                        <option value={50}>Very Fast (50ms)</option>
                    </select>
                </label>
            </div>
        </div>
    );
};
