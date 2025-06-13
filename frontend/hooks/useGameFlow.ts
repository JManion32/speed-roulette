import { useEffect, useState } from 'react';

export function useTimer(
    onTimerEnd: () => void = () => {}
) {
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const [isPaused, setIsPaused] = useState<boolean>(true);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimerEnd();
            return;
        }
        if (isPaused) {
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
    
        return () => clearInterval(timer);
    }, [timeLeft, isPaused]);

    return { timeLeft, setTimeLeft, isPaused, setIsPaused };
}

export function useRemSpins() {
    const [remSpins, setRemSpins] = useState<number>(10);
    return { remSpins, setRemSpins };
}

export function useResultModal() {
    const [showModal, setShowModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false); // private

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setShowModal(false);
            setIsClosing(false);
        }, 300);
    };

    return { showModal, setShowModal, isClosing, closeModal };
}