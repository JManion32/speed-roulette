import { useState } from 'react';
import { createPortal } from 'react-dom';

import '../../css/modal.css';

type Props = {
    trigger: React.ReactNode;
    children: React.ReactNode;
    borderColor?: string;
    canOutsideClick?: boolean;
};

function Modal({ canOutsideClick = true, borderColor, trigger, children }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsOpen(false);
        }, 300);
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).classList.contains('modal-container')) {
            closeModal();
        }
    };

    const modal = isOpen ? (
        <div className="modal-container" onClick={canOutsideClick ? handleOutsideClick : undefined}>
            <div
                className={`modal ${isClosing ? 'slide-down' : 'slide-up'}`}
                style={{
                    border:
                        borderColor === 'cyan'
                            ? '4px solid var(--standard-cyan)'
                            : borderColor === 'pink'
                              ? '4px solid var(--standard-pink)'
                              : undefined,
                }}
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
