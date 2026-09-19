import React from 'react';
import { HelpCircle, AlertCircle } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    title: string;
    message?: string;
    onClose: () => void;
    onConfirm?: (value?: string) => void;
    type?: 'alert' | 'prompt';
    defaultValue?: string;
    placeholder?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
    isOpen, title, message, onClose, onConfirm, type = 'alert', defaultValue = '', placeholder = '' 
}) => {
    const [inputValue, setInputValue] = React.useState(defaultValue);

    React.useEffect(() => {
        if (isOpen) {
            setInputValue(defaultValue);
        }
    }, [isOpen, defaultValue]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm(type === 'prompt' ? inputValue : undefined);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-md transition-opacity">
            <div className="bg-surface border border-border/60 shadow-[0_10px_40px_rgba(0,0,0,0.3)] rounded-2xl w-full max-w-[280px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-5 flex flex-col items-center text-center">
                    
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-background border border-border shadow-sm">
                        {type === 'prompt' ? (
                            <HelpCircle size={18} className="text-accent" />
                        ) : (
                            <AlertCircle size={18} className="text-red-400" />
                        )}
                    </div>
                    
                    <h3 className="text-sm font-bold text-text tracking-wide">{title}</h3>
                    {message && <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">{message}</p>}
                    
                    {type === 'prompt' && (
                        <div className="w-full mt-4 relative group">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={placeholder}
                                className="w-full bg-background border border-border/80 rounded-xl px-4 py-2.5 text-base font-mono font-bold text-center text-accent placeholder-text-muted/30 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-inner"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleConfirm();
                                    if (e.key === 'Escape') onClose();
                                }}
                            />
                        </div>
                    )}
                </div>
                
                <div className="flex border-t border-border/60 bg-background/30">
                    {type === 'prompt' && (
                        <button 
                            onClick={onClose}
                            className="flex-1 py-3 text-[11px] uppercase tracking-wider font-semibold text-text-muted hover:text-text hover:bg-surface-hover transition-colors border-r border-border/60"
                        >
                            Cancel
                        </button>
                    )}
                    <button 
                        onClick={handleConfirm}
                        className={`flex-1 py-3 text-[11px] uppercase tracking-wider font-bold transition-colors ${type === 'prompt' ? 'text-accent hover:bg-accent/10' : 'text-text hover:bg-surface-hover'}`}
                    >
                        {type === 'prompt' ? 'Confirm' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
};
