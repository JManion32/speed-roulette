import { useDarkMode } from '../../contexts/DarkModeContext';
import { useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
    canOutsideClick?: boolean;
    trigger: React.ReactNode;
    children: React.ReactNode;
};

function Modal({ canOutsideClick = true, trigger, children }: Props) {
    const { isDarkMode } = useDarkMode();
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsOpen(false);
        }, 300);
    };

    const modal = isOpen ? (
        <div
            className="modal-overlay fixed inset-0 z-50 bg-gray-900/80 flex justify-center items-center"
            onClick={canOutsideClick ? closeModal : undefined}
            aria-modal="true"
            role="dialog"
        >
            <div
                className={`relative rounded-3xl w-[50rem] max-w-[90%] max-h-[90vh] p-8 overflow-y-auto
                    ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-light-mode text-black'} 
                    ${isClosing ? 'slide-down' : 'slide-up'}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    ) : null;

    return (
        <>
            {/* Trigger */}
            <span onClick={() => setIsOpen(true)}>{trigger}</span>
            {modal && createPortal(modal, document.getElementById('modal-root')!)}
        </>
    );
}

export default Modal;
