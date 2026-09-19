import React from 'react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-opacity">
            <div className="bg-surface border border-border shadow-2xl rounded-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
                    {message && <p className="text-sm text-text-muted mb-4">{message}</p>}
                    
                    {type === 'prompt' && (
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleConfirm();
                                if (e.key === 'Escape') onClose();
                            }}
                        />
                    )}
                </div>
                
                <div className="bg-surface-hover px-6 py-4 border-t border-border flex items-center justify-end gap-3">
                    {type === 'prompt' && (
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button 
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors shadow-sm"
                    >
                        {type === 'prompt' ? 'Confirm' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
};
