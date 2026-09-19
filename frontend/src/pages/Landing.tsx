import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Sparkles, Activity, BookOpen, Shapes } from 'lucide-react';

export function Landing() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Constellation & Nebulas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 dot-grid opacity-10" />
        
        {/* Glowing Nebulas */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-state-compare/10 blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-state-swap/10 blur-[120px]"
        />
      </div>

      <div className="z-10 flex flex-col items-center text-center px-6 max-w-4xl mt-[-5vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-raised border border-border-subtle text-xs font-mono text-text-muted mb-8 shadow-sm"
        >
          <Sparkles size={14} className="text-state-compare" />
          <span>Observatory Engine v2.0</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-text to-text-secondary leading-[1.1] mb-6"
        >
          Decode the Universe <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">of Algorithms.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed mb-10"
        >
          A celestial laboratory for data structures and algorithms. Visualize execution, build custom topologies, and deeply understand code mechanics.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link 
            to="/visualizer" 
            className="group relative flex items-center gap-3 px-8 py-4 bg-accent text-background rounded-2xl font-bold text-lg overflow-hidden shadow-[0_0_40px_var(--color-accent-glow)] hover:shadow-[0_0_60px_var(--color-accent-glow)] transition-all duration-300 w-full sm:w-auto justify-center hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <Play size={20} fill="currentColor" className="relative z-10" />
            <span className="relative z-10">Launch Visualizer</span>
          </Link>

          <Link 
            to="/playground" 
            className="group flex items-center gap-3 px-8 py-4 bg-surface-raised text-text border border-border rounded-2xl font-semibold text-lg hover:bg-surface-hover transition-all duration-300 w-full sm:w-auto justify-center hover:-translate-y-1"
          >
            <Shapes size={20} className="text-text-secondary group-hover:text-text transition-colors" />
            <span>Open Playground</span>
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full"
        >
          {[
            { icon: Activity, title: 'Live Execution', desc: 'Watch algorithms step-by-step with synchronized code highlighting.' },
            { icon: Shapes, title: 'Graph Builder', desc: 'Construct your own complex graphs and trees in the interactive playground.' },
            { icon: BookOpen, title: 'Deep Guides', desc: 'Learn the theory behind the mechanics with comprehensive visual guides.' },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-sm hover:bg-surface-hover/50 transition-colors shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-subtle text-accent mb-4">
                <f.icon size={24} />
              </div>
              <h3 className="text-text font-bold mb-2">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
