
import React, { useState, useEffect, useContext } from 'react';
import type { Order, OrderStatus, Role } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import PencilIcon from './icons/PencilIcon';
import StarIcon from './icons/StarIcon';
import { OrderContext } from '../App';
import PrinterIcon from './icons/PrinterIcon';
import XCircleIcon from './icons/XCircleIcon';
import ArrowUturnLeftIcon from './icons/ArrowUturnLeftIcon';

interface OrderCardProps {
    order: Order;
    isExpandable?: boolean;
    isInitiallyExpanded?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isExpandable = false, isInitiallyExpanded = true }) => {
    const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
    const [isEditing, setIsEditing] = useState(false);
    
    const [editedName, setEditedName] = useState(order.customerName || '');
    const [editedPhone, setEditedPhone] = useState(order.customerPhone || '');
    const [editedNotes, setEditedNotes] = useState(order.notes || '');

    const context = useContext(OrderContext);

    useEffect(() => {
        setEditedName(order.customerName || '');
        setEditedPhone(order.customerPhone || '');
        setEditedNotes(order.notes || '');
        setIsEditing(false);
    }, [order]);
    
    if (!context) return null;
    const { adminProfile, updateOrderStatus, updateOrderDetails, printOrder } = context;
    const role = adminProfile?.role;
    
    const getStatusStyles = (status: OrderStatus) => {
        switch (status) {
            case 'new':       return { card: 'bg-yellow-100 border-yellow-400', text: 'text-yellow-800', header: 'bg-yellow-200' };
            case 'preparing': return { card: 'bg-blue-100 border-blue-400', text: 'text-blue-800', header: 'bg-blue-200' };
            case 'ready':     return { card: 'bg-purple-100 border-purple-400', text: 'text-purple-800', header: 'bg-purple-200' };
            case 'completed': return { card: 'bg-green-100 border-green-400', text: 'text-green-800', header: 'bg-green-200' };
            case 'cancelled': return { card: 'bg-gray-200 border-gray-400', text: 'text-gray-700', header: 'bg-gray-300' };
            default:          return { card: 'bg-gray-100 border-gray-400', text: 'text-gray-800', header: 'bg-gray-200' };
        }
    };
    
    const { card, text, header } = getStatusStyles(order.status);
    
    const handleHeaderClick = () => {
        if (isExpandable) setIsExpanded(prev => !prev);
    };
    
    const handleSave = () => {
        updateOrderDetails(order.id, { customerName: editedName, customerPhone: editedPhone, notes: editedNotes });
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset fields
        setEditedName(order.customerName || '');
        setEditedPhone(order.customerPhone || '');
        setEditedNotes(order.notes || '');
    };

    const handleCancelOrder = () => {
        if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            updateOrderStatus(order.id, 'cancelled');
        }
    };

    const handleRefundOrder = () => {
        if (window.confirm('Are you sure you want to refund this order? This will mark the order as refunded.')) {
            updateOrderStatus(order.id, 'completed', 'Refunded');
        }
    };

    const renderActionButtons = () => {
        if (isEditing) {
            return (
                 <div className="mt-4 flex gap-3">
                    <button onClick={handleCancelEdit} className="w-full bg-gray-500 text-white font-bold py-2 rounded-lg hover:bg-gray-600">Cancel</button>
                    <button onClick={handleSave} className="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600">Save Changes</button>
                </div>
            );
        }

        const buttons: JSX.Element[] = [];
        
        // Kitchen Actions
        if (role === 'Kitchen') {
            if (order.status === 'new') buttons.push(<button key="cook" onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">Start Cooking</button>);
            if (order.status === 'preparing') buttons.push(<button key="ready" onClick={() => updateOrderStatus(order.id, 'ready')} className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600">Order Ready</button>);
        }

        // Cashier Actions
        if (role === 'Cashier' && order.status === 'ready') {
            buttons.push(<button key="complete" onClick={() => updateOrderStatus(order.id, 'completed')} className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Mark as Completed & Paid</button>);
        }

        // Universal Actions (for roles that can print)
        if (role === 'Manager' || role === 'Kitchen') {
             buttons.push(<button key="print" onClick={() => printOrder(order)} className="w-full bg-brand-dark text-white font-bold py-2 px-4 rounded-lg hover:bg-black flex items-center justify-center gap-2"><PrinterIcon /> Print Ticket</button>);
        }

        // Manager Actions (superset of others, plus overrides)
        if (role === 'Manager') {
            if (order.status === 'new') buttons.push(<button key="cook" onClick={() => updateOrderStatus(order.id, 'preparing')} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">Start Cooking</button>);
            if (order.status === 'preparing') buttons.push(<button key="ready" onClick={() => updateOrderStatus(order.id, 'ready')} className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600">Order Ready</button>);
            if (order.status === 'ready') buttons.push(<button key="complete" onClick={() => updateOrderStatus(order.id, 'completed')} className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Mark as Completed</button>);

            // Overrides
            if (order.status !== 'completed' && order.status !== 'cancelled') {
                 buttons.push(<button key="edit" onClick={() => setIsEditing(true)} className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"><PencilIcon /> Edit</button>);
                 buttons.push(<button key="cancel" onClick={handleCancelOrder} className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"><XCircleIcon /> Cancel</button>);
            }
            if (order.status === 'completed' && order.paymentStatus === 'Paid') {
                buttons.push(<button key="refund" onClick={handleRefundOrder} className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2"><ArrowUturnLeftIcon/> Refund</button>);
            }
        }
        

        if (buttons.length === 0) return null;
        return <div className="mt-4 flex flex-col sm:flex-row-reverse gap-3">{buttons}</div>
    }
    
    return (
        <div className={`rounded-lg shadow-md overflow-hidden border-2 ${card}`}>
            <div 
                className={`p-3 ${header} text-brand-dark ${isExpandable ? 'cursor-pointer' : ''}`}
                onClick={handleHeaderClick}
                role={isExpandable ? 'button' : 'region'}
                tabIndex={isExpandable ? 0 : -1}
            >
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold">
                            {order.orderType === 'Dine-in' ? `Table: ${order.tableNumber}` : `${order.customerName || 'N/A'}`}
                        </h3>
                        <p className="text-sm font-semibold">{order.orderType}</p>
                        <p className="text-sm font-semibold text-gray-600">
                            {order.paymentMethod} - 
                            <span className={`font-bold ${
                                order.paymentStatus === 'Paid' ? 'text-green-700' : 
                                order.paymentStatus === 'Refunded' ? 'text-yellow-700' :
                                'text-orange-700'
                            }`}> {order.paymentStatus}</span>
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${card} ${text}`}>
                            {order.status.toUpperCase()}
                        </span>
                        {isExpandable && <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}><ChevronDownIcon /></div>}
                    </div>
                </div>
                 <p className="text-xs text-gray-700 mt-1">{order.timestamp.toLocaleTimeString()}</p>
            </div>
            {isExpanded && (
                <div className="p-4">
                    <ul className="space-y-2 mb-4">
                        {order.items.map(item => (
                            <li key={item.cartItemId} className="text-sm">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-brand-dark">{item.quantity}x {item.name}</span>
                                </div>
                                {item.selectedModifiers.length > 0 && (
                                    <div className="pl-4 text-xs text-gray-600">
                                        {item.selectedModifiers.map(mod => <p key={mod.id}>+ {mod.name}</p>)}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    
                    {isEditing ? (
                        <div className="mb-4">
                            <label className="font-bold text-sm text-yellow-800">Edit Details:</label>
                             <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} placeholder="Customer Name" className="w-full mt-1 p-2 border rounded-md text-sm" />
                             <input type="text" value={editedPhone} onChange={e => setEditedPhone(e.target.value)} placeholder="Phone Number" className="w-full mt-1 p-2 border rounded-md text-sm" />
                             <textarea value={editedNotes} onChange={e => setEditedNotes(e.target.value)} className="w-full mt-1 p-2 border rounded-md text-sm" rows={2} placeholder="No special requests" />
                        </div>
                    ) : (
                         order.notes && (
                            <div className="mb-4 p-2 bg-yellow-50 rounded-md border border-yellow-300">
                                <p className="font-bold text-sm text-yellow-800">Notes:</p>
                                <p className="text-sm text-yellow-700 whitespace-pre-wrap">{order.notes}</p>
                            </div>
                        )
                    )}

                    <div className="border-t border-gray-300 pt-3 space-y-2">
                        {order.pointsEarned && order.pointsEarned > 0 && (
                            <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                                <span>Points Earned:</span>
                                <span className="text-yellow-600 font-bold flex items-center gap-1">{order.pointsEarned} <StarIcon className="h-4 w-4" /></span>
                            </div>
                        )}
                        <div className="flex justify-between items-center font-bold text-lg">
                            <span>Total:</span>
                            <span className="text-brand-primary">RM {order.total.toFixed(2)}</span>
                        </div>
                    </div>
                    {renderActionButtons()}
                </div>
            )}
        </div>
    );
};

export default OrderCard;