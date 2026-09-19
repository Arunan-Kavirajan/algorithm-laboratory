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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(22, 19, 31, 0.7)', backdropFilter: 'blur(12px)' }}>
            <div 
                className="bg-surface-raised border border-border rounded-3xl w-full overflow-hidden"
                style={{ maxWidth: '320px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
            >
                <div className="p-6 flex flex-col items-center text-center">
                    
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-surface border border-border-subtle">
                        {type === 'prompt' ? (
                            <HelpCircle size={18} className="text-accent" />
                        ) : (
                            <AlertCircle size={18} className="text-state-swap" />
                        )}
                    </div>
                    
                    <h3 className="text-sm font-bold text-text tracking-wide font-display">{title}</h3>
                    {message && <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed">{message}</p>}
                    
                    {type === 'prompt' && (
                        <div className="w-full mt-4 flex justify-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value.replace(/[^0-9-]/g, ''))}
                                placeholder={placeholder}
                                className="w-24 bg-transparent border-b-2 border-border px-2 py-1 text-3xl font-bold font-mono text-center text-accent placeholder-text-muted/30 focus:outline-none focus:border-accent transition-colors"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleConfirm();
                                    if (e.key === 'Escape') onClose();
                                }}
                            />
                        </div>
                    )}
                </div>
                
                <div className="flex border-t border-border/60">
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
                        className={`flex-1 py-3 text-[11px] uppercase tracking-wider font-bold transition-colors ${type === 'prompt' ? 'text-accent hover:bg-accent-subtle' : 'text-text hover:bg-surface-hover'}`}
                    >
                        {type === 'prompt' ? 'Confirm' : 'OK'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
