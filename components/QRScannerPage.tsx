import React, { useEffect, useState } from 'react';

declare const Html5Qrcode: any;

interface QRScannerPageProps {
    onScanSuccess: (tableNumber: string) => void;
}

const QRScannerPage: React.FC<QRScannerPageProps> = ({ onScanSuccess }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const qrScannerId = "qr-reader";
        const html5QrCode = new Html5Qrcode(qrScannerId);

        const qrCodeSuccessCallback = (decodedText: string) => {
            html5QrCode.stop().then(() => {
                // Basic validation: check if the result is a number
                if (decodedText && !isNaN(Number(decodedText))) {
                    onScanSuccess(decodedText);
                } else {
                    setErrorMessage("Invalid QR Code. Please scan the table QR code.");
                    // Optionally restart scanning after a delay
                    setTimeout(() => setErrorMessage(null), 3000);
                }
            }).catch(err => {
                console.error("Failed to stop QR scanner:", err);
            });
        };

        const config = { 
            fps: 10, 
            qrbox: { width: 250, height: 250 },
            supportedScanTypes: [] // Use all supported scan types
        };

        html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccessCallback, (error: string) => {
            // This callback is for scan errors, which can be frequent. We'll ignore them for a cleaner UX.
        })
        .catch((err: string) => {
            setErrorMessage("Unable to start QR scanner. Please grant camera permissions and refresh the page.");
            console.error("QR Scanner Error:", err);
        });

        return () => {
            html5QrCode.stop().catch((err: string) => {
                // Log cleanup error if needed, but it's often not critical
            });
        };
    }, [onScanSuccess]);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-gray-900 text-white p-4">
            <p className="mb-4 text-lg">Point your camera at the QR code on your table.</p>
            <div className="w-full max-w-sm aspect-square relative rounded-lg overflow-hidden shadow-2xl">
                <div id="qr-reader" className="w-full h-full"></div>
                {/* Viewfinder Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                     <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                     <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                     <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                     <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                </div>
            </div>
            {errorMessage && (
                <div className="mt-4 bg-red-500 text-white font-bold py-3 px-4 rounded-lg animate-fade-in-up">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default QRScannerPage;
