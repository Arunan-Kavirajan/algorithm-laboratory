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
            <div className="fixed inset-0 z-[9999] bg-background text-text flex items-center justify-center p-6 overflow-hidden min-h-[100dvh]">
                {/* Background Styling */}
                <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
                
                {/* Subtle Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
                
                {/* Sophisticated Content Card */}
                <div className="relative z-10 w-full max-w-sm bg-surface/50 backdrop-blur-2xl border border-border/50 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center text-center">
                    
                    {/* Icon Container */}
                    <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-border/50 shadow-inner flex items-center justify-center mb-8 relative">
                        <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-md" />
                        <MonitorX size={24} className="text-accent relative z-10" />
                    </div>
                    
                    <h1 className="text-2xl font-display font-medium tracking-wide mb-4 text-text">
                        Desktop Required
                    </h1>
                    
                    <p className="text-[13px] text-text-secondary leading-relaxed mb-8">
                        Algorithm Laboratory features high-density visualizations and complex code diagnostics that are designed exclusively for larger displays.
                    </p>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">
                        Please return on a PC
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
