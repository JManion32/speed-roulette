import { useState } from "react";

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
