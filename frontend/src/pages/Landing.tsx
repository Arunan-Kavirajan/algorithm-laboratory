import { Link } from 'react-router-dom';
import { Activity, Shapes } from 'lucide-react';

export function Landing() {
  return (
    <div className="flex-1 flex flex-col bg-background relative selection:bg-accent-subtle selection:text-accent">
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      
      <div className="w-full max-w-6xl mx-auto px-6 py-12 md:py-20 flex-1 flex flex-col justify-center relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-px bg-accent"></span>
              <span className="text-accent font-mono text-xs uppercase tracking-widest">System Ready</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-text leading-[1.05] tracking-tight mb-8">
              The architecture <br />
              <span className="text-text-muted">of computation.</span>
            </h1>
            
            <p className="text-lg text-text-secondary max-w-2xl leading-relaxed mb-10">
              Algorithm Laboratory is a minimal, structured environment designed to dissect, build, and observe data structures and algorithms in real-time. No magic—just pure logic.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                to="/visualizer" 
                className="flex items-center justify-center gap-3 px-8 py-4 bg-text text-background hover:bg-accent transition-colors font-mono font-bold text-sm w-full sm:w-auto"
              >
                <Activity size={16} />
                ENTER_VISUALIZER
              </Link>
              
              <Link 
                to="/playground" 
                className="flex items-center justify-center gap-3 px-8 py-4 bg-surface border border-border text-text hover:bg-surface-raised transition-colors font-mono font-medium text-sm w-full sm:w-auto"
              >
                <Shapes size={16} className="text-text-muted" />
                OPEN_PLAYGROUND
              </Link>
            </div>
          </div>
          
          {/* Minimalist Geometric Aesthetic */}
          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div className="relative w-72 h-72 border border-border bg-surface-raised/20 flex flex-col items-center justify-center">
              <div className="absolute inset-4 border border-border-subtle border-dashed pointer-events-none" />
              <div className="w-16 h-16 border-[1.5px] border-accent rounded-full flex items-center justify-center relative">
                <div className="w-2 h-2 bg-text rounded-full animate-pulse" />
                {/* Structural lines connecting to the border */}
                <div className="absolute top-[-92px] left-1/2 w-px h-[92px] bg-border-subtle" />
                <div className="absolute bottom-[-92px] left-1/2 w-px h-[92px] bg-border-subtle" />
                <div className="absolute left-[-92px] top-1/2 h-px w-[92px] bg-border-subtle" />
                <div className="absolute right-[-92px] top-1/2 h-px w-[92px] bg-border-subtle" />
              </div>
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-text" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-text" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-text" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-text" />
              
              <div className="absolute bottom-6 right-6 text-[10px] font-mono text-text-muted">
                [ FIG 01. GRAPH_NODE ]
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Structural Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-border mt-24">
          {[
            { id: '01', title: 'Execution Engine', desc: 'Step-by-step evaluation mapped directly to source code lines. Absolute transparency into algorithm mechanics.' },
            { id: '02', title: 'Topological Playground', desc: 'Manually construct custom graph structures. Draw nodes and edges to stress test search algorithms.' },
            { id: '03', title: 'Theory & Mechanics', desc: 'Comprehensive technical documentation and visual walkthroughs for each algorithm.' },
          ].map((f, i) => (
            <div key={i} className={`p-8 border-border flex flex-col hover:bg-surface-hover/30 transition-colors ${i !== 2 ? 'md:border-r' : ''} ${i !== 0 ? 'border-t md:border-t-0' : ''}`}>
              <span className="text-accent font-mono text-xs mb-8">{f.id} //</span>
              <h3 className="text-text font-bold text-lg mb-3">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
