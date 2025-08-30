
import React, { useState, useMemo, useContext } from 'react';
import type { MenuItem, CartItem, Order, Modifier, OrderContextType } from '../types';
import MenuItemCard from './MenuItemCard';
import Cart from './Cart';
import { OrderContext } from '../App';

const CustomerView: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    
    const orderContext = useContext(OrderContext);

    if (!orderContext) {
        return <div>Loading...</div>; // Or some error state
    }

    const { addOrder, menuItems } = orderContext as OrderContextType;
    
    // FIX: Refactored the reduce function to be more explicit for better type inference.
    // It now uses the dynamic menuItems from context.
    const categories = useMemo(() => {
        return menuItems.reduce((acc, item) => {
            const category = item.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as Record<string, MenuItem[]>);
    }, [menuItems]);

    // FIX: Updated addToCart to handle modifiers and create a proper CartItem. Its signature now matches the prop type from MenuItemCard.
    const addToCart = (item: MenuItem, selectedModifiers: Modifier[]) => {
        const cartItemId = `${item.id}-${selectedModifiers.map(m => m.id).sort().join('-')}`;
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.cartItemId === cartItemId);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.cartItemId === cartItemId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1, selectedModifiers, cartItemId }];
        });
        setIsCartOpen(true);
    };

    // FIX: Changed parameter from itemId (number) to cartItemId (string) to match what Cart component provides.
    const updateQuantity = (cartItemId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            setCart(prevCart => prevCart.filter(item => item.cartItemId !== cartItemId));
        } else {
            setCart(prevCart =>
                prevCart.map(item => (item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item))
            );
        }
    };

    const handleClearCart = () => {
        setCart([]);
    };

    // FIX: Updated placeOrder to match `onCheckout` prop, add missing Order properties, and correct logic.
    const placeOrder = async (details: { customerName: string; customerPhone: string; notes: string; }) => {
        // This component is for a simplified Dine-in flow.
        // A table number is not collected here, so we use a placeholder.
        const tableNumber = 'N/A';
        if (cart.length === 0) return;

        const total = cart.reduce((sum, item) => {
            const modifiersTotal = item.selectedModifiers.reduce((modSum, mod) => modSum + mod.price, 0);
            return sum + (item.price + modifiersTotal) * item.quantity;
        }, 0);

        const newOrder: Order = {
            id: new Date().getTime().toString(),
            orderType: 'Dine-in',
            tableNumber,
            items: cart,
            total,
            timestamp: new Date(),
            status: 'new',
            paymentMethod: 'Cash', // Defaulting to Cash for this simplified view
            paymentStatus: 'Pending',
            notes: details.notes,
        };
        await addOrder(newOrder);
        setCart([]);
        setIsCartOpen(false);
        setOrderPlaced(true);
        setTimeout(() => setOrderPlaced(false), 5000); // Reset after 5s
    };
    
    const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (orderPlaced) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold font-serif text-brand-primary mb-2">Order Placed Successfully!</h2>
                <p className="text-gray-600">Your order has been sent to the kitchen. Please wait for it to be served at your table.</p>
                <button onClick={() => setOrderPlaced(false)} className="mt-6 bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-80 transition-transform transform hover:scale-105">
                    Place Another Order
                </button>
            </div>
        )
    }

    return (
        <div>
            <div className="grid grid-cols-1 gap-8">
                {Object.entries(categories).map(([category, items]) => (
                    <div key={category}>
                        <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4 pb-2 border-b-2 border-brand-secondary">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map(item => (
                                <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {cart.length > 0 && (
                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="fixed bottom-6 right-6 bg-brand-accent text-brand-dark p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                        {cartTotalItems}
                    </span>
                </button>
            )}

            {/* FIX: Changed `onPlaceOrder` to `onCheckout` to match the prop in the Cart component. */}
            <Cart 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
                cartItems={cart} 
                orderType="Dine-in"
                onUpdateQuantity={updateQuantity}
                onCheckout={placeOrder}
                onClearCart={handleClearCart}
            />
        </div>
    );
};

export default CustomerView;
