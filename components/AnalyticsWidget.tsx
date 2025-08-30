
import React, from 'react';
import type { Order } from '../types';
import StarIcon from './icons/StarIcon';
import ReceiptIcon from './icons/ReceiptIcon';

interface AnalyticsWidgetProps {
    orders: Order[];
}

const isToday = (someDate: Date) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear();
};

const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({ orders }) => {

    const todaysOrders = orders.filter(o => isToday(o.timestamp));
    const todaysCompletedOrders = todaysOrders.filter(o => o.status === 'completed' && o.paymentStatus === 'Paid');

    const totalRevenue = todaysCompletedOrders.reduce((sum, order) => sum + order.total, 0);

    const topSellingItem = () => {
        if (todaysCompletedOrders.length === 0) return 'N/A';
        const itemCounts: Record<string, number> = {};
        todaysCompletedOrders.forEach(order => {
            order.items.forEach(item => {
                itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
            });
        });

        let topItem = 'N/A';
        let maxCount = 0;
        for (const itemName in itemCounts) {
            if (itemCounts[itemName] > maxCount) {
                maxCount = itemCounts[itemName];
                topItem = itemName;
            }
        }
        return topItem;
    };

    return (
        <div className="mb-8">
            <h2 className="text-3xl font-serif font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-400">
                Today's Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
                    <div className="p-3 bg-green-100 rounded-full mr-4">
                        <span className="text-2xl text-green-600 font-bold">RM</span>
                    </div>
                    <div>
                        <p className="text-gray-500 font-semibold">Total Revenue</p>
                        <p className="text-2xl font-bold text-brand-dark">
                            {totalRevenue.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full mr-4">
                        <ReceiptIcon className="text-blue-600"/>
                    </div>
                    <div>
                        <p className="text-gray-500 font-semibold">Total Orders</p>
                        <p className="text-2xl font-bold text-brand-dark">
                            {todaysOrders.length}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
                     <div className="p-3 bg-yellow-100 rounded-full mr-4">
                        <StarIcon className="text-yellow-500 h-6 w-6"/>
                    </div>
                    <div>
                        <p className="text-gray-500 font-semibold">Top Seller</p>
                        <p className="text-xl font-bold text-brand-dark truncate">
                            {topSellingItem()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsWidget;