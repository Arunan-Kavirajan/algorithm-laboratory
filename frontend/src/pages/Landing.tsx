import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

type Frame = {
  arr: number[];
  pointers: number[];
  action: string;
  detail: string;
  settled: number[];
};

const frames: Frame[] = [
  { arr: [8, 3, 7, 1, 5], pointers: [0, 1], action: "COMPARE", detail: "08 > 03", settled: [] },
  { arr: [3, 8, 7, 1, 5], pointers: [0, 1], action: "SWAP", detail: "08 ↔ 03", settled: [] },
  { arr: [3, 8, 7, 1, 5], pointers: [1, 2], action: "COMPARE", detail: "08 > 07", settled: [] },
  { arr: [3, 7, 8, 1, 5], pointers: [1, 2], action: "SWAP", detail: "08 ↔ 07", settled: [] },
  { arr: [3, 7, 8, 1, 5], pointers: [2, 3], action: "COMPARE", detail: "08 > 01", settled: [] },
  { arr: [3, 7, 1, 8, 5], pointers: [2, 3], action: "SWAP", detail: "08 ↔ 01", settled: [] },
  { arr: [3, 7, 1, 8, 5], pointers: [3, 4], action: "COMPARE", detail: "08 > 05", settled: [] },
  { arr: [3, 7, 1, 5, 8], pointers: [3, 4], action: "SWAP", detail: "08 ↔ 05", settled: [] },
  { arr: [3, 7, 1, 5, 8], pointers: [], action: "SETTLED", detail: "Element in position", settled: [4] }
];

function HeroVisualizer() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStep(s => (s + 1) % frames.length);
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const frame = frames[step];

  return (
    <div className="w-full max-w-md border border-border bg-surface font-mono p-6 md:p-8 relative shadow-2xl shadow-background/50">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-4 text-xs text-text-muted tracking-widest uppercase mb-10">
        <span className="font-bold text-text">BUBBLE SORT</span>
        <span>SYS.OP.01</span>
      </div>
      
      {/* Array Area */}
      <div className="flex justify-center gap-4 md:gap-6 items-end h-28 mb-10">
        {frame.arr.map((val, idx) => {
          const isActive = frame.pointers.includes(idx);
          const isSettled = frame.settled.includes(idx);
          
          return (
            <motion.div 
              layout
              key={val}
              className="flex flex-col items-center gap-3"
            >
              <div 
                className={`w-10 flex flex-col justify-end items-center pb-2 transition-colors duration-300 ${
                  isActive ? 'bg-accent/20 border-b-2 border-accent text-accent' : 
                  isSettled ? 'bg-surface-hover border-b-2 border-text-muted text-text-muted opacity-50' : 
                  'bg-surface-raised border-b-2 border-border-subtle text-text'
                }`} 
                style={{ height: `${val * 8}px` }}
              >
                <span className={isActive ? 'font-bold' : ''}>{val.toString().padStart(2, '0')}</span>
              </div>
              
              <div className={`h-4 text-accent transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                ↑
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Action Readout */}
      <div className="bg-surface-raised/50 border border-border-subtle p-4 flex flex-col gap-2 mb-8">
        <div className="text-[10px] text-text-muted tracking-widest uppercase">Current Operation</div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-accent font-bold tracking-widest">[{frame.action}]</span>
          <span className="text-text-secondary">{frame.detail}</span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center text-[10px] text-text-muted border-t border-border/50 pt-4 tracking-widest">
        <span>STEP {String(step + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}</span>
        <span className="flex items-center gap-2 text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          ACTIVE
        </span>
      </div>
      
    </div>
  );
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function Landing() {
  const { theme, toggle } = useThemeStore();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background relative selection:bg-accent-subtle selection:text-accent overflow-hidden">
      
      {/* Navigation (Just Theme Toggle) */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggle}
          className="p-3 rounded-none border border-border text-text-muted hover:text-text hover:bg-surface transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Background Textures: Dot Grid + Film Grain */}
      <div className="absolute inset-0 dot-grid pointer-events-none opacity-40" />
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      
      <div className="w-full max-w-5xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center relative z-10">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 flex flex-col"
          >
            <motion.div variants={item} className="mb-8">
              <img 
                src={theme === 'dark' ? '/logo-horizontal-dark.svg' : '/logo-horizontal-light.svg'} 
                alt="Algorithm Laboratory"
                className="h-7 opacity-80"
              />
            </motion.div>

            <motion.h1 
              variants={item}
              className="text-5xl md:text-7xl font-display font-bold text-text leading-[1.05] tracking-tight mb-8"
            >
              Algorithms, <br />
              <span className="text-text-muted">made visible.</span>
            </motion.h1>
            
            <motion.p 
              variants={item}
              className="text-lg md:text-xl text-text-secondary max-w-xl leading-relaxed mb-10"
            >
              Don't just read about an algorithm. Watch it work. Explore data structures through interactive visualizations that reveal the decisions behind every single step.
            </motion.p>
            
            <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                to="/visualizer" 
                className="flex items-center justify-center px-8 py-3.5 bg-text text-background hover:bg-accent hover:text-background transition-colors font-mono font-bold text-sm w-full sm:w-auto"
              >
                ENTER_VISUALIZER
              </Link>
              
              <Link 
                to="/playground" 
                className="flex items-center justify-center px-8 py-3.5 border border-border text-text hover:bg-surface-raised transition-colors font-mono font-medium text-sm w-full sm:w-auto"
              >
                OPEN_PLAYGROUND
              </Link>
            </motion.div>
          </motion.div>
          
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-full flex justify-end"
            >
              <HeroVisualizer />
            </motion.div>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-border/50 relative z-10 bg-background/80 backdrop-blur-sm mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 md:py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Left */}
            <div className="flex flex-col">
              <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-4 flex items-center gap-3">
                <div className="w-6 h-px bg-border" />
                LAB.AUTHOR // 001
              </div>
              <div className="text-text font-bold uppercase tracking-widest text-sm mb-4">
                Built by Arunan Kavirajan
              </div>
              <div className="flex gap-6 font-mono text-xs text-text-secondary">
                <a href="https://www.linkedin.com/in/arunan-kavirajan" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                  LinkedIn
                </a>
                <a href="https://github.com/Arunan-Kavirajan" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                  GitHub
                </a>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col md:items-end">
              <div className="text-[10px] text-text-muted font-mono tracking-widest uppercase mb-4 flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                SYSTEM.MAINTAINER
                <div className="w-6 h-px bg-border md:hidden" />
              </div>
              <div className="text-text font-bold uppercase tracking-widest text-sm mb-4">
                Found a bug?
              </div>
              <div className="font-mono text-xs text-text-secondary">
                <a href="mailto:arunan.kavirajan@gmail.com" className="hover:text-accent transition-colors">
                  arunan.kavirajan@gmail.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] font-mono text-text-muted tracking-widest uppercase border-t border-border/50 pt-8">
            <div>
              © 2026 Arunan Kavirajan. All rights reserved.
            </div>
            <div>
              Algorithm Laboratory
            </div>
          </div>
          
        </div>
      </footer>

    </div>
  );
}
