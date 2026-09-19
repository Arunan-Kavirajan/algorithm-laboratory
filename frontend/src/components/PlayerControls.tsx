import React, { useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';

export const PlayerControls: React.FC = () => {
    const { 
        isPlaying, play, pause, stepForward, stepBackward, 
        currentStepIndex, events, playbackSpeed, setPlaybackSpeed,
        isMuted, toggleMute
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
    const progress = events.length > 1 ? (currentStepIndex / (events.length - 1)) * 100 : 0;

    return (
        <div className="px-6 py-4 flex flex-col gap-3">
            {/* Interactive Timeline Scrubber */}
            <div className="flex items-center gap-4 group">
                <span className="text-xs font-mono text-text-muted w-8 text-right select-none">
                    {currentStepIndex}
                </span>
                
                <div className="flex-1 relative flex items-center h-4 cursor-pointer">
                    {/* The visual track and filled progress (looks prettier than default browser ranges) */}
                    <div className="absolute left-0 right-0 h-1.5 bg-border rounded-full overflow-hidden pointer-events-none">
                        <div 
                            className={`absolute top-0 left-0 h-full bg-accent ${isPlaying ? 'transition-all duration-300 ease-linear' : ''}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    
                    {/* The invisible interactive slider overlaid perfectly on top */}
                    <input 
                        type="range"
                        min="0"
                        max={events.length > 0 ? events.length - 1 : 0}
                        value={currentStepIndex}
                        onChange={(e) => {
                            if (isPlaying) pause();
                            usePlayerStore.getState().goToStep(Number(e.target.value));
                        }}
                        disabled={events.length === 0}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                        title="Drag to time travel"
                    />
                    
                    {/* Custom thumb visible on hover */}
                    <div 
                        className="absolute h-3 w-3 bg-accent rounded-full shadow-md pointer-events-none transition-transform scale-0 group-hover:scale-100"
                        style={{ 
                            left: `calc(${progress}% - 6px)`,
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                    />
                </div>

                <span className="text-xs font-mono text-text-muted w-8 select-none">
                    {events.length ? events.length - 1 : 0}
                </span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => usePlayerStore.getState().goToStep(0)} 
                        disabled={isAtStart || events.length === 0}
                        className="p-2 rounded-md hover:bg-surface-hover text-text-muted hover:text-text transition-colors disabled:opacity-30"
                        title="Restart"
                    >
                        <RotateCcw size={16} />
                    </button>
                    
                    <div className="w-px h-4 bg-border mx-2" />

                    <button 
                        onClick={stepBackward} 
                        disabled={isAtStart || isPlaying}
                        className="p-2 rounded-md hover:bg-surface-hover text-text-muted hover:text-text transition-colors disabled:opacity-30"
                    >
                        <SkipBack size={18} />
                    </button>
                    
                    {isPlaying ? (
                        <button 
                            onClick={pause} 
                            className="p-2 rounded-md bg-accent text-white shadow-md shadow-accent/20 hover:bg-accent-hover transition-colors"
                        >
                            <Pause size={18} fill="currentColor" />
                        </button>
                    ) : (
                        <button 
                            onClick={play} 
                            disabled={isAtEnd || events.length === 0}
                            className="p-2 rounded-md bg-accent text-white shadow-md shadow-accent/20 hover:bg-accent-hover transition-colors disabled:opacity-30 disabled:shadow-none"
                        >
                            <Play size={18} fill="currentColor" className="ml-0.5" />
                        </button>
                    )}

                    <button 
                        onClick={stepForward} 
                        disabled={isAtEnd || isPlaying}
                        className="p-2 rounded-md hover:bg-surface-hover text-text-muted hover:text-text transition-colors disabled:opacity-30"
                    >
                        <SkipForward size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-text-muted font-mono">
                    <button 
                        onClick={toggleMute}
                        className={`p-1.5 rounded hover:bg-surface-hover transition-colors ${isMuted ? 'text-text-muted opacity-50' : 'text-accent'}`}
                        title={isMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <label className="flex items-center gap-2 cursor-pointer">
                        Speed
                        <select 
                            value={playbackSpeed} 
                            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                            className="bg-surface-raised border border-border-subtle text-text-secondary rounded-lg px-2 py-1 text-[11px] outline-none focus:border-accent cursor-pointer"
                        >
                            <option value={1000}>1.0s</option>
                            <option value={500}>0.5s</option>
                            <option value={150}>0.15s</option>
                            <option value={50}>50ms</option>
                        </select>
                    </label>
                </div>
            </div>
        </div>
    );
};
