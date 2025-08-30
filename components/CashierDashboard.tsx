
import React, { useContext, useState } from 'react';
import { OrderContext } from '../App';
import OrderCard from './OrderCard';
import type { OrderContextType } from '../types';
import SearchIcon from './icons/SearchIcon';

const CashierDashboard: React.FC = () => {
    const context = useContext(OrderContext);
    const [searchQuery, setSearchQuery] = useState('');

    if (!context) {
        return <div className="text-center p-8">Loading...</div>;
    }
    const { orders } = context as OrderContextType;

    const filteredOrders = orders.filter(order => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            (order.customerName || '').toLowerCase().includes(query) ||
            (order.tableNumber || '').toLowerCase().includes(query) ||
            (order.customerPhone || '').toLowerCase().includes(query)
        );
    });

    const activeOrders = filteredOrders
        .filter(o => ['new', 'preparing', 'ready'].includes(o.status))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    const completedOrders = filteredOrders
        .filter(o => ['completed', 'cancelled'].includes(o.status))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return (
        <div className="space-y-8">
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
                <input
                    type="text"
                    placeholder="Search by Name, Table, or Phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
            </div>

            <div>
                <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4 pb-2 border-b-2 border-brand-secondary">
                    Active Orders ({activeOrders.length})
                </h2>
                {activeOrders.length === 0 ? (
                    <p className="text-gray-500 text-center">No active orders {searchQuery ? 'match your search' : 'found'}.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {activeOrders.map(order => <OrderCard key={order.id} order={order} />)}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-3xl font-serif font-bold text-gray-500 mb-4 pb-2 border-b-2 border-gray-300">
                    Order History ({completedOrders.length})
                </h2>
                {completedOrders.length === 0 ? (
                    <p className="text-gray-500 text-center">No completed orders {searchQuery ? 'match your search' : 'yet'}.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {completedOrders.map(order => (
                            <OrderCard 
                                key={order.id} 
                                order={order} 
                                isExpandable={true} 
                                isInitiallyExpanded={false} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CashierDashboard;
