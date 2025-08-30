
import React, { useContext, useEffect, useRef } from 'react';
import { OrderContext } from '../App';
import OrderCard from './OrderCard';
import type { Order, OrderContextType } from '../types';
import { NEW_ORDER_SOUND_URL } from '../constants';

const KitchenDashboard: React.FC = () => {
    const context = useContext(OrderContext);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(NEW_ORDER_SOUND_URL);
        }
    }, []);

    if (!context) {
        return <div className="text-center p-8">Loading...</div>;
    }
    const { orders } = context as OrderContextType;

    const newOrders = orders.filter(o => o.status === 'new').sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const preparingOrders = orders.filter(o => o.status === 'preparing').sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    const prevNewOrderCount = useRef(newOrders.length);
    useEffect(() => {
        if (newOrders.length > prevNewOrderCount.current) {
             audioRef.current?.play().catch(error => console.error("Audio playback failed:", error));
        }
        prevNewOrderCount.current = newOrders.length;
    }, [newOrders.length]);

    return (
        <div className="flex flex-col md:flex-row gap-4 h-full overflow-hidden">
            {/* New Orders Column */}
            <div className="flex-1 flex flex-col bg-gray-200 rounded-lg p-3">
                <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4 sticky top-0 bg-gray-200 py-2">
                    New <span className="text-lg">({newOrders.length})</span>
                </h2>
                <div className="overflow-y-auto space-y-4 flex-grow">
                    {newOrders.length === 0 ? (
                        <p className="text-gray-500 text-center mt-8">No new orders.</p>
                    ) : (
                        newOrders.map(order => <OrderCard key={order.id} order={order} />)
                    )}
                </div>
            </div>

            {/* Preparing Column */}
            <div className="flex-1 flex flex-col bg-gray-200 rounded-lg p-3">
                 <h2 className="text-2xl font-serif font-bold text-brand-dark mb-4 sticky top-0 bg-gray-200 py-2">
                    Preparing <span className="text-lg">({preparingOrders.length})</span>
                </h2>
                <div className="overflow-y-auto space-y-4 flex-grow">
                    {preparingOrders.length === 0 ? (
                        <p className="text-gray-500 text-center mt-8">No orders in preparation.</p>
                    ) : (
                        preparingOrders.map(order => <OrderCard key={order.id} order={order} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default KitchenDashboard;
