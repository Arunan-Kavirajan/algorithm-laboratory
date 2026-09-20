import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface Algorithm {
  id: string;
  name: string;
  complexity: string;
}

interface AlgorithmGroup {
  label: string;
  algorithms: Algorithm[];
}

const ALL_ALGORITHMS: AlgorithmGroup[] = [
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
    label: 'Graph Algorithms',
    algorithms: [
      { id: 'bfs', name: 'Breadth-First Search', complexity: 'O(V+E)' },
      { id: 'dfs', name: 'Depth-First Search', complexity: 'O(V+E)' },
      { id: 'dijkstra', name: "Dijkstra's Shortest Path", complexity: 'O(V\u00B2)' },
    ],
  },
];

interface AlgorithmSelectorProps {
  value: string;
  onChange: (id: string) => void;
  filter?: string[];
  category?: 'Sorting' | 'Searching' | 'Graph Algorithms';
  disabled?: boolean;
  disabledOptions?: string[];
}

export function AlgorithmSelector({ value, onChange, filter, category, disabled, disabledOptions = [] }: AlgorithmSelectorProps) {
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

  let groups = ALL_ALGORITHMS;
  if (category) {
      groups = groups.filter(g => g.label === category);
  }
  if (filter) {
      groups = groups.map((g) => ({
        ...g,
        algorithms: g.algorithms.filter((a) => filter.includes(a.id)),
      })).filter((g) => g.algorithms.length > 0);
  }

  const selected = ALL_ALGORITHMS.flatMap((g) => g.algorithms).find((a) => a.id === value);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-border bg-surface-raised transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-hover cursor-pointer'
        } text-sm font-medium text-text`}
      >
        <span className="truncate">{selected?.name || 'Select Algorithm'}</span>
        <ChevronDown
          size={14}
          className={`text-text-muted transition-transform duration-200 shrink-0 ${isOpen && !disabled ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full left-0 mt-2 w-80 bg-surface-raised border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="py-2">
              {groups.map((group, gi) => (
                <div key={group.label}>
                  {gi > 0 && <div className="mx-4 my-2 border-t border-border" />}
                  <div className="px-4 pt-3 pb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
                      {group.label}
                    </span>
                  </div>
                  {group.algorithms.map((algo) => {
                    const isDisabledOption = disabledOptions.includes(algo.id);
                    return (
                    <button
                      key={algo.id}
                      disabled={isDisabledOption}
                      onClick={() => {
                        onChange(algo.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] transition-colors ${
                        isDisabledOption
                          ? 'opacity-30 cursor-not-allowed text-text-muted'
                          : value === algo.id
                          ? 'bg-accent-subtle text-accent'
                          : 'text-text-secondary hover:bg-surface-hover hover:text-text'
                      }`}
                    >
                      <span className="font-medium">{algo.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          value === algo.id
                            ? 'bg-accent/15 text-accent'
                            : 'bg-surface-hover text-text-muted'
                        }`}
                      >
                        {algo.complexity}
                      </span>
                    </button>
                  )})}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
