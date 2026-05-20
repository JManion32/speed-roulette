import { useTheme } from '../../contexts/ThemeContext.tsx';
import { useState } from 'react';
import github_white from '../../assets/github_white.png';
import linkedin_white from '../../assets/linkedin_white.png';
import about from '../../assets/about.png';
import Modal from './Modal.tsx';

export default function AboutModal() {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('about');

    return (
        <Modal
            trigger={
                <button
                    className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-300'} home-action-btn mr-10`}
                    data-cy="open-about-modal"
                >
                    <img src={about} alt="About" className="w-20 h-20" draggable="false" />
                </button>
            }
        >
            <div className="border-b border-gray-700 mb-8">
                {['about', 'rules', 'contact'].map((tab) => (
                    <button
                        key={tab}
                        className={`py-2 px-6 text-[1.75rem] font-bold transition-colors ${
                            activeTab === tab
                                ? theme === 'dark'
                                    ? 'text-yellow-500 border-b-2 border-yellow-500'
                                    : 'text-yellow-700 border-b-2 border-yellow-700'
                                : theme === 'dark'
                                  ? 'hover:text-white text-gray-400'
                                  : 'hover:text-black text-gray-500'
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="max-h-[31.25rem] overflow-y-auto text-[1.125rem]">
                {activeTab === 'about' && (
                    <>
                        <p className="mb-6">
                            Inspired by the intensity of speed chess, Speed Roulette puts an interesting twist on the
                            beloved high-stakes casino game. Players start with 20 dollars, 10 possible spins, and just
                            60 seconds on the clock. When bets are submitted, the winning number is revealed, earnings
                            are paid out, and the clock starts ticking again 2.5 seconds later. Compete for a spot on
                            the daily leaderboard by making quick decisions, taking bold risks, and hitting big payouts.
                        </p>
                        <p className="font-bold mb-4">Note from the developer:</p>
                        <p>
                            I hope you enjoy my website! It has been a dream come true to create this. Remember:
                            anything is possible if you put your mind to it. Best of luck!
                        </p>
                    </>
                )}

                {activeTab === 'rules' && (
                    <>
                        <p className="mb-4">
                            <span className="font-bold">Standard Roulette Rules:</span>
                            <br />
                            Bet on what the winning number will be by placing chips on the betting table.
                        </p>
                        <div className="mb-4 space-y-1 pl-12">
                            <div className="flex justify-between w-5/8">
                                <span>Single numbers:</span>
                                <span className="font-bold">35:1</span>
                            </div>
                            <div className="flex justify-between w-5/8">
                                <span>Red/Black | Even/Odd | Low/High:</span>
                                <span className="font-bold">1:1</span>
                            </div>
                            <div className="flex justify-between w-5/8">
                                <span>Rows | Dozens:</span>
                                <span className="font-bold">2:1</span>
                            </div>
                        </div>
                        <p className="mb-4">
                            You can also bet on multiple buttons at a time with one chip (e.g., half on 7, half on 10).
                            For more details, see the{' '}
                            <a
                                href="https://en.wikipedia.org/wiki/Roulette#Types_of_bets"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Wikipedia Roulette Types of Bets page
                            </a>
                            .
                        </p>
                        <p>
                            <span className="font-bold">Speed Roulette Twist:</span>
                            <br />
                            <ul className="list-disc pl-8 mb-6">
                                <li>Start with $20, 10 spins, and 60 seconds on the clock.</li>
                                <li>The timer begins when you place your first bet.</li>
                                <li>
                                    When bets are submitted, there is a 2.5s pause before the next round where the
                                    number is revealed, and winnings are paid out.
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
                        <p className="transition-color duration-200 text-[2rem] mb-10">
                            <span className="font-semibold">Inquiries:</span>{' '}
                            <a
                                href="mailto:jman32business@gmail.com"
                                className={`${theme === 'dark' ? 'text-blue-500' : 'text-blue-700'} underline hover:text-purple-500 transition-colors duration-100`}
                            >
                                jman32business@gmail.com
                            </a>
                        </p>
                        {/*
                            <button 
                            className="h-25 w-150 bg-red-500 hover:bg-red-400 font-bold text-[4rem] text-white rounded-md mb-10"
                            onClick={() => window.open('https://youtube.com/@jmancodes?si=ZgYwDV3Fj49Z4-uH', '_blank')}
                            >
                            YouTube
                            </button><br />
                        */}

                        <button
                            className="transition-color duration-200 h-25 w-150 bg-github hover:bg-github-h font-bold text-[4rem] text-white rounded-md flex items-center justify-start gap-24 pl-8 mb-10"
                            onClick={() => window.open('https://github.com/JManion32/speed-roulette', '_blank')}
                        >
                            <img src={github_white} alt="GitHub" className="w-16 h-16" />
                            GitHub
                        </button>

                        <button
                            className="transition-color duration-200 h-25 w-150 bg-linkedin hover:bg-linkedin-h font-bold text-[4rem] text-white rounded-md flex items-center justify-start gap-24 pl-8"
                            onClick={() => window.open('https://linkedin.com/in/jmanion32', '_blank')}
                        >
                            <img src={linkedin_white} alt="LinkedIn" className="w-16 h-16" />
                            LinkedIn
                        </button>
                    </>
                )}
            </div>
        </Modal>
    );
}
