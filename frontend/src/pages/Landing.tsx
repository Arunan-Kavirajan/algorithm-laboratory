import { Link } from 'react-router-dom';
import { Activity, Shapes, BookOpen } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export function Landing() {
  const { theme } = useThemeStore();

  return (
    <div className="flex-1 flex flex-col bg-background relative selection:bg-accent-subtle selection:text-accent">
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      
      <div className="w-full max-w-6xl mx-auto px-6 py-12 md:py-20 flex-1 flex flex-col justify-center relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col">
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-text leading-[1.05] tracking-tight mb-6">
              Learn algorithms <br />
              <span className="text-accent">by seeing them in action.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mb-10">
              Welcome to the Algorithm Laboratory. It is a visual, interactive space where you can draw data structures, step through code line by line, and finally understand how the pieces connect together.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                to="/visualizer" 
                className="flex items-center justify-center gap-3 px-8 py-4 bg-text text-background hover:bg-accent transition-colors font-bold text-sm w-full sm:w-auto rounded-xl"
              >
                <Activity size={18} />
                Jump into the Visualizer
              </Link>
              
              <Link 
                to="/playground" 
                className="flex items-center justify-center gap-3 px-8 py-4 bg-surface border border-border text-text hover:bg-surface-raised transition-colors font-semibold text-sm w-full sm:w-auto rounded-xl"
              >
                <Shapes size={18} className="text-text-muted" />
                Open the Playground
              </Link>
            </div>
          </div>
          
          {/* Logo Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              {/* Subtle background ring to frame the logo */}
              <div className="absolute inset-0 rounded-full border border-border-subtle/40 bg-surface-raised/20" />
              <img 
                src={theme === 'dark' ? '/icon-mark-dark.svg' : '/icon-mark-light.svg'} 
                alt="Algorithm Laboratory Logo"
                className="w-40 h-40 md:w-48 md:h-48 drop-shadow-2xl animate-pulse"
                style={{ animationDuration: '4s' }}
              />
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          {[
            { 
              icon: Activity,
              title: 'Watch the Execution', 
              desc: 'Follow every step of the algorithm exactly as it runs in Python. See the variables change and watch the logic unfold right before your eyes.' 
            },
            { 
              icon: Shapes,
              title: 'Build Your Scenarios', 
              desc: 'Head into the playground to draw your own custom graphs. Stress test the algorithms against your own unique topologies.' 
            },
            { 
              icon: BookOpen,
              title: 'Read the Field Guides', 
              desc: 'Dive into our beginner friendly guides that explain the theory and mechanics behind the math, complete with interactive examples.' 
            },
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-2xl bg-surface border border-border hover:border-border-subtle hover:bg-surface-raised/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-accent-subtle text-accent flex items-center justify-center mb-6">
                <f.icon size={24} />
              </div>
              <h3 className="text-text font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
