
import React from 'react';
import { CATEGORY_IMAGES } from '../constants';
import type { MenuItem, Modifier } from '../types';
import FeaturedItems from './FeaturedItems';

interface CategoriesPageProps {
    categories: string[];
    menuItems: MenuItem[];
    onSelectCategory: (category: string) => void;
    onAddToCart: (item: MenuItem, selectedModifiers: Modifier[]) => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories, menuItems, onSelectCategory, onAddToCart }) => {
    const featuredItems = menuItems.filter(item => item.isFeatured && item.isAvailable);

    return (
        <div className="space-y-8">
            {featuredItems.length > 0 && (
                <FeaturedItems items={featuredItems} onAddToCart={onAddToCart} />
            )}

            <div>
                <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4">Or Browse by Category</h2>
                <div className="grid grid-cols-2 gap-4">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => onSelectCategory(category)}
                            className="relative aspect-square rounded-lg shadow-lg overflow-hidden group transform transition-transform duration-300 hover:scale-105"
                        >
                            <img 
                                src={CATEGORY_IMAGES[category] || CATEGORY_IMAGES.Default} 
                                alt={category}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>
                            <div className="absolute inset-0 flex items-center justify-center p-2">
                                <span className="text-white text-lg font-bold font-serif text-center">
                                    {category}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;