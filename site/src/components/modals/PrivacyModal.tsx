import Modal from './Modal.tsx';

export default function PrivacyModal() {
    return (
        <Modal
            trigger={
                <p className="transition duration-200 inline-block font-bold text-purple-700 hover:text-purple-500 mr-[0.3rem]">
                    Privacy Policy
                </p>
            }
        >
            <h1 className="text-[2rem] font-bold mb-6 text-center">PRIVACY POLICY</h1>

            <div className="mx-auto w-[90%] max-w-[40rem] text-[1.125rem] space-y-6 leading-relaxed">
                <div>
                    <h2 className="font-bold mb-1">1. No Personal Information Collected</h2>
                    <p>
                        Speed Roulette does not collect any personally identifiable information (PII) such as your name,
                        email address, or payment details.
                    </p>
                </div>

                <div>
                    <h2 className="font-bold mb-1">2. Nicknames and Leaderboard</h2>
                    <p>
                        For leaderboard purposes, a nickname you enter is temporarily stored and associated with your
                        in-game performance. This nickname is not connected to any external identity.
                    </p>
                </div>

                <div>
                    <h2 className="font-bold mb-1">3. Cookies & Session Data</h2>
                    <p>
                        Temporary cookies or session data may be stored strictly for gameplay functionality (e.g.,
                        authentication, token validation, and game state tracking). This data is never used for
                        analytics or marketing.
                    </p>
                </div>

                <div>
                    <h2 className="font-bold mb-1">4. Rate Limiting</h2>
                    <p>
                        We may temporarily process your IP address to prevent abuse and ensure fair usage of our
                        services. This information is not stored long-term and is used solely for security-related
                        functionality.
                    </p>
                </div>

                <div>
                    <h2 className="font-bold mb-1">5. No Third-Party Sharing</h2>
                    <p>
                        Speed Roulette does not share, sell, or transfer any user data to third parties. The game is
                        intended solely for entertainment, learning, and portfolio demonstration.
                    </p>
                </div>

                <div>
                    <h2 className="font-bold mb-1">6. Acceptance of Policy</h2>
                    <p>
                        By playing Speed Roulette, you agree to the terms of this privacy policy. If you have any
                        concerns, please email{' '}
                        <a href="mailto:jman32business@gmail.com" className="text-blue-500 hover:underline">
                            jman32business@gmail.com
                        </a>
                        .
                    </p>
                </div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-400">Last updated: 2025-07-24</div>
        </Modal>
    );
}
