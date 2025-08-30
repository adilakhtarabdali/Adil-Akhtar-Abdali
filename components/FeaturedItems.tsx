
import React from 'react';
import type { MenuItem, Modifier } from '../types';

interface FeaturedItemsProps {
    items: MenuItem[];
    onAddToCart: (item: MenuItem, selectedModifiers: Modifier[]) => void;
}

const FeaturedItems: React.FC<FeaturedItemsProps> = ({ items, onAddToCart }) => {
    
    const handleAddToCart = (item: MenuItem) => {
        // For simplicity, featured items with modifiers are not customizable here.
        // A more advanced implementation could open the modifiers modal.
        if (item.modifiers && item.modifiers.length > 0) {
            alert("This item has customization options. Please find it in its category to add your preferred add-ons.");
            return;
        }
        onAddToCart(item, []);
    };

    return (
        <div className="animate-fade-in-down">
            <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4">Chef's Recommendations</h2>
            {/* FIX: Corrected CSS property '-ms-overflow-style' to 'msOverflowStyle' for React inline styles. */}
            <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                 {items.map(item => (
                    <div key={item.id} className="flex-shrink-0 w-48 bg-white rounded-xl shadow-md overflow-hidden group">
                        <div className="relative h-32">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold text-brand-dark truncate">{item.name}</h3>
                            <p className="text-sm text-gray-500">RM {item.price.toFixed(2)}</p>
                            <button
                                onClick={() => handleAddToCart(item)}
                                className="mt-2 w-full bg-brand-primary text-white text-sm font-bold py-2 rounded-lg hover:bg-opacity-80 transition duration-300"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedItems;
