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

        {/* EXPLORE THE LABORATORY */}
        <div className="mt-32 pt-16 border-t border-border">
          <h2 className="text-2xl font-display font-bold text-text mb-16 uppercase tracking-wider">Explore the Laboratory</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            
            {/* Sorting */}
            <div className="flex flex-col group">
              <div className="font-mono text-xs text-text-muted mb-8 whitespace-pre bg-surface border border-border p-6 select-none group-hover:border-accent transition-colors">
                <span className="text-text">[07]</span> <span className="text-text">[03]</span> [09] [01] [05]{'\n'}
                <span className="text-accent">  ↑    ↑{'\n'}</span>
                <span className="text-accent">   compare</span>
              </div>
              <h3 className="text-text font-bold text-lg mb-3 flex items-center gap-4">
                <span className="text-accent font-mono text-sm">01</span> SORTING
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Watch values move, compare, swap and settle into their final positions.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-[10px] text-text-secondary uppercase">
                <span>Bubble</span>•<span>Selection</span>•<span>Insertion</span>•<span>Merge</span>•<span>Quick</span>•<span>Heap</span>
              </div>
            </div>

            {/* Searching */}
            <div className="flex flex-col group">
              <div className="font-mono text-xs text-text-muted mb-8 whitespace-pre bg-surface border border-border p-6 select-none group-hover:border-accent transition-colors">
                01  04  08  <span className="text-text">12</span>  17  21  29{'\n'}
                <span className="text-accent">            ↑{'\n'}</span>
                <span className="text-accent">          middle</span>
              </div>
              <h3 className="text-text font-bold text-lg mb-3 flex items-center gap-4">
                <span className="text-accent font-mono text-sm">02</span> SEARCHING
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Observe the search space elegantly shrink or scan to locate the exact target.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-[10px] text-text-secondary uppercase">
                <span>Linear</span>•<span>Binary</span>
              </div>
            </div>

            {/* Graphs */}
            <div className="flex flex-col group">
              <div className="font-mono text-xs text-text-muted mb-8 whitespace-pre bg-surface border border-border p-6 select-none group-hover:border-accent transition-colors">
                {'      A\n'}
                {'     / \\\n'}
                {'    B   '}<span className="text-text">C</span>{'\n'}
                {'   /     \\\n'}
                <span className="text-accent">VISITING → C</span>
              </div>
              <h3 className="text-text font-bold text-lg mb-3 flex items-center gap-4">
                <span className="text-accent font-mono text-sm">03</span> GRAPHS
              </h3>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Follow algorithms as they traverse and evaluate deeply connected structures.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-[10px] text-text-secondary uppercase">
                <span>BFS</span>•<span>DFS</span>•<span>Dijkstra</span>
              </div>
            </div>

          </div>
        </div>

        {/* INSIDE AN ALGORITHM */}
        <div className="mt-32 pt-16 border-t border-border pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div className="border border-border bg-surface p-8 font-mono text-xs leading-loose text-text-muted">
              <div><span className="text-text">STEP 04 / 18</span></div>
              <div className="h-px bg-border my-4" />
              <div><span className="text-accent">COMPARE</span></div>
              <div className="my-4">
                [08]  [03]<br/>
                <span className="text-accent">  ↑     ↑</span>
              </div>
              <div><span className="text-text">08 {'>'} 03</span></div>
              <div className="mt-4 opacity-70">
                Therefore, the elements are swapped.
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-display font-bold text-text mb-6 uppercase tracking-wider">Inside an Algorithm</h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-6">
                Every animation you see is an actual operation performed by the algorithm in real-time.
              </p>
              <p className="text-text-muted text-sm leading-relaxed mb-10">
                Algorithm Laboratory doesn't just animate the final result. It maps the internal execution state directly to visual components, letting you inspect the exact mathematical and logical decisions being made.
              </p>

              <div className="flex flex-col gap-6 border-l border-border pl-6">
                <div>
                  <div className="text-xs font-mono text-accent mb-1">01 / LEARN</div>
                  <div className="text-sm text-text-muted">Read the mathematical theory.</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-accent mb-1">02 / VISUALIZE</div>
                  <div className="text-sm text-text-muted">Watch the algorithm execute.</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-accent mb-1">03 / INSPECT</div>
                  <div className="text-sm text-text-muted">Understand why an operation happened.</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-accent mb-1">04 / EXPERIMENT</div>
                  <div className="text-sm text-text-muted">Change the input and run it yourself.</div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
