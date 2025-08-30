
import React, { useState, useMemo } from 'react';
import type { MenuItem, Modifier } from '../types';
import MenuItemCard from './MenuItemCard';
import SearchIcon from './icons/SearchIcon';

interface MenuPageProps {
    category: string;
    items: MenuItem[];
    onAddToCart: (item: MenuItem, selectedModifiers: Modifier[]) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ items, onAddToCart }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery.trim()) {
            return items;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return items.filter(item => 
            item.name.toLowerCase().includes(lowercasedQuery) ||
            item.description.toLowerCase().includes(lowercasedQuery)
        );
    }, [items, searchQuery]);

    return (
        <div className="space-y-4">
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
                <input
                    type="text"
                    placeholder="Search in this category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
            </div>
            {filteredItems.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">
                    {searchQuery ? `No items found for "${searchQuery}".` : 'No items found in this category.'}
                </p>
            ) : (
                <div className="space-y-4 animate-fade-in-up">
                    {filteredItems.map(item => (
                        <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuPage;