
import React from 'react';
import type { Order, OrderStatus } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface OrderStatusPageProps {
    order: Order | null;
    currentStatus: OrderStatus;
    onNewOrder: () => void;
}

const OrderStatusPage: React.FC<OrderStatusPageProps> = ({ order, currentStatus, onNewOrder }) => {

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <h2 className="text-2xl font-bold text-brand-dark mb-4">No active order found.</h2>
                <button
                    onClick={onNewOrder}
                    className="mt-6 bg-brand-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:opacity-90 transition-transform transform hover:scale-105"
                >
                    Start a New Order
                </button>
            </div>
        );
    }
    
    const statuses: { id: OrderStatus, label: string }[] = [
        { id: 'new', label: 'Order Received' },
        { id: 'preparing', label: 'Preparing Your Meal' },
        { id: 'ready', label: 'Ready for Pickup/Service' },
    ];
    
    const completedStatuses: OrderStatus[] = ['completed', 'cancelled'];
    const isCompleted = completedStatuses.includes(currentStatus);
    const currentIndex = statuses.findIndex(s => s.id === currentStatus);

    return (
        <div className="p-4 flex flex-col h-full animate-fade-in-up">
            <div className="flex-grow">
                <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                    <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-serif font-bold text-brand-primary mb-2">Thank You!</h2>
                    <p className="text-gray-600">Your order has been placed successfully.</p>
                    <p className="text-sm text-gray-500 mt-1">Order ID: #{order.id.slice(-6)}</p>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-bold text-brand-dark mb-4 text-center">Order Status</h3>
                    <div className="relative p-4">
                        {/* The line connecting the dots */}
                        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-200"></div>

                        {statuses.map((status, index) => {
                            const isActive = index <= currentIndex;
                            const isCurrent = index === currentIndex;

                            return (
                                <div key={status.id} className="relative flex items-center mb-8">
                                    <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-500 ${isActive ? 'bg-brand-secondary' : 'bg-gray-300'}`}>
                                        {isActive && <CheckCircleIcon className="w-5 h-5 text-white" />}
                                    </div>
                                    <div className="ml-6">
                                        <h4 className={`font-bold transition-colors duration-500 ${isActive ? 'text-brand-dark' : 'text-gray-500'}`}>{status.label}</h4>
                                        {isCurrent && !isCompleted && (
                                            <p className="text-sm text-brand-primary animate-pulse">Updating...</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                     {isCompleted && (
                        <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
                            <p className="font-bold">Your order is complete!</p>
                            <p>Thank you for choosing us.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto pt-4">
                <button
                    onClick={onNewOrder}
                    className="w-full bg-brand-primary text-white font-bold py-3 rounded-lg shadow-lg hover:opacity-90 transition-transform transform hover:scale-105"
                >
                    Place Another Order
                </button>
            </div>
        </div>
    );
};

export default OrderStatusPage;