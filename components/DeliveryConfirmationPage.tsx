import React from 'react';

interface DeliveryConfirmationPageProps {
    onConfirm: () => void;
}

const DeliveryConfirmationPage: React.FC<DeliveryConfirmationPageProps> = ({ onConfirm }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-full max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-brand-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10v-5m6 5v-5m0 0l-6-3m6 3l6-3" />
                </svg>
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Delivery Service Area</h2>
                <p className="text-gray-600 mb-8">
                    Our delivery service is available for locations within a <strong>5km radius</strong> of the restaurant. Please confirm you are within this area before proceeding.
                </p>
                
                <button
                    onClick={onConfirm}
                    className="w-full bg-brand-secondary text-white font-bold py-3 rounded-full shadow-lg hover:opacity-90 transform hover:scale-105 transition-transform duration-300"
                >
                    Confirm & Continue
                </button>
            </div>
        </div>
    );
};

export default DeliveryConfirmationPage;
