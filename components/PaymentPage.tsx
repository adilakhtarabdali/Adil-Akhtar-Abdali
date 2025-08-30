
import React, { useState, useMemo } from 'react';
import type { CartItem, OrderType, PaymentMethod } from '../types';
import SplitBill from './SplitBill';
import SplitBillIcon from './icons/SplitBillIcon';
import CardIcon from './icons/CardIcon';
import FPXIcon from './icons/FPXIcon';
import TNGIcon from './icons/TNGIcon';
import GrabPayIcon from './icons/GrabPayIcon';
import GooglePayIcon from './icons/GooglePayIcon';
import ApplePayIcon from './icons/ApplePayIcon';
import ShopeePayIcon from './icons/ShopeePayIcon';
import BoostIcon from './icons/BoostIcon';
import CashIcon from './icons/CashIcon';
import CheckIcon from './icons/CheckIcon';

interface PaymentPageProps {
    cartItems: CartItem[];
    orderType: OrderType;
    tableNumber?: string;
    customerName?: string;
    customerPhone?: string;
    notes?: string;
    onPlaceOrder: (paymentMethod: PaymentMethod) => Promise<void>;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ cartItems, orderType, tableNumber, customerName, customerPhone, notes, onPlaceOrder }) => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
    const [isSplitting, setIsSplitting] = useState(false);
    const [paidCartItemIds, setPaidCartItemIds] = useState<Set<string>>(new Set());

    const paymentOptions = useMemo(() => {
        const isDelivery = orderType === 'Delivery';
        return {
            counter: [
                {
                    name: isDelivery ? 'Pay with Cash on Delivery' : 'Pay with Cash',
                    value: 'Cash' as PaymentMethod,
                    icon: <CashIcon />,
                },
            ],
            card: [
                { name: 'Credit / Debit Card', value: 'Credit/Debit Card' as PaymentMethod, icon: <CardIcon /> },
            ],
            ewallets: [
                { name: 'Touch \'n Go', value: 'Touch n Go' as PaymentMethod, icon: <TNGIcon /> },
                { name: 'GrabPay', value: 'GrabPay' as PaymentMethod, icon: <GrabPayIcon /> },
                { name: 'ShopeePay', value: 'ShopeePay' as PaymentMethod, icon: <ShopeePayIcon /> },
                { name: 'Boost', value: 'Boost' as PaymentMethod, icon: <BoostIcon /> },
                { name: 'Google Pay', value: 'Google Pay' as PaymentMethod, icon: <GooglePayIcon /> },
                { name: 'Apple Pay', value: 'Apple Pay' as PaymentMethod, icon: <ApplePayIcon /> },
            ],
            banking: [
                { name: 'FPX Online Banking', value: 'FPX' as PaymentMethod, icon: <FPXIcon /> },
            ]
        };
    }, [orderType]);


    const calculateItemTotal = (item: CartItem) => {
        const modifiersPrice = item.selectedModifiers.reduce((sum, mod) => sum + mod.price, 0);
        return (item.price + modifiersPrice) * item.quantity;
    };
    const total = cartItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);

    const allItemsPaid = useMemo(() => {
        return cartItems.length > 0 && paidCartItemIds.size === cartItems.length;
    }, [paidCartItemIds, cartItems]);
    
    const handlePlaceOrder = async () => {
        if (isSplitting && !allItemsPaid) {
            alert("Please ensure all items are paid for before confirming the order.");
            return;
        }
        await onPlaceOrder(paymentMethod);
    }

    const handlePayShare = (itemIdsToPay: string[]) => {
        setPaidCartItemIds(prev => new Set([...prev, ...itemIdsToPay]));
    };

    const isDineIn = orderType === 'Dine-in';
    const confirmButtonDisabled = isSplitting && !allItemsPaid;

    return (
        <div className="flex flex-col h-full">
            {isSplitting ? (
                <SplitBill
                    items={cartItems}
                    paidItemIds={paidCartItemIds}
                    onPayShare={handlePayShare}
                    onClose={() => setIsSplitting(false)}
                />
            ) : (
                <div className="flex-grow overflow-y-auto p-4 space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center border-b pb-2 mb-2">
                            <h3 className="text-lg font-bold text-brand-dark">Order Summary</h3>
                            {isDineIn && cartItems.length > 0 && (
                                <button onClick={() => setIsSplitting(true)} className="flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-blue-200">
                                    <SplitBillIcon />
                                    Split Bill
                                </button>
                            )}
                        </div>
                        <div className="text-md font-semibold text-brand-primary mb-3">
                            {orderType === 'Dine-in' 
                                ? `For Table: ${tableNumber}` 
                                : `For: ${customerName} (${orderType})`
                            }
                            {customerPhone && <div className="text-sm text-gray-600 font-normal">Phone: {customerPhone}</div>}
                        </div>
                        <ul className="space-y-2">
                            {cartItems.map(item => (
                                <li key={item.cartItemId} className="text-sm border-b pb-2">
                                    <div className="flex justify-between">
                                        <span className="font-semibold text-gray-800">{item.quantity}x {item.name}</span>
                                        <span className="text-gray-600">RM {calculateItemTotal(item).toFixed(2)}</span>
                                    </div>
                                    {item.selectedModifiers.length > 0 && (
                                        <div className="pl-4 text-xs text-gray-500">
                                            {item.selectedModifiers.map(mod => (
                                                <p key={mod.id}>+ {mod.name}</p>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {notes && (
                            <div className="mt-3 pt-3 border-t">
                                <p className="font-bold text-sm text-gray-700">Your Notes:</p>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{notes}</p>
                            </div>
                        )}
                         <div className="flex justify-between items-center text-lg font-bold mt-3 pt-3 border-t">
                            <span>Total:</span>
                            <span className="text-brand-primary">RM {total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-4 rounded-lg shadow space-y-4">
                        <h3 className="text-lg font-bold text-brand-dark border-b pb-2">Payment Method</h3>

                        {/* Pay at Counter / Cash on Delivery */}
                        <div>
                            <h4 className="font-semibold text-gray-500 text-sm mb-2">
                                {orderType === 'Delivery' ? 'Cash on Delivery' : 'Pay at Counter'}
                            </h4>
                            {paymentOptions.counter.map(option => {
                                const isSelected = paymentMethod === option.value;
                                return (
                                <button key={option.value} onClick={() => setPaymentMethod(option.value)} className={`relative w-full flex items-center p-3 rounded-lg border-2 transition-all ${isSelected ? 'border-brand-primary bg-brand-light' : 'border-gray-300 hover:bg-gray-50'}`}>
                                    {option.icon}
                                    <span className="ml-3 font-semibold text-gray-700">{option.name}</span>
                                    {isSelected && <div className="absolute top-2 right-2 text-brand-primary"><CheckIcon /></div>}
                                </button>
                            )})}
                        </div>
                        
                        {/* Card */}
                        <div>
                            <h4 className="font-semibold text-gray-500 text-sm mb-2">Credit / Debit Card</h4>
                            {paymentOptions.card.map(option => {
                                const isSelected = paymentMethod === option.value;
                                return (
                                <button key={option.value} onClick={() => setPaymentMethod(option.value)} className={`relative w-full flex items-center p-3 rounded-lg border-2 transition-all ${isSelected ? 'border-brand-primary bg-brand-light' : 'border-gray-300 hover:bg-gray-50'}`}>
                                    {option.icon}
                                    <span className="ml-3 font-semibold text-gray-700">{option.name}</span>
                                    {isSelected && <div className="absolute top-2 right-2 text-brand-primary"><CheckIcon /></div>}
                                </button>
                            )})}
                        </div>

                        {/* E-Wallets */}
                        <div>
                            <h4 className="font-semibold text-gray-500 text-sm mb-2">E-Wallets</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {paymentOptions.ewallets.map(option => {
                                    const isSelected = paymentMethod === option.value;
                                    return (
                                        <button key={option.value} onClick={() => setPaymentMethod(option.value)} className={`relative flex items-center justify-center p-3 rounded-lg border-2 aspect-video transition-all ${isSelected ? 'border-brand-primary bg-brand-light' : 'border-gray-300 hover:bg-gray-50'}`}>
                                            {option.icon}
                                            {isSelected && <div className="absolute top-1 right-1 text-brand-primary"><CheckIcon /></div>}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Online Banking */}
                        <div>
                             <h4 className="font-semibold text-gray-500 text-sm mb-2">Online Banking</h4>
                            {paymentOptions.banking.map(option => {
                                const isSelected = paymentMethod === option.value;
                                return (
                                <button key={option.value} onClick={() => setPaymentMethod(option.value)} className={`relative w-full flex items-center p-3 rounded-lg border-2 transition-all ${isSelected ? 'border-brand-primary bg-brand-light' : 'border-gray-300 hover:bg-gray-50'}`}>
                                    {option.icon}
                                    <span className="ml-3 font-semibold text-gray-700">{option.name}</span>
                                    {isSelected && <div className="absolute top-2 right-2 text-brand-primary"><CheckIcon /></div>}
                                </button>
                            )})}
                        </div>

                        {paymentMethod !== 'Cash' && (
                            <div className="p-3 mt-2 bg-gray-100 rounded-md text-sm text-gray-800 animate-fade-in-up text-center">
                                <p>You will be redirected to <strong className="text-brand-primary">{paymentMethod}</strong> to complete your payment.</p>
                                <p className="text-xs mt-1 text-gray-500">(This is a demo. No actual payment will be processed.)</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            <footer className="p-4 bg-white border-t-2">
                 <button
                    onClick={handlePlaceOrder}
                    disabled={confirmButtonDisabled}
                    className="w-full bg-brand-secondary text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
                >
                    {isSplitting 
                        ? (allItemsPaid ? `Confirm Final Order (RM ${total.toFixed(2)})` : 'Waiting for all items to be paid...')
                        : `Confirm Order (Total: RM ${total.toFixed(2)})`
                    }
                </button>
            </footer>
        </div>
    );
};

export default PaymentPage;
