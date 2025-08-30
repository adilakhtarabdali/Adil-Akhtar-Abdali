
import React, { useEffect } from 'react';
import type { Order } from '../types';
import { RESTAURANT_NAME } from '../constants';
import Barcode from './Barcode';

interface PrintableTicketProps {
    order: Order;
    onClose: () => void;
}

const PrintableTicket: React.FC<PrintableTicketProps> = ({ order, onClose }) => {

    useEffect(() => {
        const handleAfterPrint = () => {
            onClose();
        };

        // A small timeout allows the content (especially barcode font) to render before printing
        const timer = setTimeout(() => {
            window.addEventListener('afterprint', handleAfterPrint, { once: true });
            window.print();
        }, 150);


        return () => {
            clearTimeout(timer);
            window.removeEventListener('afterprint', handleAfterPrint);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-white z-50 print:bg-white print:text-black">
            <style>{`
                @media print {
                    @page {
                        margin: 0.2in;
                    }
                    body * {
                        visibility: hidden;
                    }
                    #printable-area, #printable-area * {
                        visibility: visible;
                    }
                    #printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none;
                    }
                }
            `}</style>
            
            <div id="printable-area" className="p-2 font-mono text-black max-w-sm mx-auto">
                <div className="text-center border-b-2 border-dashed border-black pb-2 mb-2">
                    <h1 className="text-xl font-bold font-serif">{RESTAURANT_NAME}</h1>
                    <p className="text-sm">Order ID: {order.id}</p>
                    <p className="text-sm">{order.timestamp.toLocaleString()}</p>
                </div>

                <div className="border-b-2 border-dashed border-black pb-2 mb-2">
                    <p className="text-lg font-bold">
                        {order.orderType === 'Dine-in' ? `TABLE: ${order.tableNumber}` : `${order.orderType.toUpperCase()}`}
                    </p>
                    {order.orderType !== 'Dine-in' && (
                        <p className="font-semibold">{order.customerName}</p>
                    )}
                </div>

                <table className="w-full text-left text-sm my-2">
                    <thead>
                        <tr className="border-b border-dashed border-black">
                            <th className="font-bold py-1">QTY</th>
                            <th className="font-bold py-1">ITEM</th>
                            <th className="font-bold py-1 text-right">PRICE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                            <React.Fragment key={item.cartItemId}>
                                <tr>
                                    <td className="align-top pr-2 py-1">{item.quantity}x</td>
                                    <td className="py-1">{item.name}</td>
                                    <td className="py-1 text-right">{(item.price * item.quantity).toFixed(2)}</td>
                                </tr>
                                {item.selectedModifiers.length > 0 && (
                                    <tr>
                                        <td></td>
                                        <td colSpan={2} className="pl-2 pb-1">
                                            {item.selectedModifiers.map(mod => (
                                                <div key={mod.id} className="text-xs italic">+ {mod.name} ({(mod.price * item.quantity).toFixed(2)})</div>
                                            ))}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                
                {order.notes && (
                    <div className="mt-2 pt-2 border-t-2 border-dashed border-black">
                        <p className="font-bold uppercase">** NOTES **</p>
                        <p className="whitespace-pre-wrap text-sm">{order.notes}</p>
                    </div>
                )}

                 <div className="mt-2 pt-2 border-t-2 border-dashed border-black text-right">
                    <p className="font-bold text-lg">TOTAL: RM {order.total.toFixed(2)}</p>
                    <p className="text-sm">Paid via: {order.paymentMethod}</p>
                 </div>

                 <div className="mt-4 text-center">
                    <Barcode text={order.id} />
                    <p className="text-center font-serif mt-2">Thank You!</p>
                 </div>
            </div>

            <div className="no-print absolute top-4 right-4">
                 <button onClick={onClose} className="bg-gray-200 text-black py-2 px-4 rounded-lg font-semibold">
                     Close
                 </button>
            </div>
        </div>
    );
};

export default PrintableTicket;