
import React, { useState } from 'react';

interface EnterTablePageProps {
    onConfirm: (tableNumber: string) => void;
}

const EnterTablePage: React.FC<EnterTablePageProps> = ({ onConfirm }) => {
    const [tableNumber, setTableNumber] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (!tableNumber.trim() || isNaN(Number(tableNumber))) {
            setError('Please enter a valid table number.');
            return;
        }
        setError('');
        onConfirm(tableNumber);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-full max-w-xs">
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Dine-in Order</h2>
                <p className="text-gray-600 mb-8">Please enter the table number found on your table to proceed.</p>
                
                <input
                    type="tel" // Use 'tel' for numeric keyboard on mobile
                    value={tableNumber}
                    onChange={(e) => {
                        setTableNumber(e.target.value);
                        if (error) setError('');
                    }}
                    placeholder="e.g., 12"
                    className="w-full px-4 py-3 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    autoFocus
                />
                {error && (
                    <div className="mt-3 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm" role="alert">
                       {error}
                    </div>
                )}
                
                <button
                    onClick={handleConfirm}
                    className="mt-8 w-full bg-brand-secondary text-white font-bold py-3 rounded-full shadow-lg hover:opacity-90 transform hover:scale-105 transition-transform duration-300"
                >
                    Confirm Table
                </button>
            </div>
        </div>
    );
};

export default EnterTablePage;
