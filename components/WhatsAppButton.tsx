
import React from 'react';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '../constants';
import WhatsAppIcon from './icons/WhatsAppIcon';

const WhatsAppButton: React.FC = () => {
    const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 left-6 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 hover:bg-[#128C7E] transition-all duration-300 z-20"
            aria-label="Chat with us on WhatsApp"
        >
            <WhatsAppIcon />
        </a>
    );
};

export default WhatsAppButton;
