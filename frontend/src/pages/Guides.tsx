import { useState } from 'react';

export function Guides() {
    const [activeAlgorithm, setActiveAlgorithm] = useState('bubble_sort');

    return (
        <div className="flex-1 flex flex-col font-sans h-full relative">
            <header className="border-b border-border bg-surface px-6 py-4 flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-semibold tracking-tight text-text">Algorithm Guide</h2>
                        <p className="text-xs text-text-muted font-mono uppercase tracking-wider flex items-center gap-2 mt-1">
                            <select 
                                value={activeAlgorithm}
                                onChange={(e) => setActiveAlgorithm(e.target.value)}
                                className="bg-background border border-border text-accent rounded px-2 py-0.5 outline-none focus:border-accent"
                            >
                                <option value="bubble_sort">Bubble Sort</option>
                                <option value="selection_sort">Selection Sort</option>
                                <option value="insertion_sort">Insertion Sort</option>
                                <option value="merge_sort">Merge Sort</option>
                                <option value="quick_sort">Quick Sort</option>
                                <option value="heap_sort">Heap Sort</option>
                                <option value="linear_search">Linear Search</option>
                                <option value="binary_search">Binary Search</option>
                                <option value="bfs">Breadth-First Search (BFS)</option>
                                <option value="dfs">Depth-First Search (DFS)</option>
                                <option value="dijkstra">Dijkstra's Shortest Path</option>
                            </select>
                        </p>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-auto p-8 max-w-4xl mx-auto w-full">
                <div className="text-text-muted italic">
                    I will generate the markdown guides for each of these in the next step!
                </div>
            </main>
        </div>
    );
}
