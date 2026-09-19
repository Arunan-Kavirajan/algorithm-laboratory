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
  filter?: string[]; // optional list of algorithm ids to show
}

export function AlgorithmSelector({ value, onChange, filter }: AlgorithmSelectorProps) {
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

  // Filter groups if needed
  const groups = filter
    ? ALL_ALGORITHMS.map((g) => ({
        ...g,
        algorithms: g.algorithms.filter((a) => filter.includes(a.id)),
      })).filter((g) => g.algorithms.length > 0)
    : ALL_ALGORITHMS;

  // Find the currently selected algorithm's display name
  const selected = ALL_ALGORITHMS.flatMap((g) => g.algorithms).find((a) => a.id === value);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-raised hover:bg-surface-hover text-sm font-medium text-text transition-all cursor-pointer"
      >
        <span className="truncate">{selected?.name || 'Select Algorithm'}</span>
        <ChevronDown
          size={14}
          className={`text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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
            className="absolute top-full left-0 mt-2 w-72 bg-surface-raised border border-border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="max-h-80 overflow-y-auto py-2">
              {groups.map((group, gi) => (
                <div key={group.label}>
                  {gi > 0 && <div className="mx-3 my-1.5 border-t border-border-subtle" />}
                  <div className="px-3 pt-2 pb-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                      {group.label}
                    </span>
                  </div>
                  {group.algorithms.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => {
                        onChange(algo.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 mx-0 text-sm transition-colors ${
                        value === algo.id
                          ? 'bg-accent-subtle text-accent'
                          : 'text-text-secondary hover:bg-surface-hover hover:text-text'
                      }`}
                    >
                      <span className="font-medium">{algo.name}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          value === algo.id
                            ? 'bg-accent/15 text-accent'
                            : 'bg-surface-hover text-text-muted'
                        }`}
                      >
                        {algo.complexity}
                      </span>
                    </button>
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
