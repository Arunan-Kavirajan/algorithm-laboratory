import { useState, useRef, useEffect } from 'react';
import { ChevronDown, BarChart2, Network } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface DataStructureOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const DATA_STRUCTURES: DataStructureOption[] = [
  { id: 'Array', label: 'Array', icon: BarChart2, description: 'Linear indexed collection' },
  { id: 'Graph', label: 'Graph', icon: Network, description: 'Nodes & edges' },
];

interface DataStructureSelectorProps {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export function DataStructureSelector({ value, onChange, disabled }: DataStructureSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const selected = DATA_STRUCTURES.find(ds => ds.id === value);
  const SelectedIcon = selected?.icon || BarChart2;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-border bg-surface-raised transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-hover hover:border-accent/30 cursor-pointer'
        } ${isOpen ? 'border-accent/40 bg-surface-hover' : ''}`}
      >
        <SelectedIcon size={14} className="text-accent shrink-0" />
        <span className="text-sm font-medium text-text">{selected?.label || 'Select Structure'}</span>
        <ChevronDown
          size={14}
          className={`text-text-muted transition-transform duration-200 shrink-0 ${isOpen && !disabled ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-0 mt-2 w-56 bg-surface-raised border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-1.5">
              <div className="px-3 pt-2 pb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                  Data Structure
                </span>
              </div>
              {DATA_STRUCTURES.map((ds) => {
                const Icon = ds.icon;
                const isSelected = value === ds.id;
                return (
                  <button
                    key={ds.id}
                    onClick={() => {
                      onChange(ds.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 ${
                      isSelected
                        ? 'bg-accent/12 text-accent'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text'
                    }`}
                  >
                    <Icon size={16} className={isSelected ? 'text-accent' : 'text-text-muted'} />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{ds.label}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-accent/60' : 'text-text-muted'}`}>
                        {ds.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
