

import React from 'react';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import LogoutIcon from './icons/LogoutIcon';
import ReceiptIcon from './icons/ReceiptIcon';

interface HeaderProps {
    title: string;
    showBackButton: boolean;
    onBack: () => void;
    currentView: 'customer' | 'admin';
    onSwitchView: (view: 'customer' | 'admin') => void;
    isAdminAuthenticated: boolean;
    onLogout: () => void;
    onNavigateToProfile: () => void;
    orderToModifyId?: string | null;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton, onBack, currentView, onSwitchView, isAdminAuthenticated, onLogout, onNavigateToProfile, orderToModifyId }) => {
    return (
        <header className="bg-brand-primary text-white shadow-md sticky top-0 z-30">
            <div className="flex items-center justify-between p-4 h-16">
                <div className="w-1/4 flex justify-start">
                    {showBackButton && (
                        <button 
                            onClick={onBack} 
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                            aria-label="Go back"
                        >
                            <ChevronLeftIcon />
                        </button>
                    )}
                </div>
                
                <h1 className="w-1/2 text-xl font-serif font-semibold text-center truncate">
                    {title}
                </h1>
                
                <div className="w-1/4 flex justify-end items-center gap-2">
                     {currentView === 'customer' && (
                         <button
                            onClick={onNavigateToProfile}
                            className="p-2 rounded-full hover:bg-white/20 transition-colors"
                            aria-label="View my orders"
                         >
                            <ReceiptIcon />
                        </button>
                     )}
                     {isAdminAuthenticated ? (
                         <button
                            onClick={onLogout}
                            className="text-xs font-semibold p-2 rounded-md hover:bg-white/20 transition-colors flex items-center"
                            aria-label="Logout"
                         >
                            Logout <LogoutIcon />
                         </button>
                     ) : currentView === 'customer' ? (
                         <button
                             onClick={() => onSwitchView('admin')}
                             className="text-xs font-semibold p-2 rounded-md hover:bg-white/20 transition-colors"
                         >
                             Admin
                         </button>
                     ) : (
                          <button
                             onClick={() => onSwitchView('customer')}
                             className="text-xs font-semibold p-2 rounded-md hover:bg-white/20 transition-colors"
                         >
                             Menu
                         </button>
                     )}
                </div>
            </div>
            {orderToModifyId && (
                <div className="bg-yellow-400 text-yellow-900 text-center text-sm font-bold py-1 animate-fade-in-down">
                    Adding to Order #{orderToModifyId.slice(-6)}
                </div>
            )}
        </header>
    );
};

export default Header;