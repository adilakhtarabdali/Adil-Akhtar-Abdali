
import React from 'react';

interface BarcodeProps {
    text: string;
}

const Barcode: React.FC<BarcodeProps> = ({ text }) => {
    return (
        <div 
            className="font-barcode text-5xl tracking-widest"
            aria-label={`Barcode for order ID ${text}`}
        >
            {text}
        </div>
    );
};

export default Barcode;
