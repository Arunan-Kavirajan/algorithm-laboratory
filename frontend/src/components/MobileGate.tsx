import React, { useState, useEffect } from 'react';
import { MonitorX } from 'lucide-react';

export const MobileGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isRestricted, setIsRestricted] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
            const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            const isSmallScreen = window.innerWidth < 1024; // Restrict anything smaller than a standard desktop/laptop

            if (isMobileUA || isSmallScreen) {
                setIsRestricted(true);
            } else {
                setIsRestricted(false);
            }
        };

        checkDevice();
        window.addEventListener('resize', checkDevice);
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    if (isRestricted) {
        return (
            <div className="fixed inset-0 bg-background text-text z-[9999] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                {/* Background Styling */}
                <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-accent/20" />
                
                {/* Content */}
                <div className="relative z-10 max-w-lg border border-border/60 bg-surface/80 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-2xl flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                        <MonitorX size={32} className="text-red-400" />
                    </div>
                    
                    <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-widest mb-2 text-text">
                        System Halt
                    </h1>
                    <div className="text-[10px] font-mono text-red-400/80 uppercase tracking-[0.3em] mb-8">
                        Error: Insufficient Viewport
                    </div>
                    
                    <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-8">
                        The Algorithm Laboratory is a high-density technical instrument requiring significant screen real estate to render execution metrics, code diagnostics, and parallel visualization tracks.
                    </p>
                    
                    <div className="bg-background border border-border/50 rounded-lg p-4 w-full text-left font-mono text-xs text-text-muted space-y-2">
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span>Required Env:</span>
                            <span className="text-accent">Desktop / Laptop</span>
                        </div>
                        <div className="flex justify-between border-b border-border/50 pb-2">
                            <span>Min Resolution:</span>
                            <span className="text-accent">1024px width</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="text-red-400">Access Denied</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
