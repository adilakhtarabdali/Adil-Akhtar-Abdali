import React, { useContext, useState } from 'react';
import { OrderContext } from '../App';
import type { MenuItem, OrderContextType } from '../types';
import MenuItemEditor from './MenuItemEditor';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import BulkMenuUploader from './BulkMenuUploader';

const MenuManagement: React.FC = () => {
    const context = useContext(OrderContext);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null);
    const [categoryForNewItem, setCategoryForNewItem] = useState('');

    if (!context) return <div>Loading...</div>;
    const { menuItems, categories, deleteMenuItem, deleteCategory, updateMenuItem } = context as OrderContextType;

    const handleOpenEditorToAdd = (category: string) => {
        setItemToEdit(null);
        setCategoryForNewItem(category);
        setIsEditorOpen(true);
    };

    const handleOpenEditorToEdit = (item: MenuItem) => {
        setItemToEdit(item);
        setCategoryForNewItem('');
        setIsEditorOpen(true);
    };
    
    const handleCloseEditor = () => {
        setIsEditorOpen(false);
        setItemToEdit(null);
        setCategoryForNewItem('');
    };

    const handleDeleteItem = (itemId: number, itemName: string) => {
        if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
            deleteMenuItem(itemId);
        }
    };
    
    const handleAddCategory = () => {
        const newCategoryName = window.prompt("Enter new category name:");
        if (newCategoryName && newCategoryName.trim()) {
            if (categories.includes(newCategoryName.trim())) {
                alert('Category already exists.');
            } else {
                // To create a category, we prompt the user to add the first item for it.
                alert(`Category "${newCategoryName.trim()}" will be created when you add the first menu item to it.`);
                handleOpenEditorToAdd(newCategoryName.trim());
            }
        }
    };
    
    const handleDeleteCategory = (category: string) => {
        if (window.confirm(`Are you sure you want to delete the "${category}" category? This can only be done if the category is empty.`)) {
            deleteCategory(category);
        }
    }

    const handleAvailabilityChange = (item: MenuItem, isAvailable: boolean) => {
        updateMenuItem({ ...item, isAvailable });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-6">
            <BulkMenuUploader />
            {categories.map(category => {
                const itemsInCategory = menuItems.filter(item => item.category === category);
                return (
                    <div key={category} className="border-b last:border-b-0 pb-4">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xl font-bold text-brand-dark">{category} ({itemsInCategory.length})</h4>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleOpenEditorToAdd(category)}
                                    className="flex items-center gap-1 text-sm bg-brand-secondary text-white font-semibold py-1 px-3 rounded-md hover:opacity-90"
                                >
                                    <PlusIcon /> Add Item
                                </button>
                                {itemsInCategory.length === 0 && (
                                     <button
                                        onClick={() => handleDeleteCategory(category)}
                                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-full"
                                        aria-label={`Delete category ${category}`}
                                     >
                                        <TrashIcon />
                                    </button>
                                )}
                            </div>
                        </div>
                        {itemsInCategory.length > 0 ? (
                            <ul className="space-y-2">
                                {itemsInCategory.map(item => (
                                    <li key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className={`w-12 h-12 object-cover rounded-md flex-shrink-0 transition-all ${!item.isAvailable ? 'filter grayscale' : ''}`} 
                                        />
                                        <div className="flex-grow">
                                            <p className={`font-semibold transition-colors ${!item.isAvailable ? 'text-gray-400' : 'text-brand-dark'}`}>{item.name}</p>
                                            <p className="text-sm text-gray-600">RM {item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <label className="relative inline-flex items-center cursor-pointer" title={item.isAvailable ? 'Available' : 'Unavailable'}>
                                              <input 
                                                type="checkbox" 
                                                checked={item.isAvailable}
                                                onChange={(e) => handleAvailabilityChange(item, e.target.checked)}
                                                className="sr-only peer" 
                                              />
                                              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-secondary"></div>
                                            </label>
                                            <button 
                                                onClick={() => handleOpenEditorToEdit(item)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full"
                                                aria-label={`Edit ${item.name}`}
                                            >
                                                <PencilIcon />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteItem(item.id, item.name)}
                                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-full"
                                                aria-label={`Delete ${item.name}`}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 italic">No items in this category.</p>
                        )}
                    </div>
                );
            })}
             <div className="pt-4">
                <button
                    onClick={handleAddCategory}
                    className="w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300"
                >
                    Add New Category
                </button>
            </div>

            <MenuItemEditor
                isOpen={isEditorOpen}
                onClose={handleCloseEditor}
                itemToEdit={itemToEdit}
                defaultCategory={categoryForNewItem}
            />
        </div>
    );
};

export default MenuManagement;