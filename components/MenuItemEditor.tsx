
import React, { useState, useEffect, useContext, useRef } from 'react';
import type { MenuItem, OrderContextType } from '../types';
import { OrderContext } from '../App';

interface MenuItemEditorProps {
    isOpen: boolean;
    onClose: () => void;
    itemToEdit: MenuItem | null;
    defaultCategory?: string;
}

const MenuItemEditor: React.FC<MenuItemEditorProps> = ({ isOpen, onClose, itemToEdit, defaultCategory }) => {
    const context = useContext(OrderContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [image, setImage] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (itemToEdit) {
            setName(itemToEdit.name);
            setDescription(itemToEdit.description);
            setPrice(itemToEdit.price);
            setCategory(itemToEdit.category);
            setIsAvailable(itemToEdit.isAvailable);
            setIsFeatured(itemToEdit.isFeatured || false);
            setImage(itemToEdit.image);
            setImagePreview(itemToEdit.image);
        } else {
            // Reset form for new item
            setName('');
            setDescription('');
            setPrice(0);
            setCategory(defaultCategory || '');
            setIsAvailable(true);
            setIsFeatured(false);
            setImage('');
            setImagePreview(null);
        }
    }, [itemToEdit, defaultCategory, isOpen]);

    if (!context) return null;
    const { categories, addMenuItem, updateMenuItem } = context as OrderContextType;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImage(base64String);
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = () => {
        setImage('');
        setImagePreview(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input value
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !category) {
            alert('Name and category are required.');
            return;
        }

        const menuItemData = {
            name,
            description,
            price: Number(price),
            category,
            isAvailable,
            isFeatured,
            image: image || 'https://i.ibb.co/9yL6w3b/placeholder.png', // A default placeholder
            // Modifiers are not editable in this simple form for now
        };

        if (itemToEdit) {
            updateMenuItem({ ...menuItemData, id: itemToEdit.id });
        } else {
            addMenuItem(menuItemData);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl z-50 w-11/12 max-w-lg flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-xl font-bold text-brand-dark">{itemToEdit ? 'Edit Menu Item' : 'Add New Item'}</h2>
                </header>
                
                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3}></textarea>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-1">Price (RM)</label>
                            <input id="price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md" step="0.01" required />
                        </div>
                         <div>
                            <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <input
                                id="category"
                                type="text"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                list="category-list"
                                required
                            />
                            <datalist id="category-list">
                                {categories.map(cat => <option key={cat} value={cat} />)}
                            </datalist>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Image</label>
                        <div className="mt-2 flex justify-center items-center flex-col p-4 border-2 border-dashed border-gray-300 rounded-md">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-md shadow-sm" />
                                    <div className="mt-4 flex gap-3">
                                        <button type="button" onClick={handleUploadClick} className="text-sm font-semibold bg-brand-light text-brand-primary py-2 px-4 rounded-md hover:bg-brand-accent">
                                            Change Image
                                        </button>
                                        <button type="button" onClick={handleRemoveImage} className="text-sm font-semibold bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300">
                                            Remove
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="mt-2 text-sm text-gray-600">
                                        <button type="button" onClick={handleUploadClick} className="font-semibold text-brand-primary hover:text-brand-secondary focus:outline-none">
                                            Upload a file
                                        </button>
                                    </p>
                                    <p className="text-xs text-gray-500">PNG or JPG</p>
                                </div>
                            )}
                             <input
                                ref={fileInputRef}
                                id="image-upload"
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <input id="isAvailable" type="checkbox" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} className="h-5 w-5 rounded text-brand-primary focus:ring-brand-secondary" />
                            <label htmlFor="isAvailable" className="font-semibold text-gray-700">Item is Available</label>
                        </div>
                         <div className="flex items-center gap-3">
                            <input id="isFeatured" type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="h-5 w-5 rounded text-brand-primary focus:ring-brand-secondary" />
                            <label htmlFor="isFeatured" className="font-semibold text-gray-700">Feature this item on homepage</label>
                        </div>
                     </div>
                </form>

                <footer className="p-4 bg-gray-50 border-t-2 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300">
                        Cancel
                    </button>
                    <button type="submit" formNoValidate onClick={handleSubmit} className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:opacity-90">
                        {itemToEdit ? 'Save Changes' : 'Add Item'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default MenuItemEditor;