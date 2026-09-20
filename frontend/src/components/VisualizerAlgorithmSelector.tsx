import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Algorithm {
  id: string;
  name: string;
  complexity: string;
}

interface AlgorithmCategory {
  label: string;
  algorithms: Algorithm[];
}

const CATEGORIES: AlgorithmCategory[] = [
  {
    label: 'Sorting',
    algorithms: [
      { id: 'bubble_sort', name: 'Bubble Sort', complexity: 'O(n\u00B2)' },
      { id: 'selection_sort', name: 'Selection Sort', complexity: 'O(n\u00B2)' },
      { id: 'insertion_sort', name: 'Insertion Sort', complexity: 'O(n\u00B2)' },
      { id: 'merge_sort', name: 'Merge Sort', complexity: 'O(n log n)' },
      { id: 'quick_sort', name: 'Quick Sort', complexity: 'O(n log n)' },
      { id: 'heap_sort', name: 'Heap Sort', complexity: 'O(n log n)' },
    ],
  },
  {
    label: 'Searching',
    algorithms: [
      { id: 'linear_search', name: 'Linear Search', complexity: 'O(n)' },
      { id: 'binary_search', name: 'Binary Search', complexity: 'O(log n)' },
    ],
  },
  {
    label: 'Graphs',
    algorithms: [
      { id: 'bfs', name: 'Breadth-First Search', complexity: 'O(V+E)' },
      { id: 'dfs', name: 'Depth-First Search', complexity: 'O(V+E)' },
      { id: 'dijkstra', name: "Dijkstra's Algorithm", complexity: 'O(V\u00B2)' },
    ],
  },
];

const MAX_COLS = 5;

interface VisualizerAlgorithmSelectorProps {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export function VisualizerAlgorithmSelector({ value, onChange, disabled }: VisualizerAlgorithmSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const allAlgorithms = CATEGORIES.flatMap(c => c.algorithms);
  const selected = allAlgorithms.find(a => a.id === value);
  const selectedCategory = CATEGORIES.find(c => c.algorithms.some(a => a.id === value));

  // Split categories into rows of MAX_COLS
  const rows: AlgorithmCategory[][] = [];
  for (let i = 0; i < CATEGORIES.length; i += MAX_COLS) {
    rows.push(CATEGORIES.slice(i, i + MAX_COLS));
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`group flex items-center gap-3 px-4 py-2 rounded-xl border border-border bg-surface-raised transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-hover hover:border-accent/30 cursor-pointer'
        } ${isOpen ? 'border-accent/40 bg-surface-hover' : ''}`}
      >
        {/* Category badge */}
        {selectedCategory && (
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-accent bg-accent/10 px-2 py-0.5 rounded-md">
            {selectedCategory.label}
          </span>
        )}
        <span className="text-sm font-medium text-text truncate">{selected?.name || 'Select Algorithm'}</span>
        <ChevronDown
          size={14}
          className={`text-text-muted transition-transform duration-200 shrink-0 ${isOpen && !disabled ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-0 mt-2 bg-surface-raised border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-3">
              {rows.map((row, ri) => (
                <div
                  key={ri}
                  className={`grid gap-3 ${ri > 0 ? 'mt-3 pt-3 border-t border-border-subtle' : ''}`}
                  style={{
                    gridTemplateColumns: `repeat(${row.length}, minmax(170px, 1fr))`,
                  }}
                >
                  {row.map((category) => (
                    <div key={category.label} className="flex flex-col min-w-0">
                      {/* Category Header */}
                      <div className="px-3 pt-2 pb-2.5 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                          {category.label}
                        </span>
                        <div className="flex-1 h-px bg-border-subtle" />
                      </div>

                      {/* Algorithm List */}
                      <div className="flex flex-col gap-0.5">
                        {category.algorithms.map((algo) => {
                          const isSelected = value === algo.id;
                          return (
                            <button
                              key={algo.id}
                              onClick={() => {
                                onChange(algo.id);
                                setIsOpen(false);
                              }}
                              className={`group/item flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[13px] transition-all duration-150 ${
                                isSelected
                                  ? 'bg-accent/12 text-accent'
                                  : 'text-text-secondary hover:bg-surface-hover hover:text-text'
                              }`}
                            >
                              <span className={`font-medium truncate ${isSelected ? 'text-accent' : ''}`}>
                                {algo.name}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 transition-colors ${
                                  isSelected
                                    ? 'bg-accent/15 text-accent'
                                    : 'text-text-muted group-hover/item:text-text-secondary'
                                }`}
                              >
                                {algo.complexity}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
