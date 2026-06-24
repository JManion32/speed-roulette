import { useState } from 'react';
import { createPortal } from 'react-dom';
import '../../css/components/modal.css';

type Props = {
    canOutsideClick?: boolean;
    trigger: React.ReactNode;
    children: React.ReactNode;
};

function Modal({ canOutsideClick = true, trigger, children }: Props) {
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
            className="modal-overlay"
            onClick={canOutsideClick ? closeModal : undefined}
            aria-modal="true"
            role="dialog"
            data-cy="modal-bg"
        >
            <div
                className={`modal-content ${
                    isClosing ? 'slide-down' : 'slide-up'
                }`}
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
