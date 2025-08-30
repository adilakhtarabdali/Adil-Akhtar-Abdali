

import React, { useState, useEffect } from 'react';
import type { CartItem } from '../types';
import { OrderType } from '../types';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    orderType: OrderType | null;
    tableNumber?: string;
    onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
    onCheckout: (details: { customerName: string, customerPhone: string, notes: string }) => Promise<void>;
    onClearCart: () => void;
    isModifyingOrder?: boolean;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, orderType, tableNumber, onUpdateQuantity, onCheckout, onClearCart, isModifyingOrder = false }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setError('');
        }
    }, [isOpen]);
    
    const calculateItemTotal = (item: CartItem) => {
        const modifiersPrice = item.selectedModifiers.reduce((sum, mod) => sum + mod.price, 0);
        return (item.price + modifiersPrice) * item.quantity;
    };

    const total = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);

    const handleProceedToCheckout = async () => {
        if (orderType !== 'Dine-in' && !customerName.trim() && !isModifyingOrder) {
            setError('Please enter a name for the order.');
            return;
        }
        setError('');
        await onCheckout({ customerName, customerPhone, notes });
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to remove all items from your cart?')) {
            onClearCart();
        }
    };

    const isDineIn = orderType === 'Dine-in';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="cart-heading">
            <div
                className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-100 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out"
                style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 bg-white border-b flex justify-between items-center sticky top-0">
                    <div className="flex items-baseline gap-3">
                        <h2 id="cart-heading" className="text-2xl font-serif font-bold text-brand-dark">Your Order</h2>
                        {cartItems.length > 0 && (
                            <button onClick={handleClearCart} className="text-sm font-semibold text-red-500 hover:text-red-700 hover:underline">
                                Clear Cart
                            </button>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close cart">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                
                {cartItems.length > 0 && !isModifyingOrder && (
                    <div className="p-4 bg-white border-b space-y-4">
                        {isDineIn ? (
                            <div className="p-3 bg-brand-light rounded-lg text-center">
                                <p className="font-bold text-brand-dark">Ordering for Table: <span className="text-brand-primary text-xl font-serif">{tableNumber}</span></p>
                            </div>
                        ) : (
                             <div className="space-y-3">
                                <h3 className="font-bold text-gray-800">Order Details ({orderType})</h3>
                                <div>
                                    <label htmlFor="customerName" className="block text-sm font-bold text-gray-700 mb-1">Your Name *</label>
                                    <input
                                        type="text"
                                        id="customerName"
                                        value={customerName}
                                        onChange={(e) => {
                                            setCustomerName(e.target.value);
                                            if(error) setError('');
                                        }}
                                        placeholder="e.g., John Doe"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="customerPhone" className="block text-sm font-bold text-gray-700 mb-1">Phone Number (Optional)</label>
                                    <input
                                        type="tel"
                                        id="customerPhone"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="e.g., 012-3456789"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                    />
                                </div>
                                {error && (
                                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md" role="alert">
                                        <p className="font-bold">{error}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}


                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-100">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            <div className="text-gray-300">
                                <ShoppingCartIcon />
                            </div>
                            <h3 className="text-xl font-bold text-gray-700 mt-4">Your cart is empty</h3>
                            <p className="max-w-xs mt-1">Looks like you haven't added anything to your order yet.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {cartItems.map(item => (
                                <li key={item.cartItemId} className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="flex items-start">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                        <div className="flex-grow">
                                            <p className="font-bold text-brand-dark">{item.name}</p>
                                            <p className="text-sm text-gray-600">RM {item.price.toFixed(2)}</p>
                                            {item.selectedModifiers.length > 0 && (
                                                <div className="text-xs text-gray-500 mt-1 pl-2 border-l-2">
                                                    {item.selectedModifiers.map(mod => (
                                                        <p key={mod.id}>+ {mod.name} (RM {mod.price.toFixed(2)})</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center">
                                            <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)} className="px-3 py-1 bg-gray-200 rounded-l font-bold">-</button>
                                            <span className="px-4 py-1 bg-white" aria-label={`Quantity for ${item.name}`}>{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)} className="px-3 py-1 bg-gray-200 rounded-r font-bold">+</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <footer className="p-4 bg-white border-t-2 border-gray-200 space-y-4">
                         <div>
                            <label htmlFor="notes" className="block text-sm font-bold text-gray-700 mb-1">Special Requests</label>
                             <textarea
                                 id="notes"
                                 value={notes}
                                 onChange={e => setNotes(e.target.value)}
                                 placeholder="e.g., Allergic to peanuts, extra spicy..."
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                 rows={2}
                             ></textarea>
                         </div>
                         <div className="flex gap-2">
                            <input type="text" placeholder="Apply Promo Code" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                            <button className="bg-gray-200 text-brand-dark font-bold px-4 rounded-md hover:bg-gray-300">Apply</button>
                         </div>
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total:</span>
                            <span className="text-brand-primary">RM {total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleProceedToCheckout}
                            disabled={cartItems.length === 0}
                            className="w-full bg-brand-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
                        >
                            {isModifyingOrder ? 'Add Items to Order' : 'Proceed to Checkout'}
                        </button>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default Cart;