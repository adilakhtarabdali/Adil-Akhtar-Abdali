
import React, { useState, useMemo } from 'react';
import type { CartItem } from '../types';
import UsersIcon from './icons/UsersIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface SplitBillProps {
    items: CartItem[];
    paidItemIds: Set<string>;
    onPayShare: (itemIdsToPay: string[]) => void;
    onClose: () => void;
}

type SplitMode = 'item' | 'equally';

const SplitBill: React.FC<SplitBillProps> = ({ items, paidItemIds, onPayShare, onClose }) => {
    const [mode, setMode] = useState<SplitMode>('item');
    const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
    const [splitCount, setSplitCount] = useState(2);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const [paidAmount, setPaidAmount] = useState(0);

    const unpaidItems = useMemo(() => items.filter(item => !paidItemIds.has(item.cartItemId)), [items, paidItemIds]);
    const remainingTotal = unpaidItems.reduce((sum, item) => sum + (item.price + item.selectedModifiers.reduce((s, m) => s + m.price, 0)) * item.quantity, 0);

    const currentSelectionTotal = useMemo(() => {
        if (mode === 'equally') {
            return remainingTotal / splitCount;
        }
        return unpaidItems
            .filter(item => selectedItemIds.has(item.cartItemId))
            .reduce((sum, item) => sum + (item.price + item.selectedModifiers.reduce((s, m) => s + m.price, 0)) * item.quantity, 0);
    }, [unpaidItems, selectedItemIds, mode, splitCount, remainingTotal]);

    const toggleItemSelection = (cartItemId: string) => {
        setSelectedItemIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(cartItemId)) {
                newSet.delete(cartItemId);
            } else {
                newSet.add(cartItemId);
            }
            return newSet;
        });
    };

    const handlePay = () => {
        if (mode === 'item') {
            if (selectedItemIds.size === 0) return;
            onPayShare(Array.from(selectedItemIds));
            setPaidAmount(currentSelectionTotal);
            setSelectedItemIds(new Set());
        } else { // equally
            // This is a simulation. We can't actually split an order this way without a backend.
            // We'll just mark all remaining items as paid for simplicity.
            onPayShare(unpaidItems.map(item => item.cartItemId));
            setPaidAmount(currentSelectionTotal);
        }

        setShowPaymentSuccess(true);
        setTimeout(() => {
            setShowPaymentSuccess(false);
            if (unpaidItems.length - selectedItemIds.size === 0 || mode === 'equally') {
                 // If all items are paid, close the split view.
                 onClose();
            }
        }, 3000);
    };

    const allItemsPaid = unpaidItems.length === 0;

    if (showPaymentSuccess) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                <CheckCircleIcon className="h-20 w-20 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-brand-dark">Payment Successful!</h3>
                <p className="text-lg text-gray-600">Paid RM {paidAmount.toFixed(2)}.</p>
                <p className="mt-4 text-gray-500">The screen will refresh shortly.</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b flex justify-between items-center bg-white sticky top-0">
                <h3 className="text-xl font-bold text-brand-dark">Split The Bill</h3>
                <button onClick={onClose} className="font-semibold text-blue-600 hover:underline">Done</button>
            </header>
            
            <div className="p-4 bg-gray-50 border-b">
                <div className="flex bg-gray-200 rounded-lg p-1">
                    <button onClick={() => setMode('item')} className={`w-1/2 py-2 rounded-md font-semibold text-sm ${mode === 'item' ? 'bg-white shadow' : 'text-gray-600'}`}>By Item</button>
                    <button onClick={() => setMode('equally')} className={`w-1/2 py-2 rounded-md font-semibold text-sm ${mode === 'equally' ? 'bg-white shadow' : 'text-gray-600'}`}>Equally</button>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                 {allItemsPaid ? (
                     <div className="text-center p-8">
                         <CheckCircleIcon className="h-16 w-16 mx-auto text-green-500 mb-4" />
                         <h4 className="text-xl font-bold text-brand-dark">All items have been paid!</h4>
                         <p className="text-gray-600">You can now confirm the final order below.</p>
                     </div>
                 ) : mode === 'item' ? (
                    <div>
                        <h4 className="font-bold mb-2 text-gray-700">Select items to pay:</h4>
                        <ul className="space-y-2">
                            {items.map(item => {
                                const isPaid = paidItemIds.has(item.cartItemId);
                                const isSelected = selectedItemIds.has(item.cartItemId);
                                return (
                                    <li key={item.cartItemId} onClick={() => !isPaid && toggleItemSelection(item.cartItemId)}
                                        className={`p-3 rounded-lg transition-all duration-200 ${
                                            isPaid ? 'bg-gray-200 text-gray-500 line-through' :
                                            isSelected ? 'bg-blue-100 border-2 border-blue-400 cursor-pointer' :
                                            'bg-white shadow-sm cursor-pointer hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>RM {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                        <UsersIcon className="mx-auto h-12 w-12 text-brand-primary mb-3" />
                        <h4 className="font-bold text-lg text-gray-800">Split bill equally</h4>
                        <p className="text-gray-600">Total remaining: RM {remainingTotal.toFixed(2)}</p>
                        <div className="flex items-center justify-center gap-4 my-4">
                            <button onClick={() => setSplitCount(c => Math.max(2, c - 1))} className="bg-gray-200 font-bold w-10 h-10 rounded-full text-2xl">-</button>
                            <span className="text-3xl font-bold w-16 text-center">{splitCount}</span>
                            <button onClick={() => setSplitCount(c => c + 1)} className="bg-gray-200 font-bold w-10 h-10 rounded-full text-2xl">+</button>
                        </div>
                         <div className="text-xl font-bold text-brand-dark">
                             <span className="text-gray-600 font-normal">Each person pays:</span> RM {(remainingTotal / splitCount).toFixed(2)}
                         </div>
                    </div>
                )}
            </div>

            {!allItemsPaid && (
                <div className="p-4 bg-white border-t space-y-3">
                    <div className="flex justify-between items-center text-xl font-bold">
                        <span>Your Share:</span>
                        <span className="text-brand-primary">RM {currentSelectionTotal.toFixed(2)}</span>
                    </div>
                     <button
                        onClick={handlePay}
                        disabled={currentSelectionTotal <= 0}
                        className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
                    >
                         Pay My Share (RM {currentSelectionTotal.toFixed(2)})
                     </button>
                </div>
            )}
        </div>
    );
};

export default SplitBill;
