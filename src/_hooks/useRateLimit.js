import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook untuk handle rate limit errors
 * Mendengarkan custom event 'rateLimitHit' dari axios interceptor
 */
export const useRateLimit = () => {
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [retryAfter, setRetryAfter] = useState(0);
    const [rateLimitInfo, setRateLimitInfo] = useState(null);

    useEffect(() => {
        const handleRateLimit = (event) => {
            const { endpoint, retryAfter: retry, message, errorCode } = event.detail;

            // Set state
            setIsRateLimited(true);
            setRetryAfter(retry);
            setRateLimitInfo({ endpoint, message, errorCode });

            // Tampilkan toast notification
            toast.error(
                `${message}\nSilakan coba lagi dalam ${retry} detik.`,
                {
                    duration: retry * 1000, // Duration sesuai retry time
                    icon: '⏳',
                    style: {
                        background: '#FEE2E2',
                        color: '#991B1B',
                        maxWidth: '500px',
                    },
                }
            );

            // Auto reset setelah retry time
            const timer = setTimeout(() => {
                setIsRateLimited(false);
                setRetryAfter(0);
                setRateLimitInfo(null);
            }, retry * 1000);

            return () => clearTimeout(timer);
        };

        // Listen to custom event dari axios
        window.addEventListener('rateLimitHit', handleRateLimit);

        return () => {
            window.removeEventListener('rateLimitHit', handleRateLimit);
        };
    }, []);

    return {
        isRateLimited,
        retryAfter,
        rateLimitInfo,
    };
};
