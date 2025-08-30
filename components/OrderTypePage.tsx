import React from 'react';
import { OrderType } from '../types';
import TakeawayIcon from './icons/TakeawayIcon';
import DeliveryIcon from './icons/DeliveryIcon';
import DineInIcon from './icons/DineInIcon';

interface OrderTypePageProps {
    onSelect: (type: OrderType) => void;
}

const OrderTypeButton: React.FC<{
    label: OrderType,
    icon: React.ReactNode,
    onClick: (type: OrderType) => void
}> = ({ label, icon, onClick }) => (
    <button
        onClick={() => onClick(label)}
        className="bg-white p-6 rounded-xl shadow-md w-full flex flex-col items-center justify-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-brand-secondary"
    >
        <div className="mb-4 text-brand-primary">
            {icon}
        </div>
        <span className="text-xl font-bold text-brand-dark">{label}</span>
    </button>
);

const OrderTypePage: React.FC<OrderTypePageProps> = ({ onSelect }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="w-full max-w-xs space-y-6">
                <OrderTypeButton label="Takeaway" icon={<TakeawayIcon />} onClick={onSelect} />
                <OrderTypeButton label="Delivery" icon={<DeliveryIcon />} onClick={onSelect} />
                <OrderTypeButton label="Dine-in" icon={<DineInIcon />} onClick={onSelect} />
            </div>
        </div>
    );
};

export default OrderTypePage;
