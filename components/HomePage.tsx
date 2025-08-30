import React from 'react';
import { RESTAURANT_NAME } from '../constants';
import QRIcon from './icons/QRIcon';

interface HomePageProps {
    onNewOrder: () => void;
    onScanQR: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNewOrder, onScanQR }) => {
    return (
        <div 
            className="flex flex-col items-center justify-center h-full text-center p-4 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://i.ibb.co/yYDZ15Z/biryani-bg.jpg)' }}
        >
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-white">
                <div className="mb-4 animate-fade-in-down">
                    <span className="text-4xl font-serif font-extrabold tracking-wider border-b-4 border-brand-secondary pb-2">AZAD</span>
                </div>
                <h1 className="text-lg font-sans font-normal tracking-widest uppercase animate-fade-in-down [animation-delay:0.2s]">
                    Welcome to
                </h1>
                <h2 className="text-4xl font-serif font-bold mb-12 animate-fade-in-up [animation-delay:0.4s]">
                    {RESTAURANT_NAME}
                </h2>
                <p className="mb-8 max-w-xs animate-fade-in-up [animation-delay:0.6s]">
                    The finest flavors, just a tap away. Start your order below.
                </p>
                <div className="w-full max-w-xs flex flex-col gap-4 animate-fade-in-up [animation-delay:0.8s]">
                    <button
                        onClick={onNewOrder}
                        className="bg-brand-secondary text-white font-bold py-4 px-12 rounded-full shadow-lg hover:opacity-90 transform hover:scale-105 transition-transform duration-300 text-lg"
                    >
                        Start New Order
                    </button>
                     <button
                        onClick={onScanQR}
                        className="bg-white/90 text-brand-dark font-bold py-3 px-8 rounded-full shadow-lg hover:bg-white transform hover:scale-105 transition-transform duration-300 text-md flex items-center justify-center gap-2"
                    >
                        <QRIcon />
                        Scan Table QR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;