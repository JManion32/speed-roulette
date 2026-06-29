import { useState } from 'react';
import githubWhite from '../../assets/github-white.png';
import linkedinWhite from '../../assets/linkedin-white.png';
import about from '../../assets/about.png';
import Modal from './Modal';
import { Tabs } from '../Tabs';
import HomeNavButton from '../HomeNavButton';

export default function AboutModal() {
    const [activeTab, setActiveTab] = useState('about');

    return (
        <Modal trigger={<HomeNavButton image={about} alt="About" testId="open-about-modal" />}>
            <Tabs
                tabs={[
                    { value: 'about', label: 'About' },
                    { value: 'rules', label: 'Rules' },
                    { value: 'contact', label: 'Contact' },
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className="about-modal-content">
                {activeTab === 'about' && (
                    <>
                        <p className="about-section-spacing">
                            Inspired by the intensity of speed chess, Speed Roulette puts an interesting twist on the
                            beloved high-stakes casino game. Players start with 20 dollars, 10 possible spins, and just
                            60 seconds on the clock. When bets are submitted, the winning number is revealed, earnings
                            are paid out, and the clock starts ticking again 2.5 seconds later. Compete for a spot on
                            the daily leaderboard by making quick decisions, taking bold risks, and hitting big payouts.
                        </p>

                        <p className="about-note-title">Note from the developer:</p>

                        <p>
                            I hope you enjoy my website! It has been a dream come true to create this. Remember:
                            anything is possible if you put your mind to it. Best of luck!
                        </p>
                    </>
                )}

                {activeTab === 'rules' && (
                    <>
                        <p className="about-section-spacing">
                            <span className="rules-payout-bold">Standard Roulette Rules:</span>
                            <br />
                            Bet on what the winning number will be by placing chips on the betting table.
                        </p>

                        <div className="rules-payouts">
                            <div className="rules-payout-row">
                                <span>Single numbers:</span>
                                <span className="rules-payout-bold">35:1</span>
                            </div>

                            <div className="rules-payout-row">
                                <span>Red/Black | Even/Odd | Low/High:</span>
                                <span className="rules-payout-bold">1:1</span>
                            </div>

                            <div className="rules-payout-row">
                                <span>Rows | Dozens:</span>
                                <span className="rules-payout-bold">2:1</span>
                            </div>
                        </div>

                        <p className="about-section-spacing">
                            You can also bet on multiple buttons at a time with one chip (e.g., half on 7, half on 10).
                            For more details, see the{' '}
                            <a
                                href="https://en.wikipedia.org/wiki/Roulette#Types_of_bets"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rules-link"
                            >
                                Wikipedia Roulette Types of Bets page
                            </a>
                            .
                        </p>

                        <p>
                            <span className="rules-payout-bold">Speed Roulette Twist:</span>
                            <br />

                            <ul className="rules-list">
                                <li>Start with $20, 10 spins, and 60 seconds on the clock.</li>
                                <li>The timer begins when you place your first bet.</li>
                                <li>
                                    When bets are submitted, there is a 2.5-second pause before the next round where the
                                    number is revealed and winnings are paid out.
                                </li>
                            </ul>

                            <i>
                                Make as much as you can before you run out of <b>time</b>, <b>spins</b>, or <b>money</b>
                                !
                            </i>
                        </p>
                    </>
                )}

                {activeTab === 'contact' && (
                    <>
                        <div className="socials-container">
                            <p className="contact-title">
                                <span className="contact-title-label">Inquiries:</span>{' '}
                                <a href="mailto:jman32business@gmail.com" className="about-contact-email">
                                    jman32business@gmail.com
                                </a>
                            </p>

                            <button
                                className="social-button social-button-github"
                                onClick={() => window.open('https://github.com/JManion32/speed-roulette', '_blank')}
                            >
                                <img src={githubWhite} alt="GitHub" className="social-button-icon" />
                                GitHub
                            </button>

                            <button
                                className="social-button social-button-linkedin"
                                onClick={() => window.open('https://linkedin.com/in/jmanion32', '_blank')}
                            >
                                <img src={linkedinWhite} alt="LinkedIn" className="social-button-icon" />
                                LinkedIn
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
