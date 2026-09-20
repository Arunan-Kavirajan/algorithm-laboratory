import React from 'react';
import { Plus, Minus, Shuffle, ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ArrayElement {
    id: string;
    value: number;
}

interface ArrayBuilderProps {
    values: ArrayElement[];
    onChange: (newValues: ArrayElement[]) => void;
    disableRandomize?: boolean;
}

export const ArrayBuilder: React.FC<ArrayBuilderProps> = ({ values, onChange, disableRandomize }) => {
    // Limits
    const MIN_SIZE = 3;
    const MAX_SIZE = 15;
    const MAX_VAL = 99;

    const generateRandomValue = () => Math.floor(Math.random() * 95) + 5;

    const handleAdd = () => {
        if (values.length < MAX_SIZE) {
            onChange([...values, { id: `el-${Date.now()}`, value: generateRandomValue() }]);
        }
    };

    const handleRemove = () => {
        if (values.length > MIN_SIZE) {
            onChange(values.slice(0, -1));
        }
    };

    const handleRandomize = () => {
        onChange(values.map(v => ({ ...v, value: generateRandomValue() })));
    };

    const handleSortAsc = () => {
        onChange([...values].sort((a, b) => a.value - b.value));
    };

    const handleSortDesc = () => {
        onChange([...values].sort((a, b) => b.value - a.value));
    };

    const handleValueChange = (id: string, newVal: string) => {
        // Allow empty string temporarily for typing
        if (newVal === '') {
            onChange(values.map(v => v.id === id ? { ...v, value: 0 } : v));
            return;
        }
        
        let num = parseInt(newVal, 10);
        if (isNaN(num)) return;
        
        // Clamp between 1 and MAX_VAL
        num = Math.max(1, Math.min(MAX_VAL, num));
        
        onChange(values.map(v => v.id === id ? { ...v, value: num } : v));
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto gap-12 p-8">
            {/* Visualizer Preview */}
            <div className="w-full flex items-end justify-center gap-2 md:gap-3 lg:gap-4 h-64 bg-surface/30 rounded-2xl p-6 border border-border-subtle relative overflow-hidden">
                <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
                
                <AnimatePresence mode="popLayout">
                    {values.map((item) => {
                        const height = `${Math.max(5, (item.value / MAX_VAL) * 100)}%`;
                        
                        return (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                className="flex flex-col items-center gap-3 relative z-10"
                                style={{ height: '100%', justifyContent: 'flex-end' }}
                            >
                                <motion.div 
                                    className="w-10 md:w-12 lg:w-14 bg-surface-raised border border-border rounded-t-md relative flex items-end justify-center overflow-hidden shadow-md"
                                    style={{ height, minHeight: '24px' }}
                                    layout
                                >
                                    {/* Fill effect */}
                                    <div className="absolute bottom-0 left-0 right-0 h-full bg-accent/20 border-t border-accent transition-all duration-300" />
                                </motion.div>
                                
                                {/* Input field for the value */}
                                <input 
                                    type="number"
                                    value={item.value || ''}
                                    onChange={(e) => handleValueChange(item.id, e.target.value)}
                                    min="1"
                                    max="99"
                                    className="w-10 md:w-12 lg:w-14 bg-surface border border-border rounded text-center text-xs font-mono font-bold text-text focus:border-accent focus:outline-none py-1.5 transition-colors hide-number-spinners"
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 bg-surface-raised/50 p-3 rounded-xl border border-border-subtle">
                <div className="flex items-center gap-2 bg-surface p-1 rounded-lg border border-border">
                    <button 
                        onClick={handleRemove}
                        disabled={values.length <= MIN_SIZE}
                        className="p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Decrease Size"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="text-xs font-mono font-bold text-text w-8 text-center">{values.length}</span>
                    <button 
                        onClick={handleAdd}
                        disabled={values.length >= MAX_SIZE}
                        className="p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Increase Size"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div className="w-px h-6 bg-border mx-2 hidden sm:block" />

                {!disableRandomize && (
                    <button 
                        onClick={handleRandomize}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-surface border border-border hover:bg-surface-hover rounded-lg transition-colors"
                    >
                        <Shuffle size={14} /> Randomize
                    </button>
                )}

                <div className="flex items-center gap-2 bg-surface p-1 rounded-lg border border-border">
                    <button 
                        onClick={handleSortAsc}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-muted hover:text-text hover:bg-surface-hover rounded-md transition-colors"
                        title="Sort Ascending"
                    >
                        <ArrowDownAZ size={14} /> Asc
                    </button>
                    <button 
                        onClick={handleSortDesc}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-text-muted hover:text-text hover:bg-surface-hover rounded-md transition-colors"
                        title="Sort Descending"
                    >
                        <ArrowUpZA size={14} /> Desc
                    </button>
                </div>
            </div>
            
            <style>{`
                .hide-number-spinners::-webkit-inner-spin-button,
                .hide-number-spinners::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .hide-number-spinners {
                    -moz-appearance: textfield;
                }
            `}</style>
        </div>
    );
};
