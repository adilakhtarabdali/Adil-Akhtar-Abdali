import React, { useState } from 'react';
import type { MenuItem, Modifier } from '../types';
import ModifiersModal from './ModifiersModal';
import CheckIcon from './icons/CheckIcon';

interface MenuItemCardProps {
    item: MenuItem;
    onAddToCart: (item: MenuItem, selectedModifiers: Modifier[]) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [justAdded, setJustAdded] = useState(false);
    const hasModifiers = item.modifiers && item.modifiers.length > 0;

    const handleAddToCart = () => {
        onAddToCart(item, []);
        showAddedConfirmation();
    };
    
    const handleAddToCustomizedCart = (selectedModifiers: Modifier[]) => {
        onAddToCart(item, selectedModifiers);
        setIsModalOpen(false);
        showAddedConfirmation();
    }

    const showAddedConfirmation = () => {
        setJustAdded(true);
        setTimeout(() => {
            setJustAdded(false);
        }, 1500);
    }

    return (
        <>
            <div className={`bg-white rounded-xl shadow-md overflow-hidden flex transition-shadow duration-300 hover:shadow-xl ${!item.isAvailable ? 'select-none' : ''}`}>
                <div className="relative w-28 flex-shrink-0">
                    <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-cover ${!item.isAvailable ? 'filter grayscale' : ''}`}
                    />
                    {!item.isAvailable && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold text-xs uppercase tracking-wider bg-black bg-opacity-70 px-2 py-1 rounded">
                                Sold Out
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                        <h3 className={`text-lg font-bold font-serif ${!item.isAvailable ? 'text-gray-500' : 'text-brand-dark'}`}>{item.name}</h3>
                        <p className={`text-sm text-gray-600 mt-1 line-clamp-2 ${!item.isAvailable ? 'text-gray-500' : 'text-gray-600'}`}>{item.description}</p>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                        <span className={`text-lg font-bold ${!item.isAvailable ? 'text-gray-400' : 'text-brand-primary'}`}>
                            RM {item.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                            {hasModifiers && (
                                <button
                                    disabled={!item.isAvailable}
                                    className="bg-gray-200 text-gray-600 font-bold py-2 px-3 rounded-lg text-xs hover:bg-gray-300 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition duration-300"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                   Customize
                                </button>
                            )}
                            <button
                                onClick={handleAddToCart}
                                disabled={!item.isAvailable}
                                className={`font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 ${
                                    justAdded 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-brand-primary text-white hover:bg-opacity-80 disabled:bg-gray-400 disabled:cursor-not-allowed'
                                }`}
                            >
                                {justAdded ? (
                                    <span className="flex items-center gap-1">Added <CheckIcon className="h-4 w-4"/></span>
                                ) : (
                                    item.isAvailable ? 'Add' : 'Sold Out'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {hasModifiers && (
                <ModifiersModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    item={item}
                    onAddToCart={handleAddToCustomizedCart}
                />
            )}
        </>
    );
};

export default MenuItemCard;