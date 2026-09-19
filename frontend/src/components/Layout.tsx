import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, BookOpen, Shapes, Sun, Moon, Menu, X, Zap } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';

const navItems = [
  { path: '/visualizer', label: 'Visualizer', icon: Activity },
  { path: '/compare', label: 'Benchmark', icon: Zap },
  { path: '/guides', label: 'Guides', icon: BookOpen },
  { path: '/playground', label: 'Playground', icon: Shapes },
];

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useThemeStore();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-surface/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 h-14">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={theme === 'dark' ? '/logo-horizontal-dark.svg' : '/logo-horizontal-light.svg'}
              alt="Algorithm Laboratory"
              className="h-6"
            />
          </Link>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-raised/60 rounded-xl px-1.5 py-1 border border-border-subtle/50">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(path)
                    ? 'bg-accent-subtle text-accent shadow-sm'
                    : 'text-text-muted hover:text-text hover:bg-surface-hover/60'
                }`}
              >
                <Icon size={15} strokeWidth={isActive(path) ? 2.5 : 2} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/40 bg-surface px-4 py-3 flex flex-col gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-accent-subtle text-accent'
                    : 'text-text-muted hover:text-text hover:bg-surface-hover'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 overflow-auto flex flex-col relative">
        <Outlet />
      </main>
    </div>
  );
}
