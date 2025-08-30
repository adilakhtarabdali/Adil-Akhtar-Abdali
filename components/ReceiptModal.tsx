
import React, { useContext } from 'react';
import type { Order, OrderContextType } from '../types';
import { RESTAURANT_NAME } from '../constants';
import { OrderContext } from '../App';
import PrinterIcon from './icons/PrinterIcon';

interface ReceiptModalProps {
    order: Order;
    onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
    const context = useContext(OrderContext);
    if (!context) return null;

    const { printOrder } = context as OrderContextType;

    const handlePrint = () => {
        printOrder(order);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white rounded-xl shadow-2xl z-50 w-11/12 max-w-sm flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold text-brand-dark">Order Receipt</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>
                
                <div className="flex-grow overflow-y-auto p-5 text-sm">
                    <div className="text-center mb-4">
                        <h3 className="text-xl font-serif font-bold">{RESTAURANT_NAME}</h3>
                        <p className="text-gray-600">Thank you for your order!</p>
                    </div>
                    <div className="border-y border-dashed py-3 space-y-1">
                        <p><strong>Order ID:</strong> #{order.id.slice(-6)}</p>
                        <p><strong>Date:</strong> {order.timestamp.toLocaleString()}</p>
                        <p><strong>Type:</strong> {order.orderType} {order.orderType === 'Dine-in' ? `(Table ${order.tableNumber})` : ''}</p>
                        {order.customerName && <p><strong>Name:</strong> {order.customerName}</p>}
                    </div>

                    <ul className="my-4 space-y-2">
                         {order.items.map(item => (
                            <li key={item.cartItemId} className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{item.quantity}x {item.name}</p>
                                    {item.selectedModifiers.length > 0 && (
                                        <div className="pl-3 text-xs text-gray-500">
                                            {item.selectedModifiers.map(mod => <p key={mod.id}>+ {mod.name}</p>)}
                                        </div>
                                    )}
                                </div>
                                <p className="font-semibold">RM {(item.price * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>RM {order.total.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between font-bold text-lg">
                            <span>Total Paid</span>
                            <span>RM {order.total.toFixed(2)}</span>
                        </div>
                        <div className="text-right text-gray-600">
                            Paid via {order.paymentMethod}
                        </div>
                        {order.pointsEarned && order.pointsEarned > 0 ? (
                             <div className="text-center pt-3 text-green-700 font-semibold">
                                You earned {order.pointsEarned} loyalty points on this order!
                            </div>
                        ) : null}
                    </div>
                </div>

                <footer className="p-4 bg-gray-50 border-t-2">
                    <button
                        onClick={handlePrint}
                        className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg hover:bg-opacity-80 transition duration-300 flex items-center justify-center gap-2"
                    >
                        <PrinterIcon/>
                        Print Receipt
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ReceiptModal;
