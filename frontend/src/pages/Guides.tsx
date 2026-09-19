import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { AlgorithmSelector } from '../components/AlgorithmSelector';
import { useThemeStore } from '../store/useThemeStore';

const markdownFiles = import.meta.glob('../content/guides/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export function Guides() {
    const [activeAlgorithm, setActiveAlgorithm] = useState('bubble_sort');
    const { theme } = useThemeStore();

    const markdownContent = useMemo(() => {
        const path = `../content/guides/${activeAlgorithm}.md`;
        return markdownFiles[path] || '# Guide not found\n\nThe guide for this algorithm is currently being generated...';
    }, [activeAlgorithm]);

    return (
        <div className="flex-1 flex flex-col h-full relative">
            <header className="sticky top-0 z-10 border-b border-border/60 bg-surface/80 backdrop-blur-xl px-5 py-3 flex items-center">
                <AlgorithmSelector value={activeAlgorithm} onChange={setActiveAlgorithm} />
            </header>

            <main className="flex-1 overflow-auto p-8 lg:p-12">
                <div className={`max-w-3xl mx-auto prose ${theme === 'dark' ? 'prose-invert' : ''} prose-headings:font-display prose-headings:text-text prose-p:text-text-secondary prose-strong:text-text prose-code:text-accent prose-a:text-accent`}>
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {markdownContent}
                    </ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
