import React, { useState, useMemo } from 'react';
import type { MenuItem, Modifier } from '../types';

interface ModifiersModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: MenuItem;
    onAddToCart: (selectedModifiers: Modifier[]) => void;
}

const ModifiersModal: React.FC<ModifiersModalProps> = ({ isOpen, onClose, item, onAddToCart }) => {
    const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);

    const handleModifierChange = (modifier: Modifier, isChecked: boolean) => {
        if (isChecked) {
            setSelectedModifiers(prev => [...prev, modifier]);
        } else {
            setSelectedModifiers(prev => prev.filter(m => m.id !== modifier.id));
        }
    };
    
    const total = useMemo(() => {
        const modifiersTotal = selectedModifiers.reduce((sum, mod) => sum + mod.price, 0);
        return item.price + modifiersTotal;
    }, [item.price, selectedModifiers]);

    const handleAddToCart = () => {
        onAddToCart(selectedModifiers);
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white rounded-xl shadow-2xl z-50 w-11/12 max-w-sm flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold text-brand-dark">Customize {item.name}</h2>
                     <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    <p className="text-sm text-gray-600">Base Price: RM {item.price.toFixed(2)}</p>
                    <div className="space-y-3">
                        <h3 className="font-bold text-gray-700">Add-ons:</h3>
                        {item.modifiers?.map(modifier => (
                            <label key={modifier.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div>
                                    <span className="font-semibold text-gray-800">{modifier.name}</span>
                                    <p className="text-xs text-gray-500">+ RM {modifier.price.toFixed(2)}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 rounded text-brand-primary focus:ring-brand-secondary"
                                    onChange={(e) => handleModifierChange(modifier, e.target.checked)}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <footer className="p-4 bg-gray-50 border-t-2">
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-brand-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 transition duration-300"
                    >
                        Add to Cart (RM {total.toFixed(2)})
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ModifiersModal;
