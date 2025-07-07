import DarkModeToggle from './DarkModeToggle';
import HomeButton from './HomeButton';

interface ResultHeaderProps {
  nickname: string;
  resultNums: string[];
  isDarkMode: boolean;
  getColorClass: (num: string) => string;
}

export default function ResultHeader({
  nickname,
  resultNums,
  isDarkMode,
  getColorClass
}: ResultHeaderProps) {
  return (
    <div className="p-4 flex top-0">
      <p className={`absolute top-7 left-8 font-bold text-[1.5rem] ${isDarkMode ? 'text-white' : 'text-black'}`}>
        {nickname}
      </p>
      <span className="absolute top-7 right-44 flex flex-row">
        {[...Array(9)].map((_, i) => {
          const result = resultNums[i];
          return (
            <button
              key={i}
              className={`h-10 w-10 ml-2 rounded-md font-bold border-2 transition duration-200 ${
              isDarkMode ? 'border-white' : 'border-black'
              } ${
              result !== undefined 
                ? getColorClass(result) 
                : (isDarkMode ? 'bg-gray-700' : 'bg-gray-300')
            }`}
            >
              {result ?? ''}
            </button>
          );
        })}
      </span>
      <DarkModeToggle />
      <HomeButton />
    </div>
  );
}
