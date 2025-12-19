import { useEffect } from 'react';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

export default function Toast({ message, onClose, duration = 5000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down">
            <div className="bg-green-600/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg border border-white/20 flex items-center gap-3">
                <span className="text-xl">🎄</span>
                <span className="font-medium">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
