import { useState } from 'react';

interface HomeFooterProps {
    setShowPrivacy: (v: boolean) => void;
}

export default function HomeFooter({
  setShowPrivacy
}: HomeFooterProps) {

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText("https://speedroulette.io");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // revert after 2 seconds
  };
  return (
    <div className="absolute bottom-0 w-full p-4 text-center">
        <p
        className="transition duration-200 inline-block font-bold text-purple-700 hover:text-purple-500 mr-[0.3rem]"
        onClick={() => setShowPrivacy(true)}
        >
        Privacy Policy
        </p>

        <span className="inline-block mx-[1.2rem]">|</span>

        <p
        className="transition duration-200 inline-block min-w-[3.7rem] text-center cursor-pointer font-bold text-purple-700 hover:text-purple-500"
        onClick={handleCopy}
        >
        {copied ? "Copied!" : "Share"}
        </p>

        <span className="inline-block mx-[1.2rem]">|</span>

        <p
        className="transition duration-200 inline-block font-bold text-purple-700 hover:text-purple-500 ml-[0.3rem]"
        onClick={() =>
            window.open('https://docs.google.com/forms/d/e/1FAIpQLScB-K5IMt4Bx_MBvFxeSjfaMtgWF5M3HrxAREoMcictemvp0w/viewform?usp=dialog','_blank')
        }
        >
        Have a feature suggestion?
        </p>
    </div>
  );
}
