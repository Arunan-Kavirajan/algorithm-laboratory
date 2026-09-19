class AudioEngine {
    private ctx: AudioContext | null = null;
    private minFreq = 120; // Hz
    private maxFreq = 1200; // Hz

    public init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    public playTone(value: number, maxValue: number, type: 'compare' | 'swap' = 'compare') {
        if (!this.ctx) return;

        // Exponential frequency mapping
        const freq = this.minFreq * Math.pow(this.maxFreq / this.minFreq, value / Math.max(maxValue, 1));

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        // Waveform configuration
        osc.type = type === 'swap' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Enveloping to prevent clicking
        const maxVolume = type === 'swap' ? 0.15 : 0.05; // Swaps are slightly louder and punchier
        const attackTime = 0.01;
        const releaseTime = type === 'swap' ? 0.05 : 0.03;

        gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(maxVolume, this.ctx.currentTime + attackTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + attackTime + releaseTime);

        // Connections
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        // Start and Schedule Stop
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + attackTime + releaseTime);

        // Cleanup
        osc.onended = () => {
            osc.disconnect();
            gainNode.disconnect();
        };
    }
}

export const audio = new AudioEngine();
