

import React, { useContext, useEffect, useRef, useState } from 'react';
import { OrderContext } from '../App';
import OrderCard from './OrderCard';
import type { Order, OrderContextType, OrderStatus, OrderType } from '../types';
import { NEW_ORDER_SOUND_URL } from '../constants';
import SearchIcon from './icons/SearchIcon';
import PasswordSettings from './PasswordSettings';
import SettingsIcon from './icons/SettingsIcon';
import MenuManagement from './MenuManagement';
import MenuBookIcon from './icons/MenuBookIcon';
import AnalyticsWidget from './AnalyticsWidget';
import PrinterIcon from './icons/PrinterIcon';

type FilterKey = 'all' | OrderStatus | OrderType;

const ManagerDashboard: React.FC = () => {
    const context = useContext(OrderContext);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const prevNewOrdersRef = useRef<Order[]>([]);
    const [highlightedOrderIds, setHighlightedOrderIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [autoPrintEnabled, setAutoPrintEnabled] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
    
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(NEW_ORDER_SOUND_URL);
        }
    }, []);

    if (!context) {
        return <div>Loading...</div>;
    }
    const { orders, handleChangeAdminPassword, printOrder } = context as OrderContextType;
    
    const newOrders = orders.filter(o => o.status === 'new');

    useEffect(() => {
        const prevOrderIds = new Set(prevNewOrdersRef.current.map(o => o.id));
        const newlyArrivedOrders = newOrders.filter(o => !prevOrderIds.has(o.id));

        if (newlyArrivedOrders.length > 0) {
            audioRef.current?.play().catch(error => console.error("Audio playback failed:", error));
            
            if (autoPrintEnabled) {
                newlyArrivedOrders.forEach(order => printOrder(order));
            }
            
            const newIds = newlyArrivedOrders.map(o => o.id);
            setHighlightedOrderIds(current => new Set([...current, ...newIds]));
            
            const timer = setTimeout(() => {
                setHighlightedOrderIds(current => {
                    const next = new Set(current);
                    newIds.forEach(id => next.delete(id));
                    return next;
                });
            }, 2000);
            
            return () => clearTimeout(timer);
        }
        prevNewOrdersRef.current = newOrders;
    }, [newOrders, autoPrintEnabled, printOrder]);

    const allOrdersSorted = [...orders].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const filteredOrders = allOrdersSorted.filter(order => {
        // Filter logic
        let matchesFilter = true;
        if (activeFilter !== 'all') {
            const orderTypes: OrderType[] = ['Dine-in', 'Takeaway', 'Delivery'];
            if (orderTypes.includes(activeFilter as OrderType)) {
                matchesFilter = order.orderType === activeFilter;
            } else {
                matchesFilter = order.status === activeFilter;
            }
        }
        
        // Search logic
        let matchesSearch = true;
        const query = searchQuery.toLowerCase().trim();
        if (query) {
            matchesSearch = (
                order.id.toLowerCase().includes(query) ||
                (order.customerName || '').toLowerCase().includes(query) ||
                (order.tableNumber || '').toLowerCase().includes(query) ||
                (order.customerPhone || '').toLowerCase().includes(query)
            );
        }
        
        return matchesFilter && matchesSearch;
    });

    const activeOrders = filteredOrders.filter(o => !['completed', 'cancelled'].includes(o.status));
    const completedOrders = filteredOrders.filter(o => ['completed', 'cancelled'].includes(o.status));

    const filterButtons: { key: FilterKey, label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'new', label: 'New' },
        { key: 'preparing', label: 'Preparing' },
        { key: 'ready', label: 'Ready' },
        { key: 'Dine-in', label: 'Dine-In' },
        { key: 'Takeaway', label: 'Takeaway' },
        { key: 'Delivery', label: 'Delivery' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <AnalyticsWidget orders={orders} />
            </div>
             <div>
                <h2 className="text-3xl font-serif font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-400">
                    Orders ({orders.length})
                </h2>
                <div className="space-y-4 mb-6">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
                        <input
                            type="text"
                            placeholder="Search by ID, Name, Table, or Phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {filterButtons.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setActiveFilter(key)}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                                    activeFilter === key
                                        ? 'bg-brand-primary text-white shadow'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="mt-6">
                    <h3 className="text-2xl font-serif font-bold text-brand-primary mb-3">
                        Active Orders ({activeOrders.length})
                    </h3>
                    {activeOrders.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No active orders match your criteria.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {activeOrders.map(order => (
                                 <div 
                                    key={order.id} 
                                    className={`rounded-lg transition-all duration-1000 ease-out ${highlightedOrderIds.has(order.id) ? 'bg-brand-accent shadow-2xl scale-[1.03]' : ''}`}
                                 >
                                    <OrderCard 
                                        order={order} 
                                        isExpandable={true}
                                        isInitiallyExpanded={true}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8">
                    <h3 className="text-2xl font-serif font-bold text-gray-500 mb-3">
                        Completed & Cancelled ({completedOrders.length})
                    </h3>
                     {completedOrders.length === 0 ? (
                         <p className="text-gray-500 text-center py-4">No completed orders match your criteria.</p>
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

            <div>
                <h2 className="text-3xl font-serif font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-400 flex items-center gap-2">
                    <MenuBookIcon /> Menu Management
                </h2>
                <MenuManagement />
            </div>

            <div>
                <h2 className="text-3xl font-serif font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-400 flex items-center gap-2">
                    <SettingsIcon /> Admin Settings
                </h2>
                 <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    <div>
                        <h3 className="text-xl font-bold font-serif text-brand-dark mb-4 flex items-center gap-2"><PrinterIcon/> Printer Settings</h3>
                        <label htmlFor="autoPrint" className="flex items-center justify-between cursor-pointer">
                            <span className="font-semibold text-gray-700">Auto-print new orders</span>
                            <div className="relative">
                                <input
                                    id="autoPrint"
                                    type="checkbox"
                                    className="sr-only"
                                    checked={autoPrintEnabled}
                                    onChange={() => setAutoPrintEnabled(prev => !prev)}
                                />
                                <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${autoPrintEnabled ? 'translate-x-6 bg-brand-primary' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                    <PasswordSettings onChangePassword={handleChangeAdminPassword} />
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;