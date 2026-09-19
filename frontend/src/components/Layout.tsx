import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent/30 bg-background text-text">
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-surface border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-accent to-blue-800 flex items-center justify-center shadow-lg shadow-accent/20">
                    <span className="text-white font-bold font-mono tracking-tighter text-sm">AL</span>
                </div>
                <h2 className="text-sm font-bold tracking-tight text-text">Navigation</h2>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-text-muted hover:text-text transition-colors rounded-lg p-1 hover:bg-surface-hover">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="p-3 flex flex-col gap-2">
            <Link to="/" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/' ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-muted hover:bg-surface-hover hover:text-text border border-transparent'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Visualizer
            </Link>
            <Link to="/guides" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname.startsWith('/guides') ? 'bg-accent/10 text-accent border border-accent/20' : 'text-text-muted hover:bg-surface-hover hover:text-text border border-transparent'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Guides
            </Link>
        </div>
      </div>

      {/* Global Top Navigation */}
      <header className="border-b border-border bg-surface px-6 py-4 flex items-center gap-4 z-10 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3 border-l border-border pl-4">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-accent to-blue-800 flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="text-white font-bold font-mono tracking-tighter">AL</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-text">Algorithm Laboratory</h1>
            </div>
          </div>
      </header>
      
      {/* Page Content */}
      <main className="flex-1 overflow-auto flex flex-col relative">
        <Outlet />
      </main>
    </div>
  );
}
