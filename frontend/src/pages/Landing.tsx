import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

const frames = [
  { arr: [8, 3, 7, 1, 5], p1: 0, p2: 1, action: "COMPARE", detail: "08 > 03" },
  { arr: [3, 8, 7, 1, 5], p1: 0, p2: 1, action: "SWAP", detail: "08 ↔ 03" },
  { arr: [3, 8, 7, 1, 5], p1: 1, p2: 2, action: "COMPARE", detail: "08 > 07" },
  { arr: [3, 7, 8, 1, 5], p1: 1, p2: 2, action: "SWAP", detail: "08 ↔ 07" },
  { arr: [3, 7, 8, 1, 5], p1: 2, p2: 3, action: "COMPARE", detail: "08 > 01" },
  { arr: [3, 7, 1, 8, 5], p1: 2, p2: 3, action: "SWAP", detail: "08 ↔ 01" },
];

function MiniVisualizer() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % frames.length), 1800);
    return () => clearInterval(t);
  }, []);

  const frame = frames[step];

  return (
    <div className="w-full max-w-sm border border-border bg-surface font-mono text-sm flex flex-col relative overflow-hidden shadow-2xl shadow-background/50">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-surface-raised/50 px-4 py-2.5 text-[11px] text-text-muted tracking-widest uppercase">
        <span className="font-bold text-text">BUBBLE SORT</span>
        <span>SYS.OP.01</span>
      </div>
      
      {/* Main Area */}
      <div className="p-6 pb-2">
        <div className="flex justify-center gap-4 items-end h-28 mb-8">
          {frame.arr.map((val, idx) => {
            const isActive = idx === frame.p1 || idx === frame.p2;
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-8 flex flex-col justify-end items-center pb-2 transition-all duration-500 ease-in-out ${isActive ? 'bg-accent-subtle border border-accent text-accent' : 'bg-surface-raised border border-border-subtle text-text-muted'}`} 
                  style={{ height: `${val * 10}px` }}
                >
                  <span className={isActive ? 'font-bold' : ''}>{val.toString().padStart(2, '0')}</span>
                </div>
                {/* Pointer Arrow */}
                <div className={`h-4 text-accent transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  ↑
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Action Readout */}
        <div className="text-accent text-xs mb-6 h-4 tracking-[0.15em] flex justify-between items-center">
          <span className="opacity-80">[{frame.action}]</span>
          <span>{frame.detail}</span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center text-[10px] text-text-muted border-t border-border px-4 py-2.5 bg-surface-raised/30 tracking-widest">
        <span>STEP {String(step + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}</span>
        <span className="flex items-center gap-2 text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          ACTIVE
        </span>
      </div>
    </div>
  );
}

type Frame = {
  arr: number[];
  pointers: number[];
  action: string;
  detail: string;
  settled: number[];
};

const conceptFrames: Frame[] = [
  { arr: [8, 3, 7, 1, 5], pointers: [0, 1], action: "COMPARE", detail: "8 > 3", settled: [] },
  { arr: [3, 8, 7, 1, 5], pointers: [0, 1], action: "SWAP", detail: "Move 8 right", settled: [] },
  { arr: [3, 8, 7, 1, 5], pointers: [1, 2], action: "COMPARE", detail: "8 > 7", settled: [] },
  { arr: [3, 7, 8, 1, 5], pointers: [1, 2], action: "SWAP", detail: "Move 8 right", settled: [] },
  { arr: [3, 7, 8, 1, 5], pointers: [2, 3], action: "COMPARE", detail: "8 > 1", settled: [] },
  { arr: [3, 7, 1, 8, 5], pointers: [2, 3], action: "SWAP", detail: "Move 8 right", settled: [] },
  { arr: [3, 7, 1, 8, 5], pointers: [3, 4], action: "COMPARE", detail: "8 > 5", settled: [] },
  { arr: [3, 7, 1, 5, 8], pointers: [3, 4], action: "SWAP", detail: "Move 8 right", settled: [] },
  { arr: [3, 7, 1, 5, 8], pointers: [], action: "SETTLED", detail: "Largest moved to end", settled: [4] }
];

function ConceptVisualizer() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStep(s => {
        if (s === conceptFrames.length - 1) return 0;
        return s + 1;
      });
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const frame = conceptFrames[step];

  return (
    <div className="w-full border border-border bg-surface font-mono p-6 md:p-8 relative">
      <div className="flex justify-between items-center text-xs text-text-muted mb-12 uppercase tracking-widest border-b border-border/50 pb-4">
        <span>Execution Log</span>
        <span>{String(step + 1).padStart(2, '0')} / {String(conceptFrames.length).padStart(2, '0')}</span>
      </div>

      <div className="flex justify-center gap-4 md:gap-6 items-end h-24 mb-12">
        {frame.arr.map((val, idx) => {
          const isActive = frame.pointers.includes(idx);
          const isSettled = frame.settled.includes(idx);
          return (
            <div key={idx} className="flex flex-col items-center gap-3">
              <div 
                className={`w-10 flex flex-col justify-end items-center pb-2 transition-all duration-500 ease-in-out ${
                  isActive ? 'bg-accent-subtle border-b-2 border-accent text-accent' : 
                  isSettled ? 'bg-surface-hover border-b-2 border-text-muted text-text-muted opacity-50' : 
                  'bg-surface-raised border-b-2 border-border-subtle text-text'
                }`} 
                style={{ height: `${val * 8}px` }}
              >
                <span className={isActive ? 'font-bold' : ''}>{val.toString().padStart(2, '0')}</span>
              </div>
              <div className={`h-4 text-accent transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                ↑
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-surface-raised/50 border border-border-subtle p-4 flex flex-col gap-2">
        <div className="text-[10px] text-text-muted tracking-widest uppercase">Current Operation</div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-accent font-bold tracking-widest">{frame.action}</span>
          <span className="text-text-secondary">{frame.detail}</span>
        </div>
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
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-accent-subtle selection:text-accent">
      
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
      
      <div className="w-full max-w-5xl mx-auto px-6 py-20 flex-1 flex flex-col relative z-10">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[70vh]">
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
            >
              <MiniVisualizer />
            </motion.div>
          </div>
        </div>

        {/* EXPLORE ALGORITHMS */}
        <div className="mt-24 pt-16 border-t border-border">
          <h2 className="text-xl font-display font-bold text-text mb-8 tracking-tight uppercase">Explore Algorithms</h2>
          
          <div className="border border-border bg-surface-raised/20">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
              
              {/* Sorting */}
              <div className="p-8 group hover:bg-surface-raised/40 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <h3 className="text-text font-mono text-sm tracking-widest uppercase">Sorting</h3>
                </div>
                <div className="font-mono text-xs text-text-muted leading-relaxed mb-6">
                  Bubble · Selection · Insertion<br/>Merge · Quick · Heap
                </div>
                <div className="font-mono text-[10px] text-text-secondary whitespace-pre opacity-60 group-hover:opacity-100 transition-opacity">
                  [07] [03] [09] [01]{'\n'}
                  <span className="text-accent">  ↑    ↑{'\n'}</span>
                  <span className="text-accent"> compare</span>
                </div>
              </div>

              {/* Searching */}
              <div className="p-8 group hover:bg-surface-raised/40 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <h3 className="text-text font-mono text-sm tracking-widest uppercase">Searching</h3>
                </div>
                <div className="font-mono text-xs text-text-muted leading-relaxed mb-6">
                  Linear · Binary
                </div>
                <div className="font-mono text-[10px] text-text-secondary whitespace-pre opacity-60 group-hover:opacity-100 transition-opacity mt-10">
                  01  04  <span className="text-text">08</span>  12  17{'\n'}
                  <span className="text-accent">        ↑{'\n'}</span>
                  <span className="text-accent">      middle</span>
                </div>
              </div>

              {/* Graphs */}
              <div className="p-8 group hover:bg-surface-raised/40 transition-colors">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <h3 className="text-text font-mono text-sm tracking-widest uppercase">Graphs</h3>
                </div>
                <div className="font-mono text-xs text-text-muted leading-relaxed mb-6">
                  BFS · DFS · Dijkstra
                </div>
                <div className="font-mono text-[10px] text-text-secondary whitespace-pre opacity-60 group-hover:opacity-100 transition-opacity mt-10">
                  {'      A\n'}
                  {'     / \\\n'}
                  {'    B   '}<span className="text-text">C</span>{'\n'}
                  <span className="text-accent">VISITING → C</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* WATCH EVERY DECISION */}
        <div className="mt-24 pt-24 border-t border-border pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 md:order-1">
              <ConceptVisualizer />
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-display font-bold text-text mb-6 tracking-tight uppercase">Watch every decision</h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-12">
                The visualizer doesn't just show the final answer. It exposes the operations that produce it.
              </p>

              <div className="flex flex-col gap-8 font-mono text-xs tracking-widest">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-px bg-accent"></div>
                  <span className="text-text">COMPARE</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-px bg-accent"></div>
                  <span className="text-text">DECIDE</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-px bg-accent"></div>
                  <span className="text-text">MOVE</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FINAL CTA */}
        <div className="border-t border-border py-20 flex flex-col items-center text-center">
          <Link 
            to="/visualizer" 
            className="flex items-center justify-center px-10 py-4 bg-text text-background hover:bg-accent hover:text-background transition-colors font-mono font-bold text-sm w-full sm:w-auto"
          >
            ENTER THE LABORATORY
          </Link>
        </div>

      </div>
    </div>
  );
}
