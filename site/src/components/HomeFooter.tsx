import { useState } from 'react';
import PrivacyModal from './modals/PrivacyModal.tsx';
import '../css/home.css';

export default function HomeFooter() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText('https://speedroulette.io');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="home-footer">
            <PrivacyModal />

            <span className="home-footer-divider">|</span>

            <p
                className="home-footer-link home-footer-share"
                onClick={handleCopy}
            >
                {copied ? 'Copied!' : 'Share'}
            </p>

            <span className="home-footer-divider">|</span>

            <p
                className="home-footer-link"
                onClick={() =>
                    window.open(
                        'https://docs.google.com/forms/d/e/1FAIpQLScB-K5IMt4Bx_MBvFxeSjfaMtgWF5M3HrxAREoMcictemvp0w/viewform?usp=dialog',
                        '_blank'
                    )
                }
            >
                Have a feature suggestion?
            </p>
        </div>
    );
}
