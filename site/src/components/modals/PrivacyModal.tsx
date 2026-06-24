import Modal from './Modal';

export default function PrivacyModal() {
    return (
        <Modal
            trigger={
                <p className="privacy-trigger">
                    Privacy Policy
                </p>
            }
        >
            <h1 className="privacy-title">
                PRIVACY POLICY
            </h1>

            <div className="privacy-content">
                <div className="privacy-section">
                    <h2 className="privacy-section-title">
                        1. No Personal Information Collected
                    </h2>
                    <p>
                        Speed Roulette does not collect any personally identifiable information (PII)
                        such as your name, email address, or payment details.
                    </p>
                </div>

                <div className="privacy-section">
                    <h2 className="privacy-section-title">
                        2. Nicknames and Leaderboard
                    </h2>
                    <p>
                        For leaderboard purposes, a nickname you enter is temporarily stored and
                        associated with your in-game performance. This nickname is not connected
                        to any external identity.
                    </p>
                </div>

                <div className="privacy-section">
                    <h2 className="privacy-section-title">
                        3. Cookies & Session Data
                    </h2>
                    <p>
                        Temporary cookies or session data may be stored strictly for gameplay
                        functionality (e.g., authentication, token validation, and game state
                        tracking). This data is never used for analytics or marketing.
                    </p>
                </div>

                <div className="privacy-section">
                    <h2 className="privacy-section-title">
                        4. Rate Limiting
                    </h2>
                    <p>
                        We may temporarily process your IP address to prevent abuse and ensure
                        fair usage of our services. This information is not stored long-term and
                        is used solely for security-related functionality.
                    </p>
                </div>

                <div className="privacy-section">
                    <h2 className="privacy-section-title">
                        5. No Third-Party Sharing
                    </h2>
                    <p>
                        Speed Roulette does not share, sell, or transfer any user data to third
                        parties. The game is intended solely for entertainment, learning, and
                        portfolio demonstration.
                    </p>
                </div>

                <div className="privacy-section">
                    <h2 className="privacy-section-title">
                        6. Acceptance of Policy
                    </h2>
                    <p>
                        By playing Speed Roulette, you agree to the terms of this privacy policy.
                        If you have any concerns, please email{' '}
                        <a
                            href="mailto:jman32business@gmail.com"
                            className="privacy-email"
                        >
                            jman32business@gmail.com
                        </a>
                        .
                    </p>
                </div>
            </div>

            <div className="privacy-last-updated">
                Last updated: 2025-07-24
            </div>
        </Modal>
    );
}