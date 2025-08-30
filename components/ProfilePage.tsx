

import React from 'react';
import type { UserProfile, Order } from '../types';
import StarIcon from './icons/StarIcon';
import ReceiptIcon from './icons/ReceiptIcon';
import PlusIcon from './icons/PlusIcon';

interface ProfilePageProps {
    userProfile: UserProfile;
    orders: Order[];
    onViewReceipt: (order: Order) => void;
    onAddToOrder: (order: Order) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userProfile, orders, onViewReceipt, onAddToOrder }) => {

    const sortedOrders = [...orders].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const canAddToOrder = (order: Order): boolean => {
        return order.orderType === 'Dine-in' && (order.status === 'new' || order.status === 'preparing');
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="flex justify-center items-center text-yellow-500 mb-3">
                    <StarIcon className="h-8 w-8" />
                    <h2 className="text-xl font-bold text-brand-dark ml-2">Loyalty Points</h2>
                </div>
                <p className="text-6xl font-bold font-serif text-brand-primary tracking-tight">
                    {userProfile.loyaltyPoints}
                </p>
                <p className="text-gray-600 mt-2">
                    You earn 1 point for every RM1 spent. Keep ordering to earn more rewards!
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
                 <div className="flex items-center text-brand-dark mb-3 border-b pb-3">
                    <ReceiptIcon />
                    <h2 className="text-xl font-bold ml-2">Your Order History</h2>
                </div>
                {sortedOrders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">You haven't placed any orders yet.</p>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {sortedOrders.map(order => (
                             <div key={order.id} className="border rounded-lg p-3 bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold">{order.orderType} Order</p>
                                        <p className="text-sm text-gray-600">{order.timestamp.toLocaleDateString()} - RM {order.total.toFixed(2)}</p>
                                        <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${
                                            order.status === 'completed' ? 'bg-green-200 text-green-800' :
                                            order.status === 'cancelled' ? 'bg-red-200 text-red-800' :
                                            'bg-yellow-200 text-yellow-800'
                                        }`}>{order.status}</span>
                                    </div>
                                     <button
                                        onClick={() => onViewReceipt(order)}
                                        className="bg-brand-primary text-white font-semibold text-sm py-2 px-4 rounded-lg hover:bg-opacity-80"
                                    >
                                        View Receipt
                                    </button>
                                </div>
                                {canAddToOrder(order) && (
                                     <button
                                        onClick={() => onAddToOrder(order)}
                                        className="mt-3 w-full bg-brand-secondary text-white font-bold py-2 rounded-lg hover:opacity-90 flex items-center justify-center gap-1"
                                    >
                                        <PlusIcon />
                                        Add to this Order
                                    </button>
                                )}
                             </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;