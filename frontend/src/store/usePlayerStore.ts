import { create } from 'zustand'
import type { ExecutionEvent, ExecutionSummary } from '../types'

interface PlayerState {
    events: ExecutionEvent[];
    summary: ExecutionSummary | null;
    sourceCode: string;
    algorithmId: string;
    currentStepIndex: number;
    isPlaying: boolean;
    playbackSpeed: number; // ms per step
    
    // Actions
    setExecutionData: (events: ExecutionEvent[], summary: ExecutionSummary, sourceCode: string, algorithmId: string) => void;
    stepForward: () => void;
    stepBackward: () => void;
    goToStep: (step: number) => void;
    play: () => void;
    pause: () => void;
    setPlaybackSpeed: (speed: number) => void;
    reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    events: [],
    summary: null,
    sourceCode: "",
    algorithmId: "",
    currentStepIndex: 0,
    isPlaying: false,
    playbackSpeed: 500,

    setExecutionData: (events, summary, sourceCode, algorithmId) => set({ events, summary, sourceCode, algorithmId, currentStepIndex: 0, isPlaying: true }),
    
    stepForward: () => set((state) => ({
        currentStepIndex: Math.min(state.currentStepIndex + 1, state.events.length - 1)
    })),
    
    stepBackward: () => set((state) => ({
        currentStepIndex: Math.max(state.currentStepIndex - 1, 0)
    })),
    
    goToStep: (step) => set((state) => ({
        currentStepIndex: Math.max(0, Math.min(step, state.events.length - 1))
    })),
    
    play: () => set({ isPlaying: true }),
    
    pause: () => set({ isPlaying: false }),
    
    setPlaybackSpeed: (speed) => set({ playbackSpeed: speed }),
    
    reset: () => set({ events: [], summary: null, currentStepIndex: 0, isPlaying: true })
}))
