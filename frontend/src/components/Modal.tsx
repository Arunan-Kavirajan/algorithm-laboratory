import React from 'react';
import { createPortal } from 'react-dom';
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

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md transition-opacity">
            <div 
                className="bg-surface border border-border/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                style={{ maxWidth: '280px' }}
            >
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
                        <div className="w-full mt-4 flex justify-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value.replace(/[^0-9-]/g, ''))}
                                placeholder={placeholder}
                                className="w-24 bg-transparent border-b-2 border-border/50 px-2 py-1 text-3xl font-bold font-mono text-center text-accent placeholder-text-muted/30 focus:outline-none focus:border-accent transition-colors"
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
        </div>,
        document.body
    );
};
