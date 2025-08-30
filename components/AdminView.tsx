
import React, { useContext } from 'react';
import { OrderContext } from '../App';
import type { OrderContextType } from '../types';
import ManagerDashboard from './ManagerDashboard';
import KitchenDashboard from './KitchenDashboard';
import CashierDashboard from './CashierDashboard';

const AdminView: React.FC = () => {
    const orderContext = useContext(OrderContext);

    if (!orderContext) {
        return <div>Loading...</div>;
    }
    
    const { adminProfile } = orderContext as OrderContextType;

    if (!adminProfile) {
        // This should not happen if rendered correctly, but it's a good safeguard.
        return <div>Error: No admin profile found.</div>;
    }

    switch (adminProfile.role) {
        case 'Manager':
            return <ManagerDashboard />;
        case 'Kitchen':
            return <KitchenDashboard />;
        case 'Cashier':
            return <CashierDashboard />;
        default:
            return <div>Invalid role specified.</div>;
    }
};

export default AdminView;