import { Link } from 'react-router-dom';
import { Activity, Shapes, BookOpen, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

export function Landing() {
  const { theme, toggle } = useThemeStore();

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-accent-subtle selection:text-accent">
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={toggle}
          className="p-3 rounded-full bg-surface-raised/50 border border-border/50 text-text-muted hover:text-text hover:bg-surface-hover backdrop-blur-sm transition-colors shadow-sm"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Background Textures: Dot Grid + Film Grain */}
      <div className="absolute inset-0 dot-grid pointer-events-none opacity-50" />
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
      
      <div className="w-full max-w-6xl mx-auto px-6 py-12 md:py-24 flex-1 flex flex-col justify-center relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col">
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-text leading-[1.05] tracking-tight mb-6">
              Learn algorithms <br />
              <span className="text-accent">by seeing them in action.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mb-10">
              Welcome to the Algorithm Laboratory. It is a visual, interactive space where you can draw data structures, step through code line by line, and finally understand how the pieces connect together.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                to="/visualizer" 
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-text text-background hover:bg-accent hover:text-background transition-colors font-bold text-sm w-full sm:w-auto"
              >
                <Activity size={18} className="transition-transform group-hover:scale-110" />
                Jump into the Visualizer
              </Link>
              
              <Link 
                to="/playground" 
                className="group flex items-center justify-center gap-3 px-2 py-4 text-text hover:text-accent transition-colors font-semibold text-sm w-full sm:w-auto"
              >
                <Shapes size={18} />
                Open the Playground
              </Link>
            </div>
          </div>
          
          {/* Logo Showcase - Pure, floating, no boxes */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              <img 
                src={theme === 'dark' ? '/icon-mark-dark.svg' : '/icon-mark-light.svg'} 
                alt="Algorithm Laboratory Logo"
                className="w-48 h-48 md:w-56 md:h-56 drop-shadow-2xl animate-pulse"
                style={{ animationDuration: '5s' }}
              />
            </div>
          </div>
        </div>

        {/* Feature List - Pure Typography, no boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 border-t border-border/50 pt-12">
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
            <div key={i} className="flex flex-col group">
              <f.icon size={24} className="text-accent mb-5 opacity-80 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-text font-display font-bold text-xl mb-3">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
